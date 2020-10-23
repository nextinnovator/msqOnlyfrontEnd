var answerAndQuestion = { question: "", answer: "" }
//For  adding the value to the array to redirect to database!
var answersMade = []
var counter = 0
function answers(question, answer) {
    answerAndQuestion = { question: "", answer: "" }
    answerAndQuestion.question = question
    answerAndQuestion.answer = answer
    answersMade.push(answerAndQuestion)
}

$(document).ready(() => {
    var mydata = JSON.parse(JSON.stringify(array))
    var choice = ""
    var clientName = ""

    //Email Validator
    function ValidateEmail(inputText) {
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (inputText.match(mailformat)) {
            return true;
        }
        else {
            return false;
        }
    }


    $("#countdown").hide()
    //This is for the timer
    var minutes = 14;
    var seconds = 59;
    var sendScore = false;
    function timer() {
        setInterval(() => {
            $("#countdown").text("Time Remaining  " + minutes + ":" + seconds)
            seconds--;
            if (seconds == -1) {
                minutes = minutes - 1
                seconds = 59
                if (minutes <= 0) {
                    alert("Time is up!")
                    sendScore = true
                    sendingDataToDatabase()
                    $("#countdown").hide()
                }
            }

        }, 1000)
    }

    //This is for the created function
    $("#nextButton").hide()
    $("#submitButton").hide()
    $("#submitAnswers").hide()
    $(".answering").hide()
    $(".directions").hide()
    $.fn.showAnswer = function (index, value) {
        $("#submitButton").show()
        choice = mydata[index].answers[value]
    }
    var numberOfQuestion = 0
    var counter = 0

    $("#login").click(() => {
        if (document.getElementById("clientName").value != "") {
            if (ValidateEmail(document.getElementById("clientName").value)) {
                $(".directions").show()
                $(".Email").hide()
            } else {
                alert("You've enter an invalid Email!")
            }
        } else {
            alert("Email is required!")
        }
    })
    //This is for showing the questionare
    $("#button").click(() => {
        $(".directions").hide()
        var img = document.createElement("img")
        img.setAttribute("id", "imageSrc")
        document.getElementById("image").appendChild(img)
        var mydata = JSON.parse(JSON.stringify(array))
        $("img").hide()
        $("#countdown").show()
        $("#submitAnswers").hide()
        $("#submitButton").hide()
        $(".answering").show()
        $("#clientName").hide()
        $("h1").hide()
        clientName = document.getElementById("clientName").value
        timer()
        $("#button").hide()
        $("#nextButton").show()
        document.getElementById('questions').innerHTML = mydata[numberOfQuestion].question;
        $("#choices").append("<hr>" + "<ul></ul>");
        for (var i in mydata[numberOfQuestion].answers) {
            counter += 1
            var li = "<br><br><input id='choice" + counter + "' type='radio' name='choices' onclick=$.fn.showAnswer(" + numberOfQuestion + "," + i + ")>";
            $("ul").append(li.concat(mydata[numberOfQuestion].answers[i]))
        }
    })



    //This is for showing the next question
    $("#nextButton").click(() => {
        numberOfQuestion += 1
        var mydata = JSON.parse(JSON.stringify(array))
        array.push(mydata[numberOfQuestion])
        $("ul").hide()
        if (Array.isArray(mydata[numberOfQuestion].question)) {
            $("img").show()
            //for the logical images 
            document.getElementById("imageSrc").src = mydata[numberOfQuestion].question[0]
            $("#choices").append("<ul></ul>");
            for (var i in mydata[numberOfQuestion].answers) {
                counter += 1
                var li = "<br><br><input id='choice" + counter + "' type='radio' name='choices' onclick=$.fn.showAnswer(" + numberOfQuestion + "," + i + ")>";
                $("ul").append(li.concat(mydata[numberOfQuestion].answers[i]))
            }
        } else {
            //for skipping the questions
            mydata.push(mydata[numberOfQuestion])
            $("ul").hide()
            document.getElementById('questions').innerHTML = mydata[numberOfQuestion].question
            $("#choices").append("<ul></ul>");
            for (var i in mydata[numberOfQuestion].answers) {
                counter += 1
                var li = "<br><br><input id='choice" + counter + "' type='radio' name='choices' onclick=$.fn.showAnswer(" + numberOfQuestion + "," + i + ")>";
                $("ul").append(li.concat(mydata[numberOfQuestion].answers[i]))
            }
        }
    })



    //Getting all the answers from user
    $("#submitButton").click(() => {
        var mydata = JSON.parse(JSON.stringify(array))
        answers(mydata[numberOfQuestion], choice)
        numberOfQuestion += 1
        $("ul").hide()
        if (Array.isArray(mydata[numberOfQuestion].question)) {
            $("img").show()
            //for the Logical Images
            document.getElementById("imageSrc").src = mydata[numberOfQuestion].question[0]
            $("#questions").hide()
            $("#choices").append("<ul></ul>");
            for (var i in mydata[numberOfQuestion].answers) {
                counter += 1
                var li = "<br><br><input id='choice" + counter + "' type='radio' name='choices' onclick=$.fn.showAnswer(" + numberOfQuestion + "," + i + ")>";
                $("ul").append(li.concat(mydata[numberOfQuestion].answers[i]))
            }
            mydata.splice(numberOfQuestion, 1)
        } else {
            document.getElementById('questions').innerHTML = mydata[numberOfQuestion].question
            $("#choices").append("<ul></ul>");
            for (var i in mydata[numberOfQuestion].answers) {
                counter += 1
                var li = "<br><br><input id='choice" + counter + "' type='radio' name='choices' onclick=$.fn.showAnswer(" + numberOfQuestion + "," + i + ")>";
                $("ul").append(li.concat(mydata[numberOfQuestion].answers[i]))
            }
            mydata.splice(numberOfQuestion, 1)
        }
        $("#submitButton").hide()
        choice = ""
        var numbersOfAnswers = answersMade.length
        $("#numberToAnswer").text("You've answered " + numbersOfAnswers + " out of 50")
        if (answersMade.length == 50) {
            sendScore = true
            sendingDataToDatabase()
        }
    })


    function sendingDataToDatabase() {
        if (sendScore == true) {
            $.ajax({
                type: 'POST',
                url: 'https://msquestions.herokuapp.com/addAnswers',
                data: JSON.stringify({ name: clientName, answers: answersMade }),
                success: (data) => {
                    alert("Thank you for taking the exam, just wait for the result, we will call you about the result of your exam!");
                    location.reload("https://msqintern1.wixsite.com/intern1")
                    $("p").hide()
                    $("#nextButton").hide()
                    $("#submitButton").hide()
                    $("#button").show()
                    $("#clientName").show()
                    $("#submitAnswers").hide()
                    $("h1").show()
                },
                contentType: "application/json",
                dataType: 'json'
            })
            sendScore = false
            $("#countdown").hide()
            $("#numberToAnswer").hide()
            $("form").hide()
            $("#submitAnswers").hide()
            $("#nextButton").hide()
            $(".time").hide()
        }
    }

    //Submit answers
    $("#submitAnswers").click(() => {
        $.ajax({
            type: 'POST',
            url: 'https://msquestions.herokuapp.com/addAnswers',
            data: JSON.stringify({ name: clientName, answers: answersMade }), // or JSON.stringify ({name: 'jonas'}),
            success: (data) => {
                alert("Thank you for taking the exam, just wait for the result, we will call you about the result of your exam!");
                $("p").hide()
                $("#nextButton").hide()
                $("#submitButton").hide()
                $("#button").show()
                $("#clientName").show()
                $("#submitAnswers").hide()
                $("h1").show()
            },
            contentType: "application/json",
            dataType: 'json'
        });
    })
})
