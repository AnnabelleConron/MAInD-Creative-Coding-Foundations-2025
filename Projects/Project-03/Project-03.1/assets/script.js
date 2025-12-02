// API and game configuration object
const DOG_API = {
	base: "https://dog.ceo/api",
	randomEndpoint: (count) => `https://dog.ceo/api/breeds/image/random/${count}`,
	randomByBreed: (breed, count) => `https://dog.ceo/api/breed/${breed}/images/random/${count}`,
	defaultPairs: 8
};

const FOX_API = {
	base: "https://randomfox.ca",
	randomEndpoint: () => "https://randomfox.ca/floof/",
	extractUrl: (data) => data.image
};

// Theme identifiers and 
// Theme data types
const THEMES = {
	DOGS: "dogs",
	FOXES: "foxes"
};

// For the loading/status messaging
const THEME_META = {
	[THEMES.DOGS]: { label: "Dogs" },
	[THEMES.FOXES]: { label: "Foxes" }
};

// Mapping of theme keys to their respective deck builder functions
const THEME_BUILDERS = {
	[THEMES.DOGS]: buildDogDeck,
	[THEMES.FOXES]: buildFoxDeck
};

let currentTheme = THEMES.DOGS;

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
	{ btnId: "instructions-menu-btn", sectionId: "instructions-container" },
	{ btnId: "play-game-btn", sectionId: "game-container" },
	{ btnId: "instructions-container-play-game-btn", sectionId: "game-container" }
];
const menuButtons = document.querySelectorAll(".menu-btn");

// Shows or hides HTML sections based on which button is clicked
function showSection(sectionId) {
  // Hide menu
  menu.style.display = "none";
  // Hide all sections, then reveal only the target
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
const WIN_SOUNDS = {
	[THEMES.DOGS]: "./assets/sound/dog_sound.m4a",
	[THEMES.FOXES]: "./assets/sound/fox_sound.m4a"
};

function createWinSound(themeKey) {
	const src = WIN_SOUNDS[themeKey] || "./assets/sound/success_fanfare.mp3";
	const audio = new Audio(src);
	audio.preload = "auto";
	return audio;
}

let winSound = createWinSound(currentTheme);

// Check the game state
let flippedCards = [];
let matchedCards = [];
let gameState = { status: "idle", deck: [] };
const cardElementsById = new Map();
// creates an empty Map to store DOM elements for the cards, keyed by a unique card ID. Using a Map (instead of a plain object)

// When name input is filled and start button clicked the gameplay variable is set to true
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
retryBtn.addEventListener("click", resetGame);
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

	// Render either an image (from API) or a fallback icon
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

// Fetch helper for Fox API that only return one image per request
async function fetchImages(count, fetcher) {
	const requests = Array.from({ length: count }, () => fetcher());
	const results = await Promise.all(requests);
	return results;
}

async function buildFoxDeck(pairCount = GAME_CONFIG.defaultPairs) {
	const fetcher = async () => {
		const res = await fetch(FOX_API.randomEndpoint());
		if (!res.ok) throw new Error(`Fox API failed: ${res.status}`);
		const data = await res.json();
		const url = FOX_API.extractUrl(data);
		if (!url) throw new Error("Unexpected Fox API payload");
		return url;
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
	// Ignores input if it’s not in "ready" state, makes sure that the name input is filled before playing the game
	if(flippedCards.length === 2 || 
		card.classList.contains("flipped") || 
		card.classList.contains("matched")) 
	return;
	//Prevents more than two concurrent flips and avoids re-flipping already matched cards.

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

// Matching logic and check for a match, compares the two flipped cards using their shared pairKey
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
		// End timer computes the duration using Date.getTime()
        endGameTimer();

        // Prepare modal content
        STATUS.innerText = "You Won!";
		const playerName = nameInput.value.trim();
		winnerNameDiv.innerText = playerName ? `Congratulations ${playerName}!` : "";
        timerDiv.innerText = timerDiv.innerText;
		// Play win sound
		winSound.currentTime = 0;
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
	const themeLabel = THEME_META[currentTheme]?.label || "Animals";
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
	// Compares against the stored best time in localStorage
	const bestTimeMs = getStoredBestTime();
	if (bestTimeMs === null || durationMs < bestTimeMs) {
		localStorage.setItem("bestTimeMs", durationMs);
		localStorage.setItem("bestPlayerName", playerName || "Unknown");  // Player name or "Unknown" if empty
		updateBestTimeDisplay();
		// Updates both the storage and the #best-time element if the time has improved
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
	// Attached to document.addEventListener("keydown", handleKeyNavigation)
	if (gameState.status !== "ready") return;
	// Ignores key presses while the game is loading or when the user is typing in an input field
	const activeElement = document.activeElement;
	if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) return;

	// Treats the oard as an array of cards and translate arrow presses into index changes
	const cards = getCardElements();
	if (!cards.length) return;

	// Tracks a linear index across the grid
	let newIndex = selectedCardIndex;
	let moved = false;

	switch (event.key) {
		case "ArrowLeft":
			if (selectedCardIndex % BOARD_COLUMNS !== 0) {
				newIndex = selectedCardIndex - 1;
				moved = true;
			}
			// Update newIndex if not at left boundary
			break;
		case "ArrowRight":
			if (selectedCardIndex % BOARD_COLUMNS !== BOARD_COLUMNS - 1 && selectedCardIndex + 1 < cards.length) {
				newIndex = selectedCardIndex + 1;
				moved = true;
			}
			// Update newIndex if not at right boundary
			break;
		case "ArrowUp":
			if (selectedCardIndex >= BOARD_COLUMNS) {
				newIndex = selectedCardIndex - BOARD_COLUMNS;
				moved = true;
			}
			// Move by BOARD_COLUMNS steps
			break;
		case "ArrowDown":
			if (selectedCardIndex + BOARD_COLUMNS < cards.length) {
				newIndex = selectedCardIndex + BOARD_COLUMNS;
				moved = true;
			}
			break;
		case "Enter":
			if (!hasKeyboardSelection) return;
			// Avoids highlighting until the user first presses an arrow key
			event.preventDefault();
			flipCard(cards[selectedCardIndex]);
			// Uses the flipCard logic
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
	// Updates the visual highlight based on selectedCardIndex
	const cards = existingCards || getCardElements();
	if (!hasKeyboardSelection) return;
	cards.forEach(card => card.classList.remove("selected"));
	if (!cards.length) return;

	if (selectedCardIndex >= cards.length) {
		selectedCardIndex = cards.length - 1;
	}

	cards[selectedCardIndex].classList.add("selected");
	// CSS .card.selected class changes the border colour
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
	const builder = THEME_BUILDERS[themeKey] || THEME_BUILDERS[THEMES.DOGS];
	return builder(pairCount);
}

function setTheme(themeKey) {
	if (!Object.values(THEMES).includes(themeKey)) return;
	currentTheme = themeKey;
	winSound = createWinSound(themeKey);
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

