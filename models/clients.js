const mongoose = require('mongoose')


const clientSchema = new mongoose.Schema({

    name: {
        type: String,
        required: false
    },
    contactName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    address1: [{
        type: String,
        required: false
    }],
    address2: [{
        type: String,
        required: false
    }],
    gstIn: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    supplyPlace: {
        type: String,
        required: false
    }

})

module.exports = mongoose.model('Client',clientSchema,'Clients')