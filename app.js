const express = require ('express');
const path = require ('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Joi = require('joi');
const { localstoreSchema, reviewSchema } = require('./schemas.js')
const wrapAsync = require('./utilities/wrapAsync');
const ExpressError = require('./utilities/ExpressError')
const ejsMate = require('ejs-mate')
const Localshop = require('./models/localShop');
const { urlencoded } = require('express');
const Review = require('./models/review')

mongoose.connect('mongodb://localhost:27017/tuck-n-shop',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const validateLocalstore = (req, res, next) =>{
     const { error } = localstoreSchema.validate(req.body);
     console.log(error)
     if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
     }else{
        next()
     }
}

const validateReview = ( req, res , next) => {
   const { error } = reviewSchema.validate(req.body);
   if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error:"));
db.once("open",() =>{
    console.log("Database connected");
});

const app = express();


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/localshops', async (req,res) =>{
    const localshops = await Localshop.find({})
    res.render('localshops/index', { localshops })
});

app.get('/localshops/new', async (req,res) =>{
    res.render('localshops/new')
});

app.post('/localshops',validateLocalstore, wrapAsync(async (req,res) => {
    //if(!req.body.localshops) throw new ExpressError('Invalid Data',400)
   const localshop = new Localshop (req.body.localshop);
   await localshop.save();
   res.redirect(`/localshops/${localshop._id}`)
}));

app.get('/localshops/:id',wrapAsync(async (req,res) =>{
    const localshop = await Localshop.findById(req.params.id).populate('reviews');
    res.render('localshops/show', { localshop });
}));

app.get('/localshops/:id/edit', wrapAsync(async (req,res) =>{
    const localshop = await Localshop.findById(req.params.id)
    res.render('localshops/edit', { localshop })
}))

app.put('/localshops/:id',validateLocalstore, wrapAsync(async (req,res) =>{
    const { id } = req.params;
    const localshop = await Localshop.findByIdAndUpdate(id, {...req.body.localshop})
    res.redirect(`/localshops/${localshop._id}`)
}))

app.delete('/localshops/:id',wrapAsync( async (req,res) =>{
    const { id } = req.params
    const localshop = await Localshop.findByIdAndDelete(id);
    res.redirect('/localshops');
}));

app.post('/localshops/:id/reviews', validateReview, wrapAsync( async(req,res) =>{
    const localshop = await Localshop.findById(req.params.id);
    const review = new Review(req.body.review)
    localshop.reviews.push(review);
    await review.save();
    await localshop.save();
    res.redirect(`/localshops/${localshop._id}`)
}))

app.delete('/localshops/:id/reviews/:reviewId', wrapAsync ( async (req,res) =>{
    const { id, reviewId} = req.params;
    Localshop.findByIdAndUpdate(id, {$pull: { reviews:reviewId }})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/localshops/${id}`)
}));

app.all('*',(req,res,next)=>{
    next(new ExpressError('PAGE NOT FOUND',404))
})

app.use((err,req,res,next)=>{
   const { statusCode = 500} = err;
   if(!err.message) err.message = 'UH OH SOMETHING WENT WRONG'
   res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Running port on 3000")
})