// Get references to the input field and add button
const addButton = document.getElementById('add-button');

const taskInput = document.getElementById('todo-input');

// Event listener to the add button using the addButton and taskInput reference
// Listener for the add button
addButton.addEventListener('click', () => {
    // detecting a click on the add button
    console.log('Add button clicked');

    const inputValue = taskInput.value;
    // can reuse in to check with the console that the input value is being detected when the add button is clicked
    console.log(inputValue);

    const listElement = document.createElement('li');
    // create new list element
    // get inputValue and use it as the text content for the new list element
    listElement.innerHTML = inputValue;
})