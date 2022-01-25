const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

canvas.height = 600;
canvas.width = 600;

class Tile {
  constructor(x, y, startHealth) {
    this.width = 85;
    this.height = 20;
    this.x = x;
    this.y = y;
    this.health = startHealth;
  }
}

class Ball {
  constructor() {
    this.radius = 15;
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
    this.x = this.x + 5 * xMove;
    this.y = this.y - 5 * yMove;
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
    if (generalCollision(this, player)) {
      //check for side collision by checking if ball net y under platform x
      if (this.y <= player.y) {
        this.currentDirection = 360 - this.currentDirection;
      } else {
        this.currentDirection = 180 - this.currentDirection;
      }

      this.moveBall();
    }

    tiles.forEach((tile) => {
      console.log(
        `tested: ball.x: ${this.x}   ball.y: ${this.y}   obj.x: ${tile.x}   obj.y: ${tile.y}`
      );
      if (generalCollision(this, tile)) {
        console.log("hit something");
        console.log(
          `tested: ball.x: ${this.x}   ball.y: ${this.y}   obj.x: ${tile.x}   obj.y: ${tile.y}`
        );

        if (this.y >= tile.y + tile.height || this.y <= tile.y) {
          this.currentDirection = 360 - this.currentDirection;
          this.moveBall();
        } else {
          this.currentDirection = 180 - this.currentDirection;
        }
      }
    });
  };
}

class Player {
  constructor() {
    this.width = 100;
    this.height = 20;
    this.x = 250;
    this.y = canvas.height - 80;
    this.lives = 3;
  }
}

let ball = new Ball();
let player = new Player();
let tiles = [];
let level = 1;
let ballMovementInterval = "";
let ballCollisionInterval = "";

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    player.x = player.x - 10 >= 0 ? player.x - 10 : player.x;
  } else if (event.code === "ArrowRight") {
    player.x =
      player.x + 10 + player.width <= canvas.width ? player.x + 10 : player.x;
  }
});

let generalCollision = (ball, obj) => {
  return (
    ball.x < obj.x + obj.width &&
    ball.x + ball.radius > obj.x &&
    ball.y - ball.radius < obj.y + obj.height &&
    ball.y + ball.radius > obj.y
  );
};

let drawBall = () => {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};

let drawPlayer = () => {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.width, player.height);
};

let drawTiles = () => {
  ctx.fillStyle = "red";
  tiles.forEach((tile) => {
    ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
  });
};

let animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ball.checkCollision();

  drawBall();
  drawPlayer();
  drawTiles();
  if (ball.y < canvas.height) {
    window.requestAnimationFrame(animate);
  } else {
    player.lives--;
    ctx.font = "30px Arial";
    ctx.fillText(
      "You lost, you have " + player.lives + " lives remaining.",
      70,
      canvas.height / 2
    );
    document.getElementById("livesTag").innerText = player.lives;
    level++;
    document.getElementById("levelTag").innerText = level;
    tiles = [];
  }
};

let fillTiles = () => {
  //filling tiles according to level, 25 px either side, 10 px gap, 80 wide
  // minimum 3 rows , goes to 6 rows, then back to 3 with one more health point, back up to 6, etc etc,

  let numRows = level > 3 ? 3 + (level % 4) : 3 + level;
  let startHealth = 1 + Math.floor(level - 1 / 3);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < 6; j++) {
      tiles.push(
        new Tile(2 + j * 80 + 16 * (j + 1), 20 * i + 14 * (i + 1), startHealth)
      );
    }
  }
};

let resetGame = () => {
  player.x = 250;
  ball.x = 295;
  ball.y = 295;
  ball.currentDirection = Math.random() * 160 + 10;
  document.getElementById("livesTag").innerText = player.lives;
  fillTiles();
};

let startGame = () => {
  // reset player, ball, tiles according to level, player health
  resetGame();
  clearInterval(ballMovementInterval);
  clearInterval(ballCollisionInterval);
  ballMovementInterval = setInterval(ball.moveBall, 20);
  ballCollisionInterval = setInterval(ball.checkCollision, 20);
  animate();
};

// window.addEventListener("keydown", (event) => {
//   if (event.code === "ArrowDown") {
//     console.log("pressed");
//     ball.moveBall();
//   }
// });
document.getElementById("gameButton").addEventListener("click", startGame);
