let score = 0;
let questions = 5;
let submitBtn = document.querySelector("#submit");
let answerOneMessage = document.querySelector("#answerOneMessage");
let answerTwoMessage = document.querySelector("#answerTwoMessage");
let answerThreeMessage = document.querySelector("#answerThreeMessage");
let answerFourMessage = document.querySelector("#answerFourMessage");
let answerFiveMessage = document.querySelector("#answerFiveMessage");
let answerOneIcon = document.querySelector("#answerOneIcon");
let answerTwoIcon = document.querySelector("#answerTwoIcon");
let answerThreeIcon = document.querySelector("#answerThreeIcon");
let answerFourIcon = document.querySelector("#answerFourIcon");
let answerFiveIcon = document.querySelector("#answerFiveIcon");
let congratsMessage = document.querySelector("#congrats");
let timesTakenSpan = document.querySelector("#timesTaken");

// load quiz taken count from localStorage
let quizTimes = localStorage.getItem('quizTimes');
if (quizTimes === null) {
  quizTimes = 0;
} else {
  quizTimes = parseInt(quizTimes);
}
timesTakenSpan.textContent = quizTimes;
submitBtn.addEventListener("click", function() {
  score = 0; // reset score each time
  // question 1
  let answer1 = document.querySelector("#answerOne").value.toLowerCase().trim();
  if (answer1 === "elephant") {
    answerOneMessage.textContent = "Correct!";
    answerOneMessage.style.color = "green";
    answerOneIcon.src = "correct.png";
    answerOneIcon.style.display = "inline";
    score += 20;
  } else {
    answerOneMessage.textContent = "wrong";
    answerOneMessage.style.color = "red";
    answerOneIcon.src = "incorrect.png";
    answerOneIcon.style.display = "inline";
  }
  // question 2
  let answerTwo = document.querySelector("input[name=colors]:checked");
  let color = "red";
  if (answerTwo) {
    color = answerTwo.value;
  }
  if (color === "green") {
    answerTwoMessage.textContent = "Correct!";
    answerTwoMessage.style.color = "green";
    answerTwoIcon.src = "correct.png";
    answerTwoIcon.style.display = "inline";
    score += 20;
  } else {
    answerTwoMessage.textContent = "wrong";
    answerTwoMessage.style.color = "red";
    answerTwoIcon.src = "incorrect.png";
    answerTwoIcon.style.display = "inline";
  }
  // question 3
  let answerThree = document.querySelector("#answerThree").value.trim();
  if (answerThree === "blue") {
    answerThreeMessage.textContent = "Correct!";
    answerThreeMessage.style.color = "green";
    answerThreeIcon.src = "correct.png";
    answerThreeIcon.style.display = "inline";
    score += 20;
  } else {
    answerThreeMessage.textContent = "wrong";
    answerThreeMessage.style.color = "red";
    answerThreeIcon.src = "incorrect.png";
    answerThreeIcon.style.display = "inline";
  }
  // question 4
  let answerFour = parseFloat(document.querySelector("#answerFour").value);
  if (answerFour === 3.14) {
    answerFourMessage.textContent = "Correct!";
    answerFourMessage.style.color = "green";
    answerFourIcon.src = "correct.png";
    answerFourIcon.style.display = "inline";
    score += 20;
  } else {
    answerFourMessage.textContent = "wrong";
    answerFourMessage.style.color = "red";
    answerFourIcon.src = "incorrect.png";
    answerFourIcon.style.display = "inline";
  }
  // question 5
  let checkedAnimals = document.querySelectorAll("input[name=animals]:checked");
  let selectedValues = Array.from(checkedAnimals).map(checkbox => checkbox.value);
  let dog = false;
  let cat = false;
  let cow = false;
  for (let i = 0; i < selectedValues.length; ++i) {
    if (selectedValues[i] == "dog") {
      dog = true;
    }
    if (selectedValues[i] == "cat") {
      cat = true;
    }
    if (selectedValues[i] == "cow") {
      cow = true;
    }
  }
  if (cat && dog && !cow) {
    answerFiveMessage.textContent = "Correct!";
    answerFiveMessage.style.color = "green";
    answerFiveIcon.src = "./correct.png";
    answerFiveIcon.style.display = "inline";
    score += 20;
  } else {
    answerFiveMessage.textContent = "wrong";
    answerFiveMessage.style.color = "red";
    answerFiveIcon.src = "./incorrect.png";
    answerFiveIcon.style.display = "inline";
  }
  document.querySelector("#score").textContent = score + "/" + 80;
  if (score >= 80) { // congratulatory message
    congratsMessage.textContent = "Congratulations! You scored high!";
    congratsMessage.style.color = "green";
  } else {
    congratsMessage.textContent = "";
  }
  quizTimes = quizTimes + 1;  // update quiz taken count
  localStorage.setItem('quizTimes', quizTimes);
  timesTakenSpan.textContent = " " + quizTimes + " ";
});