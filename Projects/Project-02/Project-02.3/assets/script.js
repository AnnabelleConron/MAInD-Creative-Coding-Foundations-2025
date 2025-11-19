
//List of font awesome icons for the game
const icons = [
	"fa-heart", "fa-heart", "fa-star", "fa-star", "fa-moon", "fa-moon", "fa-bell", "fa-bell", "fa-car", "fa-car", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-smile", "fa-smile"
];

// References to DOM elements
const BOARD = document.getElementById("game-board");
const STATUS = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");
const timerDiv = document.getElementById("timer");
const nameInput = document.getElementById("name-input");
const bestTimeDiv = document.getElementById("best-time");
const winnerNameDiv = document.getElementById("winner-name");
// Modal
const winModal = document.getElementById("winModal");
const closeBtn = document.querySelector(".close");
// Sound
const winSound = new Audio("./assets/sound/success_fanfare.mp3");


// Check the game state
let flippedCards = [];
let matchedCards = [];

// Timer variables
// Time stamp on first flip
let startTime = null;
// Time stamp when game ends
let endTime = null;

// Different colours for the icons
const iconColors = ['#FE3263', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22', '#1abc9c', '#ff4757'];
const BOARD_COLUMNS = 4;
let selectedCardIndex = 0;
let hasKeyboardSelection = false;

resetBtn.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeyNavigation);

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
function checkGameOver() {
    if (matchedCards.length === icons.length) {

        endGameTimer();

        // Prepare modal content
        STATUS.innerText = "You Won!";
		const playerName = nameInput.value.trim();
		winnerNameDiv.innerText = playerName ? `Congratulations ${playerName}!` : "";
        timerDiv.innerText = timerDiv.innerText;
		// Play win sound
		winSound.play();

        // Show modal
        winModal.style.display = "block";
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

	selectedCardIndex = 0;
	hasKeyboardSelection = false;
}

function resetGame() {
    startTime = null;
    endTime = null;

    timerDiv.innerText = "";   
	winnerNameDiv.innerText = "";
    winModal.style.display = "none"; //Hide modal if open

    initGame();
}

function startGameTimer () {
	if (startTime !== null) return;  //Prevent resetting
	startTime = new Date().getTime();  // Capture timestamp (ms)
}

// End game timer and calculate duration
function endGameTimer() {
    endTime = new Date().getTime();  // Capture finish time
    const durationMs = endTime - startTime;  // Calculate time difference
    const formatted = formatGameTime(durationMs);  // Format time for display
    timerDiv.innerText = `Time: ${formatted}`;
	const playerName = nameInput.value.trim();  // Get trimmed #name-input value and passes into the best-time logic
	saveBestTimeIfFaster(durationMs, playerName);
}

function formatGameTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);

    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => n.toString().padStart(2, "0");

    return `${pad(minutes)}min ${pad(seconds)}sec`;
}

function getStoredBestTime() {
	const stored = localStorage.getItem("bestTimeMs");
	return stored ? parseInt(stored, 10) : null;
}

// Update best time display with duration and player name
function updateBestTimeDisplay() {
	const bestTimeMs = getStoredBestTime();
	const bestPlayerName = localStorage.getItem("bestPlayerName") || "Unknown";
	bestTimeDiv.innerText = bestTimeMs !== null ? `Best Time: ${bestPlayerName} - ${formatGameTime(bestTimeMs)}` : "Best Time";
}

function saveBestTimeIfFaster(durationMs, playerName) {
	const bestTimeMs = getStoredBestTime();
	if (bestTimeMs === null || durationMs < bestTimeMs) {
		localStorage.setItem("bestTimeMs", durationMs);
		localStorage.setItem("bestPlayerName", playerName || "Unknown");  // Player name or "Unknown" if empty
		updateBestTimeDisplay();
	}
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

function handleKeyNavigation(event) {
	const activeElement = document.activeElement;
	if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) return;

	const cards = getCardElements();
	if (!cards.length) return;

	let newIndex = selectedCardIndex;
	let moved = false;

	switch (event.key) {
		case "ArrowLeft":
			if (selectedCardIndex % BOARD_COLUMNS !== 0) {
				newIndex = selectedCardIndex - 1;
				moved = true;
			}
			break;
		case "ArrowRight":
			if (selectedCardIndex % BOARD_COLUMNS !== BOARD_COLUMNS - 1 && selectedCardIndex + 1 < cards.length) {
				newIndex = selectedCardIndex + 1;
				moved = true;
			}
			break;
		case "ArrowUp":
			if (selectedCardIndex >= BOARD_COLUMNS) {
				newIndex = selectedCardIndex - BOARD_COLUMNS;
				moved = true;
			}
			break;
		case "ArrowDown":
			if (selectedCardIndex + BOARD_COLUMNS < cards.length) {
				newIndex = selectedCardIndex + BOARD_COLUMNS;
				moved = true;
			}
			break;
		case "Enter":
			if (!hasKeyboardSelection) return;
			event.preventDefault();
			flipCard(cards[selectedCardIndex]);
			return;
		default:
			return;
	}

	if (!hasKeyboardSelection) {
		hasKeyboardSelection = true;
		highlightSelectedCard(cards);
	}

	if (moved && newIndex !== selectedCardIndex) {
		selectedCardIndex = newIndex;
		highlightSelectedCard(cards);
		event.preventDefault();
	} else if (hasKeyboardSelection) {
		// Ensure highlight appears after first arrow, even if player hits a boundary
		highlightSelectedCard(cards);
	}
}

function getCardElements() {
	return Array.from(BOARD.querySelectorAll(".card"));
}

function highlightSelectedCard(existingCards = null) {
	const cards = existingCards || getCardElements();
	if (!hasKeyboardSelection) return;
	cards.forEach(card => card.classList.remove("selected"));
	if (!cards.length) return;

	if (selectedCardIndex >= cards.length) {
		selectedCardIndex = cards.length - 1;
	}

	cards[selectedCardIndex].classList.add("selected");
}


//Initialise the game on page load
updateBestTimeDisplay();
initGame();

  
