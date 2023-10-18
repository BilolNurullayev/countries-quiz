const apiUrl = "https://restcountries.com/v3.1/all";

let countriesData = [];
let currentLevel = 1;
let score = 0;
let timeLeft = 15;
let timer;
let correctAnswer;

const startButton = document.getElementById("startButton");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("nextButton");
const trueElement = document.getElementById("question1");
const timerElementValue = document.getElementById("timer-value");
const timerElement = document.getElementById("timer");
const messageBoxElement = document.getElementById("message-box");

function messageBox(show) {
  let option = ""
  if (show) {
    option = "block"
  } else {
    option = "none"
  }
  messageBoxElement.style.display = option
}

// Fetches country data from an API.
async function fetchCountriesData() {
  try {
    const response = await fetch(apiUrl);
    countriesData = await response.json();
    startGame();
  } catch (error) {
    messageBox(true)
  }
}

// Generates a random index within a given range.
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// Generates a new question with options.
function generateQuestion(timer) {
  const randomIndex = getRandomIndex(countriesData.length - 1);
  const currentCountry = countriesData[randomIndex];
  if (!currentCountry?.name) {
    return messageBox(true)
  }
  if (!currentCountry.capital?.length) {
    return messageBox(true)
  }
  correctAnswer = currentCountry.capital[0]; // Set the value here
  const options = [correctAnswer];
  while (options.length < 4) {
    const randomCountry = countriesData[getRandomIndex(countriesData.length - 1)];
    const wrongAnswer = randomCountry.capital[0];
    if (!options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }

  questionElement.innerText = `What is the capital of ${currentCountry.name.common}?`;
  // flagElement.style.backgroundImage = url(${currentCountry.flags.png});
  optionsElement.innerHTML = "";
  options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    button.addEventListener("click", () => checkAnswer(option === correctAnswer, option, button));
    optionsElement.appendChild(button);
  });
  resetTimer();
  updateTimerDisplay();
  startTimer();
}

// Checks if the selected answer is correct and updates the UI accordingly.
function checkAnswer(isCorrect, selectedOption, selectedButton) {
  clearInterval(timer);
  const buttons = Array.from(optionsElement.getElementsByTagName("button"));
  buttons.forEach(button => {
    button.disabled = true;
    if (button.innerText === correctAnswer) {
      button.classList.add("correct-answer");
    }
  });
  if (isCorrect) {
    score++;
    scoreElement.innerText = `Score: ${score}`;
    selectedButton.classList.add("correct");
  } else {
    selectedButton.classList.add("wrong");
  }
  nextButton.disabled = false;
}

// Proceeds to the next question or ends the game.
function nextQuestion() {
  currentLevel++;
  if (currentLevel <= 10) {
    generateQuestion();
  } else {
    endGame();
  }
}

// Updates the timer display.
function updateTimerDisplay() {
  timerElementValue.innerText = timeLeft;
}

// Starts a timer countdown.
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
      checkAnswer(false);
      setTimeout(() => {
        nextQuestion();
      }, 3000);
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

// Resets the timer to its initial value.
function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  updateTimerDisplay();
}

// Initializes the game.
function startGame() {
  currentLevel = 1;
  score = 0;
  startButton.style.display = "none"
  nextButton.style.opacity = 1;
  nextButton.disabled = false;
  generateQuestion();
}

// Ends the game and displays the final score and message.
function endGame() {
  let endMessage = "";

if (score < 5) {
    endMessage = "Next time, give it your all ";
  } else if (score >= 5 && score <= 7) {
    endMessage = "You can improve";
  } else {
    endMessage = "You are an absolute genius";
  }

  questionElement.innerText = `Game over! You found  ${score} out of 10. ${endMessage}`;
  optionsElement.innerHTML = "";
  startButton.style.display = "block"
  nextButton.style.opacity = 0;
  nextButton.disabled = true;
  startButton.textContent = "Play Again";
  resetTimer()
  timerElement.style.display = "none"
}

// Restarting the game 
startButton.addEventListener("click", () => {
  if (startButton.textContent === "Start Game") {
    fetchCountriesData();
  } else if (startButton.textContent === "Play Again") {
    startGame();
    location.reload();
  }
});

startButton.addEventListener("click", fetchCountriesData);
nextButton.addEventListener("click", nextQuestion);