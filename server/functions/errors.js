module.exports = (status = 500, error) => {
    return {
        done: false,
        status: status,
        errorStatus: true,
        message: error.message || error
    };
};