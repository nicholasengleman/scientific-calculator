/* global $ */

/// /Model
const model = {
	displayCurrent: [],
	displayHistory: [],
	equation: "",
	combineWithNextInput: false,


	addInput: function (input, addParen) {
		//concats number input to previous input if it is part of a larger number being inputed
		if (!isNaN(input) && this.combineWithNextInput) {
			this.displayCurrent[this.displayCurrent.length - 1] = this.displayCurrent[this.displayCurrent.length - 1] + input;
			//adds number input to new element in array if larger number is not being inputed
		} else if (!isNaN(input) && !this.combineWithNextInput) {
			this.displayCurrent.push(input);
			this.combineWithNextInput = true;
			//concats period to previous element containing number-
		} else if (input === "period") {
			if (this.displayCurrent.length > 0 && this.combineWithNextInput === true) {
				this.displayCurrent[this.displayCurrent.length - 1] = this.displayCurrent[this.displayCurrent.length - 1] + ".";
				this.combineWithNextInput = true;
			} else {
				this.displayCurrent.push(".");
				this.combineWithNextInput = true;
			}
		} else if (isNaN(input) && input !== "period") {
			this.displayCurrent.push(input);
			this.combineWithNextInput = false;
		}

		if (input === "-") {
			this.combineWithNextInput = true;
		}

		if (addParen) {
			this.displayCurrent.push("leftParen");
		}
		render.displayInput();
	},

	backspace: function () {
		if (!isNaN(this.displayCurrent[this.displayCurrent.length - 1]) && this.displayCurrent[this.displayCurrent.length - 1] > 9) {
			var lastItem = String(this.displayCurrent[this.displayCurrent.length - 1]).split("");
			lastItem.pop();
			this.displayCurrent[this.displayCurrent.length - 1] = lastItem.join("");
		} else if (this.displayCurrent.length < 2) {
			this.displayCurrent[0] = "";
		} else {
			this.displayCurrent.pop();
		}
		render.displayInput();
	},

	calc: function () {
		this.equation = $("#displayLine1").html();

		while (this.displayCurrent.length > 1) {
			this.calcInsideParenthesis();
		}
		render.displayInput();
		$("#displayLine1").removeClass("displayInput").addClass("displayAnswer");
		this.shiftHistory(this.equation);
	},


	findParenthesis: function () {
		var start = 0;
		var end = model.displayCurrent.length;
		var foundRightParen = false;
		var foundLeftParen = false;

		for (var e = model.displayCurrent.length; e >= 0; e--) {
			if (model.displayCurrent[e] === "leftParen") {
				start = e;
				foundLeftParen = true;
				break;
			}
		}
		for (var i = start; i <= model.displayCurrent.length; i++) {
			if (model.displayCurrent[i] === "rightParen") {
				end = i;
				foundRightParen = true;
				break;
			}
		}
		return [start, end, foundLeftParen, foundRightParen];
	},


	calcInsideParenthesis: function () {
		var i, result;

		//translates constants and factorial
		for (i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
			switch (this.displayCurrent[i]) {
				case "PI":
					if (!isNaN(this.displayCurrent[i - 1])) {
						this.displayCurrent.splice(i, 1, "multiply", 3.14159);
						break;
					} else {
						this.displayCurrent.splice(i, 1, 3.14159);
						break;
					}
				case "E":
					if (!isNaN(this.displayCurrent[i - 1])) {
						this.displayCurrent.splice(i, 1, "multiply", 2.71828);
						break;
					}
					else {
						this.displayCurrent.splice(i, 1, 2.71828);
						break;
					}
			}
		}

		//computes powers
		for (i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
			switch (this.displayCurrent[i]) {
				case "xToTheNegativeOne":
					this.displayCurrent.splice(i - 1, 2, this.roundFloatingPoint(Math.pow(parseFloat(this.displayCurrent[i - 1]), -1)));
					i--;
					break;
				case "xsquared":
					this.displayCurrent.splice(i - 1, 2, this.roundFloatingPoint(Math.pow(parseFloat(this.displayCurrent[i - 1]), 2)));
					i--;
					break;
				case "power":
					this.displayCurrent.splice(i - 1, 4, this.roundFloatingPoint(Math.pow(parseFloat(this.displayCurrent[i - 1]), parseFloat(this.displayCurrent[i + 2]))));
					i--;
					break;
				case "squareroot":
					if (!isNaN(this.displayCurrent[i - 1])) {
						this.displayCurrent.splice(i, 3, "multiply", this.roundFloatingPoint(Math.sqrt(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					}
					else {
						this.displayCurrent.splice(i, 3, this.roundFloatingPoint(Math.sqrt(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					}
				case "sine":
					if (!isNaN(this.displayCurrent[i - 1])) {
						this.displayCurrent.splice(i, 3, "multiply", this.roundFloatingPoint(Math.sin(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					} else {
						this.displayCurrent.splice(i, 3, this.roundFloatingPoint(Math.sin(this.displayCurrent[i + 2])));
						i--;
						break;
					}
				case "cosine":
					if (!isNaN(this.displayCurrent[i - 1])) {
						this.displayCurrent.splice(i, 3, "multiply", this.roundFloatingPoint(Math.cos(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					} else {
						this.displayCurrent.splice(i, 3, this.roundFloatingPoint(Math.cos(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					}
				case "tangent":
					if (!isNaN(this.displayCurrent[i - 1])) {
						this.displayCurrent.splice(i, 3, "multiply", this.roundFloatingPoint(Math.tan(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					} else {
						this.displayCurrent.splice(i, 3, this.roundFloatingPoint(Math.tan(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					}
				case "sineInverse":
					result = this.roundFloatingPoint(Math.asin(this.displayCurrent[i + 2]));
					if (result) {
						if (!isNaN(this.displayCurrent[i - 1])) {
							this.displayCurrent.splice(i, 3, "multiply", result);
							i--;
							break;
						} else {
							this.displayCurrent.splice(i, 3, result);
							i--;
							break;
						}
					} else {
						model.displayCurrent = [];
						model.combineWithNextInput = false;
						model.displayCurrent.push("NaN");
						break;
					}
					i--;
				case "cosineInverse":
					result = this.roundFloatingPoint(Math.acos(this.displayCurrent[i + 2]));
					if (result) {
						if (!isNaN(this.displayCurrent[i - 1])) {
							this.displayCurrent.splice(i, 3, "multiply", result);
							i--;
							break;
						} else {
							this.displayCurrent.splice(i, 3, result);
							i--;
							break;
						}
					} else {
						model.displayCurrent = [];
						model.combineWithNextInput = false;
						model.displayCurrent.push("NaN");
						break;
					}
					i--;
				case "tangentInverse":
					if (!isNaN(this.displayCurrent[i - 1])) {
						this.displayCurrent.splice(i, 3, "multiply", this.roundFloatingPoint(Math.atan(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					} else {
						this.displayCurrent.splice(i, 3, this.roundFloatingPoint(Math.atan(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					}
				case "log":
					if (!isNaN(this.displayCurrent[i - 1])) {
						this.displayCurrent.splice(i, 3, "multiply", this.roundFloatingPoint(Math.log(parseFloat(this.displayCurrent[i + 2]))));
						i--;
						break;
					} else {
						this.displayCurrent.splice(i, 3, this.roundFloatingPoint(Math.log(this.displayCurrent[i + 2])));
						i--;
						break;
					}
			}
		}


		//computes multiplication and division
		for (i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
			switch (this.displayCurrent[i]) {
				case "divide":
					if (this.displayCurrent[i + 1] !== 0) {
						this.displayCurrent.splice(i - 1, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i - 1]) / parseFloat(this.displayCurrent[i + 1])));
						i--;
						break;
					} else {
						model.displayCurrent = [];
						model.combineWithNextInput = false;
						model.displayCurrent.push("Can't divide by 0");
						break;
					}
				case "multiply":
					this.displayCurrent.splice(i - 1, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i - 1]) * parseFloat(this.displayCurrent[i + 1])));
					i--;

					break;
			}
		}


		//computes addition and subtraction
		for (i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
			switch (this.displayCurrent[i]) {
				case "plus":
					this.displayCurrent.splice(i - 1, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i - 1]) + parseFloat(this.displayCurrent[i + 1])));
					i--;
					break;
				case "minus":
					this.displayCurrent.splice(i - 1, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i - 1]) - parseFloat(this.displayCurrent[i + 1])));
					i--;
					break;
			}
		}
		this.removesParenthesis();
	},

	roundFloatingPoint: function (floatingPointNumber) {
		return (floatingPointNumber * 1000).toFixed(0) / 1000;
	},


	removesParenthesis: function () {
		var leftParenLocation = this.findParenthesis()[0];
		var rightParenLocation = this.findParenthesis()[1];
		var foundleftParenLocation = this.findParenthesis()[2];
		var foundrightParenLocation = this.findParenthesis()[3];

		if (foundleftParenLocation === true) {
			var previousCharacter = this.displayCurrent[leftParenLocation - 1];
			if (previousCharacter === "minus" ||
				previousCharacter === "plus" ||
				previousCharacter === "divide" ||
				previousCharacter === "multiply" ||
				previousCharacter === "leftParen" ||
				previousCharacter === undefined ||
				previousCharacter === null) {
				this.displayCurrent.splice(leftParenLocation, 1);
				rightParenLocation = rightParenLocation - 1;
			} else {
				this.displayCurrent.splice(leftParenLocation, 1, "multiply");
			}
		}

		if (foundrightParenLocation === true) {
			var nextCharacter = this.displayCurrent[rightParenLocation + 1];
			if (nextCharacter === "minus" ||
				nextCharacter === "plus" ||
				nextCharacter === "divide" ||
				nextCharacter === "multiply" ||
				nextCharacter === "rightParen" ||
				nextCharacter === "power" ||
				nextCharacter === undefined ||
				nextCharacter === null) {
				this.displayCurrent.splice(rightParenLocation, 1);
			} else {
				this.displayCurrent.splice(rightParenLocation, 1, "multiply");
			}
		}
	},

	clear: function (clearAllHistory) {
		this.displayCurrent = [];
		this.combineWithNextInput = false;
		$("#displayLine1").removeAttr("style");
		$("#displayLine1" + " span").removeAttr("style");
		$("#displayLine1" + " i").removeAttr("style");
		if (clearAllHistory) {
			for (var i = 2; i < 8; i++) {
				$("#displayLine" + i).html("");
				$("#displayLine" + i).removeAttr("style");
				$("#displayLine" + i + " span").removeAttr("style");
				$("#displayLine" + i + " i").removeAttr("style");
			}
		}
		render.displayInput();
	},

	shiftHistory: function (equation) {
		for (var i = 6; i > 1; i--) {
			$(`${'#displayLine'}${i + 1}`).html(function () {
				return $(`${'#displayLine'}${i}`).html();
			});
		}
		$("#displayLine2").html(function () {
			return equation + " = " + $("#displayLine1").html();
		});
		render.dynamicFontSize(2, 7);
	}
};


//View
var render = {
	displayInput: function () {
		$("#displayLine1").removeClass("displayAnswer").addClass("displayInput");
		var displayLine1 = document.getElementById("displayLine1");
		displayLine1.innerHTML = "";
		var usePower = false, leftParenCount = 0, rightParenCount = 0;

		model.displayCurrent.forEach(function (input) {
			if (input === "power") {
				usePower = true;
			}
			if (usePower) {
				displayLine1.innerHTML += "<sup><i>" + render.translateOperator(input) + "</i></sup>";
				if (input === "leftParen") {
					leftParenCount++;
				}
				if (input === "rightParen") {
					rightParenCount++;
				}
			}
			else {
				displayLine1.innerHTML += render.translateOperator(input);
			}

			if (rightParenCount !== 0 && rightParenCount === leftParenCount) {
				usePower = false;
				rightParenCount = 0;
				leftParenCount = 0;
			}
		});
		this.dynamicFontSize(1, 1);
	},


	translateOperator: function (input) {
		switch (input.toString()) {
			case "divide":
				return "<span>&divide;</span>";
			case "multiply":
				return "<span>x</span>";
			case "minus":
				return "<span>-</span>";
			case "plus":
				return "<span>+</span>";
			case "xToTheNegativeOne":
				return "<sup>-1</sup>";
			case "xsquared":
				return "<sup>2</sup>";
			case "log":
				return "LOG";
			case "sine":
				return "SIN";
			case "cosine":
				return "COS";
			case "tangent":
				return "TAN";
			case "sineInverse":
				return "SIN<sup>-1</sup>";
			case "cosineInverse":
				return "COS<sup>-1</sup>";
			case "tangentInverse":
				return "TAN<sup>-1</sup>";
			case "power":
				return "^";
			case "PI":
				return "&Pi;";
			case "E":
				return "e";
			case "factorial":
				return "!";
			case "squareroot":
				return "&radic;";
			case "leftParen":
				return "<i>(</i>";
			case "rightParen":
				return "<i>)</i>";
			case "period":
				return ".";
			case "-":
				return "<span>-</span>";
			default:
				return input;
		}
	},

	dynamicFontSize: function (startLine, endLine) {
		var newDivFontSize;
		//reduces font-size so that the input always fits inside the display's width
		let displayWidth = document.getElementById("displayWidth").clientWidth - 30;
		for (let i = startLine; i < endLine + 1; i++) {
			let displayLine = document.getElementById("displayLine" + i);

			while (displayLine.clientWidth > displayWidth) {
				newDivFontSize = parseInt($("#displayLine" + i).css("font-size"), 10) - 1;
				if (newDivFontSize < 10) {
					break;
				}
				$("#displayLine" + i).css("font-size", newDivFontSize);
				$("#displayLine" + i + " span").css({
					"font-size": newDivFontSize - 5,
					"vertical-align": "5%",
					"margin": "1px",
					"letter-spacing": "0"
				});
				$("#displayLine" + i + " i").css({"font-size": newDivFontSize - 5, "vertical-align": "5%"});
			}
		}
	}
};

//Controller
var handlers = {

	findId: function (e) {
		var id = 0;

		if (e.target.id) {
			id = e.target.id;
		} else {
			id = e.target.parentNode.id;
		}
		if (id === "undo") {
			model.backspace();
		} else if (id === "solve") {
			model.calc();
		} else if (id === "clear") {
			model.clear(false);
		} else if (id === "clearhistory") {
			model.clear(true);
		} else if (!isNaN(id)) {
			model.addInput(id, false);
		} else if (id === "period") {
			model.addInput(id, false);
		} else if ((id === "sine") ||
			(id === "cosine") ||
			(id === "tangent") ||
			(id === "squareroot") ||
			(id === "power") ||
			(id === "sineInverse") ||
			(id === "cosineInverse") ||
			(id === "tangentInverse") ||
			(id === "log")) {
			model.addInput(id, true);
		} else {
			model.addInput(id, false);
		}
	},

	findKey: function (e) {
		e.preventDefault();
		if (!e.shiftKey && (e.keyCode === 48 || e.keyCode === 96)) {
			model.addInput("0", false);
			this.keypress("#0", 1);
		}
		if (e.keyCode === 49 || e.keyCode === 97) {
			model.addInput("1", false);
			this.keypress("#1", 1);
		}
		if (e.keyCode === 50 || e.keyCode === 98) {
			model.addInput("2", false);
			this.keypress("#2", 1);
		}
		if (e.keyCode === 51 || e.keyCode === 99) {
			model.addInput("3", false);
			this.keypress("#3", 1);
		}
		if (e.keyCode === 52 || e.keyCode === 100) {
			model.addInput("4", false);
			this.keypress("#4", 1);
		}
		if (e.keyCode === 53 || e.keyCode === 101) {
			model.addInput("5", false);
			this.keypress("#5", 1);
		}
		if (!e.shiftKey && (e.keyCode === 54 || e.keyCode === 102)) {
			model.addInput("6", false);
			this.keypress("#6", 1);
		}
		if (e.keyCode === 55 || e.keyCode === 103) {
			model.addInput("7", false);
			this.keypress("#7", 1);
		}
		if ((!e.shiftKey && e.keyCode === 56) || e.keyCode === 104) {
			model.addInput("8", false);
			this.keypress("#8", 1);
		}
		if ((!e.shiftKey && e.keyCode === 57) || e.keyCode === 46) {
			model.addInput("9", false);
			this.keypress("#9", 1);
		}
		if (e.keyCode === 190) {
			model.addInput("period", false);
			this.keypress("#period", 1);
		}
		if ((e.shiftKey && e.keyCode === 187) || e.keyCode === 107) {
			model.addInput("plus", false);
			this.keypress("#plus", 2);
		}
		if ((e.shiftKey && e.keyCode === 189) || e.keyCode === 109) {
			model.addInput("minus", false);
			this.keypress("#minus", 2);
		}
		if ((e.shiftKey && e.keyCode === 56) || e.keyCode === 106 || e.keyCode === 88) {
			model.addInput("multiply", false);
			this.keypress("#multiply", 2);
		}
		if (e.keyCode === 191 || e.keyCode === 111) {
			model.addInput("divide", false);
			this.keypress("#divide", 2);
		}
		if (e.shiftKey && e.keyCode === 57) {
			model.addInput("leftParen", false);
			this.keypress("#leftParen", 3);
		}
		if (e.shiftKey && e.keyCode === 48) {
			model.addInput("rightParen", false);
			this.keypress("#rightParen", 3);
		}
		if (e.shiftKey && e.keyCode === 54) {
			model.addInput("power", true);
			this.keypress("#power", 3);
		}
		if (!e.shiftKey && e.keyCode === 189) {
			model.addInput("-", false);
			this.keypress("#-", 2);
		}
		if (e.keyCode === 8) {
			model.backspace();
			this.keypress("#undo", 4);
		}
		if (e.keyCode === 13) {
			model.calc();
			this.keypress("#solve", 2);
		}
	},

	keypress: function (keyID, keyCode) {
		if (keyCode === 1) {
			$(keyID).removeClass("numberKey").addClass("numberKeyPress buttonActive");
			setTimeout(function () {
				$(keyID).removeClass("numberKeyPress buttonActive").addClass("numberKey");
			}, 90);
		}
		if (keyCode === 2) {
			$(keyID).removeClass("functionKey").addClass("functionKeyPress buttonActive");
			setTimeout(function () {
				$(keyID).removeClass("functionKeyPress buttonActive").addClass("functionKey");
			}, 90);
		}
		if (keyCode === 3) {
			$(keyID).removeClass("advancedfunctionKey").addClass("advancedfunctionKeyPress buttonActive");
			setTimeout(function () {
				$(keyID).removeClass("advancedfunctionKeyPress buttonActive").addClass("advancedfunctionKey");
			}, 90);
		}
		if (keyCode === 4) {
			$(keyID).removeClass("clearKey").addClass("clearKeyPress buttonActive");
			setTimeout(function () {
				$(keyID).removeClass("clearKeyPress buttonActive").addClass("clearKey");
			}, 90);
		}
	}
};



