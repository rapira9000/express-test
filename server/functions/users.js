const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = ({users}) => ({
    followUser: (arr, userId) => {
        if (!arr.includes(userId)) {
            arr.push(userId);
        }
        return arr;
    },

    unFollowUser: (arr, userId) => {
        return arr.filter(item => item !== userId);
    },

    clearArray: (arr = []) => {
        let newArr = [];
        arr.forEach((item) => {
            if (item && item.length) {
                newArr.push(item);
            }
        });

        return [... new Set(arr)];
    },

    checkIsFollowedUsers: (users, authUserFollowedIds) => {
        authUserFollowedIds = authUserFollowedIds.map(item => (item.toString()));
        return users.map((item) => {
            return {
                ...item._doc,
                isFollow: authUserFollowedIds.includes(item._id.toString())
            };
        });
    },

    generatePassword: (password) => {
        const salt = bcript.genSaltSync(10);
        return bcript.hashSync(password, salt);
    },

    passwordComparison: (password, passwordFromDb) => {
        return bcript.compareSync(password, passwordFromDb);
    },

    getUserToken: (userEmail, userId, expiresTime) => {
        return jwt.sign(
            {
                userEmail,
                userId
            },
            config.TOKEN_USER_SECRET_KEY,
            {
                expiresIn: expiresTime || 3600
            }
        );
    }

});

