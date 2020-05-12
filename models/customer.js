const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25
    },
    phone: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 9
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(2).max(25).required(),
        phone: Joi.string().min(6).max(9).required(),
        isGold: Joi.boolean()
    };
    
    return Joi.validate(customer, schema);
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;