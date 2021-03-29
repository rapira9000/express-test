const errorHendler = require('../functions/errors');
const Helpers = require('../functions/helpers');
const config = require('../config');
const responseToRequest = {...config.RESPONSE_TO_REQUEST};

const self = module.exports = ({users}) => ({
    getAllUsers: async (userId, page, limit, libUsers) => {
        try {
            const usersQuery = await self({users}).getAll(page, limit);
            const followedIdsArr = await self({users}).getFollowUnFollowUser(userId);
            responseToRequest.items = await libUsers.checkIsFollowedUsers(usersQuery, followedIdsArr.followed || []);
            responseToRequest.itemsCount = await self({users}).getCount();
            return responseToRequest;
        } catch (err) {
            return errorHendler(500, err);
        }

    },

    getAll: async (page, limit) => {
        const pagiParams = Helpers().calculatePagination(page, limit);
        return await users.Instance.find().skip(pagiParams.skip).limit(pagiParams.limit);
    },

    getCount: async () => {
        return await users.Instance.countDocuments();
    },

    getUser: async (userId) => {
        try {
            const query = await users.Instance.findOne({
                    _id: userId
                },
                {
                    _id: true,
                    userEmail: true,
                    userName: true
                });
            responseToRequest.userId = query._id;
            responseToRequest.userEmail = query.userEmail;
            responseToRequest.userName = query.userName;
            return responseToRequest;
        } catch (err) {
            return errorHendler(500, err);
        }

    },

    getFollowUnFollowUser: async (userAuthId) => {
        return await users.Instance.findById({
                _id: userAuthId
            },
            {
                followed: true,
                _id: false,
            });
    },

    toggleFollowUser: async (follow = false, authUserId, followedUserId, libUsers) => {
        try {
            let followedIdsArr = await self({users}).getFollowUnFollowUser(authUserId);
            let followedIds = libUsers.clearArray(followedIdsArr.followed || []);
            let followedData = follow ? await libUsers.followUser(followedIds, followedUserId) : await libUsers.unFollowUser(followedIds, followedUserId);
            await self({users}).updateUserFollowers(authUserId, followedData.followersIds);
            return responseToRequest
        } catch (err) {
            errorHendler(500, err);
        }

    },

    updateUserFollowers: (userAuthId, followersIds) => {
        return users.Instance.updateOne({
                _id: userAuthId
            },
            {
                $set: {
                    followed: followersIds
                }
            });
    },

    insert: (payload) => {
        const u = new users.Instance({
            userName: payload.userName,
            userEmail: payload.userEmail,
            userNickName: payload.userNickName,
            userCity: payload.userCity,
            userAge: payload.userAge,
            userDescription: payload.userDescription
        });

        return u.save();
    },

    updateUserDescription: async (userId, userDescription) => {
        try {
            await users.Instance.updateOne({
                    _id: userId
                },
                {
                    $set: {
                        userDescription
                    }
                });
            responseToRequest.userDescription = userDescription;
            return responseToRequest;
        } catch (err) {
            errorHendler(500, err);
        }
    },

    createUser: async ({userName, userEmail, userPassword, lib}) => {
        const isUserExist = await users.Instance.findOne({userEmail: userEmail});
        if (isUserExist) {
            return errorHendler(409, {message: `user with email ${userEmail} already exist`});
        } else {
            userPassword = lib.generatePassword(userPassword);
            const createUser = new users.Instance({
                userName,
                userEmail,
                userPassword
            });

            try {
                await createUser.save();
                responseToRequest.status = 201;
                responseToRequest.message = `user with email ${userEmail} was been created`
                return responseToRequest
            } catch (e) {
                return errorHendler(401, e);
            }
        }
    },

    logInUser: async ({userName, userEmail, userPassword, lib}) => {
        const isExistUser = await users.Instance.findOne({userEmail: userEmail}, {userEmail: true, userPassword: true});
        if (isExistUser) {
            const passwordIsCompared = lib.passwordComparison(userPassword, isExistUser.userPassword);

            if (passwordIsCompared) {
                responseToRequest.message = `user is login`;
                responseToRequest.token = `Bearer ${lib.getUserToken(isExistUser.userEmail, isExistUser._id)}`;
                responseToRequest.userData = {
                    userId: isExistUser._id,
                    userName: isExistUser.userName,
                    userEmail: isExistUser.userEmail
                };
                return responseToRequest;
            } else {
                return errorHendler(401, {message: `password is incorrect`});
            }
        } else {
            return errorHendler(409, {message: `user with email ${userEmail} is no exist`});
        }
    },
});