const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

const AppError = require("./../errors/appError");
const catchAsync = require("../errors/catchAsync");

const sendMail = require("./../utils/email");

const User = require("../models/studentSchema");
const Course = require("./../models/courseSchema");

// 1:) return new jwt based on passed payload
const signToken = async (user) => {
    const payload = {
        email: user.email,
        _id: user._id,
    };
    return await jwt.sign(payload, process.env.SECRET, {
        expiresIn: process.env.EXPIRES_IN,
    });
};

//2:) This function sends cookie to the browser so that is saves the cookie and send atomatically
// in next subsequent request
const createSendToken = async (user, statusCode, res) => {
    const token = await signToken(user);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);
    const { _id, name, email, course, profilePicture, contact } = user;
    const userProfile = {
        _id,
        name,
        email,
        course,
        profilePicture,
        contact,
    };

    res.status(statusCode).json({
        status: "success",
        token: "Bearer " + token,
        userProfile,
    });
};

//3:) protect unauthorized student from  courses ,jwt is extracted from authorization header
//not from req.cookies
const protect = catchAsync(async (req, res, next) => {
    // a) Getting token and check of it's there
    let token;
    console.log(req.headers.authorization);
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        console.log(req.cookie.jwt);
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                "You are not logged in! Please log in to get access.",
                401
            )
        );
    }

    // b) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
    // c) Check if user still exists
    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to this token does no longer exist.",
                401
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

//3:) signup user based on req.body and return jwt via cookie
const signupControl = catchAsync(async (req, res) => {
    //check whether user already exist or not/ duplicate email
    if (await User.findOne({ email: req.body.email })) {
        throw new AppError("User Already Exist with this Email", 409);
    }

    const user = await User.create({
        ...req.body,
    });

    // if everything is ok :send token to the user
    await createSendToken(user, 200, res);
});

//4:) login in user based on {email,password} and send jwt in cokkie
const loginControl = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    //a)check if email or password exist:
    if (!email || !password) {
        throw new AppError("email or password not provided", 403);
    }
    // b) Check if user exists && password is correct
    const user = await User.findOne({ email });

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError("Incorrect email or password", 401);
    }
    //c) If everything is ok: send token to the logged in user
    await createSendToken(user, 200, res);
});

//5:) this is 1st hit for forget password
const forgetControl = catchAsync(async (req, res, next) => {
    //a) check whether user exist or not
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        throw new AppError("User does not exist");
    }
    //b) generate reset token:
    const resetToken = crypto.randomBytes(32).toString("hex");

    //c) update user's token with salted and hashed token :
    const hash = await bcrypt.hash(resetToken, 10);
    await User.findOneAndUpdate({ email: email }, { "resetToken.token": hash });

    //d) preparing credentials to send user an email:
    const link = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/student/passwordReset?token=${resetToken}&id=${user._id}`;
    const options = {
        email: email,
        subject: "Reset password A+ pathshala ",
        message: `${link} \n
    click the above link to reset your password, \n
    Please Notice that this is one time reset link and don't share with others`,
    };
    //e) send reset password link to the user's email
    await sendMail(options);

    //f) if everything succeds then send success message
    res.status(200).json({
        status: "success",
        message: "checkout your email to reset password",
    });
});

//6:) this is 2nd redirected hit for forgetpassword
const resetControl = catchAsync(async (req, res) => {
    //a) getting user reset credential :
    const { url, password } = req.body;
    //extract token and userId from url
    const token = url.split("=")[1].split("&")[0];
    const userId = url.split("=")[2];

    //b) if user doesn't exist or token is invalid
    const user = await User.findOne({ _id: userId });
    if (!user || !(await bcrypt.compare(token, user.resetToken.token))) {
        throw new AppError("Invalid or expired password reset token");
    }
    //c) hash the password and update
    const hash = await bcrypt.hash(password, 10);
    await User.updateOne({ password: hash });
    //d) change token value to empty string
    await User.findOneAndUpdate({ _id: userId }, { "resetToken.token": "" });

    //e) if reset is successful then send success message
    res.status(200).json({
        status: "success",
        message: "password reset successful",
    });
});

//7:) logout user by putting jwt ==null in user's browser cookie
const logoutControl = catchAsync(async (req, res, next) => {
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", null, cookieOptions);
    res.end("logged out");
});

//just for testing purpose
const protectedControl = catchAsync(async (req, res, next) => {
    createSendToken("dillirajtimalsina354@gmail.com", 200, res);
});

module.exports = {
    signupControl,
    loginControl,
    signToken,
    forgetControl,
    resetControl,
    logoutControl,
    protect,
    protectedControl,
};
