module.exports = (status = 500, error) => {
    if (status === 500) {
        console.log(error);
    }
    return {
        done: false,
        status: status,
        errorStatus: true,
        message: error.message || error
    };
};