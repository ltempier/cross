$(document).ready(function () {


    addNewQuestion();
    $('#add-line').click(addNewQuestion);


    $('#question-form').submit(function (e) {
        e.preventDefault();
        var questions = _.map($(this).find('.question-line'), function (questionLine) {
            var $questionLine = $(questionLine)
            return {
                question: $questionLine.find('.question-input').val(),
                answer: $questionLine.find('.answer-input').val()
            }
        });
        $.ajax({
            url: '/crosswords',
            type: 'POST',
            data: {
                url: 'toto.com',
                questions: questions
            },
            success: function () {

            },
            error: function (err) {
                console.log(err)
            }
        })
    });

    function addNewQuestion() {
        $.get('templates/question', function (html) {
            var $html = $(html);
            $html.find('.remove-question').click(function (e) {
                e.preventDefault();
                $html.remove()
            });
            $('#question-list').append($html)
        })
    }
});