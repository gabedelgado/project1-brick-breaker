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
    this.currentDirection = 90; // sectioned into typical graph, 0 right, 90 up, 180 left, etc..
  }

  moveBall = () => {
    let xMove = Math.cos((this.currentDirection * Math.PI) / 180);
    let yMove = Math.sin((this.currentDirection * Math.PI) / 180);
    // this.x = Number(this.x + 6 * xMove).toFixed();
    // this.y = Number(this.y - 6 * yMove).toFixed();
    this.x = this.x + 8 * xMove;
    this.y = this.y - 8 * yMove;

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
    // need to include only hit for top
    if (
      this.x < player.x + player.width &&
      this.x + this.radius > player.x &&
      this.y < player.y + player.height &&
      this.y + this.radius > player.y
    ) {
      //check for side collision by checking if ball net y under platform x
      if (this.y <= player.y) {
        this.currentDirection = 360 - this.currentDirection;
      } else {
        this.currentDirection = 180 - this.currentDirection;
      }

      this.moveBall();
    }

    // car.x < roadBlock.x + roadBlock.width &&
    // car.x + car.width > roadBlock.x &&
    // car.y < roadBlock.y + roadBlock.height &&
    // car.y + car.height > roadBlock.y
  };
}

class Player {
  constructor() {
    this.width = 100;
    this.height = 20;
    this.x = 250;
    this.y = canvas.height - 80;
  }
}

let ball = new Ball();
let player = new Player();

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    player.x = player.x - 10 >= 0 ? player.x - 10 : player.x;
  } else if (event.code === "ArrowRight") {
    player.x =
      player.x + 10 + player.width <= canvas.width ? player.x + 10 : player.x;
  }
});

let drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};

let drawPlayer = () => {
  ctx.fillRect(player.x, player.y, player.width, player.height);
};

let animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.checkCollision();
  drawBall();
  drawPlayer();
  window.requestAnimationFrame(animate);
};

let startGame = () => {
  setInterval(ball.moveBall, 20);

  animate();
};

startGame();
