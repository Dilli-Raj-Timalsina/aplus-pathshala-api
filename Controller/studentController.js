const Student = require("../StudentSchema/studentSchema");

const cookieParser = require("cookie-parser");

async function loginControl(req, res) {
  try {
    console.log(req);
    res.end("ok");
  } catch (err) {
    console.log(err);
    res.end("error occured!");
  }
}

async function signupControl(req, res) {
  try {
    const data = await Student.findById("641565d60632af8192ef0619").exec();
    res.status(200).send({
      result: {
        status: "sucess",
        data: {
          data,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.end("Error occured");
  }
}

async function getResouce(req, res) {
  try {
    const data = await Student.findById("641565d60632af8192ef0619").exec();
    res.status(200).send({
      result: {
        status: "sucess",
        data: {
          data,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.end("Error occured");
  }
}

module.exports = { loginControl, signupControl, getResouce };
