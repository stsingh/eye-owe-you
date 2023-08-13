const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true}
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;