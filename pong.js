let leftPaddle, rightPaddle;
let ball;
let leftScore = 0;
let rightScore = 0;
let winningScore = 11;
let winner = null;
let restartButton = {
  x: 0,
  y: 0,
  w: 200,
  h: 60,
  visible: false
};
let bgMusic;
let pointSound;
let musicStarted = false;
let gameStarted = false;

function preload() {
  bgMusic = loadSound("background.mp3");
  pointSound = loadSound("point.mp3");
}

function setup() {
  createCanvas(800, 600);
  leftPaddle = new Paddle(20);
  rightPaddle = new Paddle(width - 30);
  resetGame();
}

function draw() {
  background(0);
  drawCenterLine();
  drawScores();

  if (!gameStarted) {
    drawStartButton();
    return;
  }

  // Show winner message and pause
  if (winner) {
    textSize(50);
    fill(255);
    let x = winner === 'left' ? width / 4 : 3 * width / 4;
    textAlign(CENTER);
    text("WINNER", x, height / 2);

  restartButton.x = width / 2 - restartButton.w / 2;
  restartButton.y = height / 2 + 20;
  restartButton.visible = true;

  drawRestartButton();

    return; // pause all gameplay
  }

  ball.update();
  ball.draw();

  leftPaddle.update('w', 's');
  rightPaddle.update(UP_ARROW, DOWN_ARROW);
  leftPaddle.draw();
  rightPaddle.draw();

  checkCollisions();
  checkScore();
}

function drawStartButton() {
  const x = width / 2 - 100;
  const y = height / 2 - 30;
  fill(255);
  rect(x, y, 200, 60, 10);

  fill(0);
  textSize(28);
  textAlign(CENTER, CENTER);
  text("START GAME", x + 100, y + 30);
}

function drawRestartButton() {
  fill(255);
  rect(restartButton.x, restartButton.y, restartButton.w, restartButton.h, 10);
  
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("RESTART", restartButton.x + restartButton.w / 2, restartButton.y + restartButton.h / 2);
}

function mousePressed() {
  if (!gameStarted) {
    const x = width / 2 - 100;
    const y = height / 2 - 30;
    const w = 200;
    const h = 60;

    const withinStart = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
    if (withinStart) {
      bgMusic.setLoop(true);
      bgMusic.setVolume(0.4);
      bgMusic.play();
      musicStarted = true;
      gameStarted = true;
      return;
    }
  }

  if (restartButton.visible) {
    const withinX = mouseX >= restartButton.x && mouseX <= restartButton.x + restartButton.w;
    const withinY = mouseY >= restartButton.y && mouseY <= restartButton.y + restartButton.h;
    if (withinX && withinY) {
      resetGame();
    }
  }
}

function resetGame() {
  leftPaddle.resetSpeed();
  rightPaddle.resetSpeed();
  ball = new Ball();
  leftScore = 0;
  rightScore = 0;
  winner = null;
  restartButton.visible = false;
}

function drawCenterLine() {
  stroke(255);
  for (let y = 0; y < height; y += 20) {
    line(width / 2, y, width / 2, y + 10);
  }
}

function drawScores() {
  textSize(32);
  fill(255);
  textAlign(CENTER);
  text(`${leftScore}     ${rightScore}`, width / 2, 40);
}

function checkCollisions() {
  if (ball.collides(leftPaddle)) {
    leftPaddle.speed += 0.5;
    ball.bounce(true); // ball handles its own speed += 1
  }

  if (ball.collides(rightPaddle)) {
    rightPaddle.speed += 0.5;
    ball.bounce(false);
  }
}

function checkScore() {
  if (ball.x < 0) {
    rightScore++;
    pointSound.play();
    leftPaddle.resetSpeed();
    rightPaddle.resetSpeed();
    if (rightScore === winningScore) {
      winner = 'right';
    }
    ball = new Ball(true);
  } else if (ball.x > width) {
    leftScore++;
    pointSound.play();
    if (leftScore === winningScore) {
      winner = 'left';
    }
    ball = new Ball(false);
  }
}

class Paddle {
  constructor(x) {
    this.x = x;
    this.y = height / 2 - 50;
    this.w = 10;
    this.h = 100;
    this.baseSpeed = 7;
    this.speed = this.baseSpeed;
  }

resetSpeed() {
  this.speed = this.baseSpeed;
  console.log(`Paddle speed reset to ${this.speed}`);
}

  update(upKey, downKey) {
    if (keyIsDown(keyCodeFor(upKey)) && this.y > 0) this.y -= this.speed;
    if (keyIsDown(keyCodeFor(downKey)) && this.y + this.h < height) this.y += this.speed;
  }

  draw() {
    noStroke();
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Ball {
  constructor(towardRight = random() < 0.5) {
    this.x = width / 2;
    this.y = height / 2;
    this.r = 10;

    this.currentSpeed = 4;
    this.angle = random(-PI / 4, PI / 4);
    this.direction = towardRight ? 1 : -1;

    this.updateVelocity();
  }

  updateVelocity() {
    this.vx = this.currentSpeed * cos(this.angle) * this.direction;
    this.vy = this.currentSpeed * sin(this.angle);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  collides(paddle) {
    return this.x - this.r < paddle.x + paddle.w &&
           this.x + this.r > paddle.x &&
           this.y > paddle.y &&
           this.y < paddle.y + paddle.h;
  }

  bounce(fromLeftPaddle) {
    // Increase speed by 1 each time it hits a paddle
    this.currentSpeed += 1.0;

    // New random angle, preserve direction
    this.angle = random(-PI / 4, PI / 4);
    this.direction = fromLeftPaddle ? 1 : -1;

    this.updateVelocity();
  }
}

function keyCodeFor(key) {
  return typeof key === "string" ? key.toUpperCase().charCodeAt(0) : key;
}

