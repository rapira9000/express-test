const passport = require('passport');
const FOR_AUTH_USER_ONLY =  passport.authenticate('jwt', {session: false});

module.exports = ({router, actions, models, lib}) => {
    const routes = router();
    const users = actions.users(models);
    const libUsers = lib.users(models);

    routes.get('/', FOR_AUTH_USER_ONLY, async (req, res) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const authUserId = req.user._id ? req.user._id : false;
        const response = await users.getAllUsers(authUserId, page, limit, libUsers);

        res.status(response.status).send(response);
    });

    routes.get('/get-followed-list', FOR_AUTH_USER_ONLY, async (req, res) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const authUserId = req.user._id ? req.user._id : false;
        const response = await users.getFollowedUsers(authUserId, page, limit, libUsers);

        res.status(response.status).send(response);
    });

    routes.get('/get-user', FOR_AUTH_USER_ONLY, async (req, res) => {
        const response = await users.getUser(req.user._id);

        res.status(response.status).send(response);
    });

    routes.put('/follow', FOR_AUTH_USER_ONLY, async (req, res) => {
        const followedUserId = req.query.id || null;
        const authUserId = req.user._id ? req.user._id : false;
        const response = await users.toggleFollowUser(true, authUserId, followedUserId, libUsers);

        res.status(response.status).send(response);
    });

    routes.delete('/unfollow', FOR_AUTH_USER_ONLY, async (req, res) => {
        const followedUserId = req.query.id || null;
        const authUserId = req.user._id ? req.user._id : false;
        const response = await users.toggleFollowUser(false, authUserId, followedUserId, libUsers);

        res.status(response.status).send(response);
    });

    routes.post('/description', FOR_AUTH_USER_ONLY, async (req, res) => {
        const {userId, userDescription} = req.body;
        const response = await users.updateUserDescription(userId, userDescription);

        res.status(response.status).send(response);
    });

    routes.post('/registration', async (req, res) => {
        const response = await users.createUser({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: req.body.userPassword,
            lib: libUsers
        });

        res.status(response.status).send(response);
    });

    routes.post('/login', async (req, res) => {
        const response = await users.logInUser({
            userEmail: req.body.userEmail,
            userPassword: req.body.userPassword,
            lib: libUsers
        });

        res.status(response.status).send(response);
    });

    return routes;
};