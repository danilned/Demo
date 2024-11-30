import { apiURL, retryRequest } from "./request_sender.js";

let score = 0;
let bestScore = null;
let sequence = [];
let blockStartGame = false;
let blockButtonsClick = false;
let currentSequenceIndex = 0;

const buttons = document.querySelectorAll(".circle");
const scoreDisplay = document.querySelector(".score");
const bestScoreDisplay = document.querySelector(".best-score");
const username = localStorage.getItem("username");

const putScore = async () => {
  try {
    await retryRequest(`${apiURL}/players/${username}`, {
      method: "PUT",
      body: JSON.stringify({ score }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getBestScore = async () => {
  try {
    const result = await retryRequest(
      `${apiURL}/players/${localStorage.getItem("username")}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await result.json();
    bestScoreDisplay.textContent = bestScore = data.Score;
  } catch (error) {
    console.log(error);
  }
};

getBestScore();

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
  putScore();

  if (bestScore === null || bestScore < score) {
    bestScoreDisplay.textContent = bestScore = score;
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
