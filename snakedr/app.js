let offsetFromDate = new Date(2021, 0, 1);
let msOffset = Date.now() - offsetFromDate;
let dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24);

let date = new Date();
let dateFormatted = date.toLocaleDateString("en-US");

let myrng = new Math.seedrandom(dayOffset);

let cons = "nnnnnnrrrrrrttttttllllssssddddgggbbccmmppffhhvvwwyyk";
let vwls = "eeeeeeeeeeeeaaaaaaaaaiiiiiiiiioooooooouuuu";
let consvwls = cons + vwls;
let lettersArray = consvwls.split("");
let allLetters = shuffle(lettersArray);

let startingLetters = "bcdfghjklmnpqrstvw";
let hammerContainer = document.getElementById("hammercount");
let lettersLeft = document.getElementById("letters-left");
let hammercount = 3;
let scoreContainer = document.getElementById("scorecount");
let score = 0;
let longestWords = [];
let submitBtn = document.getElementById("submit");
let shareBtn = document.getElementById("copy");
let tiles = Array.from(document.getElementsByClassName("tile"));
let alertcontainer = document.querySelector(".alert");
let starter = [];
let avail = [];
let current = starter;
let choiceTile = Array.from(document.getElementsByClassName("ctile"));
let numChoice = 7;
let starterLength = 4;

function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(myrng() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function randomLetter(src) {
  let randomLetter = src[Math.floor(myrng() * src.length)];
  return randomLetter;
}

function init() {
  hammercount = 3;
  score = 0;
  allLetters = shuffle(lettersArray);
  shareBtn.style.display = "none";
  submitBtn.style.display = "block";

  //push letters into starting positions
  for (let i = 0; i < starterLength; i++) {
    starter.push(randomLetter(startingLetters));
  }
  for (let i = 0; i < choiceTile.length; i++) {
    avail.push(allLetters.pop());
  }

  startInteraction();
  draw(starter);
  renderChoices(avail);
  getFirstEmpty();
}

function getFirstEmpty() {
  //clear all blinkers
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].classList.remove("blinker");
  }
  let firstEmpty = document.querySelector(".tile:empty");
  firstEmpty.classList.add("blinker");
}

function startInteraction() {
  for (let i = 0; i < numChoice; i++) {
    choiceTile[i].addEventListener("click", clickTile);
  }
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener("click", deleteLetter);
  }
  submitBtn.addEventListener("click", submit);
}

function stopInteraction() {
  for (let i = 0; i < numChoice; i++) {
    choiceTile[i].removeEventListener("click", clickTile);
  }
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].removeEventListener("click", deleteLetter);
  }
}

function deleteLetter(e) {
  if (hammercount > 0 && current.length > 3) {
    hammercount--;
    current.splice(tiles.indexOf(e.target), 1);
    draw(current);
  } else if (hammercount <= 0) {
    alert("No pills left, make some longer words");
  } else {
    alert("Not enough letters in snake for a pill");
  }
}

function draw(arr) {
  //clear all tiles
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].textContent = "";
  }

  //draw tiles
  if (arr.length <= tiles.length) {
    for (let i = 0; i < arr.length; i++) {
      tiles[i].textContent = arr[i];
    }
    if (arr.length === 10) {
      alert("Remember to use your hammer!");
    }
  }
  getFirstEmpty();

  hammerContainer.textContent = hammercount;
  scoreContainer.textContent = score + allLetters.length;
  lettersLeft.textContent = allLetters.length;
}

function renderChoices() {
  for (let i = 0; i < avail.length; i++) {
    choiceTile[i].textContent = avail[i];
  }
}

function clickTile(e) {
  alert("");
  let clickedLetter = e.target.textContent;
  current.push(clickedLetter);
  //remove clicked letter from available
  avail.splice(choiceTile.indexOf(e.target), 1);
  avail.push(allLetters.pop());
  changeColor();
  checkLoss();
  renderChoices();
  draw(current);
  if (current.length === 10) {
    alert("Remember to use your hammer!");
  }
}

