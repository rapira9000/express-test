const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: String,
    content: String,
    // parentId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'posts'
    // },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    likes: {
        type: String,
        default: '0'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

const Posts = model('Posts', schema);

module.exports = {Instance: Posts, Schema};