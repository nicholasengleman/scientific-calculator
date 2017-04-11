//Model
var model = {
    displayCurrent: [],
    displayHistory: [],
    equation: "",
    lastInputNumber: false,

    addInput: function (input, isNumber) {
        if (isNumber && this.lastInputNumber) {
            this.displayCurrent[this.displayCurrent.length - 1] = this.displayCurrent[this.displayCurrent.length - 1] + input;
        } else {
            this.displayCurrent.push(input);
        }
        if (isNumber) {
            this.lastInputNumber = true;
        }
        if (!isNumber) {
            this.lastInputNumber = false;
        }
        render.displayInput();
        console.log(this.displayCurrent);
    },

    calc: function () {
        this.equation = $("#displayLine1").html();
        var i;
        //computes sin, cosine, tangent
        for (i = 0; i < this.displayCurrent.length; i++) {
            switch (this.displayCurrent[i]) {
                case "sine":
                    this.displayCurrent.splice(i, 2, Math.pow(parseFloat(this.displayCurrent[i - 1]), -1));
                    i--;
                    break;
            }
        }
        //computes exponents and roots
        for (i = 0; i < this.displayCurrent.length; i++) {
            switch (this.displayCurrent[i]) {
                case "xToTheNegativeOne":
                    this.displayCurrent.splice(i - 1, 2, Math.pow(parseFloat(this.displayCurrent[i - 1]), -1));
                    i--;
                    break;
                case "xsquared":
                    this.displayCurrent.splice(i - 1, 2, Math.pow(parseFloat(this.displayCurrent[i - 1]), 2));
                    i--;
                    break;
                case "power":
                    this.displayCurrent.splice(i - 1, 3, Math.pow(parseFloat(this.displayCurrent[i - 1]), parseFloat(this.displayCurrent[i + 1])));
                    i--;
                    break;
            }
        }
        //computes multiplication and division
        for (i = 0; i < this.displayCurrent.length; i++) {
            switch (this.displayCurrent[i]) {
                case "divide":
                    this.displayCurrent.splice(i - 1, 3, parseFloat(this.displayCurrent[i - 1]) / parseInt(this.displayCurrent[i + 1]));
                    i--;
                    break;
                case "times":
                    this.displayCurrent.splice(i - 1, 3, parseFloat(this.displayCurrent[i - 1]) * parseFloat(this.displayCurrent[i + 1]));
                    i--;
                    break;
            }
        }

        //computes addition and subtraction
        for (i = 0; i < this.displayCurrent.length; i++) {
            switch (this.displayCurrent[i]) {
                case "plus":
                    this.displayCurrent.splice(i - 1, 3, parseFloat(this.displayCurrent[i - 1]) + parseFloat(this.displayCurrent[i + 1]));
                    i--;
                    break;
                case "minus":
                    this.displayCurrent.splice(i - 1, 3, parseFloat(this.displayCurrent[i - 1]) - parseFloat(this.displayCurrent[i + 1]));
                    i--;
                    break;
            }
        }
        render.displayInput();
        $("#displayLine1").removeClass("displayInput").addClass("displayAnswer");
        this.shiftHistory(this.equation);
    },

    clear: function (clearAllHistory) {
        this.displayCurrent = [];
        if (clearAllHistory) {
            for (var i = 2; i < 8; i++) {
                $("#displayLine" + (i)).html("");
            }
        }
        render.displayInput();
    },

    shiftHistory: function (equation) {
        for (var i = 6; i > 1; i--) {
            $("#displayLine" + (i + 1)).html(function () {
                return $("#displayLine" + (i)).html();
            });
        }
        $("#displayLine2").html(function () {
            return equation + " = " + $("#displayLine1").html();
        });
    }
};


//View
var render = {
    displayInput: function () {
        $("#displayLine1").removeClass("displayAnswer").addClass("displayInput");
        var displayLine1 = document.getElementById("displayLine1");
        displayLine1.innerHTML = "";
        model.displayCurrent.forEach(function (input) {
            if (render.translateOperator(input) === input) {
                displayLine1.innerHTML += render.translateOperator(input);
            } else if (render.translateOperator(input).search("sup") !== -1) {
                displayLine1.innerHTML += " " + render.translateOperator(input) + " ";
            } else if (render.translateOperator(input).search("&radic;") !== -1) {
                displayLine1.innerHTML += render.translateOperator(input);
            } else {
                displayLine1.innerHTML += " <h3>" + render.translateOperator(input) + "</h3> ";
            }
        });
        this.dynamicFontSize();
    },

    translateOperator: function (input) {
        switch (input.toString()) {
            case "divide":
                return "&divide;";
            case "times":
                return "x";
            case "minus":
                return "-";
            case "plus":
                return "+";
            case "xToTheNegativeOne":
                return "<sup>-1</sup>";
            case "xsquared":
                return "<sup>2</sup>";
            case "sine":
                return "sin(";
            case "power":
                return "^";
            case "squareroot":
                return "&radic;(";
            case "rightParen":
                return ")";
            default:
                return input;
        }
    },

    dynamicFontSize: function () {
        //reduces font-size so that the input always fits inside the display's width
        for (var i = 1; i < 3; i++) {
            while (document.getElementById("displayLine"+i).clientWidth > 390) {
                var displayLine = document.getElementById("displayLine"+1);
                var currentFontSize = parseFloat(window.getComputedStyle(displayLine, null).getPropertyValue("font-size"));
                displayLine.style.fontSize = (currentFontSize - 1).toString() + "px";
            }
        }
    }
};

//Controller
var handlers = {
        findId: function (e) {
            if (e.target.id === "solve") {
                model.calc();
            } else if (e.target.id === "clear") {
                model.clear(false);
            } else if (e.target.id === "clearhistory") {
                model.clear(true);

            } else if (e.target.id) {
                if (!isNaN(e.target.id)) {
                    model.addInput(e.target.id, true);
                } else {
                    model.addInput(e.target.id, false);
                }
            }
            else if (e.target.parentNode.id) {
                if (!isNaN(e.target.parentNode.id)) {
                    model.addInput(e.target.parentNode.id, true);
                } else {
                    model.addInput(e.target.parentNode.id, false);
                }
            }
        },

        findKey: function (e) {
            if (e.keyCode === 49 || e.keyCode === 97) {
                model.addInput(1, true);
            }
            if (e.keyCode === 50 || e.keyCode === 98) {
                model.addInput(2, true);
            }
            if (e.keyCode === 51 || e.keyCode === 99) {
                model.addInput(3, true);
            }
            if (e.keyCode === 52 || e.keyCode === 100) {
                model.addInput(4, true);
            }
            if (e.keyCode === 53 || e.keyCode === 101) {
                model.addInput(5, true);
            }
            if (e.keyCode === 54 || e.keyCode === 102) {
                model.addInput(6, true);
            }
            if (e.keyCode === 55 || e.keyCode === 103) {
                model.addInput(7, true);
            }
            if (e.keyCode === 56 || e.keyCode === 104) {
                model.addInput(8, true);
            }
            if (e.keyCode === 57 || e.keyCode === 105) {
                model.addInput(9, true);
            }
            if (e.keyCode === 107) {
                model.addInput("plus", false);
            }
            if (e.keyCode === 109) {
                model.addInput("minus", false);
            }
            if (e.keyCode === 186 || e.keyCode === 106) {
                model.addInput("times", false);
            }
            if (e.keyCode === 191 || e.keyCode === 111) {
                model.addInput("divide", false);
            }
        }
    }
;

