module.exports = Matrix;

var _ = require('underscore');

function Matrix() {
    this._type = "MATRIX";
    this.matrix = [
        []
    ];
    this.i = 0;
    this.j = 0;
    this.inc = {
        i: 0,
        j: 0
    };
    this.orientation = "horizontal";
    this.count = 0;
}

Matrix.prototype.findPositions = function (question) {
    var self = this;
    this.inc = {
        i: 0,
        j: 0
    };
    var positions = [];
    _.each(question.toArray(), function (char, charIndex) {
        _.each(self.matrix, function (row, j) {
            _.each(row, function (c, i) {
                if (c === char)
                    positions.push({
                        char: char,
                        charIndex: charIndex,
                        i: i,
                        j: j
                    })
            })
        });
    });
    return positions
};

Matrix.prototype.get = function (i, j) {
    var row = this.matrix[j];
    if (row)
        return row[i]
};

Matrix.prototype.set = function (char, i, j) {
    for (i; i < 0; i++)
        this.addMatrixColumnLeft()
    for (j; j < 0; j++)
        this.addMatrixRowAbove()
    while (j >= this.matrix.length)
        this.addMatrixRowBelow();
    var row = this.matrix[j];
    while (i >= row.length)
        this.addMatrixColumnRight();
    this.matrix[j][i] = char
};

Matrix.prototype.addQuestion = function (question, position) {
    if (this.i > this.j)
        this.orientation = "vertical";
    if (this.j > this.i)
        this.orientation = "horizontal";

    if (this.orientation == "horizontal") {
        this.addQuestionWithOrientation(question, position, "horizontal");
        if (question.isDone())
            this.addQuestionWithOrientation(question, position, "vertical");
        else
            this.addQuestionWithOrientation(question, position, "vertical");
    } else {
        this.addQuestionWithOrientation(question, position, "vertical");
        if (question.isDone())
            this.orientation = "horizontal";
        else
            this.addQuestionWithOrientation(question, position, "horizontal");
    }
    return question.isDone()
};

Matrix.prototype.addQuestionWithOrientation = function (question, position, orientation) {
    var self = this;
    var _position = _.clone(position);
    var can = this.canAddQuestion(question, _position, orientation);
    if (can && orientation == "horizontal") {
        _position.j = _position.j - _position.charIndex || 0;
        _.each(question.toArray(), function (char, index) {
            self.set(char, _position.i + index + self.inc.i, _position.j);
        });
        self.set(question, _position.i + self.inc.i - 1, _position.j);
        self.count++;
        question.done(orientation)
    }
    else if (can && orientation == "vertical") {
        _position.i = _position.i - _position.charIndex || 0;
        _.each(question.toArray(), function (char, index) {
            self.set(char, _position.i, _position.j + index + self.inc.j);
        });
        self.set(question, _position.i, _position.j + self.inc.j - 1);
        self.count++;
        question.done(orientation)
    }
    return question.isDone()
};

Matrix.prototype.canAddQuestion = function (question, position, orientation) {
    var matrix = _.clone(this);
    var questionArray = question.toArray();
    var can = true;

    if (orientation == "horizontal") {
        if (position.j < 0) return true;
        var i = _.clone(position.i);
        _.each(questionArray, function (char, index) {
            var c0 = matrix.get(i + index, position.j);
            var c1 = matrix.get(i + index, position.j + 1);
            var c2 = matrix.get(i + index, position.j - 1);
            var c3 = matrix.get(i - 1, position.j);
            var c4 = matrix.get(i + questionArray.length, position.j);
            if (c0 && c0 == char && index == position.charIndex) {
                can = true;
            }
            else if (c0 || c1 || c2 || (c3 && c3._type != "QUESTION") || c4) {
                can = false;
                return
            }
        })
    }
    else if (orientation == "vertical") {
        if (position.i < 0) return true;
        var j = _.clone(position.j);
        _.each(questionArray, function (char, index) {
            var c0 = matrix.get(position.i, j + index);
            var c1 = matrix.get(position.i + 1, j + index);
            var c2 = matrix.get(position.i - 1, j + index);
            var c3 = matrix.get(position.i, j - 1);
            var c4 = matrix.get(position.i, j + questionArray.length);
            if (c0 && c0 == char && index == position.charIndex) {
                can = true;
            }
            else if (c0 || c1 || c2 || (c3 && c3._type != "QUESTION") || c4) {
                can = false;
                return
            }
        })
    } else
        return false;
    return can
};

Matrix.prototype.addMatrixRowAbove = function () {
    this.matrix.unshift(_.map(this.matrix[0], function () {
        return undefined
    }));
    this.inc.j++;
    this.j++
};

Matrix.prototype.addMatrixRowBelow = function () {
    this.matrix.push(_.map(this.matrix[0], function () {
        return undefined
    }));
    this.j++
};

Matrix.prototype.addMatrixColumnLeft = function () {
    this.matrix = _.map(this.matrix, function (row) {
        row.unshift(undefined);
        return row
    });
    this.inc.i++;
    this.i++
};
Matrix.prototype.addMatrixColumnRight = function () {
    this.matrix = _.map(this.matrix, function (row) {
        row.push(undefined);
        return row
    });
    this.i++
};
Matrix.prototype.toString = function () {
    var string = _.map(this.matrix, function (row) {
        return row.join('\t')
    }).join('\n');
    return string
};

Matrix.prototype.fetchQuestionPosition = function () {
    var self = this;
    var questions = [];
    for (var i = 0; i <= self.i; i++) {
        for (var j = 0; j <= self.j; j++) {
            var item = self.get(i, j);
            if (item && item._type == "QUESTION") {
                item.setPosition(i, j);
                questions.push(item)
            }
        }
    }
    return questions
};
