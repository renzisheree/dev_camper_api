const express = require("express");
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  updateBootcamps,
  deleteBootcamps,
  createBootcamps,
  getBootcampsInRadius,
  bootcampUploadPhoto,
} = require("../controllers/bootcamps");
const Bootcamp = require("../models/Bootcamps");
const advancedResults = require("../middleware/advanceResults");
const courseRouter = require("./courses");
const { protect } = require("../middleware/auth");
router.use("/:bootcampId/courses", courseRouter);
router.route("/:radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamps);
router.route("/:id/photo").put(protect, bootcampUploadPhoto);
router
  .route("/:id")
  .put(protect, updateBootcamps)
  .delete(protect, deleteBootcamps)
  .get(getBootcamp);

module.exports = router;
