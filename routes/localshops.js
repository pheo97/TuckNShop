const express = require('express');
const router = express.Router();

const Localshop = require('../models/localShop');
const flash = require('connect-flash');

const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressError');

const { localstoreSchema } = require('../schemas.js');


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

router.get('/', async (req,res) =>{
    const localshops = await Localshop.find({})
    res.render('localshops/index', { localshops })
});

router.get('/new', async (req,res) =>{
    res.render('localshops/new')
});

router.post('/',validateLocalstore, wrapAsync(async (req,res) => {
    //if(!req.body.localshops) throw new ExpressError('Invalid Data',400)
   const localshop = new Localshop (req.body.localshop);
   await localshop.save();
   req.flash('success', 'Successfully created new Store');
   res.redirect(`/localshops/${localshop._id}`);
}));

router.get('/:id',wrapAsync(async (req,res) =>{
    const localshop = await Localshop.findById(req.params.id).populate('reviews');
    if(!localshop){
        req.flash('error', 'Store does not exist');
        return res.redirect('/localshops');
    } 
    res.render('localshops/show', { localshop });
}));

router.get('/:id/edit', wrapAsync(async (req,res) =>{
    const localshop = await Localshop.findById(req.params.id);
    if(!localshop){
        req.flash('error', 'Store does not exist');
        return res.redirect('/localshops');
    } 
    res.render('localshops/edit', { localshop });
}))

router.put('/:id',validateLocalstore, wrapAsync(async (req,res) =>{
    const { id } = req.params;
    const localshop = await Localshop.findByIdAndUpdate(id, {...req.body.localshop});
    req.flash('success', 'Successfully updated Store');
    res.redirect(`/localshops/${localshop._id}`);
}))

router.delete('/:id',wrapAsync( async (req,res) =>{
    const { id } = req.params
    const localshop = await Localshop.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted store');
    res.redirect('/localshops');
}));

module.exports = router;