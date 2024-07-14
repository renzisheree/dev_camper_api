const ErrorResponse = require("../utils/errorResponse");
const Bootcamps = require("../models/Bootcamps");

// @desc get all bootcamps
// @route /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamps.find();

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    next(err);
  }
};
// @desc get bootcamp
// @route /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamps.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};
// @desc create bootcamps
// @route /api/v1/bootcamps
// @access private
exports.createBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamps.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
};
// @desc update bootcamps
// @route /api/v1/bootcamps/:id
// @access public
exports.updateBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamps.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};
// @desc delete bootcamps
// @route /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamps.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
