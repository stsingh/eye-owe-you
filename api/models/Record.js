const { model, Schema } = require("mongoose");

const RecordSchema = new Schema({
    name: {type: String, required:true},
    dir: {type: String, required:true},
    money: {type: Number, required:true}
});

const RecordModel = model('Record', RecordSchema);

module.exports = RecordModel;