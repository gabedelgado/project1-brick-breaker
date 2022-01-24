const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

canvas.height = 600;
canvas.width = 600;

class Ball {
  constructor() {
    this.radius = 10;
    this.color = "red";
    this.x = 295;
    this.y = 295;
    this.currentDirection = 176; // sectioned into typical graph, 0 right, 90 up, 180 left, etc..
  }

  moveBall = () => {
    let xMove = Math.cos((this.currentDirection * Math.PI) / 180);
    let yMove = Math.sin((this.currentDirection * Math.PI) / 180);
    // this.x = Number(this.x + 6 * xMove).toFixed();
    // this.y = Number(this.y - 6 * yMove).toFixed();
    this.x = this.x + 6 * xMove;
    this.y = this.y - 6 * yMove;

    console.log("moving?", xMove, yMove);
  };

  checkCollision = () => {
    // checking for top wall collision
    if (this.y - this.radius < 0) {
      this.currentDirection = 360 - this.currentDirection;
      this.moveBall();
    }
    // left , right wall collision
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
      this.currentDirection = 180 - this.currentDirection;
      this.moveBall();
    }
  };
}
let ball = new Ball();
let drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};

let animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.checkCollision();
  drawBall();
  window.requestAnimationFrame(animate);
};

let startGame = () => {
  setInterval(ball.moveBall, 20);
  animate();
};

startGame();
