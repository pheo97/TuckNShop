const express = require('express');
const router = express.Router();
const localshops = require('../controllers/localshops'); 
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedIn, isAuthorised, validateLocalstore } = require('../middleware');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage })

router.route('/')
    .get(wrapAsync(localshops.index) )
    

router.get('/new', isLoggedIn, async (req,res) =>{
    res.render('localshops/new')
});

router.post('/', isLoggedIn, upload.array('image'), validateLocalstore,  wrapAsync(localshops.createShop));

router.get('/:id',wrapAsync(localshops.viewShop));

router.get('/:id/edit',isLoggedIn, isAuthorised, wrapAsync(localshops.editShop))

router.put('/:id',isLoggedIn , isAuthorised, upload.array('image'),  validateLocalstore, wrapAsync(localshops.updateShop))

router.delete('/:id', isLoggedIn, isAuthorised, wrapAsync(localshops.deleteShop));

module.exports = router;