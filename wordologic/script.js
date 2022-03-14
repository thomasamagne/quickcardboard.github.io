
//initialize global variables
let guessGrid = document.querySelector("[data-guessgrid]");
let tileList = document.getElementsByClassName("tile");
let allGuess = [];
let guessCount = 0;
let guessBtn = document.getElementsByClassName("guess-count");
let clueContainer = document.getElementsByClassName("clue-container");
let alertContainer = document.querySelector(".alert-container");
let shareBtn = document.querySelector("#share");
let noteContent = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
];
let noteList = document.getElementsByClassName("note");
let keyList = document.getElementsByClassName("key");
let lockmodeChecked = document.querySelector("#lockmode");
let currentGuess = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];
let lockedGuess = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];
let guessWithLock = null;
let currentSelection = document.querySelector('[data-selection="true"]').dataset
  .index;
let currentGuessBtn = document.querySelector('[data-state="current"]').dataset
  .index;

//initialize answer based on date
let offsetFromDate = new Date(2021, 0, 1);
let msOffset = Date.now() - offsetFromDate;
let dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24);

let myrng = new Math.seedrandom(dayOffset);
let myrngStr = myrng().toString();

const word1 = dict[parseInt(myrngStr[2] + myrngStr[6] + myrngStr[10])];
const word2 = dict[parseInt(myrngStr[3] + myrngStr[7] + myrngStr[11])];
const word3 = dict[parseInt(myrngStr[4] + myrngStr[8] + myrngStr[12])];
const word4 = dict[parseInt(myrngStr[5] + myrngStr[9] + myrngStr[13])];

let answer = word1 + word2 + word3 + word4;
let answerParsed = parseWords(answer);

function parseWords(words) {
  let parsedWord = [[], [], [], [], [], [], [], []];
  parsedWord[0] = words[0] + words[4] + words[8] + words[12];
  parsedWord[1] = words[1] + words[5] + words[9] + words[13];
  parsedWord[2] = words[2] + words[6] + words[10] + words[14];
  parsedWord[3] = words[3] + words[7] + words[11] + words[15];
  parsedWord[4] = words.slice(0, 4);
  parsedWord[5] = words.slice(4, 8);
  parsedWord[6] = words.slice(8, 12);
  parsedWord[7] = words.slice(12, 16);

  return parsedWord;
}

function startInteraction() {
  lockmodeChecked.disabled = "true";
  //add event listener to all tiles to select
  for (let i = 0; i < tileList.length; i++) {
    tileList[i].addEventListener("click", makeActive);
    tileList[i].dataset.index = i;
  }
  //handle keyboard and mouse entry
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
  guessBtn[0].addEventListener("click", toggleGuessBtn);
  //add event listener to all guess-count-containers
  //   for (let i = 0; i < guessBtn.length; i++) {
  //     guessBtn[i].dataset.index = i;
  //     guessBtn[i].addEventListener("click", toggleGuessBtn);
  //   }
}
function stopInteraction() {
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);
}

startInteraction();
initializeCheckBox();

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }
  if (e.target.matches("[data-enter]")) {
    submitGuess(guessCount);
    return;
  }
  if (e.target.matches("[data-delete]")) {
    deleteKey();
    return;
  }
}
function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess(guessCount);
    return;
  }
  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }
  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key);
    return;
  }
}
function pressKey(key) {
  let currentSelection = document.querySelector('[data-selection="true"]')
    .dataset.guesscount;
  let currentGuessBtn = document.querySelector('[data-state="current"]').dataset
    .guesscount;
  if (currentSelection == currentGuessBtn) {
    //find the active tile
    let currentTile = document.querySelector('.tile[data-state="active"]');
    //enter the letter
    currentTile.textContent = key.toLowerCase();
    saveCurrent();
    //animate tile
    currentTile.setAttribute("data-new", "");
    setTimeout(function () {
      currentTile.removeAttribute("data-new");
    }, 100);
    //move the active tile
    if (currentTile.dataset.index < 15) {
      currentTile.dataset.state = "";
      let nextAvailable = getNextSibling(currentTile, ":not(.highlight)");
      nextAvailable.dataset.state = "active";
      renderKeys(nextAvailable.dataset.index);
    } else {
      currentTile.dataset.state = "active";
    }
  } else {
    //start note taking mode
    // for (let i = 0; i < tileList.length; i++) {
    //   //enter letter into active tiles
    //   if (tileList[i].dataset.state == "active") {
    //     //if the letter is not in notes, add it. If it's already in the notes, remove it
    //     if (!noteList[i].textContent.includes(key)) {
    //       noteList[i].textContent += key;
    //       noteList[i].textContent = noteList[i].textContent
    //         .split("")
    //         .sort()
    //         .join("");
    //     } else {
    //       noteList[i].textContent = noteList[i].textContent.replace(key, "");
    //     }
    //   }
    // }
    enterNote(key)
  }
}

