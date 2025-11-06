// === CONSTANTS ===
// References to the input field and add button
const addButton = document.getElementById('add-button');
const listViewButton = document.getElementById('list-view-button');
const cardViewButton = document.getElementById('card-view-button');
const taskInput = document.getElementById('todo-input');
const taskList = document.getElementById('todo-list');
const colorButtons = document.querySelectorAll('#color-picker .color-swatch');
let selectedColor = '#F7A262'; // default colour

// === COLOR SELECTION ===
colorButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedColor = button.dataset.color;
    colorButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});

// === VIEW TOGGLE ===
// Event listener to the view buttons using the listViewButton and cardViewButton references

listViewButton.addEventListener('click', () => {
  taskList.classList.remove('card-view');
  taskList.classList.add('list-view');
});

cardViewButton.addEventListener('click', () => {
  taskList.classList.remove('list-view');
  taskList.classList.add('card-view');
});

// === LOCAL STORAGE ===
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#todo-list li').forEach(li => {
    const text = li.querySelector('p').textContent;
    const color = li.style.backgroundColor;
    tasks.push({ text, color });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem('tasks')) || [];
  saved.forEach(task => {
    createTaskElement(task.text, task.color);
  });
}

// === TASK ===
function createTaskElement(text, color) {
  const listElement = document.createElement('li');
  listElement.classList.add('todo-item');
  listElement.style.backgroundColor = color;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const p = document.createElement('p');
  p.textContent = text;

  listElement.appendChild(checkbox);
  listElement.appendChild(p);
  taskList.appendChild(listElement);

  // Remove on check
  checkbox.addEventListener('click', () => {
    listElement.remove();
    saveTasks();
  });
}

// === ADD TASK ===
function addTask() {
  const inputValue = taskInput.value.trim();
  if (inputValue === '') return;

  createTaskElement(inputValue, selectedColor);
  saveTasks(); // save after adding
  taskInput.value = '';
}

// === EVENT LISTENERS ===
addButton.addEventListener('click', addTask);

// Press Enter to add a new task
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// === INITIAL LOAD ===
loadTasks();

