module.exports = Crossword;

var _ = require('underscore');
var Matrix = require('./matrix');

function Crossword() {
    this._type = "CROSSWORD";
    this._timeout = 2000;
    this._minIteration = 5;
    this._randomArray = [];
    this.questions = [];
    if (arguments[0])
        this.addQuestion(arguments[0])
}

Crossword.prototype.addQuestion = function (questions) {
    var self = this;
    if (!_.isArray(questions))
        questions = [questions];
    _.each(questions, function (question) {
        if (question._type == "QUESTION") {
            self.questions.push(question);
            question.id(self.questions.length)
        }
    })
};


Crossword.prototype.initTrt = function () {
    var self = this;
    var array = _.range(this.questions.length);
    var iteration = 0;
    do {
        array = _.shuffle(array);
    } while (_.contains(this._randomArray, array) && iteration++ < 100);
    this._randomArray.push(array);

    this._waitingList = _.map(array, function (index) {
        return _.clone(self.questions[index])
    });
};

Crossword.prototype.getQuestion = function () {
    var self = this;
    var question = _.find(_.shuffle(self._waitingList), function (q) {
        return !q.isDone()
    });
    return question
};

Crossword.prototype.trt = function () {
    var self = this;
    var best, start = Date.now(), iteration = 0;
    do {
        var result = trt();
        if (!best || result.length > best.length)
            best = _.clone(result);

        iteration++;
    } while (best.length < self.questions.length && (Date.now() - start < self._timeout || iteration < self._minIteration));

    self.result = {
        iteration: iteration,
        questions: best,
        ratio: best.length / self.questions.length,
        delta: self.questions.length - best.length
    };

    function trt() {
        var matrix = new Matrix();
        self.initTrt();
        var notDoneIteration = 0;
        while (self.getQuestion() && notDoneIteration < (self.questions.length < 10 ? 10 : self.questions.length / 10)) { //TODO fix param
            var question = self.getQuestion();
            var positions = matrix.findPositions(question);
            if (positions.length) {
                positions = _.shuffle(positions);
                positions.every(function (position) {
                    return !matrix.addQuestion(question, position);
                })
            }
            if (!question.isDone()) {
                var stop = false;
                for (var i = 0; i <= matrix.i; i++) {
                    for (var j = 0; j <= matrix.j; j++) {
                        stop = matrix.addQuestion(question, {i: i, j: j});
                        if (stop) break;
                    }
                    if (stop) break;
                }
            }
            if (!question.isDone())
                notDoneIteration++;
            else
                notDoneIteration = 0
        }

        var doneQuestions = _.clone(matrix.fetchQuestionPosition());
        return doneQuestions
    }
};



