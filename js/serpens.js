//Usynlig liste under CREDITS blir synlig når trykket på
function myFunction1(id) {
  let x = document.getElementById(id);
  let y = document.getElementsByClassName("usynlig");

  if (x.style.display != "block") {
    for (var i = 0; i < y.length; i++) {
      y[i].style.display = "none";
    }
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function playAudio() {
  document.getElementById("myAudio").play();
}

function pauseAudio() {
  document.getElementById("myAudio").pause();
}

var canvas, ctx;
// Try other values!
var numberOfSegments = 12;
// Length of each segment of the snake
var segLength = 15;
// Diana's additions

// Arrays of x,y positions of each coordinate system
// one for each segment
// Trick to create arrays filled with zero values
var x = Array.apply(null, Array(numberOfSegments)).map(
  Number.prototype.valueOf,
  0
);

var y = Array.apply(null, Array(numberOfSegments)).map(
  Number.prototype.valueOf,
  0
);
var mousePos;

function init() {
  canvas = document.getElementById("myCanvas");
  canvas.focus();
  ctx = canvas.getContext("2d");
  canvas.addEventListener(
    "mousemove",
    function(evt) {
      mousePos = getMousePos(canvas, evt);
    },
    false
  );

  // starts animation
  requestAnimationFrame(animate);
}

function getMousePos(canvas, evt) {
  // necessary to take into account CSS boundaries
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ADD A NICE BACKGROUND HERE?
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // draw the snake, only when the mouse entered at
  // least once the canvas surface
  if (mousePos !== undefined) {
    drawSnake(mousePos.x, mousePos.y);
  }

  // DRAW EXTRA THINGS HERE?

  requestAnimationFrame(animate);
}

function drawSnake(posX, posY) {
  // DRAW BETTER HEAD HERE?
  drawHead(posX - 5, posY - 5);
  dragSegment(0, posX - 5, posY - 5);
  for (var i = x.length - 2; i >= 0; i--) {
    dragSegment(i + 1, x[i], y[i]);
  }
  // DRAW BETTER TAIL HERE ?
  drawTail();
}

function drawHead(xin, yin) {
  dx = xin - x[0];
  dy = yin - y[0];

  ctx.save();
  ctx.translate(dx, dy);

  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(mousePos.x - 5, mousePos.y - 5, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

function drawTail() {
  dx = x[numberOfSegments - 2] - x[numberOfSegments - 1];
  dy = y[numberOfSegments - 2] - y[numberOfSegments - 1];

  angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.translate(x[numberOfSegments - 1], y[numberOfSegments - 1]);
  ctx.rotate(angle - (2 * Math.PI) / 180);
  ctx.translate(0, -5);

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-20, 5);
  ctx.lineTo(0, 10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function dragSegment(i, xin, yin) {
  dx = xin - x[i];
  dy = yin - y[i];

  angle = Math.atan2(dy, dx);

  x[i] = Math.round(xin - Math.cos(angle) * segLength);
  y[i] = Math.round(yin - Math.sin(angle) * segLength);

  ctx.save();
  ctx.translate(x[i], y[i]);
  ctx.rotate(angle);

  var segColor;

  // Generate colors
  if (i % 3 == 1) segColor = "rgba(0, 0, 0, 255)";
  else if (i % 3 == 2) segColor = "rgba(255, 255, 0, 255)";
  else segColor = "rgba(255, 0, 0, 255)";
  drawLine(0, 0, segLength, 0, segColor, 10);

  ctx.restore();
}

function drawLine(x1, y1, x2, y2, color, width) {
  ctx.save();

  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.restore();
}

myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

// Fikser spillknapp på framside for Firefox på Linux
document.getElementById("play").onclick = function() {
  window.location.href = "game.html";
};
