// CONSTANTS
// References to the input field and add button
const addButton = document.getElementById('add-button');
const listViewButton = document.getElementById('list-view-button');
const cardViewButton = document.getElementById('card-view-button');
const taskInput = document.getElementById('todo-input');
const taskList = document.getElementById('todo-list');
const colorPicker = document.getElementById('color-picker');


// VIEW
// Event listener to the view buttons using the listViewButton and cardViewButton references

// LIST VIEW
listViewButton.addEventListener('click', () => {
    console.log('List View button clicked');
    taskList.classList.remove('card-view');
    taskList.classList.add('list-view');
})

// CARD VIEW
cardViewButton.addEventListener('click', () => {
    console.log('Card View button clicked');
    taskList.classList.remove('list-view');
    taskList.classList.add('card-view');
})

// ADD BUTTON
// Event listener to the add button using the addButton and taskInput reference
// ADD BUTTON
addButton.addEventListener('click', () => {
    const inputValue = taskInput.value.trim();
    if (inputValue === '') return;

    const listElement = document.createElement('li');
    listElement.classList.add('todo-item');

    // apply selected colour
    listElement.style.backgroundColor = colorPicker.value;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const p = document.createElement('p');
    p.textContent = inputValue;

    listElement.appendChild(checkbox);
    listElement.appendChild(p);
    taskList.appendChild(listElement);

    taskInput.value = '';

    // remove on check
    checkbox.addEventListener('click', () => {
        listElement.remove();
    });
});