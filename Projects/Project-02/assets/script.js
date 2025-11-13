// list of font awsome icons for the game
const icons = [
    "fa-heart", "fa-heart", "fa-start", "fa-start", "fa-moon", "fa-moon", "fa-bell", "fa-bell", "fa-car", "fa-car", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-smile", "fa-smile"
];

const board = document.getElementById("game-board");
const status = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");

let flippedCards = [];
let matchedCards = [];
const iconColors = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22', '#1abc9c', '#ff4757'];

resetBtn.addEventListener("click", resetGame);

// Shuffle function
function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to create card
function createCard(ioc, color) {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.style.color = color;
    cardBack.innerHTML = '<i class="fas'+icon+'"></i>';

    cardInner.appendChild(cardFront);

    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardInner);

    card.addEventListener("click", () => flipCard(card));
    card.dataset.icon = icon;

    return card;
}

function flipCard(card){
    if(flippedCards.length === 2 || card.classList.contains("flipped") || card.classList.contains("matched")) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if(flippedCards.length === 2)
        checkForMatch();
}

function checkForMatch () {
    const [card1, card2] = flippedCards;

    if(card1.dataset.icon === card2.dataset.icon) {
        card1.classList.add("matched");
        
        card2.classList.add("matched");
        matchedCards.push(card1, card2);
    }
    // revove the cards if they don't match
    else {
        setTimeout( () => {
            card1.classList.remove ("flipped");
            card2.classList.remove ("flipped");
        }, 1000);
    }

    flippedCards = [];
    checkGameOver();
}

function checkGameOver() {
    if(matchedCards.length === icons.length){
        status.innerText = "Winner";   
    }
}

function initGame(){
    board.innerHTML = "";
    status.innerText = "";
    flippedCards = [];
    matchedCards = [];

    const shuffledIcons = [...icons];
    shuffle(shuffledIcons);

    shuffledIcons.forEach((icon, index) => {
        const color = iconColors[index % iconColors.length];

        const card = createCard (icon, color);
        board.appendChild(card);
    });
}

function resetGame(){
    initGame();
}

//Initialise the game on page load
initGame();
