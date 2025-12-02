// API and game configuration object
const DOG_API = {
	base: "https://dog.ceo/api",
	// Base API URL string
	randomEndpoint: (count) => `https://dog.ceo/api/breeds/image/random/${count}`,
	// Function that returns the full URL for fetching count random dog images across all breeds
	randomByBreed: (breed, count) => `https://dog.ceo/api/breed/${breed}/images/random/${count}`,
	// Function that returns the full URL for fetching count random images of a specific breed
	defaultPairs: 8
	// Default image-count/“card pairs”
};

// Theme configuration map for swapping APIs
const THEMES = {
	dogs: { label: "Dogs" },
	foxes: { label: "Foxes" },
	ducks: { label: "Ducks" }
};

// Settings object
const GAME_CONFIG = {
	boardColumns: 4,
	// Sets the board width to 4 columns (so a grid layout can place cards 4 across)
	defaultPairs: DOG_API.defaultPairs
	// Reuses the default pair count defined in DOG_API (8)
};

// Fallback icons used until Dog CEO images are wired in
const fallbackIcons = [
	"fa-heart", "fa-star", "fa-moon", "fa-bell", "fa-car", "fa-cube", "fa-leaf", "fa-smile"
];

// References to DOM elements
const BOARD = document.getElementById("game-board");
const STATUS = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");
const timerDiv = document.getElementById("timer");
const nameInput = document.getElementById("name-input");
const bestTimeDiv = document.getElementById("best-time");
const winnerNameDiv = document.getElementById("winner-name");
const startBtn = document.getElementById("start-btn");
const loadingOverlay = document.getElementById("loading-overlay");
const errorOverlay = document.getElementById("error-overlay");
const retryBtn = document.getElementById("retry-btn");
const themeContainer = document.getElementById("theme-options");
const loadingOverlayText = loadingOverlay?.querySelector(".overlay-content");

// Menu
const menu = document.getElementById("menu-section");
const sections = document.querySelectorAll(".webpage-section");
const menuPairs = [
  { btnId: "theme-menu-btn", sectionId: "theme-container" },
  { btnId: "game-board-menu-btn", sectionId: "game-container" },
  { btnId: "instructions-menu-btn", sectionId: "instructions-container" } // update HTML id to match
];
const menuButtons = document.querySelectorAll(".menu-btn");

function showSection(sectionId) {
  // hide header
  menu.style.display = "none";
  // hide all sections, then reveal only the target
  sections.forEach(sec => {
    sec.style.display = sec.id === sectionId ? "block" : "none";
  });
}

menuPairs.forEach(({ btnId, sectionId }) => {
  const btn = document.getElementById(btnId);
  if (btn) btn.addEventListener("click", () => showSection(sectionId));
});

function showMenuSection() {
  menu.style.display = "block";
  sections.forEach(sec => {
    sec.style.display = "none";
  });
}

menuButtons.forEach(btn => btn.addEventListener("click", showMenuSection));


// Modal
const winModal = document.getElementById("winModal");
const closeBtn = document.querySelector(".close");
// Sound
const winSound = new Audio("./assets/sound/success_fanfare.mp3");



// Check the game state
let flippedCards = [];
let matchedCards = [];
let gameState = { status: "idle", deck: [] };
const cardElementsById = new Map();
// creates an empty Map to store DOM elements for the cards, keyed by a unique card ID. Using a Map (instead of a plain object)
let currentTheme = "dogs";

let gameplay = false;

// Timer variables
let startTime = null;
// Time stamp on first flip
let endTime = null;
// Time stamp when game ends

// Different colours for the icons
const iconColors = ['#FE3263', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22', '#1abc9c', '#ff4757'];
const BOARD_COLUMNS = GAME_CONFIG.boardColumns;
let selectedCardIndex = 0;
let hasKeyboardSelection = false;

resetBtn.addEventListener("click", resetGame);
retryBtn?.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeyNavigation);

