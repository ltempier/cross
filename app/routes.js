'use strict';


var _ = require('underscore'),
    async = require('async'),
    models = require('./models');

module.exports = function (app) {
    app.route('/')
        .get(function (req, res) {
            res.render('pages/home', {
                title: "home"
            });
        });

    app.route('/form')
        .get(function (req, res) {
            res.render('pages/form', {
                title: "form"
            });
        });

    app.route('/crosswords')
        .post(function (req, res) {
            var questionIds = [];
            async.each(req.body.questions, function (item, next) {
                    var question = new models.Questions(item);
                    question.save(function (err, room) {
                            if (err) return next(err);
                            questionIds.push(room.id);
                            next()
                        }
                    )
                }, function (err) {
                    if (err) {
                        res.sendStatus(500)
                    } else {
                        req.body.questions = questionIds;
                        var crossword = new models.Crosswords(req.body);
                        crossword.save(function (err) {
                            if (err)
                                res.sendStatus(500);
                            else
                                res.sendStatus(200)
                        })
                    }
                }
            )
        }
    );

    app.route('/crosswords/:id')
        .get(function (req, res) {

        });

    app.route('/templates/:templateName')
        .get(function (req, res) {
            res.render('templates/' + req.params.templateName);
        })
};

