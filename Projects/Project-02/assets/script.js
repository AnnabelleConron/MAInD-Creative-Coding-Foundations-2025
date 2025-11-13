// list of font awsome icons for the game
const icons = [
    "fa-heart", "fa-heart", "fa-start", "fa-start", "fa-moon", "fa-moon", "fa-bell", "fa-bell", "fa-car", "fa-car", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-smile", "fa-smile"
];

const board = document.getElementById("game-board");
const status = ocument.getElementById("status");
const resetBtn = ocument.getElementById("reset-btn");

let flippedCards = [];
let matchedCards = [];
const iconColors = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22', '#1abc9c', '#ff4757'];

resetBtn.addEventListener("click", resetGame);
