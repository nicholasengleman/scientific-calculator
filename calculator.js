//Model
var model = {
    displayCurrent: [],
    displayHistory: [],
    equation: "",
    lastInputNumber: false,


    addInput: function (input, addParenthesis, isNumber) {
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
        if (addParenthesis) {
            this.displayCurrent.push("leftParen");
        }
        render.displayInput();
    },

    calc: function () {
        this.equation = $("#displayLine1").html();

        for (var i = 0; i < this.displayCurrent.length; i++) {
            if ((this.displayCurrent[i] === "rightParen") || (this.displayCurrent[i] === "leftParen")) {
                this.calcInsideParenthesis();
            }
        }

        this.calcInsideParenthesis();

        render.displayInput();
        $("#displayLine1").removeClass("displayInput").addClass("displayAnswer");
        this.shiftHistory(this.equation);
    },


    findParenthesis: function () {
        var start = 0;
        var end = model.displayCurrent.length;
        var foundRightParen = false;
        var foundLeftParen = false;

        for (var i = 0; i < model.displayCurrent.length; i++) {
            if (model.displayCurrent[i] === "rightParen") {
                end = i;
                foundRightParen = true;
            }
        }
        for (var e =  model.displayCurrent.length; e >= 0; e--) {
            if (model.displayCurrent[e] === "leftParen") {
                start = e;
                foundLeftParen = true;
            }
        }

        return [start, end,foundLeftParen, foundRightParen];
    },


    calcInsideParenthesis: function () {

        var i;
        //translates constants
        for (i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
            switch (this.displayCurrent[i]) {
                case "PI":
                    if (!isNaN(this.displayCurrent[i - 1])) {
                        this.displayCurrent.splice(i, 1, "times", 3.14159);
                    } else {
                        this.displayCurrent.splice(i, 1, 3.14159);
                    }
                    break;
                case "E":
                    if (!isNaN(this.displayCurrent[i - 1])) {
                        this.displayCurrent.splice(i, 1, "times", 2.71828);
                    }
                    else {
                        this.displayCurrent.splice(i, 1, 2.71828);
                    }
                    break;
            }
        }

        //computes powers
        for (i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
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
                case "squareroot":
                    if (!isNaN(this.displayCurrent[i - 1])) {
                        this.displayCurrent.splice(i, 2, "times", Math.sqrt(parseFloat(this.displayCurrent[i + 1])));
                    }
                    else {
                        console.log(this.displayCurrent);
                        console.log(this.findParenthesis()[0]);
                        this.displayCurrent.splice(i, 2, Math.sqrt(parseFloat(this.displayCurrent[i + 1])));
                    }
                    i--;
                    break;
                case "sine":
                    if (!isNaN(this.displayCurrent[i - 1])) {
                        this.displayCurrent.splice(i, 2, "times", Math.sin(parseFloat(this.displayCurrent[i + 1])));
                    } else {
                        this.displayCurrent.splice(i, 2, Math.sin(parseFloat(this.displayCurrent[i + 1])));
                    }
                    i--;
                    break;
                case "cosine":
                    if (!isNaN(this.displayCurrent[i - 1])) {
                        this.displayCurrent.splice(i, 2, "times", Math.cos(parseFloat(this.displayCurrent[i + 1])));
                    } else {
                        this.displayCurrent.splice(i, 2, Math.cos(parseFloat(this.displayCurrent[i + 1])));
                    }
                    i--;
                    break;
                case "tangent":
                    if (!isNaN(this.displayCurrent[i - 1])) {
                        this.displayCurrent.splice(i, 2, "times", Math.tan(parseFloat(this.displayCurrent[i + 1])));
                    } else {
                        this.displayCurrent.splice(i, 2, Math.tan(parseFloat(this.displayCurrent[i + 1])));
                    }
                    i--;
                    break;
            }
        }
        //computes multiplication and division
        for (i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
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
        for (i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {

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

        if (this.findParenthesis()[2] === true) {
            this.displayCurrent.splice(this.findParenthesis()[0], 1);
        }
        if (this.findParenthesis()[3] === true) {
            this.displayCurrent.splice(this.findParenthesis()[1], 1);
        }

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
        render.dynamicFontSize();
    }
};


//View
var render = {
    displayInput: function () {
        $("#displayLine1").removeClass("displayAnswer").addClass("displayInput");
        var displayLine1 = document.getElementById("displayLine1");
        displayLine1.innerHTML = "";
        var usePower;
        model.displayCurrent.forEach(function (input) {
            if (input === "power") {
                usePower = true;
            }
            if (usePower) {
                if (render.translateOperator(input) === input) {
                    displayLine1.innerHTML += "<sup>" + render.translateOperator(input) + "</sup>";
                }
                else {
                    displayLine1.innerHTML += "<sup><h3>" + render.translateOperator(input) + "</h3></sup>";
                }
            } else {
                if (render.translateOperator(input) === input) {
                    displayLine1.innerHTML += render.translateOperator(input);
                }
                else {
                    displayLine1.innerHTML += "<h3>" + render.translateOperator(input) + "</h3>";
                }
            }
            if (input === "rightParen") {
                usePower = false;
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
                return "SIN";
            case "cosine":
                return "COS";
            case "tangent":
                return "TAN";
            case "power":
                return "^";
            case "PI":
                return "&Pi;";
            case "E":
                return "&epsilon;";
            case "squareroot":
                return "&radic;";
            case "leftParen":
                return "<i>(</i>";
            case "rightParen":
                return "<i>)</i>";
            default:
                return input;
        }
    },

    dynamicFontSize: function () {
        //reduces font-size so that the input always fits inside the display's width
        for (var i = 1; i < 8; i++) {
            var displayLine = document.getElementById("displayLine" + i);
            while (displayLine.clientWidth > 390) {
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
                    model.addInput(e.target.id, false, true);
                } else if ((e.target.id === "sine") || (e.target.id === "cosine") || (e.target.id === "tangent") || (e.target.id === "squareroot") || (e.target.id === "power")) {
                    model.addInput(e.target.id, true, false);
                } else {
                    model.addInput(e.target.id, false, false);
                }
            }
            else if (e.target.parentNode.id) {
                if (!isNaN(e.target.parentNode.id)) {
                    model.addInput(e.target.parentNode.id, false, true);
                } else if ((e.target.parentNode.id === "sine") || (e.target.parentNode.id === "cosine") || (e.target.parentNode.id === "tangent") || (e.target.parentNode.id === "squareroot") || (e.target.parentNode.id === "power")) {
                    model.addInput(e.target.parentNode.id, true, true);
                } else {
                    model.addInput(e.target.parentNode.id, false, false);
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

