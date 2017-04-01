//Model
var model = {
    displayCurrent: [],
    displayHistory: [],

    addInput: function (input) {
        this.displayCurrent.push(input);
        render.displayInput();
    },
}


//View
var render = {
    displayInput: function () {
        var displayLine1 = document.getElementById("displayLine1");
        displayLine1.innerHTML = "";
        model.displayCurrent.forEach(function(input) {
            if(render.translateOperator(input) == input) {
                displayLine1.innerHTML += render.translateOperator(input);
            } else {
                displayLine1.innerHTML += " " + render.translateOperator(input) + " ";
            }
            
        });
    },

    translateOperator: function (input) {
        switch (input.toString()) {
            case 'divide':
                return "&divide;";
            case 'times':
                return "x";
            case 'minus':
                return "-";
            case 'plus':
                return "+";
            default:
                return input;
        }
    }
}



//Controller
var handlers = {
    findId: function (e) {
        if (!e.target.id) {
            model.addInput(e.target.parentNode.id);
        } else {
            model.addInput(e.target.id);
        }
    }
}