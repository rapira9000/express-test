module.exports = {
    MONGO_DB_URI: `mongodb+srv://rapira9k:8Srpsaiqp0tj1RwM@cluster0.qn7sv.mongodb.net/reactTest?retryWrites=true&w=majority`,
    TOKEN_USER_SECRET_KEY: 'sdasd#$@rt5yfdgdse453E#$5r',
    SESSION_SECRET_KEY: 's748R43#$ifkr_0453fUrje&4ekd',
    SESSION_MAX_AGE: 3600000,
    LISTEN_PORT: 3001,
    SES_NAME: 'sid',
    RESPONSE_TO_REQUEST: {
        done: true,
        status: 200,
        errorStatus: false,
        message: 'status 200'
    },
    CORS_DOMAINS_ALLOWED: ['http://localhost:3000']
};