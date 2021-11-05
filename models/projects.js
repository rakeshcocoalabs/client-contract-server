const mongoose = require('mongoose')


const projectSchema = new mongoose.Schema({

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
    },
    project: {
        type: String,
        required: false
    },
    PO:{
        date:String,
        numner:String,
        details:String,
        value:Number,
        filePath:String
    },
    clientId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    project:String,
    status:{
        type:String,
        default:"active"
    },
})

module.exports = mongoose.model('Project',projectSchema,'Projects')