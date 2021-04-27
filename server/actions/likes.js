const errorHendler = require('../functions/errors');
const config = require('../config');
const responseToRequest = {...config.RESPONSE_TO_REQUEST};

const toggleLikes = (likeDb, postDb) => async (user, post) => {
    try {
        const likeId = await userIsLiked(likeDb)(user, post);
        let countLikes = +await getLikeCountsOfPost(likeDb)(post);
        const postData = {
            userId: user,
            isDisableLike: false,
            postId: post,
        };
        if (likeId) {
            await removeLike(likeDb)(likeId);
            countLikes--;
        } else {
            await insertLike(likeDb)(user, post);
            countLikes++;
            postData.isDisableLike = true;
        }
        await updatePostCountLikes(postDb)(post, countLikes);
        postData.likes = countLikes;
        responseToRequest.post = postData;
        return responseToRequest;
    } catch (e) {
        return errorHendler(500, e);
    }
};

const userIsLiked = db => async (user, post) => {
    try {
        const response = await db.Instance.findOne({user, post}, {_id: true});
        return (response == null) ? false : response._id;
    } catch (e) {
        console.log(e);
        return e;
    }

};

const insertLike = (db) => async (user, post) => {
    console.log(post);
    try {
        return await new db.Instance({user, post}).save();
    } catch (e) {
        console.log(e);
        return e;
    }
};

const removeLike = (db) => async (_id) => {
    try{
        return await db.Instance.deleteOne({_id});
    }catch (e) {
        console.log(e);
        return e;
    }
};

const getLikeCountsOfPost = (db) => async (post) => {
    try {
        return await db.Instance.countDocuments({post});
    } catch (e) {
        console.log(e);
        return e;
    }
};

const updatePostCountLikes = (db) => async (_id, likes) => {
    try {
        return await db.Instance.findOneAndUpdate({_id}, {likes});
    }catch (e) {
        console.log(e);
        return e;
    }
};

module.exports = ({likes, posts}) => ({
    toggleLikes: toggleLikes(likes, posts),
    insertLike: insertLike(likes)
});