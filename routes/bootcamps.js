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
const reviewRouter = require("./review");
const { protect, authorize } = require("../middleware/auth");


router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);



router.route("/:radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamps);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampUploadPhoto);
router
  .route("/:id")
  .put(protect, authorize("publisher", "admin"), updateBootcamps)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamps)
  .get(getBootcamp);

module.exports = router;
