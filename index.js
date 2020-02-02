const session = require('express-session'),
    mongoConnect = require('connect-mongo');

const config = { //FIXME check settings
    sessionOptions: {
        secret:             'Neuronex secret',
        resave:             false,
        saveUninitialized:  false,
        duration:           30*60*1000,
        activeDuration:     5*60*1000
    },
    mongooseOptions: {
        useNewUrlParser: true,
    },
};

module.exports = (app, mongoose, DATABASE_URL, consoleLog, CONFIG) => {
    if (!CONFIG) CONFIG = config;

    let dbName = DATABASE_URL.slice(DATABASE_URL.lastIndexOf('/') + 1); //FIXME add regexp
    if (dbName.indexOf('?') !== -1) {
        dbName = dbName.slice(0, dbName.indexOf('?') + 1);
    }

    const mongoStore = mongoConnect(session);
    CONFIG.sessionOptions.name = dbName;
    CONFIG.sessionOptions.store = new mongoStore({url: DATABASE_URL});
    app.use(session(CONFIG.sessionOptions));

    mongoose.connect(DATABASE_URL, CONFIG.mongooseOptions); //FIXME check warning msg

    mongoose.connection.on('error', () => {if (consoleLog) consoleLog('Connection to database error')});
    mongoose.connection.once('open', () => {if (consoleLog) consoleLog('Connection to database is successful')});
};