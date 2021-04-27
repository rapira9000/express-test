const Helpers = require("../functions/helpers");
const passport = require('passport');
const upload = require('../middleware/upload');
const FOR_AUTH_USER_ONLY =  passport.authenticate('jwt', {session: false});

module.exports = ({router, actions, models, lib}) => {
    const routes = router();
    const profile = actions.profile(models.users);
    const profileLib = lib.profile();


    routes.get('/', FOR_AUTH_USER_ONLY, async (req, res) => {
        const userId = (req.query.userId) || req.user._id;
        const profileData = await profile.getProfileData(userId, profileLib);
        res.status(profileData.status).send(profileData);
    });

    routes.patch('/update', FOR_AUTH_USER_ONLY, async (req, res) => {
        const payload = {
            userId: req.user._id,
            userField: req.body.userField,
            userFieldValue: req.body.userFieldValue
        };
        const profileData = await profile.updateFiled(payload);
        res.status(profileData.status).send(profileData);
    });

    routes.post('/update/avatar', FOR_AUTH_USER_ONLY, upload.single("userAvatar"), async (req, res) => {
        const removeOldAvatarRequest =  await profile.removeUserAvatar(req.user._id);
        if (removeOldAvatarRequest.done) {
            const updatedRequest = await profile.updateUserAvatar(req.user._id, Helpers.replaceBackSlashesFilePath(req.file.path));
            res.send(updatedRequest);
        } else {
            res.send(removeOldAvatarRequest)
        }

    });

    routes.post('/create/post', FOR_AUTH_USER_ONLY, async (req, res) => {
        const postCreated = await profile.createPost(req.user._id, req.body.text, models.posts);
        res.status(postCreated.status).send(postCreated);
    });

    routes.get('/get/post', FOR_AUTH_USER_ONLY, async (req, res) => {
        const getPost = await profile.getPosts(req.user._id, req.query.page, req.query.limit, models);
        res.status(getPost.status).send(getPost);
    });

    return routes;
};