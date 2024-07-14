const express = require("express");
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  updateBootcamps,
  deleteBootcamps,
  createBootcamps,
} = require("../controllers/bootcamps");

router.route("/").get(getBootcamps).post(createBootcamps);

router
  .route("/:id")
  .put(updateBootcamps)
  .delete(deleteBootcamps)
  .get(getBootcamp);

module.exports = router;
