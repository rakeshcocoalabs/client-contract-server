const mongoose = require('mongoose')


const invoiceDocSchema = new mongoose.Schema({

    name: {
        type: String,
        required: false
    },
    invoiceId: {
        type: String,
        required: false
    },
    invoiceNumber: {
        type: Number,
        required: false
    },
    date: {
        type: Number,
        required: false
    },

   
    path: {
        type: String,
        required: false
    }
   
})

module.exports = mongoose.model('InvoiceDoc',invoiceDocSchema,'InvoicesDoc')