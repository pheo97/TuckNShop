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
        const price = Math.floor(Math.random() * 50) + 10
        const newShop = new Localshop({
            author: "62d56f6ca98ec9e2093cdd86",
            location:`${cities[rand1000].city},${cities[rand1000].state}`,
            shopName:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste consequuntur ea vero, est quisquam, doloremque minus distinctio consectetur expedita corporis cum, quam qui inventore alias enim ipsam officiis soluta voluptas.',
            price,
            geometry:{
                type: "Point",
                coordinates: [-133.1331, 47.0202]
            },
            images:[
                {
                  url: 'https://res.cloudinary.com/ddvvtpekz/image/upload/v1658253740/TuckNShop/ruaejcnrifjdrgrdcnce.jpg',
                  filename: 'TuckNShop/ruaejcnrifjdrgrdcnce'
                },
                {
                  url: 'https://res.cloudinary.com/ddvvtpekz/image/upload/v1658253740/TuckNShop/mw3wlyzzrpzvm1pp6ayd.jpg',
                  filename: 'TuckNShop/mw3wlyzzrpzvm1pp6ayd'
                }
              ]
        })
         await newShop.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
});