function enterNote(key) {
  let numIncludes = 0; 
  let activeIndex = []
  let toAdd = []
  //get indexes of selected tiles
  for (let i = 0; i< tileList.length; i++) {
    if (tileList[i].dataset.state == 'active') {
      activeIndex.push(i)
    }
  }
  //check if all the tiles have letter, if not, get the tiles without
  for (let i = 0; i< activeIndex.length; i++) {
    if (noteList[activeIndex[i]].textContent.includes(key)) {
      numIncludes ++
    } else {
      toAdd.push(activeIndex[i])
    }
  }
  // console.log("numIncludes", numIncludes)
  // console.log("activeIndex", activeIndex)
  // console.log("toAdd", toAdd)
  //if all the tiles have it, remove the letter, otherwise add it to the one without
  if (numIncludes == 0) {
    //if none includes the letter
    for (let i = 0; i< activeIndex.length; i++) {
      noteList[activeIndex[i]].textContent += key
      noteList[activeIndex[i]].textContent = noteList[activeIndex[i]].textContent.split('').sort().join('')
    }
  } else if (numIncludes == activeIndex.length) {
    //if all includes the letter
    for (let i = 0; i<activeIndex.length; i++) {
      noteList[activeIndex[i]].textContent = noteList[activeIndex[i]].textContent.replace(key, "")
    }
  } else {
    for (let i = 0; i< toAdd.length; i++) {
      //if some includes the letter
      noteList[toAdd[i]].textContent += key
      noteList[toAdd[i]].textContent = noteList[toAdd[i]].textContent.split('').sort().join('')
    }
  }
}

//functions for selecting cells without highlights
function getNextSibling(elem, selector) {
  // Get the next sibling element
  var sibling = elem.nextElementSibling;

  // If there's no selector, return the first sibling

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }
}
function getPreviousSibling(elem, selector) {
  // Get the next sibling element
  var sibling = elem.previousElementSibling;

  // If there's no selector, return the first sibling

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }
}

function deleteKey() {
  let currentSelection = document.querySelector('[data-selection="true"]')
    .dataset.guesscount;
  let currentGuessBtn = document.querySelector('[data-state="current"]').dataset
    .guesscount;
  //check current selection is the current guess

  if (currentSelection == currentGuessBtn) {
    let currentTile = document.querySelector('[data-state="active"]');
    currentTile.textContent = "";
    if (currentTile.dataset.index > 0) {
      currentTile.dataset.state = "inactive";
      let firstAvailable = getPreviousSibling(currentTile, ":not(.highlight)");
      firstAvailable.dataset.state = "active";
      renderKeys(firstAvailable.dataset.index);
    }
  }
  saveCurrent();
}

function submitGuess(gc) {
  let currentSelection = document.querySelector('[data-selection="true"]')
    .dataset.guesscount;
  let currentGuessBtn = document.querySelector('[data-state="current"]').dataset
    .guesscount;
  //check current selection is the current guess

  if (currentSelection == currentGuessBtn) {
    //check win
    if (saveCurrent() === answer) {
      alert("You got it in " + (guessCount + 1) + " guesses!", true);
      stopInteraction();
      for (let i = 0; i < guessBtn.length; i++) {
        guessBtn[i].removeEventListener("click", toggleGuessBtn);
      }
      //win animation
      var interval = 100;
      for (let i = 0; i < tileList.length; i++) {
        setTimeout(function () {
          tileList[i].classList.add("win");
        }, i * interval);
      }
    }
    //check valid
    if (checkValid()) {
      allGuess.push(saveCurrent());
      renderClues(gc);
      makeInactive();
      lockmodeChecked.disabled = false;
      //remove highlights in tiles for lock
      for (let i = 0; i < tileList.length; i++) {
        tileList[i].classList.remove("highlight");
      }
      //activate next guess button
      currentGuess = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ];
      guessBtn[gc].dataset.state = "read";
      guessBtn[gc + 1].dataset.state = "current";
      guessCount++;
      guessBtn[guessCount].addEventListener("click", toggleGuessBtn);
      //clear key highlight
      for (let i = 0; i < keyList.length; i++) {
        keyList[i].classList.remove("keyh");
      }
    } else {
      checkValid();
    }
    //check loss
    if (guessCount > 9 && saveCurrent() != answer) {
      alert(
        "Nice try, but the answer was " +
          word1 +
          ", " +
          word2 +
          ", " +
          word3 +
          ", and " +
          word4,
        true
      );
    }
  }
}

