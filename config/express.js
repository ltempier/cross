/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var config = require('./environment');

module.exports = function (app) {

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(session({
        secret: config.secrets.session,
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({
            mongooseConnection: mongoose.connection,
            db: 'cross'
        })
    }));

    app.use(express.static(config.root + '/public'));
    app.use(morgan('dev'));
};
