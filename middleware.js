const Localshop = require('./models/localShop');
const Review = require('./models/review');
const { localstoreSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utilities/ExpressError')

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next(); 
}

module.exports.validateLocalstore = (req, res, next) =>{
    const { error } = localstoreSchema.validate(req.body);
    console.log(error)
    if(error){
       const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next()
    }
}

module.exports.isAuthorised = async(req, res, next) =>{
    const { id } = req.params
    const localshop = await Localshop.findById(id);
    if(!localshop.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission');
       return res.redirect(`/localshops/${id}`);
    };
    next();
};

module.exports.isReviewAuthor = async(req, res, next) =>{
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission');
       return res.redirect(`/localshops/${id}`);
    };
    next();
};

module.exports.validateReview = ( req, res , next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
         const msg = error.details.map(el => el.message).join(',')
         throw new ExpressError(msg, 400)
     }else{
         next()
     }
 }
