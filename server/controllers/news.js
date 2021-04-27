const passport = require('passport');
const FOR_AUTH_USER_ONLY =  passport.authenticate('jwt', {session: false});

module.exports = ({router, actions, models}) => {
    const routes = router();

    const news = actions.news(models);

    routes.get('/get-all', FOR_AUTH_USER_ONLY, async (req, res) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const authUserId = req.user._id ? req.user._id : false;
        const response = await news.getNews(authUserId, page, limit);
        res.status(response.status).send(response);
    });

    return routes;
};