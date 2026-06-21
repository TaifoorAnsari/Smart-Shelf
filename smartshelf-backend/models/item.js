const mongoose= require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemName : {type: String, required: true},
    category : {type: String, default: 'other'},
    expiry : {type: Date,required: true},
    addedAt : {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Item', ItemSchema);