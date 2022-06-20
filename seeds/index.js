const mongoose = require('mongoose')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Localshop = require('../models/localShop')

mongoose.connect('mongodb://localhost:27017/tuck-n-shop',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection
db.on('error', console.error.bind(console,"connection error:"));
db.once("open",() =>{
    console.log("Database connected")
});

const sample = array => array[ Math.floor(Math.random() * array.length)]

const seedDB = async () =>{
    await Localshop.deleteMany();
    for(let i = 0; i < 50; i++){
        const rand1000 = Math.floor(Math.random() * 1000);
        const newShop = new Localshop({
            location:`${cities[rand1000].city},${cities[rand1000].state}`,
            shopName:`${sample(descriptors)} ${sample(places)}`
        })
         await newShop.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
});
