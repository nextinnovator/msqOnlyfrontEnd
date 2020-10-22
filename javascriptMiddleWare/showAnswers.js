//Disable refreshing web page 
// window.onbeforeunload = function(data) {
//    return "Dude, are you sure you want to leave? Think of the kittens!";
// }

//Disable inspect
// $(document).bind("contextmenu", function (e) {
//     e.preventDefault();
// });
// $(document).keydown(function (e) {
//     if (e.which === 123) {
//         return false;
//     }
//  });
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