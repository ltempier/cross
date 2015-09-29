var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var crosswordSchema = Schema({
    url: String,
    questions :[{ type: Schema.Types.ObjectId, ref: 'questions' }]
});

var Crosswords = mongoose.model('crosswords', crosswordSchema);

module.exports = Crosswords;

