const express = require("express");
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  updateBootcamps,
  deleteBootcamps,
  createBootcamps,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");
const courseRouter = require("./courses");
router.use("/:bootcampId/courses", courseRouter);
router.route("/:radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/").get(getBootcamps).post(createBootcamps);

router
  .route("/:id")
  .put(updateBootcamps)
  .delete(deleteBootcamps)
  .get(getBootcamp);

module.exports = router;
