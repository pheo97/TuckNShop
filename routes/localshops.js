const express = require('express');
const router = express.Router();
const Localshop = require('../models/localShop');
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedIn, isAuthorised, validateLocalstore } = require('../middleware');

router.get('/', async (req,res) =>{
    const localshops = await Localshop.find({})
    res.render('localshops/index', { localshops })
});

router.get('/new', isLoggedIn, async (req,res) =>{
    res.render('localshops/new')
});

router.post('/',isLoggedIn,validateLocalstore,  wrapAsync(async (req,res) => {
   const localshop = new Localshop (req.body.localshop);
   localshop.author = req.user._id;
   await localshop.save();
   req.flash('success', 'Successfully created new Store');
   res.redirect(`/localshops/${localshop._id}`);
}));

router.get('/:id',wrapAsync(async (req,res) =>{
    const localshop = await Localshop.findById(req.params.id)
    .populate({ path: 'reviews',
                populate:{
                    path: 'author'
                }    
    }).populate('author');
    if(!localshop){
        req.flash('error', 'Store does not exist');
        return res.redirect('/localshops');
    } 
    res.render('localshops/show', { localshop });
}));

router.get('/:id/edit',isLoggedIn, isAuthorised, wrapAsync(async (req,res) =>{
    const { id } = req.params
    const localshop = await Localshop.findById(id);
    if(!localshop){
        req.flash('error', 'Store does not exist');
        return res.redirect('/localshops');
    } 
    res.render('localshops/edit', { localshop });
}))

router.put('/:id',isLoggedIn , validateLocalstore, wrapAsync(async (req,res) =>{
    const { id } = req.params;
    const localshop = await Localshop.findByIdAndUpdate(id, {...req.body.localshop});
    req.flash('success', 'Successfully updated Store');
    res.redirect(`/localshops/${localshop._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthorised, wrapAsync( async (req,res) =>{
    const { id } = req.params
    const localshop = await Localshop.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted store');
    res.redirect('/localshops');
}));

module.exports = router;