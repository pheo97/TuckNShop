const express = require('express');
const router = express.Router({mergeParams: true});

const Localshop = require('../models/localShop');
const Review = require('../models/review');

const wrapAsync = require('../utilities/wrapAsync');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/',isLoggedIn, validateReview, wrapAsync( async(req,res) =>{
    const localshop = await Localshop.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    localshop.reviews.push(review);
    await review.save();
    await localshop.save();
    req.flash('success', 'Successfully created Review');
    res.redirect(`/localshops/${localshop._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync ( async (req,res) =>{
    const { id, reviewId} = req.params;
    Localshop.findByIdAndUpdate(id, {$pull: { reviews:reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted');
    res.redirect(`/localshops/${id}`)
}));

module.exports = router;