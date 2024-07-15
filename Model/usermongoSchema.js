// models/MongoUser.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

const MongoUser = mongoose.model('MongoUser', userSchema);

module.exports = MongoUser;
