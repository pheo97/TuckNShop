const Joi = require('joi');

module.exports.localstoreSchema = Joi.object({
    localshop: Joi.object({
        shopName : Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required()
    }).required()
 })
