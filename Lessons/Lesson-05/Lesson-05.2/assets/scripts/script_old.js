// console.log("hello")

// const HOBBIES = ["judo", "boxing", "cycling"]
// console.log(HOBBIES.length)

// console.log(HOBBIES[0])

// const PERSON = {
//     name: "Sasha",
//     lastname: "Bravo",
//     hobbies: ["judo", "boxing", "cycling"]
// }

// console.log(PERSON.hobbies)

// const CONTAINER = document.getElementById("container")

// for (hobby of PERSON.hobbies){
    
//     const ITEM = document.createElement('li');
//     ITEM.textContent = hobby;
//     // ITEM.innerHTML = hobby;

//     CONTAINER.appendChild(ITEM)

//     // console.log(hobby)
// }

// USING JSON

const CONTAINER = document.getElementById("container")

fetch('./assets/data/data.json') // get the data from an external source
    .then(response => response.json()) // parse/convert the data in JavaScript format (telling the function the type of file format)
    .then(data => displayData(data)) // dispay the data in the console
    .catch(error => displayError(error)); // display an error if the data cannot be loaded

function displayData(data){
    console.log(data)

    let counter = 0;

    for (hobby of data.hobbies) {

        counter += 1;
        const ITEM = document.createElement('li');
        // ITEM.textContent = hobby;
        ITEM.textContent = `${counter}) ${hobby}`;

        CONTAINER.appendChild(ITEM);
    }
}

function displayError(error){
    console.log(error)
}