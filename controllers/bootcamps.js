const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamps = require("../models/Bootcamps");

// @desc get all bootcamps
// @route /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// @desc get bootcamp
// @route /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
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
});
// @desc create bootcamps
// @route /api/v1/bootcamps
// @access private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const publisherBootcamp = await Bootcamps.findOne({ user: req.user.id });
  if (publisherBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} have already publish the bootcamp`
      )
    );
  }
  const bootcamp = await Bootcamps.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});
// @desc update bootcamps
// @route /api/v1/bootcamps/:id
// @access public
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
  try {
    let bootcamp = await Bootcamps.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.params.id} is not authorize to update`,
          401
        )
      );
    }
    bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
});
// @desc delete bootcamps
// @route /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} is not authorize to delete`, 401)
    );
  }
  await bootcamp.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// @desc get bootcamps within a radius
// @route /api/v1/bootcamps/radius/:zipcode/:distance
// @access private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Earth's radius is approximately 6,378 km
  const radius = distance / 6378;

  const bootcamps = await Bootcamps.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
const path = require("path");

// @desc upload photo for bootcamps
// @route PUT /api/v1/bootcamps/:id/photo
// @access private
exports.bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} is not authorize to update`, 401)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamps.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
