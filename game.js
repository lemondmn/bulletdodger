// Game width and height
var w = 800;
var h = 400;

// Game variables
var playerSprite; // Player sprite
var canvasBackground; // Background sprite

// Horizontal bullet
var hBullet;
var hB_wasShoot = false;
var h_ufo;
var hB_speed;
var hB_displacement;
var airStatus;
var groundStatus;

// Key variables
var jumpKey;

// Menu variable
var menu;

// Neural network variables
var neuralNetwork,
  neuralNetworkTraining,
  neuralNetworkOutput,
  trainingData = [];
var isAuto = false,
  isTrainingComplete = false;

// Game object
var game = new Phaser.Game(w, h, Phaser.CANVAS, "dodgergame", {
  preload: preload,
  create: create,
  update: update,
  render: render,
});

function preload() {
  game.load.image("fondo", "assets/game/fondo.jpg");
  game.load.spritesheet("mono", "assets/sprites/altair.png", 32, 48);
  game.load.image("nave", "assets/game/ufo.png");
  game.load.image("bala", "assets/sprites/purple_ball.png");
  game.load.image("menu", "assets/game/menu.png");
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 800;
  game.time.desiredFps = 30;

  canvasBackground = game.add.tileSprite(0, 0, w, h, "fondo");
  h_ufo = game.add.sprite(w - 100, h - 70, "nave");
  hBullet = game.add.sprite(w - 100, h, "bala");
  playerSprite = game.add.sprite(50, h, "mono");

  game.physics.enable(playerSprite);
  playerSprite.body.collideWorldBounds = true;
  playerSprite.animations.add("corre", [8, 9, 10, 11]);
  playerSprite.animations.play("corre", 10, true);

  game.physics.enable(hBullet);
  hBullet.body.collideWorldBounds = true;

  pausaL = game.add.text(w - 100, 20, "Pausa", {
    font: "20px Arial",
    fill: "#fff",
  });
  pausaL.inputEnabled = true;
  pausaL.events.onInputUp.add(pauseGame, self);
  game.input.onDown.add(pauseMenu, self);

  jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  neuralNetwork = new synaptic.Architect.Perceptron(2, 6, 6, 2);
  neuralNetworkTraining = new synaptic.Trainer(neuralNetwork);

  actionLogger("Juego Iniciado");
}

function trainNeuralNetwork() {
  neuralNetworkTraining.train(trainingData, {
    rate: 0.0003,
    iterations: 10000,
    shuffle: true,
  });
}

function autojumper(param_entrada) {
  neuralNetworkOutput = neuralNetwork.activate(param_entrada);
  var aire = Math.round(neuralNetworkOutput[0] * 100);
  var piso = Math.round(neuralNetworkOutput[1] * 100);
  console.log("Valor ", "En el Aire %: " + aire + " En el suelo %: " + piso);
  return neuralNetworkOutput[0] >= neuralNetworkOutput[1];
}

function pauseGame() {
  game.paused = true;
  menu = game.add.sprite(w / 2, h / 2, "menu");
  menu.anchor.setTo(0.5, 0.5);
}

function pauseMenu(event) {
  if (game.paused) {
    var menu_x1 = w / 2 - 270 / 2,
      menu_x2 = w / 2 + 270 / 2,
      menu_y1 = h / 2 - 180 / 2,
      menu_y2 = h / 2 + 180 / 2;

    var mouse_x = event.x,
      mouse_y = event.y;

    if (
      mouse_x > menu_x1 &&
      mouse_x < menu_x2 &&
      mouse_y > menu_y1 &&
      mouse_y < menu_y2
    ) {
      if (
        mouse_x >= menu_x1 &&
        mouse_x <= menu_x2 &&
        mouse_y >= menu_y1 &&
        mouse_y <= menu_y1 + 90
      ) {
        actionLogger("[MANUAL MODE] presionado");
        isTrainingComplete = false;
        trainingData = [];
        isAuto = false;
        actionLogger("Juego Reiniciado");
      } else if (
        mouse_x >= menu_x1 &&
        mouse_x <= menu_x2 &&
        mouse_y >= menu_y1 + 90 &&
        mouse_y <= menu_y2
      ) {
        actionLogger("[AUTO MODE] presionado");
        if (!isTrainingComplete) {
          actionLogger("Entrenando Red Neuronal...");
          console.log("", "Entrenamiento " + trainingData.length + " valores");
          trainNeuralNetwork();
          isTrainingComplete = true;
          actionLogger("Entrenamiento Completo");
        }
        isAuto = true;
        actionLogger("Juego en modo Auto");
      }
      menu.destroy();
      resetVariables();
      game.paused = false;
    }
  }
}

function resetVariables() {
  playerSprite.body.velocity.x = 0;
  playerSprite.body.velocity.y = 0;
  hBullet.body.velocity.x = 0;
  hBullet.position.x = w - 100;
  playerSprite.position.x = 50;
  hB_wasShoot = false;
}

function jump() {
  playerSprite.body.velocity.y = -270;
}

function update() {
  canvasBackground.tilePosition.x -= 1;

  game.physics.arcade.collide(hBullet, playerSprite, colisionH, null, this);

  groundStatus = 1;
  airStatus = 0;

  if (!playerSprite.body.onFloor()) {
    groundStatus = 0;
    airStatus = 1;
  }

  hB_displacement = Math.floor(playerSprite.position.x - hBullet.position.x);

  if (isAuto == false && jumpKey.isDown && playerSprite.body.onFloor()) {
    jump();
  }

  if (isAuto == true && hBullet.position.x > 0 && playerSprite.body.onFloor()) {
    if (autojumper([hB_displacement, hB_speed])) {
      jump();
    }
  }

  if (hB_wasShoot == false) {
    fireHBullet();
  }

  if (hBullet.position.x <= 0) {
    resetVariables();
  }

  if (isAuto == false && hBullet.position.x > 0) {
    trainingData.push({
      input: [hB_displacement, hB_speed],
      output: [airStatus, groundStatus],
    });

    console.log(
      "Desplazamiento Bala, Velocidad Bala, Estatus, Estatus: ",
      hB_displacement + " " + hB_speed + " " + airStatus + " " + groundStatus
    );
  }
}

function fireHBullet() {
  hB_speed = -1 * randomSpeed(300, 800);
  hBullet.body.velocity.y = 0;
  hBullet.body.velocity.x = hB_speed;
  hB_wasShoot = true;
}

function colisionH() {
  actionLogger("Has sido golpeado por la bala.");
  pauseGame();
}

function randomSpeed(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render() {}

function actionLogger(msg) {
  var logDiv = document.getElementById("dataprint");
  var newMsg = document.createElement("p");
  newMsg.innerHTML = msg;
  logDiv.appendChild(newMsg);
  logDiv.scrollTop = logDiv.scrollHeight;
}
