// Functions

const person1 = "Annie";
const person2 = "Jenni";

function greet(personA, personB) {
    // we have given th greet function a parameter
    console.log("Hi " + personA + " & " + personB + "!" );
    // function declared in line 12 (the greet call)
    console.log("Hi " + person1 + " & " + person2 + "!" );
    // person 1 and 2 come from the declared constants
}

greet("Bob", "Jack");
// function is called: there is a function called greet and we can call at any time

console.log("Hi " + person1 + " & " + person2 + "!" );

// Function Declaration

const myGreeting = function (personC, personD) {
// this is a function being assigned to a variable
    console.log("Hi " + personC + " & " + personD + "!" );
}

myGreeting("James", "John")

function fullName(name, surname){
    return "Name: " + name + " Surname: " + surname;
}
console.log(fullName("Annie", "Conron"));

function printInfo(name, surname, course){
    // console.log(name + " " + surname + " Course: " + course)
    // because we created the full name function can now do this
    console.log(fullName(name, surname) + " Course: " + course);
}

function printGrades(name, surname, grade){
    console.log(fullName(name, surname) + " Grade: " + grade);
}

printInfo("Annie", "Conron", "Coding");
printGrades("Annie", "Conron", "7");