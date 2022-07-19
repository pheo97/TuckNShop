const Localshop = require('../models/localShop');

module.exports.index = async (req,res) =>{
    const localshops = await Localshop.find({})
    res.render('localshops/index', { localshops })
};

module.exports.createShop = async (req,res) => {
    const localshop = new Localshop (req.body.localshop);
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
    req.flash('success', 'Successfully updated Store');
    res.redirect(`/localshops/${localshop._id}`);
};

module.exports.deleteShop = async (req,res) =>{
    const { id } = req.params
    const localshop = await Localshop.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted store');
    res.redirect('/localshops');
};