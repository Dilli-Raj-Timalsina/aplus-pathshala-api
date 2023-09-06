const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

const AppError = require("../errors/appError");
const catchAsync = require("../errors/catchAsync");

const { sendMailNormal } = require("../utils/email");

const prisma = require("./../prisma/prismaClientExport");

// 1:) return new jwt based on passed payload
const signToken = async (user) => {
    const payload = {
        email: user.email,
        id: user.id,
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
    const { id, name, email, role } = user;
    const userProfile = {
        id,
        name,
        email,
        role,
    };

    res.status(statusCode).json({
        status: "success",
        token: "Bearer " + token,
        userProfile,
    });
};
// 3:) general token leven authentication for both student and teacher
const generalProtect = catchAsync(async (req, res, next) => {
    // a) Getting token and check of it's there

    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
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
    const currentUser = await prisma.user.findFirst({
        where: { id: decoded.id },
    });

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

//4:) protect unauthorized teacher from  courses
const protectTeacher = catchAsync(async (req, res, next) => {
    const currentUser = req.user;
    if (currentUser.role !== "teacher") {
        throw new AppError(
            "You are not a teacher, create a teacher account",
            401
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// //5:) protect unauthorized user from  courses
// const protectPurchase = catchAsync(async (req, res, next) => {
//    if(req.user.courseIds.contains())

//     // GRANT ACCESS TO PROTECTED ROUTE
//     next();
// });

//6:) signup user based on req.body and return jwt via cookie
const signupControl = catchAsync(async (req, res) => {
    //check whether user already exist or not/ duplicate email
    if (await prisma.user.findFirst({ where: { email: req.body.email } })) {
        throw new AppError("User Already Exist with this Email", 409);
    }
    let { name, email, password, role } = req.body;
    password = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            role,
        },
    });

    // if everything is ok :send token to the user
    await createSendToken(user, 200, res);
});

//7:) login in user based on {email,password} and send jwt in cokkie
const loginControl = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    //a)check if email or password exist:
    if (!email || !password) {
        throw new AppError("email or password not provided", 403);
    }
    // b) Check if user exists && password is correct
    const user = await prisma.user.findFirst({ where: { email: email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError("Incorrect email or password", 401);
    }
    //c) If everything is ok: send token to the logged in user
    await createSendToken(user, 200, res);
});

//8:) this is 1st hit for forget password
const forgetControl = catchAsync(async (req, res, next) => {
    //a) check whether user exist or not
    const { email } = req.body;
    const currUser = await prisma.user.findFirst({ where: { email: email } });

    if (!currUser) {
        throw new AppError("User does not exist");
    }
    //b) generate reset token:
    const resetToken = Math.floor(Math.random() * 9000) + 1000;

    //c) update user's token with salted and hashed token :

    await prisma.user.update({
        where: { email: email },
        data: { token: resetToken + "" },
    });

    //d) preparing credentials to send user an email:

    const options = {
        email: email,
        subject: "Reset password A+ pathshala ",
        message: `Your reset OTP is   : ${resetToken}\n
    please do not share it with anybody `,
    };
    //e) send reset password link to the user's email
    await sendMailNormal(options);

    //f) if everything succeds then send success message
    res.status(200).json({
        status: "success",
        message: "checkout your email to reset password",
    });
});

//9:) this is 2nd redirected hit for forgetpassword
const verifyControl = catchAsync(async (req, res) => {
    //a) getting user reset credential :
    const { email, otp, password } = req.body;
    console.log(email, otp, password);

    //b) if user doesn't exist or token is invalid
    const user = await prisma.user.findFirst({ where: { email: email } });
    if (!user || !(otp == user.token)) {
        throw new AppError(
            "Invalid or expired token, please reset again!!",
            403
        );
    }
    const random = Math.floor(Math.random() * 9000) + 1000;
    //c) hash the password and update , also update otp
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({
        where: { email: email },
        data: { password: hash, token: random + "" },
    });

    res.status(200).json({
        status: "success",
        message: "verification has done, change the password now",
    });
});

// //9:) this is 2nd redirected hit for forgetpassword
// const resetControl = catchAsync(async (req, res) => {
//     //a) getting user reset credential :
//     const { email, password } = req.body;

//     //c) hash the password and update
//     const hash = await bcrypt.hash(password, 10);
//     await prisma.user.update({
//         where: { email: email },
//         data: { password: hash },
//     });
//     //d) change token value to empty string
//     await prisma.user.update({ where: { email: email }, data: { token: "" } });

//     //e) if reset is successful then send success message
//     res.status(200).json({
//         status: "success",
//         message: "password reset successful",
//     });
// });

//10:) logout user by putting jwt ==null in user's browser cookie
const logoutControl = catchAsync(async (req, res, next) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
});

module.exports = {
    signupControl,
    loginControl,
    signToken,
    forgetControl,
    // resetControl,
    logoutControl,
    protectTeacher,
    generalProtect,

    verifyControl,
};