function initializeCheckBox() {
  lockmodeChecked.addEventListener("change", function () {
    let currentSelection = document.querySelector('[data-selection="true"]');
    if (lockmodeChecked.checked) {
      lockCells();
      makeInactive();
      guessWithLock = currentSelection.dataset.guesscount;
      currentSelection.dataset.lock = "true";
    } else {
      lockedGuess = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ];
      for (let i = 0; i < tileList.length; i++) {
        tileList[i].classList.remove("highlight");
      }
      for (let i = 0; i < guessBtn.length; i++) {
        guessBtn[i].dataset.lock = "false";
      }
      guessWithLock = null;
      makeInactive();
    }
  });
}

//saves the current text content
function saveCurrent() {
  for (let i = 0; i < 16; i++) {
    if (tileList[i].textContent != "") {
      currentGuess[i] = tileList[i].textContent;
    } else {
      currentGuess[i] = null;
    }
  }
  return currentGuess.join("");
}

//handle guess btn presses
function toggleGuessBtn(e) {
  //disable other selections
  for (let i = 0; i < guessBtn.length; i++) {
    guessBtn[i].dataset.selection = "false";
  }
  if (e.target.dataset.state != "inactive") {
    e.target.dataset.selection = "true";
  }
  //render highlighting of locked cells
  if (
    e.target.dataset.guesscount == guessWithLock ||
    e.target.dataset.state == "current"
  ) {
    for (let i = 0; i < tileList.length; i++) {
      if (lockedGuess[i] != null) {
        tileList[i].classList.add("highlight");
      }
    }
  } else {
    for (let i = 0; i < tileList.length; i++) {
      tileList[i].classList.remove("highlight");
    }
  }

  //render clues and tiles
  if (e.target.dataset.state == "read") {
    lockmodeChecked.disabled = false;
    clearGrid();
    makeInactive();
    //clear key highlight
    for (let i = 0; i < keyList.length; i++) {
      keyList[i].classList.remove("keyh");
    }
    renderTiles(e.target.dataset.guesscount);
    renderClues(e.target.dataset.guesscount);
  } else if (e.target.dataset.state == "current") {
    lockmodeChecked.disabled = true;
    makeInactive();
    clearGrid();
    //render locked guess
    for (let i = 0; i < tileList.length; i++) {
      tileList[i].textContent = lockedGuess[i];
      if (tileList[i].textContent != "") {
      }
    }

    //render current guess
    for (let i = 0; i < tileList.length; i++) {
      //merge with locked guess
      if (tileList[i].textContent == "") {
        tileList[i].textContent = currentGuess[i];
      }
    }
    //select first available tile \
    let firstAvail = document.querySelector(".tile:empty");
    firstAvail.dataset.state = "active";
  }
}

//Click tile to make active
function makeActive(e) {
  let currentSelection = document.querySelector('[data-selection="true"]')
    .dataset.guesscount;
  let currentGuessBtn = document.querySelector('[data-state="current"]').dataset
    .guesscount;
  if (currentSelection == currentGuessBtn) {
    makeInactive();
    renderKeys(e.target.dataset.index);
    //if it is not locked, then allow selection of tile
    if (!e.currentTarget.classList.contains("highlight")) {
      e.currentTarget.dataset.state = "active";
    }
  } else {
    if (e.currentTarget.dataset.state == "active") {
      for (let i = 0; i < tileList.length; i++) {
        tileList[i].dataset.state = "";
      }
    } else {
      e.currentTarget.dataset.state = "active";
    }
  }
}
function makeInactive() {
  for (let i = 0; i < tileList.length; i++) {
    tileList[i].dataset.state = "";
  }
}

// render tiles
function renderTiles(gc) {
  for (let i = 0; i < tileList.length; i++) {
    tileList[i].textContent = allGuess[gc][i];
  }
}

