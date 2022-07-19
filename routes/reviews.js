const express = require('express');
const router = express.Router({mergeParams: true});

const reviews = require('../controllers/reviews')

const Localshop = require('../models/localShop');
const Review = require('../models/review');

const wrapAsync = require('../utilities/wrapAsync');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/',isLoggedIn, validateReview, wrapAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync (reviews.deleteReview));

module.exports = router;