var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var questionSchema = Schema({
    question: String,
    answer: String
});

var Questions = mongoose.model('questions', questionSchema);

module.exports = Questions;
