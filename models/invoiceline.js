const mongoose = require('mongoose')


const invoiceLineSchema = new mongoose.Schema({

    estimate: [{
        title: String,
        description:String,
        taxable:String,
        sac:String,
        contract:String,
    }],
    invoiceId: String,
    

})

module.exports = mongoose.model('invoiceLine',invoiceLineSchema,'invoiceLines')