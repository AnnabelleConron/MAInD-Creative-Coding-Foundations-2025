// let greetings = "Hello Annie!"
// // This is a variable storing a string that I can reuse. Also I can change the string in one place and it will change everywhere I use the variable.
// // let number = 0
// // This is a variable storing a number, which don't have quotation marks around it.$
// let numberA = 0
// let numberB = 5
// // These are two variables storing numbers that I can use to do maths with.
// let myNumber = "1"

// let greetNumber = greetings + numberA
// // This is combining the two variables into one new variable.

// let sum = numberA + numberB
// // This is adding the two number variables together and storing the result in a new variable.
// let sumB = numberB + myNumber
// // This is adding a number variable and a string variable together, which results in concatenation in this case 2 and 1 (in the console this will be 21).

// console.log(greetings)
// // Console log is a test to see if the JS file is linked correctly
// console.log(numberA)
// console.log(greetNumber)
// // These console logs are to check the values of the variables.
// console.log(sum)
// // This console log is to check the result of the addition.

// let number = 0

// number = number + 1
// // this can also be written as number += 1

// console.log(number)

const BUTTON = document.getElementById("myButton");
// This is selecting the button element from the HTML and storing it in a variable called BUTTON.
const BOX = document.getElementById("result");
// This is selecting the section element from the HTML and storing it in a variable called BOX.
const INPUT = document.getElementById("userInput");
// This is selecting the input element from the HTML and storing it in a variable called INPUT.

// console.log(BUTTON)
// // This console log is to check that the button element has been selected correctly.

let number = 0;

// BUTTON.addEventListener("click", () => {

//     number += 2;
//     // This is adding 2 to the number variable (0) each time the button is clicked.

//     // console.log("Button clicked!")
//     // // This is an event listener that listens for a click event on the button element. When the button is clicked, it will log "Button clicked!" to the console.

//     BOX.innerHTML = number;
//     // This is updating the inner HTML of the BOX element to display the current value of the number variable each time the button is clicked.

// })

BUTTON.addEventListener("click", () => {

    let userInput = INPUT.value;
    // This is getting the value from the input element and storing it in a variable called userInput.
    
    console.log(userInput)
    // This console log is to check the value of the userInput variable.
    
    // BOX.innerHTML = userInput;  
    // // This is updating the inner HTML of the BOX element to display the value of the userInput variable when the button is clicked.

    let boxInput = documentcreateElement("p");
    boxInput.textContent = userInput;

    BOX.appendChild(boxInput);
    // This is appending the value of the userInput variable to the BOX element each time the button is clicked.

})