const mongoose =require('mongoose');
const passportLocalmongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
   email:{
    type: String,
    required: true,
    unique: true
   }
});

UserSchema.plugin(passportLocalmongoose)

module.exports = mongoose.model('User', UserSchema);