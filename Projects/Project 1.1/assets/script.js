// Get references to DOM elements
const input = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const viewButton = document.getElementById('viewButton');
const board = document.getElementById('board');

// Add new todo item
addButton.addEventListener ("click", addTodo);

function addTodo() {
    const todoText = input.value.trim();
    if (todoText === "") return;
    // Create todo item element
    const div = document.createElement("div");
    div.className = "todo";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const p = document.createElement("p");  
    p.textContent = text;
}