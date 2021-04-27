const errorHendler = require('../functions/errors');
const Helpers = require('../functions/helpers');
const config = require('../config');
const responseToRequest = {...config.RESPONSE_TO_REQUEST};
const usersAction = require("../actions/users");
const libUsers = require('../functions/users');
const mongoose = require('mongoose');

const getNews = db => async (authUserId, page, limit, postsInProfile = false) => {
    try {
        const pagiParams = Helpers.calculatePagination(page, limit);

        let followedIds = [authUserId];
        if (!postsInProfile) {
            followedIds = await getFollowedIds(db)(authUserId);
        }

        followedIds = followedIds.map(i => (mongoose.Types.ObjectId(i)));
        const postsData = await db.posts.Instance.aggregate([
            {
                $match: {
                    user: {$in: followedIds}
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: {'userId': '$user'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$$userId', '$_id']
                                }
                            }
                        },
                        {$project: {userNickName: true, userName: true}}
                    ],
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    content: true,
                    likes: true,
                    dateCreated: true,
                    'user': '$user'
                }
            }
        ]).skip(pagiParams.skip).limit(pagiParams.limit);

        const postsIds = postsData.map(p => (p._id));
        const postsIdsLikedByAuthUser = await getPastsIdWhoLikedAuthUser(db)(postsIds, authUserId);
        responseToRequest.items = postsData.map(p => (Helpers.checkPostIsLikeDisable(p, postsIdsLikedByAuthUser)));
        responseToRequest.itemsCount = await getCountFollowedPosts(db)(followedIds);
        return responseToRequest;
    } catch (error) {
        return errorHendler(500, error);
    }
};

const getCountFollowedPosts = db => async (followedIds) => {
    try {
        return await db.posts.Instance.countDocuments({user: {$in: followedIds}});
    } catch (e) {
        return e;
    }

};

const getPastsIdWhoLikedAuthUser = db => async (postsIds, authUserId) => {
    try {
        const response = await db.likes.Instance.find({post: {$in: postsIds}, user: authUserId}, {
            post: true,
            _id: false
        });
        return response.map(p => (p.post.toString()));
    } catch (e) {
        return e;
    }
};

const getFollowedIds = (db) => async (authUserId) => {
    const response = await usersAction(db).getFollowUnFollowUser(authUserId);
    const followedIds = (response.followed) ? response.followed : [];
    return libUsers(db).clearArray(followedIds);
};

module.exports = (db) => ({
    getNews: getNews(db),
    getCountFollowedPosts: getCountFollowedPosts(db),
    getPastsIdWhoLikedAuthUser: getPastsIdWhoLikedAuthUser(db)
});