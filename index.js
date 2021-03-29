const express = require('express');
const inject = require('require-all');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./server/config');

const app = express();
const router = express.Router;

app.use(passport.initialize());
require('./server/middleware/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

try {
    const controllers = inject(__dirname + '/server/controllers');
    const actions = inject(__dirname + '/server/actions');
    const models = inject(__dirname + '/server/models');
    const lib = inject(__dirname + '/server/functions');

    // connect to db
    mongoose.connect(config.MONGO_DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    );

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.info('Database - connected');
    });

    // default rout to SPA and his static files
    app.use('/server/uploads', express.static('server/uploads'));
    // app.use(express.static('/build'));
    // app.use(/^((?!\/api\/).)*$/, (req, res) => {
    //     res.sendFile(__dirname + '/build/index.html');
    // });

    // api endpoints
    for (const name in controllers) {
        app.use(`/api/${name}`, controllers[name]({router, actions, models, lib}));
    }

} catch (e) {
    console.error(e)
}

app.listen(config.LISTEN_PORT);