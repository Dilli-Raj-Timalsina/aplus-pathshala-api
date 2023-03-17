const Student = require("./../userSchema");

module.exports = async function postUser(req, res) {
  try {
    const stu = await Student.create(req.body);
    console.log(stu);
    res.end("get request done");
  } catch (err) {
    console.log(err);
    res.end("error occured!");
  }
};
