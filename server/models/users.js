const { Schema, model } = require('mongoose');

const schema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    userNickName: String,
    userCity: String,
    userAge: String,
    userDescription: String,
    userAvatar: String,
    gender: String,
    followed: Array,
});

const Users = model('Users', schema);

module.exports = {Instance: Users, Schema};