const mongoose = require('mongoose')


const invoiceLineSchema = new mongoose.Schema({

    estimate: [{
        title: String,
        description:String,
        taxable:String,
        sac:String,
        contract:String,
    }],
    InvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    

})

module.exports = mongoose.model('invoiceLine',invoiceLineSchema,'invoiceLines')