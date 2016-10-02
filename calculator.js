/**
 * Created by Nicholas on 10/2/2016.
 */
window.onload = init;
function init() {
    var input = document.getElementsByClassName("button");
    for (var i = 0; i < input.length; i++) {
        input[i].onclick = combine;
    }
}

    function combine(eventObj) {
        var button = eventObj.target;
        button = button.id;
        var input = document.getElementById("display1");
        input.innerHTML = button;
}