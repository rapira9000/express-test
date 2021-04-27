const socketioJwt = require("socketio-jwt");
const config = require('../config');
const usersStatusOnline = require('./usersStatusOnline');
const usersPriveteMessanger = require('./usersPriveteMessanger');

const initWebSocket = (io) => () => {

    io.use(socketioJwt.authorize({
        secret: config.TOKEN_USER_SECRET_KEY,
        handshake: true,
        auth_header_required: true,
    }));

    io.on('connection', async (socket) => {
        const authUserId = socket?.decoded_token?.userId || 0;
        const authUserSocketId = socket.id;

        socket.on("disconnect", async () => {
            await usersStatusOnline(io, socket).usersStatusOnlineWatcher(getSocketsIdsByUserId(io), authUserId, false, false);
        });


        // get users status online only by followed users
        await usersStatusOnline(io, socket).usersStatusOnlineWatcher(getSocketsIdsByUserId(io), authUserId, true, true);

        await usersPriveteMessanger(io,socket).usersPrivateMessenger(getSocketsIdsByUserId(io), authUserId, authUserSocketId);
    });
};

const getSocketsIdsByUserId = (io, withSocket = false) => {
    let users = [];

    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userId: socket?.decoded_token?.userId.toString() || 0,
            socketId: id
        });
    }
    return users;
};

module.exports = (io) => ({
    initWebSocket: initWebSocket(io),
});