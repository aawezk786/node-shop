const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type: String},
    sale : {type : Number},
    rate : {type : Number},
    title : {type: String},
    final :{type: Number},
    mrp_dollar : {type : Number},
    mrp_euro : {type : Number},
    mrp_inr : {type : Number},
    file_name : {type : String}
});

module.exports = mongoose.model('Test',testSchema);