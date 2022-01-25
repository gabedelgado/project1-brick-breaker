const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 600;

let tileLinkPrefix = "./images/PNG/tile";

class Tile {
  constructor(x, y, startHealth) {
    this.width = 85;
    this.height = 20;
    this.x = x;
    this.y = y;
    this.health = startHealth;
    this.image = new Image();
    this.image.src = tileLinkPrefix + String(this.health) + ".png";
  }

  updateImgSrc = () => {
    this.image.src = tileLinkPrefix + String(this.health) + ".png";
  };
}

class Ball {
  constructor() {
    this.radius = 15;
    this.color = "red";
    this.x = 295;
    this.y = 295;
    this.currentDirection = 90; // sectioned into typical graph, 0 right, 90 up, 180 left, etc..
    this.image = new Image();
    this.image.src = "./images/PNG/ball.png";
  }

  moveBall = () => {
    let xMove = Math.cos((this.currentDirection * Math.PI) / 180);
    let yMove = Math.sin((this.currentDirection * Math.PI) / 180);
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
    // platform collision
    else if (generalCollision(this, player)) {
      this.currentDirection =
        determineCollisionArea(this, player) === 1
          ? 180 - this.currentDirection
          : 360 - this.currentDirection;
      this.moveBall();
      // this.moveBall();
    }
    // tile collision (checking only if ball near lowest hanging tile)
    else if (this.y - this.radius * 4 < tiles[tiles.length - 1].y) {
      let hitTileIndex = -1;
      tiles.forEach((tile, index) => {
        if (generalCollision(this, tile)) {
          this.currentDirection =
            determineCollisionArea(this, tile) === 1
              ? 180 - this.currentDirection
              : 360 - this.currentDirection;
          this.moveBall();
          // this.moveBall();
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
    this.image = new Image();
    this.image.src = "./images/PNG/platform_base.png";
  }
}

// ***** HELPER FUNCTIONS *****
let generalCollision = (ball, obj) => {
  return (
    ball.x - ball.radius < obj.x + obj.width &&
    ball.x + ball.radius > obj.x &&
    ball.y - ball.radius < obj.y + obj.height &&
    ball.y + ball.radius > obj.y
  );
};

let determineCollisionArea = (ball, tile) => {
  let ballRelY = ball.y - (tile.y + tile.height / 2);
  let slope = tile.height / 2 / (tile.width / 2);
  let ballRelX = ball.x - (tile.x + tile.width / 2);
  if (
    (ballRelY < slope * ballRelX && ballRelY > -1 * slope * ballRelX) ||
    (ballRelY < -1 * slope * ballRelX && ballRelY > slope * ballRelX)
  ) {
    return 1;
  } else {
    return 2;
  }
};

let drawBall = () => {
  ctx.drawImage(
    ball.image,
    ball.x - ball.radius,
    ball.y - ball.radius,
    ball.radius * 2,
    ball.radius * 2
  );
};

let drawPlayer = () => {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
};

let drawTiles = () => {
  tiles.forEach((tile) => {
    ctx.drawImage(tile.image, tile.x, tile.y, tile.width, tile.height);
  });
};

let hitTile = (tileIndex) => {
  if (--tiles[tileIndex].health === 0) {
    tiles.splice(tileIndex, 1);
  } else {
    tiles[tileIndex].updateImgSrc();
  }
};

let fillTiles = () => {
  //filling tiles according to level, 25 px either side, 10 px gap, 80 wide
  // minimum 3 rows , goes to 6 rows, then back to 3 with one more health point, back up to 6, etc etc,
  let numRows = level > 3 ? 4 + ((level - 1) % 3) : 3 + level;
  let startHealth = 1 + Math.floor((level - 1) / 3);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < 6; j++) {
      tiles.push(
        new Tile(2 + j * 80 + 16 * (j + 1), 20 * i + 14 * (i + 1), startHealth) //+2 is arbitary for centering (visual)
      );
    }
  }
  // testing code below
  // tiles.push(new Tile(300, 150, 10));
};

let resetGame = () => {
  player.x = 250;
  ball.x = 250;
  ball.y = 400;
  ball.currentDirection = Math.random() * 160 + 10;
  // testing code below
  // ball.currentDirection = -135;
  document.getElementById("livesTag").innerText = player.lives;
  document.getElementById("levelTag").innerText = level;
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
  ctx.fillStyle = "white";
  ctx.font = "25px Arial";
  ctx.fillText(
    `You beat level ${level}! Press continue.`,
    125,
    canvas.height / 2
  );
  document.getElementById("livesTag").innerText = player.lives;
  level++;
  document.getElementById("levelTag").innerText = level;
  clearIntervals();
};

let lostLife = () => {
  ctx.fillStyle = "white";
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
  clearIntervals();
};

// ***** GAME ITEMS *****
let ball = new Ball();
let player = new Player();
let tiles = [];
let level = 1;
let ballMovementInterval = "";
let ballCollisionInterval = "";

// ***** GAME ENGINE *****
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
  resetGame();
  clearIntervals();
  setIntervals();
  animate();
};

// testing code below
// window.addEventListener("keydown", (event) => {
//   if (event.code === "ArrowDown") {
//     ball.moveBall();
//     ball.checkCollision();
//   }
// });

// ***** ADDING EVENT LISTENERS *****
canvas.addEventListener("mousemove", (event) => {
  player.x = event.offsetX;
});

document.getElementById("gameButton").addEventListener("click", startGame);
