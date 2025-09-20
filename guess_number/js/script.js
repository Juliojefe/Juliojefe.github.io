document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

let randomNumber;
let attempts = 0;
let winCount = 0;
let lossCount = 0;

initializeGame();

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1;
  console.log("Random number:" + randomNumber);
  attempts = 0;

  // hiding the Reset button
  document.querySelector("#resetBtn").style.display = "none";

  // showing the Guess button
  document.querySelector("#guessBtn").style.display = "inline";

  let playerGuess = document.querySelector("#playerGuess");
  playerGuess.focus(); // adding focus to textbox
  playerGuess.value = ""; // clearing the textbox

  let feedback = document.querySelector("#feedback");
  feedback.textContent = ""; // clearing the feedback

  // clearing previous guesses
  document.querySelector("#guesses").textContent = "";

  document.querySelector("#winCount").textContent = winCount;

  document.querySelector("#lossCount").textContent = lossCount;

  document.querySelector("#remainingAttempts").textContent = 7 - attempts;
}

function gameOver(){
  let guessBtn = document.querySelector("#guessBtn");
  let resetBtn = document.querySelector("#resetBtn");
  guessBtn. style.display = "none"; //hides Guess button
  resetBtn. style.display = "inline"; //displays Reset button
}

function checkGuess() {
  let feedback = document.querySelector("#feedback");
  feedback. textContent = "";
  let guess = document.querySelector("#playerGuess") . value;
  console.log ("Player guess: " + guess) ;
  if (guess < 1 || guess > 99) {
    feedback.textContent = "Enter a number between 1 and 99";
    feedback.style. color = "red";
  }
  attempts++;
  document.querySelector("#remainingAttempts").textContent = 7 - attempts;
  console. log("Attempts:" + attempts);
  feedback. style.color = "orange";
  if (guess == randomNumber) {
    feedback.textContent = "You guessed it! You Won!";
    feedback.style.color = "darkgreen";
    ++winCount;
    //  show remianing attemts here 
    document.querySelector("#winCount").textContent = winCount;
    gameOver();
  } else {
    document.querySelector("#guesses").textContent += guess + " ";
    if (attempts == 7) {
      feedback.innerHTML = "Sorry, you lost!<br>The number was " + randomNumber;
      feedback.style. color = "red";
      ++lossCount;
      document.querySelector("#lossCount").textContent = lossCount;
      gameOver();
    } else if (guess > randomNumber) {
      if (guess > 99) {
        feedback.textContent = "Error: enter a number less than or equal to 99";
      } else {
        feedback.textContent = "Guess was high";
      }
    } else {
      feedback.textContent = "Guess was low";
    }
  }
}