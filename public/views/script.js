var socket = io("http://localhost:4000");

var robotChannel = "/robot/movement/control";
var cameraChannel = "/robot/camera/control";

var connectOnClick = () => {
  var address = document.getElementById("address").value;
  socket.emit("/connect", address);
};

var onConnected = (payload) => {
  document.getElementById("ip").innerHTML = payload;
};

socket.on("/connected", onConnected);

var robotPayload = {
  linearVel: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },
  angularVel: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },
};

var cameraPayload = {
  camName: "cam1",
  zoomLevel: 10.1,
  direction: "up",
};

var startingDelay = 5;
var speedUp = 1;

/**
 * Robot movement handler
 */

var moveRobotForward = () => {
  console.log("robot forward");
  robotPayload.linearVel.x = 1;
  robotPayload.angularVel.z = 0;
  socket.emit(robotChannel, robotPayload);
};

var moveRobotBackward = () => {
  console.log("robot backward");
  robotPayload.linearVel.x = -1;
  robotPayload.angularVel.z = 0;
  socket.emit(robotChannel, robotPayload);
};

var turnRobotRight = () => {
  console.log("robot right");
  robotPayload.linearVel.x = 0;
  robotPayload.angularVel.z = 1;
  socket.emit(robotChannel, robotPayload);
};

var turnRobotLeft = () => {
  console.log("robot left");
  robotPayload.linearVel.x = 0;
  robotPayload.angularVel.z = -1;
  socket.emit(robotChannel, robotPayload);
};

/**
 * Camera movement handler
 */

var turnCameraUp = () => {
  console.log("camera up");
  cameraPayload.direction = "up";
  socket.emit(cameraChannel, cameraPayload);
};

var turnCameraDown = () => {
  console.log("camera down");
  cameraPayload.direction = "down";
  socket.emit(cameraChannel, cameraPayload);
};

var turnCameraRight = () => {
  console.log("camera right");
  cameraPayload.direction = "right";
  socket.emit(cameraChannel, cameraPayload);
};

var turnCameraLeft = () => {
  console.log("camera left");
  cameraPayload.direction = "left";
  socket.emit(cameraChannel, cameraPayload);
};

/**
 * Key handler to robot movement
 * @param {char} key key bein pressed down
 */
var keydownHandler = (key) => {
  switch (key) {
    case "w":
      return moveRobotForward();
    case "s":
      return moveRobotBackward();
    case "a":
      return turnRobotLeft();
    case "d":
      return turnRobotRight();
    case "ArrowUp":
      return turnCameraUp();
    case "ArrowDown":
      return turnCameraDown();
    case "ArrowLeft":
      return turnCameraLeft();
    case "ArrowRight":
      return turnCameraRight();
  }
};

/**
 * Continuous keyboard presses handler
 */
var keydown = false;
var key;

document.addEventListener("keydown", (e) => {
  if (keydown === false) {
    keydown = true;
    key = e.key;
  }
});

document.addEventListener("keyup", () => {
  keydown = false;
});

setInterval(() => {
  if (keydown) {
    keydownHandler(key);
  }
}, startingDelay);

/**
 * Button hold handler
 */

function buttonHold(btn, action, start, speedup) {
  var t;

  var repeat = function () {
    action();
    t = setTimeout(repeat, start);
    start = start / speedup;
  };

  btn.onmousedown = function () {
    repeat();
  };

  btn.onmouseout = function () {
    clearTimeout(t);
  };

  btn.onmouseup = function () {
    clearTimeout(t);
  };
}

buttonHold(
  document.getElementById("robotUp"),
  moveRobotForward,
  startingDelay,
  speedUp
);
buttonHold(
  document.getElementById("robotDown"),
  moveRobotBackward,
  startingDelay,
  speedUp
);
buttonHold(
  document.getElementById("robotLeft"),
  turnRobotLeft,
  startingDelay,
  speedUp
);
buttonHold(
  document.getElementById("robotRight"),
  turnRobotRight,
  startingDelay,
  speedUp
);

buttonHold(
  document.getElementById("cameraUp"),
  turnCameraUp,
  startingDelay,
  speedUp
);
buttonHold(
  document.getElementById("cameraDown"),
  turnCameraDown,
  startingDelay,
  speedUp
);
buttonHold(
  document.getElementById("cameraLeft"),
  turnCameraLeft,
  startingDelay,
  speedUp
);
buttonHold(
  document.getElementById("cameraRight"),
  turnCameraRight,
  startingDelay,
  speedUp
);
