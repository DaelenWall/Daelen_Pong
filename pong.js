let leftPaddle, rightPaddle;
let ball;
let leftScore = 0;
let rightScore = 0;
let winningScore = 11;
let winner = null;
let winTime = null;

function setup() {
  createCanvas(800, 600);
  resetGame();
}

function draw() {
  background(0);
  drawCenterLine();
  drawScores();

  // Show winner message and pause
  if (winner) {
    textSize(50);
    fill(255);
    let x = winner === 'left' ? width / 4 : 3 * width / 4;
    textAlign(CENTER);
    text("WINNER", x, height / 2);

    // After 4 seconds, reset game
    if (millis() - winTime > 4000) {
      resetGame();
    }

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

function resetGame() {
  leftPaddle = new Paddle(20);
  rightPaddle = new Paddle(width - 30);
  ball = new Ball();
  leftScore = 0;
  rightScore = 0;
  winner = null;
  winTime = null;
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
  if (ball.collides(leftPaddle)) ball.bounce(true);
  if (ball.collides(rightPaddle)) ball.bounce(false);
}

function checkScore() {
  if (ball.x < 0) {
    rightScore++;
    if (rightScore === winningScore) {
      winner = 'right';
      winTime = millis();
    }
    ball = new Ball(true);
  } else if (ball.x > width) {
    leftScore++;
    if (leftScore === winningScore) {
      winner = 'left';
      winTime = millis();
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
    this.speed = 5;
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

