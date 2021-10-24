const mongoose = require('mongoose')


const mileStoneSchema = new mongoose.Schema({

    estimate: [{
        milestone: String,
        percent:Number,
        amount:Number,
    }],
    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    

})

module.exports = mongoose.model('milesStone',mileStoneSchema,'milesStones')