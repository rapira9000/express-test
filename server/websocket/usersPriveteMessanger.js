const messDb = require("../models/mess");
const messAction = require("../actions/mess")(messDb);

const WEBSOCKET__SEND_MESSAGE = `WEBSOCKET__SEND_MESSAGE`;
const WEBSOCKET__GET_MESSAGES = `WEBSOCKET__GET_MESSAGES`;

const usersPrivateMessengerWatcher = (io, socket) => async (users, authUserId, authUserSocketId) => {

    socket.on(WEBSOCKET__SEND_MESSAGE, async ({content, userId, type, temporaryId}) => {
        const savedMess = await messAction.saveMess(authUserId, userId, content);
        const privateMessageRoom = `${authUserId}-privateMess-${userId}`;
        const usersOnlineToSendMess = getOnlineSocketIds(io, [authUserId, userId]);

        usersOnlineToSendMess.forEach(socketLocal => {
            socketLocal.join(privateMessageRoom);
        });

        io.in(privateMessageRoom).emit(WEBSOCKET__SEND_MESSAGE, {
            ...savedMess,
            mess: {
                ...savedMess.mess._doc,
                temporaryId
            }
        });
    });

    socket.on(WEBSOCKET__GET_MESSAGES, async ({userId}) => {
        const response = await messAction.getMess(authUserId, userId);
        io.to(authUserSocketId).emit(WEBSOCKET__GET_MESSAGES, response);
    })
};

const getOnlineSocketIds = (io, usersIds) => {
    const socketOnline = [];
    io.sockets.sockets.forEach(function(socket) {
        const socketUserId = socket?.decoded_token?.userId.toString() || '0';
        if (usersIds.includes(socketUserId)) {
            socketOnline.push(socket);
        }
    });
    return socketOnline;
};

module.exports = (io, socket) => ({
    usersPrivateMessenger: usersPrivateMessengerWatcher(io, socket)
});