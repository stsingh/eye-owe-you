const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    name: {type: String, required:true},
    dir: {type: String, required:true},
    money: {type: Number, required:true},
    user:{type:mongoose.SchemaTypes.ObjectId}
});

const RecordModel = mongoose.model('Record', RecordSchema);

module.exports = RecordModel;