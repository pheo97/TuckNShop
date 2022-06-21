const express = require ('express');
const path = require ('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const Localshop = require('./models/localShop');
const { urlencoded } = require('express');

mongoose.connect('mongodb://localhost:27017/tuck-n-shop',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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

app.post('/localshops', async (req,res) => {
   const localshop = new Localshop (req.body.localshop);
   await localshop.save();
   res.redirect(`/localshops/${localshop._id}`)
});

app.get('/localshops/:id',async (req,res) =>{
    const localshop = await Localshop.findById(req.params.id)
    res.render('localshops/show', { localshop })
});

app.get('/localshops/:id/edit', async (req,res) =>{
    const localshop = await Localshop.findById(req.params.id)
    res.render('localshops/edit', { localshop })
})

app.put('/localshops/:id', async (req,res) =>{
    const { id } = req.params;
    const localshop = await Localshop.findByIdAndUpdate(id, {...req.body.localshop})
    res.redirect(`/localshops/${localshop._id}`)
})

app.delete('/localshops/:id', async (req,res) =>{
    const { id } = req.params
    const localshop = await Localshop.findByIdAndDelete(id);
    console.log(localshop)
    res.redirect('/localshops')
})

app.listen(3000, () => {
    console.log("Running port on 3000")
})