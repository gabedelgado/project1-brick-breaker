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

class Player {
  constructor() {
    this.width = 100;
    this.height = 20;
    this.x = 250;
    this.y = 520;
    this.lives = 3;
    this.image = new Image();
    this.image.src = "./images/PNG/platform_base.png";
  }
}

class Ball {
  constructor() {
    this.radius = 15;
    this.color = "red";
    this.x = 295;
    this.y = 295;
    this.currentDirection = 90; // sectioned into typical graph, 0 right, 90 up, 180 left, etc..
    this.prevCurrentDirection = 0;
    this.image = new Image();
    this.image.src = "./images/PNG/ball.png";
    this.xMove = 0;
    this.yMove = 0;
  }

  moveBall = () => {
    if (this.currentDirection !== this.prevCurrentDirection) {
      let xMove = Math.cos((this.currentDirection * Math.PI) / 180);
      let yMove = Math.sin((this.currentDirection * Math.PI) / 180);
      this.xMove = 8 * xMove;
      this.yMove = 8 * yMove;
      this.x = this.x + xMove;
      this.y = this.y - yMove;
      this.prevCurrentDirection = this.currentDirection;
    } else {
      this.x += this.xMove;
      this.y -= this.yMove;
    }
  };

  checkCollision = (tiles, player, canvas) => {
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
      if (determineCollisionArea(this, player) === 1) {
        this.currentDirection = 180 - this.currentDirection;
      } else {
        let position = this.x - player.x < 0 ? 0 : this.x - player.x;
        let rawDirection = 180 - Math.floor((position / player.width) * 180);

        if (rawDirection < 20) {
          this.currentDirection = 20;
        } else if (rawDirection > 160) {
          this.currentDirection = 160;
        } else {
          this.currentDirection = rawDirection;
        }
      }
      this.moveBall();
    }

    // tile collision (checking only if ball near lowest hanging tile)
    else if (this.y - this.radius * 4 < tiles[tiles.length - 1].y) {
      //checking which tiles were hit
      let hitTileIndex = [];
      tiles.forEach((tile, index) => {
        if (generalCollision(this, tile)) {
          hitTileIndex.push(index);
        }
      });

      //picking the closest tile to be the one to get hit and base the reaction off of
      let closestIndex = -1;
      let closestDistance = 10000;
      hitTileIndex.forEach((index) => {
        let tileCenterY = tiles[index].y + tiles[index].height / 2;
        let tileCenterX = tiles[index].x + tiles[index].width / 2;
        let distance = Math.sqrt(
          Math.pow(this.x - tileCenterX, 2) + Math.pow(this.y - tileCenterY, 2)
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      //  BRANCH TEST

      //react to and hit the closest tile
      if (closestIndex !== -1) {
        let twotop =
          hitTileIndex.length >= 2
            ? hitTileIndex[1] - hitTileIndex[0] === 1
            : false; // NOT PERFECT, CAN HIT SIDEWAYS WITH DELETED TILES NEED TO MAKE CHECK FOR SIDE HITS ON TWO PIECES
        if (
          determineCollisionArea(this, tiles[closestIndex]) === 1 &&
          !twotop
        ) {
          this.currentDirection = 180 - this.currentDirection;
        } else {
          this.currentDirection = 360 - this.currentDirection;
        }
        this.moveBall();
        hitTile(closestIndex);
      }
    }
  };
}
