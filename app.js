/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    config = require('./config/environment'),
    mongoose = require('mongoose');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);


var app = express();

require('./config/express')(app);
require('./app/routes')(app);

app.listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});

