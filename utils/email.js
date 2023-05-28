const AppError = require("../errors/appError");
const nodemailer = require("nodemailer");
const catchAsync = require("../errors/catchAsync");
require("dotenv").config();

const sendMail = async (options) => {
    try {
        // 1) Create a transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        // 2) Define the email options
        const message = {
            from: "Dilli Raj Timalsina <dillirajtimalsina354@gmail.com>",
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // 3) Actually send the email
        await transporter.sendMail(message);
    } catch (err) {
        console.log(err);
        throw new AppError(err.message, err.statusCode);
    }
};

module.exports = sendMail;
