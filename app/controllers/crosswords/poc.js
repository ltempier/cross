"use strict";

var _ = require('underscore');
var Crossword = require('./crossword');
var Question = require('./question');

var params = [
    {
        l: 10,
        iteration: 0,
        ratio: 0
    },
    {
        l: 50,
        iteration: 0,
        ratio: 0
    },
    {
        l: 100,
        iteration: 0,
        ratio: 0
    },
    {
        l: 200,
        iteration: 0,
        ratio: 0
    },
    {
        l: 400,
        iteration: 0,
        ratio: 0
    },
    {
        l: 1000,
        iteration: 0,
        ratio: 0
    }
];


function test(param) {
    var crossword = new Crossword();
    for (var i = 0; i < param.l; i++) {
        var l = " abcdefghijklmnopqrstuvwxyz".split('');
        crossword.addQuestion(new Question("test" + i, _.sample(l, _.random(1, 6)).join('')))
    }
    crossword.trt();
    param.ratio += crossword.result.ratio;
    param.iteration += crossword.result.iteration
}


var count = 10;
for (var t = 0; t < count; t++) {
    _.each(params, function (param) {
        test(param)
    })
}

_.each(params, function (param) {
    param.ratio /= count;
    param.iteration /= count;
    console.log(param)
});


process.exit();