//render clues
function renderClues(gc) {
  let guessParsed = parseWords(allGuess[gc]);
  //loop through all 8 clues
  for (let i = 0; i < guessParsed.length; i++) {
    let clueArray = [];
    let workingGuessParsed = guessParsed[i];
    let workingAnswerParsed = answerParsed[i];
    //check for exact matches, remove letters from exact matches
    for (let j = 0; j < workingGuessParsed.length; j++) {
      if (workingGuessParsed[j] === workingAnswerParsed[j]) {
        clueArray.push(2);

        workingGuessParsed =
          workingGuessParsed.substring(0, j) +
          workingGuessParsed.substring(j + 1, workingGuessParsed.length);
        workingAnswerParsed =
          workingAnswerParsed.substring(0, j) +
          workingAnswerParsed.substring(j + 1, workingAnswerParsed.length);
        j = -1;
        continue;
      }
    }
    //check for right letter wrong position from the left overs
    for (let j = 0; j < workingGuessParsed.length; j++) {
      if (workingAnswerParsed.includes(workingGuessParsed[j])) {
        clueArray.push(1);
        let index = workingAnswerParsed.indexOf(workingGuessParsed[j]);
        workingAnswerParsed = workingAnswerParsed.replace(workingAnswerParsed[index], '');
      }
    }
    //draw out the clues based on clueArray
    for (let j = 0; j < clueArray.length; j++) {
      let clueCell = document.createElement("div");
      clueCell.classList.add("clue");
      clueContainer[i].append(clueCell);
      if (clueArray[j] == 2) {
        clueCell.dataset.state = "correct";
      } else if (clueArray[j] == 1) {
        clueCell.dataset.state = "wrong-position";
      }
    }
  }
}
// Check if all tiles are filled out
function checkValid() {
  let currentGuess = "";
  for (let i = 0; i < tileList.length; i++) {
    currentGuess = currentGuess + tileList[i].textContent;
  }
  let w1 = currentGuess.slice(0, 4);
  let w2 = currentGuess.slice(4, 8);
  let w3 = currentGuess.slice(8, 12);
  let w4 = currentGuess.slice(12, 16);

  if (currentGuess.length < 16) {
    alert("Incomplete submission");
  } else if (!allowedWords.includes(w1)) {
    //check if the words are in allowed words
    alert(`${w1.toUpperCase()} is not a word in the list`);
  } else if (!allowedWords.includes(w2)) {
    //check if the words are in allowed words
    alert(`${w2.toUpperCase()} is not a word in the list`);
  } else if (!allowedWords.includes(w3)) {
    //check if the words are in allowed words
    alert(`${w3.toUpperCase()} is not a word in the list`);
  } else if (!allowedWords.includes(w4)) {
    //check if the words are in allowed words
    alert(`${w4.toUpperCase()} is not a word in the list`);
  } else {
    return true;
  }
}
//alert box
function alert(text, gameOver) {
  alertContainer.classList.add("show");
  alertContainer.textContent = text;
  if (gameOver != true) {
    setTimeout(function () {
      alertContainer.classList.remove("show");
    }, 2000);
  }
}
//highlight to lock tiles
function lockCells() {
  let currentSelection = document.querySelector('[data-selection="true"]')
    .dataset.guesscount;
  let currentGuessBtn = document.querySelector('[data-state="current"]').dataset
    .guesscount;

  if (currentSelection != currentGuessBtn) {
    let selectedCells = document.querySelectorAll(
      '.tile[data-state = "active"]'
    );
    for (let i = 0; i < selectedCells.length; i++) {
      selectedCells[i].classList.add("highlight");
    }
    for (let i = 0; i < tileList.length; i++) {
      if (tileList[i].matches(".highlight")) {
        lockedGuess[i] = tileList[i].textContent;
      } else {
        lockedGuess[i] = null;
      }
    }
  }
}
//clear all
function clearGrid() {
  for (let i = 0; i < tileList.length; i++) {
    tileList[i].textContent = "";
  }
  //clear all child elements from clue container
  for (let i = 0; i < clueContainer.length; i++) {
    while (clueContainer[i].firstChild) {
      clueContainer[i].removeChild(clueContainer[i].firstChild);
    }
  }
}

//highlight keys with notes
function renderKeys(e) {
  for (let i = 0; i < keyList.length; i++) {
    keyList[i].classList.remove("keyh");
  }
  let letters = noteList[e].textContent;
  for (let i = 0; i < keyList.length; i++) {
    if (letters.includes(keyList[i].dataset.key.toLowerCase())) {
      keyList[i].classList.add("keyh");
    }
  }
}

//show and hide instructions
let introBtn = document.querySelector(".introbtn");
let instructions = document.querySelector("#instructions");
let closeInstructionBtn = document.querySelector("#closeinstruction");
introBtn.addEventListener("click", showInstruction);
closeInstructionBtn.addEventListener("click", closeInstruction);

function showInstruction() {
  instructions.style.display = "block";
}
function closeInstruction() {
  instructions.style.display = "none";
}
