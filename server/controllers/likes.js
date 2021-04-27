const passport = require('passport');
const FOR_AUTH_USER_ONLY =  passport.authenticate('jwt', {session: false});

module.exports = ({router, actions, models}) => {
    const routes = router();

    const likes = actions.likes(models);

    routes.put('/', FOR_AUTH_USER_ONLY, async (req, res) => {
        const postId = req.body.postId;
        const authUserId = req.user._id ? req.user._id : false;
        const response = await likes.toggleLikes(authUserId, postId);
        res.status(response.status).send(response);
    });

    return routes;
};