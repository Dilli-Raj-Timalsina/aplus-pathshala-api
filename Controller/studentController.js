const Student = require("../StudentSchema/studentSchema");
const asyncCatch = require("../ErrorHandeling/catchAsync");
const cookieParser = require("cookie-parser");

const loginControl = asyncCatch(async (req, res) => {
  console.log(req);
  res.end("ok");
});

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
