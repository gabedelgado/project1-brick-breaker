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
    else if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
      this.currentDirection = 180 - this.currentDirection;
      this.moveBall();
    }
    // need to include only hit for top
    else if (generalCollision(this, player)) {
      //check for side collision by checking if ball net y under platform x
      if (this.y <= player.y) {
        this.currentDirection = 360 - this.currentDirection;
      } else {
        this.currentDirection = 180 - this.currentDirection;
      }

      this.moveBall();
    } else if (this.y - this.radius * 4 < tiles[tiles.length - 1].y) {
      let hitTileIndex = -1;
      tiles.forEach((tile, index) => {
        if (generalCollision(this, tile)) {
          if (this.y >= tile.y + tile.height || this.y <= tile.y) {
            this.currentDirection = 360 - this.currentDirection;
          } else {
            this.currentDirection = 180 - this.currentDirection;
          }
          this.moveBall();
          hitTileIndex = index;
        }
      });
      if (hitTileIndex != -1) {
        hitTile(hitTileIndex);
      }
    }
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

let hitTile = (tileIndex) => {
  if (tiles[tileIndex].health - 1 === 0) {
    tiles.splice(tileIndex, 1);
  }
};

let fillTiles = () => {
  //filling tiles according to level, 25 px either side, 10 px gap, 80 wide
  // minimum 3 rows , goes to 6 rows, then back to 3 with one more health point, back up to 6, etc etc,

  let numRows = level > 3 ? 3 + (level % 4) : 3 + level;
  let startHealth = 1 + Math.floor((level - 1) / 3);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < 6; j++) {
      tiles.push(
        new Tile(2 + j * 80 + 16 * (j + 1), 20 * i + 14 * (i + 1), startHealth) //+2 is arbitary for centering (visual)
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
  tiles = [];
  fillTiles();
};

let hardReset = () => {
  level = 1;
  player.lives = 3;
  tiles = [];
};

let clearIntervals = () => {
  clearInterval(ballMovementInterval);
  clearInterval(ballCollisionInterval);
};

let setIntervals = () => {
  ballMovementInterval = setInterval(ball.moveBall, 20);
  ballCollisionInterval = setInterval(ball.checkCollision, 20);
};

let beatLevel = () => {
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  ctx.fillText(
    `You beat level ${level}! Press continue.`,
    125,
    canvas.height / 2
  );
  document.getElementById("livesTag").innerText = player.lives;
  level++;
  document.getElementById("levelTag").innerText = level;
};

let lostLife = () => {
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  if (--player.lives === 0) {
    ctx.fillText("You lost! For real this time!", 150, canvas.height / 2);
    ctx.fillText("Press restart to try again.", 155, canvas.height / 2 + 30);
    document.getElementById("gameButton").value = "Restart";
    hardReset();
  } else {
    ctx.fillText(
      `You lost a life! Press continue to try again.`,
      75,
      canvas.height / 2,
      540
    );
    document.getElementById("gameButton").value = "Continue";
  }
  document.getElementById("livesTag").innerText = player.lives;
};

let animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPlayer();
  drawTiles();
  if (!tiles.length) {
    beatLevel();
  } else if (ball.y < canvas.height) {
    window.requestAnimationFrame(animate);
  } else {
    lostLife();
  }
};

let startGame = () => {
  // reset player, ball, tiles according to level, player health
  resetGame();
  clearIntervals();
  setIntervals();
  animate();
};

document.getElementById("gameButton").addEventListener("click", startGame);