//Shuffle function using the Fisher-Yates algorithm
function shuffle(array){
	for(let i = array.length - 1; i > 0; i--){
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

// Function to toggle overlays based on gameState.status
function setGameStatus(status) {
	gameState.status = status;
	updateStatusUI();
}

function updateStatusUI() {
	if (loadingOverlay) {
		loadingOverlay.style.display = gameState.status === "loading" ? "flex" : "none";
	}
	if (errorOverlay) {
		errorOverlay.style.display = gameState.status === "error" ? "flex" : "none";
	}
}

// Function to create a card object from API source with fallback icon
function makeCard(source, pairIndex, copyIndex){
	return {
		id: `${pairIndex}-${copyIndex}`,
		pairKey: `pair-${pairIndex}`,
		imageUrl: source.imageUrl || null,
		icon: source.icon || null,
		color: source.color || null,
		matched: false,
		revealed: false
	};
}

// Build the deck of cards by pulling random dog images from Dog CEO and turning them into paired card objects
async function buildDogDeck(pairCount = GAME_CONFIG.defaultPairs) {
	const url = DOG_API.randomEndpoint(pairCount);
	const res = await fetch(url);
	// Forms the API URL with DOG_API.randomEndpoint(pairCount) /breeds/image/random/8 and fetches it.
	if (!res.ok) throw new Error(`Dog API failed: ${res.status}`);
	// If http response isn’t OK, it throws Dog API failed: <status>
	const data = await res.json();
	if (!data.message || !Array.isArray(data.message)) throw new Error("Unexpected Dog API load");
	// If the response JSON doesn’t have a message array, it throws Unexpected Dog API load
	
	// Preload images to avoid flicker during gameplay
	const urls = data.message.slice(0, pairCount);
	await preloadImages(urls);

	const pairSources = urls.map((imageUrl, index) => ({
		imageUrl,
		icon: null,
		color: iconColors[index % iconColors.length]
	}));

	const deck = pairSources.flatMap((source, pairIndex) => ([
		makeCard(source, pairIndex, 0),
		makeCard(source, pairIndex, 1)
	]));

	shuffle(deck);
	return deck;
}

function preloadImages(urls = []) {
	return Promise.all(urls.map((src) => new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = () => reject(new Error(`Failed to load ${src}`));
		img.src = src;
	})));
}

//Function to create a card dynamically from data
function createCardElement(cardData){
	const card = document.createElement("div");
	card.classList.add("card");
	card.dataset.cardId = cardData.id;
	card.dataset.pairKey = cardData.pairKey;
	
	const cardInner = document.createElement("div");
	cardInner.classList.add("card-inner");
	
	const cardFront = document.createElement("div");
	cardFront.classList.add("card-front");
	
	const cardBack = document.createElement("div");
	cardBack.classList.add("card-back");
	cardBack.style.color = cardData.color || "#000";

	// Future: swap icon for API-provided dog image when imageUrl is set
	if (cardData.imageUrl) {
		const img = document.createElement("img");
		img.src = cardData.imageUrl;
		img.alt = "Theme card";
		cardBack.appendChild(img);
	} else {
		const iconElement = document.createElement("i");
		iconElement.classList.add("fa-solid", cardData.icon || "fa-question");
		cardBack.appendChild(iconElement);
	}
	
	cardInner.appendChild(cardFront);
	
	cardInner.appendChild(cardBack);
	card.appendChild(cardInner);
	
	card.addEventListener("click", () => flipCard(card));
	
	return card;
}

// shared fetch helper for APIs that only return one image per request
async function fetchImages(count, fetcher) {
	const requests = Array.from({ length: count }, () => fetcher());
	const results = await Promise.all(requests);
	return results;
}

async function buildFoxDeck(pairCount = GAME_CONFIG.defaultPairs) {
	const fetcher = async () => {
		const res = await fetch("https://randomfox.ca/floof/");
		if (!res.ok) throw new Error(`Fox API failed: ${res.status}`);
		const data = await res.json();
		if (!data.image) throw new Error("Unexpected Fox API payload");
		return data.image;
	};

	const urls = await fetchImages(pairCount, fetcher);
	await preloadImages(urls);

	const pairSources = urls.map((imageUrl, index) => ({
		imageUrl,
		icon: null,
		color: iconColors[index % iconColors.length]
	}));

	const deck = pairSources.flatMap((source, pairIndex) => ([
		makeCard(source, pairIndex, 0),
		makeCard(source, pairIndex, 1)
	]));

	shuffle(deck);
	return deck;
}

async function buildDuckDeck(pairCount = GAME_CONFIG.defaultPairs) {
	const fetcher = async () => {
		const res = await fetch("https://random-d.uk/api/v2/random");
		if (!res.ok) throw new Error(`Duck API failed: ${res.status}`);
		const data = await res.json();
		if (!data.url) throw new Error("Unexpected Duck API payload");
		return data.url;
	};

	const urls = await fetchImages(pairCount, fetcher);
	await preloadImages(urls);

	const pairSources = urls.map((imageUrl, index) => ({
		imageUrl,
		icon: null,
		color: iconColors[index % iconColors.length]
	}));

	const deck = pairSources.flatMap((source, pairIndex) => ([
		makeCard(source, pairIndex, 0),
		makeCard(source, pairIndex, 1)
	]));

	shuffle(deck);
	return deck;
}

