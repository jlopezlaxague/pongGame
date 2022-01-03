// Global variables
const court = document.getElementById("court");
const left = document.getElementById("left");
const right = document.getElementById("right");
const ball = document.getElementById("ball");
const rightScore = document.getElementById("rightScore");
const leftScore = document.getElementById("leftScore");
const ballSpeedSlider = document.getElementById("ballSpeedSlider");
const ballSpeedDisplay = document.getElementById("ballSpeed");
const difficultySlider = document.getElementById("difficultySlider");
const difficultyDisplay = document.getElementById("difficulty");
const courtHeigth = court.clientHeight;
const courtWidth = court.clientWidth;
const playerWidht = right.offsetWidth;
const playerHeigth = right.offsetHeight;
const ballSize = ball.offsetWidth;
const hBallStepMax = 8;
const hBallStepMin = 2;
const ballTime = 2;
const playersTime = ballTime * 2;
const hardMax = 0.04;
const hardMin = 0.005;
let computerInterval;
let ballInterval;
let playerInterval;
let stillPlaying = true;
let pause = false;
let point = "left";
let hSense = 1;
let started = false;

const setUp = function () {
  right.style.left = `${courtWidth - 2 * playerWidht - ballSize}px`;
  right.style.top = `${courtHeigth / 2 - playerHeigth / 2}px`;
  left.style.top = `${courtHeigth / 2 - playerHeigth / 2}px`;
  ball.style.top = `${Math.round(Math.random() * courtHeigth)}px`;
  ball.style.left = `${20}px`;
  setballSpeed(null, 50);
  setDifficulty(null, 50);
  document.addEventListener("keydown", setKeyPressed);
  document.addEventListener("keyup", setKeyPressed);
  ballSpeedSlider.addEventListener("change", setballSpeed);
  difficultySlider.addEventListener("change", setDifficulty);
};

const start = function () {
  right.style.left = `${courtWidth - 2 * playerWidht - ballSize}px`;
  right.style.top = `${courtHeigth / 2 - playerHeigth / 2}px`;
  left.style.top = `${courtHeigth / 2 - playerHeigth / 2}px`;
  if (point == "left") {
    ball.style.top = `${Math.round(Math.random() * courtHeigth)}px`;
    ball.style.left = `${20}px`;
  } else {
    ball.style.top = `${Math.round(Math.random() * courtHeigth)}px`;
    ball.style.left = `${courtWidth - playerWidht - ballSize - 20}px`;
  }
  stillPlaying = true;
  keyPressed = "";
  ballStepper();
  playerInterval = setInterval(humanPlayer, playersTime);
  computerPlayer();
};

const ballStepper = function () {
  let vSense = 1;
  const hMin = 0;
  const hMax = courtWidth - ballSize - 2 * playerWidht;
  const vMin = 0;
  const vMax = courtHeigth - ballSize;

  ballInterval = setInterval(async function () {
    if (pause) return null;
    let initTop = parseInt(ball.style.top.slice(0, -2));
    let initLeft = parseInt(ball.style.left.slice(0, -2));
    let vRightMin = Math.abs(parseInt(right.style.top.slice(0, -2)));
    let vRightMax = Math.abs(parseInt(right.style.top.slice(0, -2))) + playerHeigth;
    let vLeftMin = Math.abs(parseInt(left.style.top.slice(0, -2)));
    let vLeftMax = Math.abs(parseInt(left.style.top.slice(0, -2))) + playerHeigth;

    if (initLeft < hMin) {
      initLeft = hMin;
    }

    // Point
    if (initLeft >= hMax && (initTop + ballSize < vRightMin || initTop > vRightMax)) {
      point = "left";
      hSense = 1;
      return await score("left");
    }
    if (initLeft <= hMin && (initTop + ballSize < vLeftMin || initTop > vLeftMax)) {
      point = "right";
      hSense = -1;
      return await score("right");
    }

    // Heat player or court limits
    if (stillPlaying) {
      if (initLeft <= hMin || initLeft >= hMax) {
        hSense = -hSense;
      }
      if (initTop <= vMin || initTop >= vMax) {
        vSense = -vSense;
      }

      if (initLeft + hSense * hBallStep < hMin) {
        hBallPos = hMin;
      } else if (initLeft + hSense * hBallStep > hMax) {
        hBallPos = hMax;
      } else {
        hBallPos = initLeft + hSense * hBallStep;
      }

      if (initTop + vSense * vBallStep < vMin) {
        vBallPos = vMin;
      } else if (initTop + vSense * vBallStep > vMax) {
        vBallPos = vMax;
      } else {
        vBallPos = initTop + vSense * vBallStep;
      }

      ball.style.left = `${hBallPos}px`;
      ball.style.top = `${vBallPos}px`;
    }
  }, ballTime);
};

const humanPlayer = function (event) {
  if (pause) return null;
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
  if (pause) return null;
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
  if (parseInt(leftScore.textContent) >= 21 || parseInt(rightScore.textContent) >= 21) {
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
    if (pause) return null;
    if (event.type == "keyup") {
      return (keyPressed = "");
    } else if (event.type == "keydown") {
      return (keyPressed = event.key);
    }
  }
  if (event.key == " " && event.type == "keydown") {
    pause = !pause;
  }
  if (event.key == "s" && event.type == "keydown") {
    if (!started) {
      started = true;
      start();
    }
  }
};

const setballSpeed = function (event, percent) {
  let percentValue = 0;
  if (event) {
    percentValue = event.target.value;
  } else {
    percentValue = percent;
  }

  hBallStep = hBallStepMin + ((hBallStepMax - hBallStepMin) / 100) * percentValue;
  vBallStep = hBallStep / 2;
  if (vBallStep < 1) {
    vBallStep = 1;
  }
  ballSpeedDisplay.textContent = percentValue;
};

const setDifficulty = function (event, percent) {
  let percentValue = 0;
  if (event) {
    percentValue = event.target.value;
  } else {
    percentValue = percent;
  }

  hard = hardMin + ((hardMax - hardMin) / 100) * percentValue;
  difficultyDisplay.textContent = percentValue;
};

setUp();
