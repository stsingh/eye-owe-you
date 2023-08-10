const { model, Schema } = require("mongoose");

const PersonSchema = new Schema({
    name: {type: String, required:true},
    money: {type: Number, required:true}
});

const PersonModel = model('Record', PersonSchema);

module.exports = PersonModel;