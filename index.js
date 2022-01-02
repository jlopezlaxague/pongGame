// Global variables
const court = document.getElementById("court");
const left = document.getElementById("left");
const right = document.getElementById("right");
const ball = document.getElementById("ball");
const rightScore = document.getElementById("rightScore");
const leftScore = document.getElementById("leftScore");
const courtHeigth = court.clientHeight;
const courtWidth = court.clientWidth;
const playerWidht = right.offsetWidth;
const playerHeigth = right.offsetHeight;
const ballSize = ball.offsetWidth;
const hBallStep = 4;
const vBallStep = hBallStep / 3;
const ballTime = 2;
const playersTime = ballTime * 2;
const hard = 0.018;
let computerInterval;
let ballInterval;
let playerInterval;
let stillPlaying = true;

const start = function () {
  console.log("restart");
  right.style.left = `${courtWidth - 2 * playerWidht - ballSize}px`;
  right.style.top = `${courtHeigth / 2 - playerHeigth / 2}px`;
  left.style.top = `${courtHeigth / 2 - playerHeigth / 2}px`;
  ball.style.top = `${Math.round(Math.random() * courtHeigth)}px`;
  ball.style.left = `${20}px`;
  stillPlaying = true;
  keyPressed = "";
  ballStepper();
  document.addEventListener("keydown", setKeyPressed);
  document.addEventListener("keyup", setKeyPressed);
  playerInterval = setInterval(humanPlayer, playersTime);
  computerPlayer();
};

const ballStepper = function () {
  let hSense = 1;
  let vSense = 1;
  const hMin = 0;
  const hMax = courtWidth - ballSize - 2 * playerWidht;
  const vMin = 0;
  const vMax = courtHeigth - ballSize;

  ballInterval = setInterval(async function () {
    let initTop = Math.abs(parseInt(ball.style.top.slice(0, -2)));
    let initLeft = Math.abs(parseInt(ball.style.left.slice(0, -2)));
    let vRightMin = Math.abs(parseInt(right.style.top.slice(0, -2)));
    let vRightMax = Math.abs(parseInt(right.style.top.slice(0, -2))) + playerHeigth;
    let vLeftMin = Math.abs(parseInt(left.style.top.slice(0, -2)));
    let vLeftMax = Math.abs(parseInt(left.style.top.slice(0, -2))) + playerHeigth;

    // Point
    if (initLeft > hMax && (initTop + ballSize < vRightMin || initTop > vRightMax)) {
      return await score("left");
    }
    if (initLeft < hMin && (initTop + ballSize < vLeftMin || initTop > vLeftMax)) {
      return await score("right");
    }

    // Heat or court limits
    if (stillPlaying) {
      if (
        (initLeft <= hMin || initLeft >= hMax) &&
        (initLeft - hSense * hBallStep > hMin || initLeft - hSense * hBallStep < hMax)
      ) {
        hSense = -hSense;
      }
      if (initTop <= vMin || initTop >= vMax) {
        vSense = -vSense;
      }
      if (initTop + vSense * vBallStep <= vMin) {
        ball.style.top = `${vMin}px`;
      } else if (initTop + vSense * vBallStep >= vMax) {
        ball.style.top = `${vMax}px`;
      } else {
        ball.style.top = `${initTop + vSense * vBallStep}px`;
        ball.style.left = `${initLeft + hSense * hBallStep}px`;
      }
    }
  }, ballTime);
};

const humanPlayer = function (event) {
  if (keyPressed == "ArrowUp" || keyPressed == "ArrowDown") {
    const playerStep = 2;
    const topInit = Math.abs(parseInt(right.style.top.slice(0, -2)));
    let sense = 1;
    if (keyPressed == "ArrowUp") {
      sense = -1;
    }
    let stepLength = topInit + sense * playerStep;
    if (stepLength < 0) {
      right.style.top = `${0}px`;
    } else if (stepLength > courtHeigth - playerHeigth) {
      right.style.top = `${courtHeigth - playerHeigth}px`;
    } else if (stepLength >= 0 || stepLength <= courtHeigth - playerHeigth) {
      right.style.top = `${stepLength}px`;
    }
  }
};

const computerPlayer = function () {
  let stepLength;
  computerInterval = setInterval(() => {
    let topInit = Math.abs(parseInt(left.style.top.slice(0, -2)));
    let ballTop = Math.abs(parseInt(ball.style.top.slice(0, -2)));

    stepLength = (ballTop - playerHeigth / 2 - topInit) * hard + topInit;

    if (stepLength < 0) {
      left.style.top = `${0}px`;
    } else if (stepLength > courtHeigth - playerHeigth) {
      left.style.top = `${courtHeigth - playerHeigth}px`;
    } else if (stepLength >= 0 || stepLength <= courtHeigth - playerHeigth) {
      left.style.top = `${stepLength}px`;
    }
  }, playersTime);
};

const score = async function (player) {
  document.removeEventListener("keydown", setKeyPressed);
  document.removeEventListener("keyup", setKeyPressed);
  clearInterval(ballInterval);
  clearInterval(computerInterval);
  clearInterval(playerInterval);
  let ballColor;
  for (let i = 0; i < 11; i++) {
    if (i % 2) {
      ballColor = "#e76f51";
    } else {
      ballColor = "#f9f9f9";
    }
    ball.style.backgroundColor = ballColor;
    await sleep(40);
    stillPlaying = false;
  }
  if (player == "right") {
    rightScore.textContent = parseInt(rightScore.textContent) + 1;
  } else if (player == "left") {
    leftScore.textContent = parseInt(leftScore.textContent) + 1;
  }
  await sleep(500);
  if (parseInt(leftScore.textContent) >= 5 || parseInt(rightScore.textContent) >= 5) {
    return null;
  } else {
    start();
  }
};

const sleep = function (time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const setKeyPressed = function (event) {
  if (event.key == "ArrowUp" || event.key == "ArrowDown") {
    event.preventDefault();
    if (event.type == "keyup") {
      return (keyPressed = "");
    } else if (event.type == "keydown") {
      return (keyPressed = event.key);
    }
  }
};

start();
