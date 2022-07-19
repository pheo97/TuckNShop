const express = require('express');
const router = express.Router();
const localshops = require('../controllers/localshops');
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedIn, isAuthorised, validateLocalstore } = require('../middleware');

router.get('/', wrapAsync(localshops.index) );

router.get('/new', isLoggedIn, async (req,res) =>{
    res.render('localshops/new')
});

router.post('/',isLoggedIn, validateLocalstore, wrapAsync(localshops.createShop));

router.get('/:id',wrapAsync(localshops.viewShop));

router.get('/:id/edit',isLoggedIn, isAuthorised, wrapAsync(localshops.editShop))

router.put('/:id',isLoggedIn , validateLocalstore, wrapAsync(localshops.updateShop))

router.delete('/:id', isLoggedIn, isAuthorised, wrapAsync(localshops.deleteShop));

module.exports = router;