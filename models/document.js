const mongoose = require('mongoose')


const invoiceSchema = new mongoose.Schema({

    path: {
        type: String,
        required: false
    },
 
    invoiceId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }
    
})

module.exports = mongoose.model('Invoice',invoiceSchema,'Invoices')