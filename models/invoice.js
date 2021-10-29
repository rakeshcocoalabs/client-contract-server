const mongoose = require('mongoose')


const invoiceSchema = new mongoose.Schema({

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
    number: {
        type: Number,
        required: false
    },
    date: {
        type: String,
        required: false
    },
    clientId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    status:String,
})

module.exports = mongoose.model('Invoice',invoiceSchema,'Invoices')