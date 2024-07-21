const express = require("express");
const {getUsers, getUser, createUser, updateUser, deleteUser} = require("../controllers/user");
const User = require("../models/User");
const {protect, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advanceResults");


const router = express.Router({mergeParams : true});
router.use(protect)
router.use(authorize('admin'))


router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
module.exports = router;
