const express = require('express');
const {getReviews ,getReview , addReview, updateReview, deleteReview} = require('../controllers/review');
const Review = require('../models/Review');

const router = express.Router({mergeParams: true});
const advancedResults = require("../middleware/advanceResults");

const {protect,authorize} = require('../middleware/auth');

router.route('/').get(advancedResults(Review,{
    path : 'bootcamp',
    select : 'name description',
}),getReviews
).post(protect,authorize('admin', 'user'), addReview)
router.route('/:id').get(getReview).put(protect, authorize('user', 'admin'), updateReview).delete(protect, authorize('user', 'admin'), deleteReview);





module.exports = router;