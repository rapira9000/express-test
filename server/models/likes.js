const { Schema, model } = require('mongoose');

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

const Posts = model('Likes', schema);

module.exports = {Instance: Posts, Schema};