function submit() {
  let submission = current.join("");

  for (let i = submission.length - 1; i >= 2; i--) {
    if (dict.includes(submission)) {
      console.log(submission, "word found");
      longestWords.push(submission);
      longestWords.sort(function (a, b) {
        return b.length - a.length;
      });

      for (
        let i = current.length - submission.length;
        i < current.length;
        i++
      ) {
        tiles[i].classList.add("wordfound");
      }
      switch (submission.length) {
        case 3:
          alert(`You did not score with ${submission.toUpperCase()}`);
          break;
        case 4:
          score += 4;
          alert(`You scored 4 points with ${submission.toUpperCase()}`);
          break;
        case 5:
          score += 7;
          hammercount++;
          alert(`You scored 7 points with ${submission.toUpperCase()}`);
          break;
        case 6:
          score += 10;
          hammercount++;
          alert(`You scored 10 points with ${submission.toUpperCase()}`);
          break;
        case 7:
          score += 15;
          hammercount++;
          alert(`You scored 15 points with ${submission.toUpperCase()}`);
          break;
        case 8:
          score += 20;
          hammercount++;
          alert(`You scored 20 points with ${submission.toUpperCase()}`);
          break;
        case 9:
          score += 30;
          hammercount++;
          alert(`You scored 30 points with ${submission.toUpperCase()}`);
          break;
        case 10:
          score += 40;
          hammercount++;
          alert(`You scored 40 points with ${submission.toUpperCase()}`);
          break;
        default:
          break;
      }

      //animate the word going away
      for (let i = 0; i < submission.length; i++) {
        setTimeout(function () {
          current.splice(-1);
          draw(current);
          changeColor();
        }, 300 + i * 200);
        setTimeout(function () {
          checkWin();
        }, 300 + i * 200);
      }
      setTimeout(function () {
        for (let i = 0; i < tiles.length; i++) {
          tiles[i].classList.remove("wordfound");
        }
      }, 300 + submission.length * 200);

      break;
    } else {
      submission = submission.substring(1);
      if (i === 2) {
        alert("No word found");
      }
    }
  }
  checkLoss();

  // draw(current);
}

function checkWin() {
  let finalScore = score + allLetters.length;
  if (current.length === 0) {
    if (finalScore < 70) {
      alert(
        `You saved the snake, but barely. Your longest words are: ${longestWords[0]}, ${longestWords[1]}, and ${longestWords[2]}`
      );
    } else if (finalScore >= 70 && finalScore < 80) {
      alert(
        `You win, but could definitely do better. Your longest words are: ${longestWords[0]}, ${longestWords[1]}, and ${longestWords[2]}`
      );
    } else if (finalScore >= 80 && finalScore < 90) {
      alert(
        `Good Job! You're perfectly average. Your longest words are: ${longestWords[0]}, ${longestWords[1]}, and ${longestWords[2]}`
      );
    } else if (finalScore >= 90 && finalScore < 100) {
      alert(
        `Amazing, Your longest words are: ${longestWords[0]}, ${longestWords[1]}, and ${longestWords[2]}`
      );
    } else {
      alert(
        `You are a word genius! Your longest words are: ${longestWords[0]}, ${longestWords[1]}, and ${longestWords[2]}`
      );
    }

    for (let i = 0; i < tiles.length; i++) {
      tiles[i].classList.remove("blinker");
      setTimeout(function () {
        tiles[i].classList.add("win");
      }, i * 150);
    }
    //turn on the sharing button
    submitBtn.style.display = "none";
    shareBtn.style.display = "block";
    shareBtn.addEventListener("click", shareScore);

    stopInteraction();
  }
}
function shareScore() {
  navigator.clipboard
    .writeText(
      `${dateFormatted} \n I scored ${
        score + allLetters.length
      } on Snake Doctor \n Longest word is ${longestWords[0]}`
    )
    .then(
      function () {
        /* clipboard successfully set */
        alert("Score copied");
        console.log("score copied");
      },
      function (err) {
        /* clipboard write failed */
        alert("Error, score not copied");
        console.log(err);
      }
    );
}

function checkLoss() {
  if (current.length > tiles.length) {
    alert("You killed the snake... Try Again!");
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].classList.remove("blinker");
      setTimeout(function () {
        tiles[i].classList.add("lose");
      }, i * 150);
    }
    stopInteraction();
    submitBtn.style.display = "none";
  }
}

function changeColor() {
  let snakecolor;
  if (current.length >= 0 && current.length < 5) {
    snakecolor = "#76b043";
  } else if (current.length >= 5 && current.length < 7) {
    snakecolor = "#e6ce35";
  } else if (current.length >= 7 && current.length < 9) {
    snakecolor = "#d48928";
  } else {
    snakecolor = "var(--losecolor)";
  }
  let root = document.querySelector(":root");
  root.style.setProperty("--snakecolor", snakecolor);
}
function alert(txt) {
  alertcontainer.textContent = txt;
}

init();

//show and hide instructions
let introBtn = document.querySelector("#introbtn");
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
