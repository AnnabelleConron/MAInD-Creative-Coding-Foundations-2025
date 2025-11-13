const CONTAINER = document.getElementById("container")

fetch('./assets/data/MOCK_DATA.json') // get the data from an external source
    .then(response => response.json()) // parse/convert the data in JavaScript format (telling the function the type of file format)
    .then(data => displayData(data)) // dispay the data in the console
    .catch(error => displayError(error));

function displayData(data){
    console.log(data)

    // Filter
    const FILTERED = data.filter( (obj) => obj.age > 20 && obj.age < 39);
    // const SUB_FILTER = FILTERED_A.filter ((obj => obj.gender == "Female"))
    console.log(FILTERED.length)
    
    // const FILTERED_B = data.filter( (obj) => obj.first_name == "Hi" );

    // Sort
    const SORT_AGE = FILTERED.sort( (a,b) => a.age - b.age )
    // const SORT_NAME = SUB_FILTER.sort( (a,b) => a.first_name.localeCompare(b.first_name) )


    for (let person of FILTERED){
        // Container
        const PERSON_BOX = document.createElement('li');
        // Person
        const PERSON_INFO = document.createElement('div');
        // Bar
        const PERSON_BAR = document.createElement('div')
        
        PERSON_INFO.textContent = `${person.first_name} ${person.last_name} ${person.age}`;
        
        PERSON_BAR.style.width = `${person.age * 5}px`;
        PERSON_BAR.className = "bar";

        let BAR_COLOUR = "grey"

        if (person.gender == "Male") {
            BAR_COLOUR = "blue"
        }

        else if (person.gender == "Female") {
            BAR_COLOUR = "pink"
        }

        else {
            BAR_COLOUR = "orange"
        }

        PERSON_BAR.style.backgroundColor = BAR_COLOUR;

        PERSON_BOX.appendChild(PERSON_INFO)
        PERSON_BOX.appendChild(PERSON_BAR)

        CONTAINER.appendChild(PERSON_BOX)
    }

}

function displayError(error){
    console.log(error)
}