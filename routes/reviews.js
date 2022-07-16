const express = require('express');
const router = express.Router({mergeParams: true});

const { reviewSchema } = require('../schemas.js');

const Localshop = require('../models/localShop');
const Review = require('../models/review');

const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressError');


const validateReview = ( req, res , next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
         const msg = error.details.map(el => el.message).join(',')
         throw new ExpressError(msg, 400)
     }else{
         next()
     }
 }

router.post('/', validateReview, wrapAsync( async(req,res) =>{
    const localshop = await Localshop.findById(req.params.id);
    const review = new Review(req.body.review)
    localshop.reviews.push(review);
    await review.save();
    await localshop.save();
    req.flash('success', 'Successfully created Review');
    res.redirect(`/localshops/${localshop._id}`)
}))

router.delete('/:reviewId', wrapAsync ( async (req,res) =>{
    const { id, reviewId} = req.params;
    Localshop.findByIdAndUpdate(id, {$pull: { reviews:reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted');
    res.redirect(`/localshops/${id}`)
}));

module.exports = router;