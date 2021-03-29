const errorHendler = require('../functions/errors');
const Helpers = require('../functions/helpers');
const fs = require('fs');
const config = require('../config');
const responseToRequest = {...config.RESPONSE_TO_REQUEST};

module.exports = (users) => ({
    getProfileData: async (userId, profileLib) => {
        try {
            const userProfileData = await users.Instance.findById(userId,
                {
                    __v: false,
                    followed: false,
                    userPassword: false
                });
            responseToRequest.profileData = profileLib.sortProfileData(userProfileData);
            return responseToRequest;
        } catch (error) {
            return errorHendler(500, error);
        }
    },

    updateFiled: async ({userId, userField, userFieldValue}) => {
        try {
            const updateOptions = {};
            updateOptions[userField] = userFieldValue;
            await users.Instance.findByIdAndUpdate(userId, updateOptions);

            return responseToRequest;
        } catch (error) {
            return errorHendler(500, error);
        }
    },

    updateUserAvatar: async (userId, userAvatarFile) => {
        try {
            const updateOptions = {};
            const updateFiledName = "userAvatar";
            updateOptions["userAvatar"] = userAvatarFile;
            const query = await users.Instance.findByIdAndUpdate(userId, updateOptions,
                {
                    new: true,
                    select: {
                        userAvatar: true
                    }
                });

            responseToRequest[updateFiledName] = query.userAvatar;
            return responseToRequest;
        } catch (error) {
            return errorHendler(500, error);
        }
    },

    removeUserAvatar: async (userId) => {
        try {
            const query = await users.Instance.findById(userId, {userAvatar: true});
            const filePath = query.userAvatar;

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return responseToRequest;
        } catch (error) {
            return errorHendler(500, error);
        }
    },

    createPost: async (userId, content, dbPost) => {
        try {
            const newPost = await new dbPost.Instance({
                userId,
                content
            }).save();

            responseToRequest.postId = newPost._id;
            return responseToRequest;
        } catch (error) {
            return errorHendler(500, error)
        }
    },

    getPosts: async (userId, page = 1, limit = 5, dbPost) => {
        try {
            const pagiParams = Helpers().calculatePagination(page, limit);
            responseToRequest.posts = await dbPost.Instance.
            find({
                userId
            }).
            sort({
                dateCreated: -1
            }).
            skip(pagiParams.skip).
            limit(pagiParams.limit);

            responseToRequest.countPosts = await dbPost.Instance.countDocuments({userId});

            return responseToRequest;
        } catch (error) {
            return errorHendler(500, error)
        }
    }
});