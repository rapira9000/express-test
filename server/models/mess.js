const { Schema, model } = require('mongoose');

const schema = new Schema({
    usersChat: [{ type : Schema.ObjectId, required: true }],
    recipientId: {
        type: Schema.ObjectId,
        required: true
    },
    senderId: {
        type: Schema.ObjectId,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        default: 'mess'
    },
    content: {
        type: String,
        required: true
    }
});

const Mess = model('Mess', schema);

module.exports = {Instance: Mess, Schema};