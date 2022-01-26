const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 600;

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
  let slope = tile.height / 2 / (tile.width / 2 - ball.radius * 1.1);
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
  //filling tiles according to level
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
  ball.x = 300;
  ball.y = 400;
  ball.currentDirection = Math.random() * 160 + 10;
  // testing code below
  // ball.currentDirection = 91;
  document.getElementById("livesTag").innerText = player.lives;
  document.getElementById("levelTag").innerText = level;
  document.getElementById("gameButton").value = "Continue";
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
  ballMovementInterval = setInterval(ball.moveBall, 15);
  ballCollisionInterval = setInterval(
    ball.checkCollision,
    15,
    tiles,
    player,
    canvas
  );
};

let beatLevel = () => {
  ctx.fillStyle = "white";
  ctx.font = "18px  'Press Start 2P'";
  ctx.fillText(
    `You beat level ${level}! Press continue.`,
    7,
    canvas.height / 2
  );
  document.getElementById("livesTag").innerText = player.lives;
  level++;
  document.getElementById("levelTag").innerText = level;
  clearIntervals();
};

let lostLife = () => {
  ctx.fillStyle = "white";
  ctx.font = "18px  'Press Start 2P'";
  if (--player.lives === 0) {
    ctx.fillText("You lost! For real this time!", 45, canvas.height / 2);
    ctx.fillText("Press restart to try again.", 65, canvas.height / 2 + 30);
    document.getElementById("gameButton").value = "Restart";
    document.getElementById("livesTag").innerText = player.lives;
    hardReset();
  } else {
    ctx.fillText(`You lost a life!`, 150, canvas.height / 2);
    ctx.fillText(` Press continue to try again.`, 35, canvas.height / 2 + 30);
    document.getElementById("gameButton").value = "Continue";
    document.getElementById("livesTag").innerText = player.lives;
  }

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
