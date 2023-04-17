//Note : please Never ever pass any function which is not middleware function , This function is
// designed only for middleware function , if you pass any other helper async function ,It will
// create bug which will be hard to debug

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};
