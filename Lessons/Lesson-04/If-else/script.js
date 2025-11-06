let grade = -1; // 0.. 6, 4 is passed

// if the think in the round brackets is true the complete this code
if (grade >= 4) {
    console.log("You passed the course!")
}

else {
    console.log("Sorry try again")
}

if (grade == 6) {
    console.log("Excellent")
}

else if (grade >= 5 && grade < 6) {
    console.log("Good")
}

else if (grade >= 4 && grade < 5) {
    console.log("Fine")
}

else if (grade > 6 || grade < 1) {
    console.log("That is impossible, wrong grade")
}

else {
    console.log("Fail")
}

switch (grade) {
    case 6:
        console.log("Excelent");
        break;
    case 5:
        console.log("Good");
        break;
    case 4:
        console.log("Fine");
        break;
    default:
        console.log("Undefined");
        break;
}

