// @desc get all bootcamps
// @route /api/v1/bootcamps
// @access public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};
// @desc get bootcamp
// @route /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show  bootcamp` });
};
// @desc update bootcamps
// @route /api/v1/bootcamps/:id
// @access public
exports.updateBootcamps = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update  bootcamps ${req.params.id}` });
};
// @desc delete bootcamps
// @route /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamps = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamps ${req.params.id}` });
};
// @desc create bootcamps
// @route /api/v1/bootcamps
// @access private
exports.createBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Create bootcamps ` });
};
