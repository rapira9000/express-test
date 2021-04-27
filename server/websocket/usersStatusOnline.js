const usersDb = require("../models/users");
const usersAction = require("../actions/users")({users: usersDb});
const WEBSOCKET__NOTIFI_FOLLOWERS_USER_STATUS_ONLINE = `WEBSOCKET__NOTIFI_FOLLOWERS_USER_STATUS_ONLINE`;
const WEBSOCKET__NOTIFI_FOLLOWERS_USER_STATUS_OFFLINE = `WEBSOCKET__NOTIFI_FOLLOWERS_USER_STATUS_OFFLINE`;
const WEBSOCKET__GET_FOLLOWERS_STATUS_ONLINE = `WEBSOCKET__GET_FOLLOWERS_STATUS_ONLINE`;

const usersStatusOnlineWatcher = (io, socket) => async (users, authUserId, event, connecting = false) => {
    event = event ? WEBSOCKET__NOTIFI_FOLLOWERS_USER_STATUS_ONLINE : WEBSOCKET__NOTIFI_FOLLOWERS_USER_STATUS_OFFLINE;
    await sendFollowedUsersStatusOnline(io, socket, authUserId, users, event, connecting);
};

const getFollowedUsersOnline = async (authUserId, users) => {
    const followedUsersIds = await usersAction.getFollowUnFollowUser(authUserId);
    return users.filter(user => followedUsersIds.followed.includes(user.userId));
};

const sendFollowedUsersStatusOnline = async (io, socket, authUserId, users, event, connecting = true) => {
    const usersOnline = await getFollowedUsersOnline(authUserId, users);
    const followedUsersRoom = `${authUserId}-online-status-room`;
    usersOnline.forEach( user => {
        const socketLocal = io.sockets.sockets.get(user.socketId);
        if (socketLocal) {
            socketLocal.join(followedUsersRoom);
        }
    });

    io.to(followedUsersRoom).emit(event, {userId: authUserId});

    if (connecting) {
        socket.emit(WEBSOCKET__GET_FOLLOWERS_STATUS_ONLINE, {usersOnline: usersOnline.map(u => (u.userId))})
    }
};

module.exports = (io, socket) => ({
    usersStatusOnlineWatcher: usersStatusOnlineWatcher(io, socket),
});