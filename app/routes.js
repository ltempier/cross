'use strict';


var _ = require('underscore');

module.exports = function (app) {
    app.route('/')
        .get(function (req, res) {
            res.render('pages/home', {
                title: "home"
            });
        })
};

