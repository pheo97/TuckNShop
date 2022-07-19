const Localshop = require('../models/localShop');
const Review = require('../models/review');

module.exports.createReview = async(req,res) =>{
    const localshop = await Localshop.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    localshop.reviews.push(review);
    await review.save();
    await localshop.save();
    req.flash('success', 'Successfully created Review');
    res.redirect(`/localshops/${localshop._id}`)
};

module.exports.deleteReview = async (req,res) =>{
    const { id, reviewId} = req.params;
    Localshop.findByIdAndUpdate(id, {$pull: { reviews:reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted');
    res.redirect(`/localshops/${id}`)
};