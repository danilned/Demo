import { apiURL } from "./request_sender.js";

let score = 0;
let sequence = [];
let blockStartGame = false;
let blockButtonsClick = false;
let currentSequenceIndex = 0;

const buttons = document.querySelectorAll(".circle");
const scoreDisplay = document.querySelector(".score");
const bestScoreDisplay = document.querySelector(".best-score");

bestScoreDisplay.textContent = localStorage.getItem("score") ?? 0;

const putScore = async () => {
  console.log("Put score");
  try {
    await fetch(`${apiURL}/players/sadamxuseinn`, {
      method: "PUT",
      body: JSON.stringify({ score }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Error
    console.log(error);
  }
};

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
      }, 800);
    });
  }
};

const startRound = () => {
  blockButtonsClick = true;

  const rand = Math.floor(Math.random() * 4);
  sequence.push(buttons[rand].classList[1]);

  playSequence().then(() => {
    blockButtonsClick = false;
  });
};

const handleButtonClick = (color) => {
  if (blockButtonsClick) {
    return;
  }

  flashButton(color);

  if (color !== sequence[currentSequenceIndex++]) {
    alert("You lose: " + score);
    resetGame();
    return;
  }

  const sound = new Audio(`./sound/${color}.mp3`);

  sound.play();

  if (currentSequenceIndex >= sequence.length) {
    currentSequenceIndex = 0;
    scoreDisplay.textContent = ++score;
    setTimeout(startRound, 1000);
  }
};

const resetGame = () => {
  const prevScore = localStorage.getItem("score");

  putScore();

  if (!prevScore || +prevScore < score) {
    localStorage.setItem("score", score);
    bestScoreDisplay.textContent = score;
  }

  score = 0;
  sequence = [];
  currentSequenceIndex = 0;
  scoreDisplay.textContent = score;
  blockStartGame = false;
};

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    handleButtonClick(e.target.classList[1]);
  });
});

document
  .querySelector(".start-game-container button")
  .addEventListener("click", () => {
    if (!blockStartGame) {
      blockStartGame = true;
      startRound();
    }
  });
