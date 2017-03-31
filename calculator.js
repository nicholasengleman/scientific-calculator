//Model
var model = {
    displayInputs: [],
    displayCurrent: [],
    displayHistory: [],
    lastInputOperator: false,

    addNumber: function (input) {
        if (this.displayInputs.length > 0) {
            if (this.lastInputOperator == true) {
                this.displayCurrent.push(this.displayInputs.join(""));
                this.displayInputs = [];
            }
        } 
        this.displayInputs.push(input);
        render.displayInput(false);
        render.displayCurrent();
        this.lastInputOperator = false;
    },

    addOperator: function (input) {
        if (this.displayInputs.length > 0) {
            this.displayCurrent.push(this.displayInputs.join(""));
            this.displayInputs = [];
        }
        this.displayInputs.push(input);
        render.displayInput(true);
        render.displayCurrent();
        this.lastInputOperator = true;
    }
}


//View
var render = {
    displayInput: function (lastInputOperator) {
        var displayLine1 = document.getElementById("displayLine1");
        if (lastInputOperator) {
            displayLine1.innerText = this.translateOperator(model.displayInputs);
        } else {
            displayLine1.innerText = model.displayInputs.join("");
        }
    },

    displayCurrent: function () {
        console.log(model.displayCurrent);
        var displayLine2 = document.getElementById("displayLine2");
        displayLine2.innerText = "";
        //  displayLine2 = model.displayCurrent.forEach(render.translateOperator(element));
        for (var i = 0; i < model.displayCurrent.length; i++) {
            displayLine2.innerText += " " + this.translateOperator(model.displayCurrent[i]);
        }
    },


    translateOperator: function (operator) {
        switch (operator.toString()) {
            case 'divide':
                return "&divide;";
            case 'times':
                return "X";
            case 'minus':
                return "-";
            case 'plus':
                return "+";
            default:
                return operator;
        }
    }
}


//Controller
var handlers = {
    findId: function (e) {
        if (!e.target.id) {
            this.identifyInput(e.target.parentNode.id);
        } else {
            this.identifyInput(e.target.id);
        }
    },

    identifyInput: function (input) {
        switch (input) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                model.addNumber(input);
                break;
            case 'divide':
            case 'times':
            case 'minus':
            case 'plus':
                model.addOperator(input);
                break;
        }
    }

}