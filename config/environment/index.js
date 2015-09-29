'use strict';

var path = require('path');
var _ = require('underscore');

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'cross-secret'
    },

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    // MongoDB connection options
    mongo: {
        options: {
        }
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.extend(
    all,
        require('./' + process.env.NODE_ENV + '.js') || {}
);