const Localshop = require('../models/localShop');
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken}); 

module.exports.index = async (req,res) =>{
    const localshops = await Localshop.find({});
    res.render('localshops/index', { localshops });
};

module.exports.createShop = async (req,res) => {
    const geoData = await geocoder.forwardGeocode({ 
        query: req.body.localshop.location,
        limit:1
    }).send()
    const localshop = new Localshop (req.body.localshop);
    localshop.geometry = geoData.body.features[0].geometry;
    localshop.images = req.files.map(f => ({ url: f.path, filename: f.filename}));
    localshop.author = req.user._id;
    await localshop.save();
    req.flash('success', 'Successfully created new Store');
    res.redirect(`/localshops/${localshop._id}`);
 };

 module.exports.viewShop = async (req,res) =>{
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
};

module.exports.editShop = async (req,res) =>{
    const { id } = req.params
    const localshop = await Localshop.findById(id);
    if(!localshop){
        req.flash('error', 'Store does not exist');
        return res.redirect('/localshops');
    } 
    res.render('localshops/edit', { localshop });
};

module.exports.updateShop = async (req,res) =>{
    const { id } = req.params;
    const localshop = await Localshop.findByIdAndUpdate(id, {...req.body.localshop});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    localshop.images.push(...imgs);
    await localshop.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await localshop.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages }}}})
    }
    req.flash('success', 'Successfully updated Store');
    res.redirect(`/localshops/${localshop._id}`);
};

module.exports.deleteShop = async (req,res) =>{
    const { id } = req.params
    const localshop = await Localshop.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted store');
    res.redirect('/localshops');
};