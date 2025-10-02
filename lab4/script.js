let zipCode = document.querySelector("#zipInput");
zipCode.addEventListener("input", zipInput);

let password = document.querySelector("#passwordInput");
password.addEventListener("input", suggestPass);

let usernameInput = document.querySelector("#usernameInput");
usernameInput.addEventListener("input", checkAvailableUsername);

let statesSelect = document.querySelector("#statesSelect");
statesSelect.addEventListener("change", handleStateSelect);

let countySelect = document.querySelector("#selectCounty"); // Changed from #countySelect to #selectCounty

let state;

async function setUpFrom() {
  try {
    let statesResponse = await fetch("https://csumb.space/api/allStatesAPI.php");
    if (!statesResponse.ok) {
      throw new Error("response failed");
    }
    let stateData = await statesResponse.json();
    console.log(stateData);
    for (let state of stateData) {
      let stateOption = document.createElement("option");
      stateOption.id = state.usps;
      stateOption.value = state.usps;
      stateOption.textContent = state.state;
      statesSelect.appendChild(stateOption);
    }
  } catch (error) {
    console.log(error);
  }
}

async function zipInput() {
  try {
    let input = zipCode.value;
    if (input.length == 5) {
      let zipResponse = await fetch("https://csumb.space/api/cityInfoAPI.php?zip=" + input);
      if (!zipResponse.ok) {
        throw new Error("response failed");
      }
      let zipData = await zipResponse.json();
      if (zipData == false) {
        document.querySelector("#city").style.color = "red";
        document.querySelector("#city").textContent = "Zip code not found";
        document.querySelector("#latitude").textContent = "";
        document.querySelector("#longitude").textContent = ""; 
      } else {
        document.querySelector("#city").textContent =  "City: " + zipData.city;
        document.querySelector("#latitude").textContent = "Latitude: " + zipData.latitude;
        document.querySelector("#longitude").textContent = "Longitude: " + zipData.longitude;      
      }
      // console.log(zipData);
      // state = zipData.state;
      // console.log(state);
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleStateSelect() {
  var st = statesSelect.value;
  console.log(st);
  // Clear all options and add back the default option
  countySelect.innerHTML = "<option>select one</option>";
  let countyResponse = await fetch("https://csumb.space/api/countyListAPI.php?state=" + st);
  let countyData = await countyResponse.json();
  // console.log(countyData);
  for (let county of countyData) {
    let countyOption = document.createElement("option");
    countyOption.textContent = county.county;
    countySelect.appendChild(countyOption);
  }
}

async function suggestPass() {
  try {
    let suggestResponse = await fetch("https://csumb.space/api/suggestedPassword.php?length=8");
    if (!suggestResponse.ok) {
      throw new Error("response failed");
    }
    let suggestedPasswordData = await suggestResponse.json();
    document.querySelector("#suggestedPass").textContent = "suggested password: " + suggestedPasswordData.password;
  } catch (error) {
    console.log(error);
  }
}

function checkAvailableUsername() {
  try {
    let username = usernameInput.value;
    if ((username == "eeny") || (username == "meeny") || (username == "miny") || (username == "maria")) {
      document.querySelector("#usernameMessage").textContent = "Username in use: unavailable try another...";
    }
  } catch (error) {
    console.log(error);
  }
}

setUpFrom();