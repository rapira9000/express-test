const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: String,
    content: String,
    user: {
        type: Schema.Types.ObjectId
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    }
});

const Posts = model('Posts', schema);

module.exports = {Instance: Posts, Schema};