const player = document.getElementById('player');
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

let score = 0;
let gameInterval;
let itemInterval;
let isGameRunning = false; // Track if the game is running

// Move player with arrow keys (only if the game is running)
document.addEventListener('keydown', (e) => {
  if (!isGameRunning) return; // Don't move the player if the game isn't running

  const playerRect = player.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();

  if (e.key === 'ArrowLeft' && playerRect.left > containerRect.left + 10) {
    player.style.left = `${player.offsetLeft - 10}px`;
  }
  if (e.key === 'ArrowRight' && playerRect.right < containerRect.right - 10) {
    player.style.left = `${player.offsetLeft + 10}px`;
  }
});

// Create falling items
function createItem() {
  const item = document.createElement('div');
  item.classList.add('item');
  item.style.left = `${Math.random() * (gameContainer.offsetWidth - 30)}px`;
  gameContainer.appendChild(item);

  // Move item down
  const fallInterval = setInterval(() => {
    if (!isGameRunning) {
      clearInterval(fallInterval); // Stop moving if the game isn't running
      return;
    }

    item.style.top = `${item.offsetTop + 5}px`;

    // Check for collision with player
    const playerRect = player.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.top <= playerRect.bottom &&
      itemRect.right >= playerRect.left &&
      itemRect.left <= playerRect.right
    ) {
      score++;
      scoreElement.textContent = `Score: ${score}`;
      clearInterval(fallInterval);
      item.remove();
    }

    // Remove item if it goes off screen and decrease score
    if (item.offsetTop > gameContainer.offsetHeight) {
      score--;
      scoreElement.textContent = `Score: ${score}`;
      clearInterval(fallInterval);
      item.remove();

      // Check if score is below 0
      if (score < 0) {
        gameOver();
      }
    }
  }, 50);
}

// Game over function
function gameOver() {
  isGameRunning = false; // Stop the game
  clearInterval(itemInterval); // Stop creating items

  // Display "Game Over" message
  const gameOverMessage = document.createElement('div');
  gameOverMessage.textContent = 'Game Over!';
  gameOverMessage.style.position = 'absolute';
  gameOverMessage.style.top = '50%';
  gameOverMessage.style.left = '50%';
  gameOverMessage.style.transform = 'translate(-50%, -50%)';
  gameOverMessage.style.color = '#ff6f7d'; /* Soft pastel pink */
  gameOverMessage.style.fontSize = '24px';
  gameOverMessage.style.fontFamily = 'Nunito, sans-serif';
  gameContainer.appendChild(gameOverMessage);

  // Disable stop button and enable start button
  startButton.disabled = false;
  stopButton.disabled = true;
}

// Start the game
startButton.addEventListener('click', () => {
  if (isGameRunning) return; // Don't start if the game is already running

  isGameRunning = true; // Set game state to running

  // Reset score
  score = 0;
  scoreElement.textContent = `Score: ${score}`;

  // Clear existing items and game over message
  const items = document.querySelectorAll('.item');
  items.forEach(item => item.remove());
  const gameOverMessage = document.querySelector('.game-over');
  if (gameOverMessage) gameOverMessage.remove();

  // Start creating items
  itemInterval = setInterval(() => {
    if (isGameRunning) {
      createItem();
    }
  }, 1000);

  // Disable start button and enable stop button
  startButton.disabled = true;
  stopButton.disabled = false;
});

// Stop the game
stopButton.addEventListener('click', () => {
  isGameRunning = false; // Set game state to stopped

  // Stop creating items
  clearInterval(itemInterval);

  // Clear existing items
  const items = document.querySelectorAll('.item');
  items.forEach(item => item.remove());

  // Enable start button and disable stop button
  startButton.disabled = false;
  stopButton.disabled = true;
});
