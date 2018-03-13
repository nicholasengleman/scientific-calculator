In this calculator, all inputs are tokenized and stored as string elements in an array. Number and period inputs that are part of larger number inputs are combined together into the same array element.

When the calculator is asked to solve, it first starts looking in this array for the innermost group of parenthesis, solves everything inside this group, and then starts looking for the next innermost group of parenthesis. Once it can't find any more parenthesis, it runs thorugh the array one last time and computes the result.

When solving nested parenthesis, it can solve both types of nested parentheses: ((a + b) + (a + b) + (a + b)) and (a(a (a + b))), and also their combination:  ((a + b) + (a + b) + (a + b)) / (a(a (a + b)))

## Features
1. Follows correct mathematical "Order of Operations/Precedence", no matter how complex the input
2. Can understand nested parenthesis, of both (()+()+()) and ((()))
2. Keyboard support
3. Dynamic Font Scaling when equation exeeds size of window
4. History view of last 6 operations




