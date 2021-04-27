const errorHendler = require('../functions/errors');
const config = require('../config');
const responseToRequest = {...config.RESPONSE_TO_REQUEST};
const mongoose = require('mongoose');

const saveMess = (db) => async (senderId, recipientId, content, type = 'mess') => {
    try {
        responseToRequest.mess = await new db.Instance({
            usersChat: [
                senderId,
                recipientId,
            ],
            senderId,
            recipientId,
            content,
            type
        }).save();
        return responseToRequest;
    } catch (e) {
        errorHendler(500, e);
    }
};

const getMess = (db) => async (senderId, recipientId) => {
    try {
        responseToRequest.mess =  await db.Instance.find({usersChat: {$all: [mongoose.Types.ObjectId(senderId), mongoose.Types.ObjectId(recipientId)]}}, {__v: false}).sort({dateCreated: -1}).limit(5).lean();
        return responseToRequest;
    } catch (e) {
        errorHendler(500, e);
    }
};

module.exports = (db) => ({
    saveMess: saveMess(db),
    getMess: getMess(db)
});