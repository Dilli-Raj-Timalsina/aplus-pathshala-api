const nodemailer = require("nodemailer");

/** send mail from real gmail account */
const getMail = (req, res) => {
  const gmail = req.body.gmail;
  console.log();
  console.log(gmail);

  let config = {
    service: "gmail",
    auth: {
      user: "dillirajtimalsina354@gmail.com",
      pass: "dontulhalxcjdaap",
    },
  };

  let transporter = nodemailer.createTransport(config);

  let message = {
    from: "Dilli Raj Timalsina <dillirajtimalsina354@gmail.com>",
    to: gmail,
    subject: "Hello ✔",
    text: "Successfully Register with us.",
    html: "<b>Successfully Register with us.</b>",
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "you should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  // res.status(201).json("getBill Successfully...!");
};

module.exports = {
  getMail,
};
