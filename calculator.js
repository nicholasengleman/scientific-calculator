/**
 * Created by Nicholas on 10/2/2016.
 */
var todo;
var num;
window.onload = init;
function init() {
    var input = document.getElementsByClassName("button");
    for (var i = 0; i < input.length; i++) {
        input[i].onclick = combine;
    }
}

    function combine(that) {
        var button = that.target;
        button = button.id;
        if(button == "AC")         { num = 0; }
        if(button == "CE")         { num = 0;  }
        if(button == "devide")     { todo = "devide"; }
        if(button == "multiply")   { todo = "multiply"; }
        if(button == "minus")      { todo = "minus"; }
        if(button == "plus")       { todo = "plus"; }
        if(button == "equals")     { todo = "equals"; }
        if(button == "0")          { num.push(0); }

        var input = document.getElementById("display1");
            input.innerHTML = button;
        }

}

