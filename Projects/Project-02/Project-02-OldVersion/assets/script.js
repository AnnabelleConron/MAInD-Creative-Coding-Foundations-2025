
//List of font awesome icons for the game
const icons = [
	"fa-heart", "fa-heart", "fa-star", "fa-star", "fa-moon", "fa-moon", "fa-bell", "fa-bell", "fa-car", "fa-car", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-smile", "fa-smile"
];

// References to DOM elements
const BOARD = document.getElementById("game-board");
const STATUS = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");
const timerDiv = document.getElementById("timer");
// Modal
const winModal = document.getElementById("winModal");
const modalStatus = document.getElementById("modal-status");
const modalTime = document.getElementById("modal-time");
const closeBtn = document.querySelector(".close");


// Check the game state
let flippedCards = [];
let matchedCards = [];

// Timer variables
// Time stamp on first flip
let startTime = null;
// Time stamp when game ends
let endTime = null;

// Different colours for the icons
const iconColors = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22', '#1abc9c', '#ff4757'];

resetBtn.addEventListener("click", resetGame);

//Shuffle function using the Fisher-Yates algorithm
function shuffle(array){
	for(let i = array.length - 1; i > 0; i--){
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//Function to create a card dynamically
function createCard(icon, color){
	const card = document.createElement("div");
	card.classList.add("card");
	
	const cardInner = document.createElement("div");
	cardInner.classList.add("card-inner");
	
	const cardFront = document.createElement("div");
	cardFront.classList.add("card-front");
	
	const cardBack = document.createElement("div");
	cardBack.classList.add("card-back");
	cardBack.style.color = color;
	
	const iconElement = document.createElement("i");
	iconElement.classList.add("fa-solid", icon);
	cardBack.appendChild(iconElement);
	
	cardInner.appendChild(cardFront);
	
	cardInner.appendChild(cardBack);
	card.appendChild(cardInner);
	
	card.addEventListener("click", () => flipCard(card));
	card.dataset.icon = icon;
	
	return card;
}

// Flip cards
function flipCard(card){
	if(flippedCards.length === 2 || 
		card.classList.contains("flipped") || 
		card.classList.contains("matched")) 
	return;

	// Start timer on first meaningful flip
    if (startTime === null) {
        startGameTimer();
    }
	
	card.classList.add("flipped");
	flippedCards.push(card);
	
	if(flippedCards.length === 2)
		checkForMatch();
}

// Matching logic and check for a match
function checkForMatch(){
	const [card1, card2] = flippedCards;
	
	if(card1.dataset.icon === card2.dataset.icon){
		card1.classList.add("matched");
		
		card2.classList.add("matched");
		matchedCards.push(card1, card2);
	}else{
		setTimeout(() => {
			card1.classList.remove("flipped");
			card2.classList.remove("flipped");
		}, 1000);
	}
	
	flippedCards = [];
	checkGameOver();
}

// Check if all the cards have been matched
function checkGameOver(){
	if(matchedCards.length === icons.length){
		endGameTimer();  // compute final time
		const resultText = "Congratulations! You Won!";
    	const timeText = timerDiv.innerText; // already formatted
		// Show modal
        modalStatus.innerText = resultText;
        modalTime.innerText = timeText;
        winModal.style.display = "block";

        STATUS.innerText = resultText; // Optional: still update page status
	}
}

// Start game
function initGame(){
	BOARD.innerHTML = "";
	STATUS.innerText = "";
	flippedCards = [];
	matchedCards = [];
	
	const shuffledIcons = [...icons];
	shuffle(shuffledIcons);
	
	shuffledIcons.forEach((icon, index) => {
		const color = iconColors[index % iconColors.length];
		
		const card = createCard(icon, color);
		BOARD.appendChild(card);
	});
}

function resetGame(){
    startTime = null;
    endTime = null;
    timerDiv.innerText = "";
    winModal.style.display = "none";   // hide modal if open
    initGame();
}

function startGameTimer () {
	if (startTime !== null) return; //Prevent resetting
	startTime = new Date().getTime();   // Capture timestamp (ms)
}

function endGameTimer() {
    endTime = new Date().getTime();          // Capture finish time
    const durationMs = endTime - startTime;  // Time difference
    const formatted = formatGameTime(durationMs);
    timerDiv.innerText = `Time: ${formatted}`;
}

function formatGameTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => n.toString().padStart(2, "0");

    return `${pad(minutes)}min ${pad(seconds)}sec`;
}

// Close modal when X is clicked
closeBtn.onclick = function() {
    winModal.style.display = "none";
};

// Close when clicking outside the modal box
window.onclick = function(event) {
    if (event.target === winModal) {
        winModal.style.display = "none";
    }
};


//Initialise the game on page load
initGame();

  
