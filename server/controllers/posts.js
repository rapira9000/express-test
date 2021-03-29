module.exports = ({router, actions, models}) => {
    const routes = router();

    const posts = actions.posts(models);

    routes.get('/getall', async (req, res) => {
        const postsData = await posts.getAll();

        res.send(postsData);
    });

    // routes.get('/insert', async (req, res) => {
    //     const payload = {
    //         name: 'test post 2',
    //         content: 'test content 2'
    //     };
    //     const postsData = await posts.insert(payload);
    //     res.send(postsData);
    // });

    return routes;
};