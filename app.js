const express = require("express");
const app = express();
const cors = require("cors");

// Implement CORS
// app.use(cors());
const allowedOrigins = [
    "http://localhost:3000",
    "https://a-pathshala-service-1-git-b1course-the-gaurav-bhatt.vercel.app",
    "https://www.apluspathshala.com",
];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);
// Access-Control-Allow-Origin *
// a+pathshala.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.a+pathshala.com'
// }))

//global error handler config:
const AppError = require("./errors/appError");
const globalErrorHandler = require("./errors/errorController");

//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//making req.body available:
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// By default, $ and . characters are removed completely and used for query injection protection:
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

//It helps you secure your Express apps by setting various HTTP headers :
const helmet = require("helmet");
app.use(helmet());

// This will sanitize any data in req.body, req.query, and req.params for xss attack :
const xss = require("xss-clean");
app.use(xss());

//It helps for protecting bruteforce attack and DDOS attack by limiting no of request per IP address:
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api", limiter);

//Routes:
const userRouter = require("./routes/userRouter");

app.use("/api/v1/user", userRouter);

app.use("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message:
            "This is our Base url , yet not implemented you should better test other routes",
    });
});

//handeling global unhandled error and rejection ,e.g if no route is defined for certain url
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