startBtn.addEventListener('click', function(e){
	let userName = nameInput.value

	if (userName.length >= 3) {
		console.log('start')
		gameplay = true;
	}

	if (gameplay == true) {
		const gameBoard = document.getElementById('game-board')
		gameBoard.style.opacity = 1;
	}
	 

})

// Flip cards
function flipCard(card){

	if (gameplay == false || gameState.status !== "ready") return
	// make sure that the name input is filled before playing the game
	if(flippedCards.length === 2 || 
		card.classList.contains("flipped") || 
		card.classList.contains("matched")) 
	return;

	// Start timer on first meaningful flip
	if (startTime === null) {
        startGameTimer();
    }

	const cardData = findCardData(card.dataset.cardId);
	if (!cardData || cardData.revealed || cardData.matched) return;

	card.classList.add("flipped");

	cardData.revealed = true;
	flippedCards.push(cardData);
	
	if(flippedCards.length === 2)
		checkForMatch();
}

// Matching logic and check for a match
function checkForMatch(){
	const [card1, card2] = flippedCards;
	const cardEl1 = getCardElementById(card1.id);
	const cardEl2 = getCardElementById(card2.id);
	
	if(card1.pairKey === card2.pairKey){
		card1.matched = true;
		card2.matched = true;

		cardEl1?.classList.add("matched");
		cardEl2?.classList.add("matched");
		matchedCards.push(card1, card2);
	}else{
		setTimeout(() => {
			card1.revealed = false;
			card2.revealed = false;
			cardEl1?.classList.remove("flipped");
			cardEl2?.classList.remove("flipped");
		}, 1000);
	}
	
	flippedCards = [];
	checkGameOver();
}

// Check if all the cards have been matched
function checkGameOver() {
    if (matchedCards.length === gameState.deck.length) {

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
async function initGame(){
	BOARD.innerHTML = "";
	STATUS.innerText = "";
	flippedCards = [];
	matchedCards = [];
	gameState.deck = [];
	
	setGameStatus("loading");
	selectedCardIndex = 0;
	hasKeyboardSelection = false;
	const themeLabel = THEMES[currentTheme]?.label || "Animals";
	const loadingText = `Loading ${themeLabel.toLowerCase()}...`;
	STATUS.innerText = loadingText;
	if (loadingOverlayText) loadingOverlayText.textContent = loadingText;

	try {
		const deck = await buildDeckForTheme(currentTheme, GAME_CONFIG.defaultPairs);
		gameState.deck = deck;
		renderDeck(gameState.deck);
		setGameStatus("ready");
		STATUS.innerText = "";
	} catch (err) {
		console.error(err);
		STATUS.innerText = "Loading failed. Click reset to retry.";
		if (loadingOverlayText) loadingOverlayText.textContent = loadingText;
		setGameStatus("error");
	}

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
	if (gameState.status !== "ready") return;
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

function getCardElementById(cardId) {
	return cardElementsById.get(cardId);
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

function findCardData(cardId) {
	return gameState.deck.find(card => card.id === cardId);
}

function renderDeck(deck) {
	BOARD.innerHTML = "";
	cardElementsById.clear();

	deck.forEach((cardData) => {
		const card = createCardElement(cardData);
		cardElementsById.set(cardData.id, card);
		BOARD.appendChild(card);
	});
}

// Theme selection logic
function highlightThemeSelection(themeKey) {
	if (!themeContainer) return;
	const buttons = themeContainer.querySelectorAll(".theme-option");
	buttons.forEach(btn => {
		if (btn.dataset.theme === themeKey) {
			btn.classList.add("active-theme");
		} else {
			btn.classList.remove("active-theme");
		}
	});
}

async function buildDeckForTheme(themeKey, pairCount) {
	switch (themeKey) {
		case "foxes":
			return buildFoxDeck(pairCount);
		case "ducks":
			return buildDuckDeck(pairCount);
		case "dogs":
		default:
			return buildDogDeck(pairCount);
	}
}

function setTheme(themeKey) {
	if (!THEMES[themeKey]) return;
	currentTheme = themeKey;
	highlightThemeSelection(themeKey);
	resetGame();
}

if (themeContainer) {
	themeContainer.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		const themeKey = target.dataset.theme;
		if (themeKey) setTheme(themeKey);
	});
	highlightThemeSelection(currentTheme);
}


//Initialise the game on page load
updateBestTimeDisplay();
initGame();

  
