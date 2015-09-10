module.exports = Question;
var _ = require('underscore');

function Question(question, answer) {
    var self = this;
    this._type = "QUESTION";
    this._done = false;
    this.question = question;
    this.answer = answer;
    this.spaces = [];
    _.each(this.toArray(), function (char, index) {
        if (char == " ")
            self.spaces.push(index)
    });
}

Question.prototype.reset = function () {
    this._done = false;
    this.orientation = null;
    this.position = {}
};
Question.prototype.toArray = function () {
    return this.answer.split('')
};

Question.prototype.done = function () {
    if (arguments[0])
        this.setOrientation(arguments[0]);
    this._done = true
};

Question.prototype.isDone = function () {
    return this._done === true
};

Question.prototype.id = function () {
    if (arguments[0])
        this._id = arguments[0];
    else
        return this._id
};

Question.prototype.toString = function () {
    return this._id || '*'
};

Question.prototype.setPosition = function (i, j) {
    return this.position = {
        i: i,
        j: j
    }
};

Question.prototype.setOrientation = function (orientation) {
    if (orientation == "vertical" || orientation == "horizontal")
        return this.orientation = orientation
};

Question.prototype.isEqual = function (question) {
    return (this._id == question._id && this.answer == question.answer && this.question == question.question)
};
