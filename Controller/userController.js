const Student = require("./../userSchema");

async function postUser(req, res) {
  try {
    // console.log(doc.);
    const stu = await Student.create(req.body);

    res.status(200).send({
      result: {
        status: "sucess",
        data: {
          stu,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.end("error occured!");
  }
}

async function getUser(req, res) {
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

module.exports = { postUser, getUser };
