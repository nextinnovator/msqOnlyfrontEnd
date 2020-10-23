//Disable CTRL+U 
document.onkeydown = function (e) {
    if (e.ctrlKey &&
        (e.keyCode === 67 ||
            e.keyCode === 86 ||
            e.keyCode === 85 ||
            e.keyCode === 117)) {
        return false;
    } else {
        return true;
    }
};
$(document).keypress("u", function (e) {
    if (e.ctrlKey) {
        return false;
    }
    else {
        return true;
    }
});
//Disable refreshing web page 
window.onbeforeunload = function (data) {
    return "Dude, are you sure you want to leave? Think of the kittens!";
}

//Disable inspect
$(document).bind("contextmenu", function (e) {
    e.preventDefault();
});
$(document).keydown(function (e) {
    if (e.which === 123) {
        return false;
    }
});
$(document).ready(() => {
    $("#requestor").click(() => {
        $.ajax({
            url: 'https://msquestions.herokuapp.com/allData',
            type: 'GET',
            success: (data) => {
                console.log(data)
            },
            error: () => {
                console.log("error")
            }
        });
    })
})