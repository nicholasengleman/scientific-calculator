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
       this.dynamicFontSize(); 
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
    },

    dynamicFontSize: function() {
        //reduces font-size by 90% at a time till the equation fits inside the display's width
        while(document.getElementById("displayLine1").clientWidth > 390) {
            var displayLine1 = document.getElementById("displayLine1");
            var FontSize = parseFloat(window.getComputedStyle(displayLine1, null).getPropertyValue("font-size"));
            displayLine1.style.fontSize = (FontSize - 1).toString() + "px";

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