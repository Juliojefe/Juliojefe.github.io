let score = 0;
let questions = 4;
let submitBtn = document.querySelector("#submit");
let answerOneMessage = document.querySelector("#answerOneMessage");
let answerTwoMessage = document.querySelector("#answerTwoMessage");
let answerThreeMessage = document.querySelector("#answerThreeMessage");
let answerFourMessage = document.querySelector("#answerFourMessage");
let answerFiveMessage = document.querySelector("#answerFiveMessage");

submitBtn.addEventListener("click", function() {
  let answer1 = document.querySelector("#answerOne").value;
  if (answer1 === "elephant") {
    answerOneMessage.textContent = "Correct!";
    score += 20;
  } else {
    answerOneMessage.textContent = "wrong";
  }

  let answerTwo = document.querySelector("input[name=colors]:checked");
  let color = "red";
  if (answerTwo) {
    color = answerTwo.value;
  }
  if (color === "green") {
    answerTwoMessage.textContent = "Correct!";
    score += 20;
  } else {
    answerTwoMessage.textContent = "wrong";
  }

  let answerThree = document.querySelector("#answerThree").value;
  if (answerThree === "blue") {
    answerThreeMessage.textContent = "Correct!";
    score += 20;
  } else {
    answerThreeMessage.textContent = "wrong";
  }

  let answerFour = parseFloat(document.querySelector("#answerFour").value);
  if (answerFour === 3.14) {
    answerFourMessage.textContent = "Correct!";
    score += 20;
  } else {
    answerFourMessage.textContent = "wrong";
  }

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
    score += 20;
  } else {
    answerFiveMessage.textContent = "wrong";
  }

  document.querySelector("#score").textContent = score + "/" + questions * 20;
});