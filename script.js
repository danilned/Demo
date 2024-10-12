let score = 0;
let sequence = [];
let blockStartGame = false;
let currentSequenceIndex = 0;

const buttons = document.querySelectorAll(".circle");
const scoreDisplay = document.querySelector(".score");

const place = {
  red: 0,
  blue: 1,
  yellow: 2,
  green: 3,
};

const flashButton = (color) => {
  buttons[place[color]].classList.add("active");
  setTimeout(() => {
    buttons[place[color]].classList.remove("active");
  }, 400);
};

const playSequence = async () => {
  for (let i = 0; i < sequence.length; i++) {
    await new Promise((resolve) => {
      setTimeout(() => {
        flashButton(sequence[i]);
        resolve();
      }, 600);
    });
  }
};

const startRound = () => {
  if (blockStartGame) {
    return;
  }

  blockStartGame = true;

  const rand = Math.floor(Math.random() * 4);
  sequence.push(buttons[rand].classList[1]);

  playSequence().then(() => {
    blockStartGame = false;
  });
};

const handleButtonClick = (color) => {
  if (blockStartGame) {
    return;
  }

  flashButton(color);

  if (color !== sequence[currentSequenceIndex++]) {
    alert("You lose: " + score);
    resetGame();
    return;
  }

  console.log(sequence, currentSequenceIndex);

  if (currentSequenceIndex >= sequence.length) {
    score++;
    currentSequenceIndex = 0;
    scoreDisplay.textContent = score;
    setTimeout(startRound, 1000);
  }
};

const resetGame = () => {
  score = 0;
  sequence = [];
  scoreDisplay.textContent = score;
};

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    handleButtonClick(e.target.classList[1]);
  });
});

document
  .querySelector(".start-game-container button")
  .addEventListener("click", startRound);
