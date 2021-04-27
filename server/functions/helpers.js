module.exports = ({
    replaceBackSlashesFilePath: (filePath) => {
        const pattern = /\\/g;
        return filePath.replace(pattern, '/');
    },

    calculatePagination(page, limit, maxLimit = 100) {
        page = page ? page : 1;
        limit = limit ? limit : 10;
        limit = limit <= maxLimit ? limit : maxLimit;
        const skip = (page * limit) - limit;
        return {
            page: parseInt(page),
            limit: parseInt(limit),
            skip: skip
        }
    },

    checkPostIsLikeDisable: (postCheck, postsDisabledLike) => ({...postCheck, isDisableLike: postsDisabledLike.includes(postCheck._id.toString())})
});