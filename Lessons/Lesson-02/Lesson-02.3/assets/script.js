// --- State ---
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const board = $("#board");
const addForm = $("#addForm");
const input = $("#todoInput");
const viewToggle = $(".view-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let nextId = Number(localStorage.getItem("nextId") || "1");

function save(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("nextId", String(nextId));
}

function addTask(text){
  const t = text.trim();
  if(!t) return;
  tasks.unshift({ id: nextId++, text: t });
  save();
  render();
}

function removeTask(id){
  tasks = tasks.filter(task => task.id !== id);
  save();
  render();
}

// Render in either list or card layout (CSS controls layout)
function render(){
  board.innerHTML = "";
  const tpl = $("#todoTemplate");
  tasks.forEach(task => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = task.id;
    node.querySelector(".todo-text").textContent = task.text;
    board.appendChild(node);
  });
  // Update pressed state on view buttons
  const view = document.body.dataset.view || "list";
  $$('.view-toggle button').forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.view === view));
  });
}

// --- Events ---

// Add via form submit or Enter
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

// Remove when a checkbox is checked
board.addEventListener("change", (e) => {
  const checkbox = e.target;
  if(checkbox.matches('.todo-check input')){
    const id = Number(checkbox.closest('.todo-item').dataset.id);
    // Optional tiny delay for visual feedback
    setTimeout(() => removeTask(id), 75);
  }
});

// Toggle view
viewToggle.addEventListener("click", (e) => {
  const btn = e.target.closest('button[data-view]');
  if(!btn) return;
  document.body.dataset.view = btn.dataset.view;
  render();
});

// Keyboard: Enter adds task when input focused; already covered by form submit

// Initial view and render
document.body.dataset.view = document.body.dataset.view || "list";
render();
