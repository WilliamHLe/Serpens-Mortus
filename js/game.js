var canvas, ctx, resX, resY;
var direction = [0, 0];
var movX = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -4, -3, -2, -1];
//arrayer som bestemmer hvor langt man beveger seg i x og y aksene for
var movY = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4];
//hver gang man beveger seg, basert på hvilken retning man har
var xPos = [0, 0];
var yPos = [0, 0];
var playerDead = [false, false]; //om spillerne er i live,
//standardfarger settes her
var color = ['#FF0000', '#0000FF'];
var intervalID;
var lastXPos = [0, 0];
var lastYPos = [0, 0];
var score = [0, 0];
var occupiedPoint;
var leftPressed = [false, false];
var rightPressed = [false, false];
var roundActive = false;
var gameActive = false;
var counter = [0, 0]; // teller
var counterLimit = [0, 0]; // grense som endres, som sammenlignes med teller, når denne grensen nås vil spilleren bytte mellom å være "solid" og ikke "solid"
var breakActive = [false, false]; //når denne variablen er true er
var firstLoop = [false, false];
const c1 = document.getElementById('col1');
const c2 = document.getElementById('col2');
const i1 = document.getElementById('i1');
const i2 = document.getElementById('i2');
var playerName = ['Player 1', 'Player 2'];
var givePoints = false;
var countDownId = [0, 0, 0, 0];
var muted = false;
var music = document.getElementById('myAudio');
color[0] = c1.value; //setter fargen til nåværende farge i fargevelgerne, trengs fordi noen nettlesere lagrer fargen i fargevelgerne
color[1] = c2.value;
c1.onchange = function() {
  color[0] = c1.value; //endrer fargen i spillet når fargen i fargevelgerne oppdateres
};
c2.onchange = function() {
  color[1] = c2.value;
};
//henter canvaselementet og gjør det klart til å tegne
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
//leser av høyde og bredde på canvaselementet
resX = canvas.width;
resY = canvas.height;

document.getElementById('buttonM').onclick = function() {
  let logo = document.getElementById('spG');
  muted = !muted;
  if (!muted) {
    logo.classList.remove('glyphicon-volume-off');
    logo.classList.add('glyphicon-volume-up');
    if (roundActive) {
      music.play();
    }
  } else {
    logo.classList.remove('glyphicon-volume-up');
    logo.classList.add('glyphicon-volume-off');
    music.pause();
  }
};

//gjør at spillet kan startes med en knapp
document.getElementById('button').onclick = function() {
  if (!gameActive && !roundActive) {
    //gjør at spillet ikke kan startes før forrige runde er ferdig
    if (i1.value !== '') {
      playerName[0] = i1.value;
    } else {
      playerName[0] = 'Player 1';
    }
    if (i2.value !== '') {
      playerName[1] = i2.value;
    } else {
      playerName[1] = 'Player 2';
    }
    document.getElementById('n1').innerText = playerName[0];
    document.getElementById('n2').innerText = playerName[1];
    startRound(2);
  }
};
//leser av tastetrykk, og setter styringsverdiene leftPressed og rightPressed til true når knappen blir trykket inn. leser også space for å starte neste runde
document.addEventListener('keydown', function(event) {
  switch (event.which) {
    case 37:
      leftPressed[0] = true;
      console.log('p1left down');
      break;
    case 39:
      rightPressed[0] = true;
      console.log('p1right down');
      break;
    case 65:
      leftPressed[1] = true;
      console.log('p2left down');
      break;
    case 68:
      rightPressed[1] = true;
      console.log('p2right down');
      break;
    case 32:
      if (!roundActive && gameActive) {
        startRound(2);
      }
    default:
    //  console.log(event.key);
  }
});
//leser av tastetrykk, og setter styringsverdiene leftPressed og rightPressed til false når knappen blir sluppet
document.addEventListener('keyup', function(event) {
  switch (event.which) {
    case 37:
      leftPressed[0] = false;
      console.log('p1left up');
      break;
    case 39:
      rightPressed[0] = false;
      console.log('p1right up');
      break;
    case 65:
      leftPressed[1] = false;
      console.log('p2left up');
      break;
    case 68:
      rightPressed[1] = false;
      console.log('p2right up');
      break;
    default:
    //console.log(event.key);
    //console.log(event.which);
  }
});

//setter alle verdier som varieres til begynnelsesverdier
function startRound(playerAmount) {
  counter = [0, 0];
  counterLimit = [0, 0];
  breakActive = [false, false];
  firstLoop = [false, false];
  gameActive = true;
  roundActive = true;
  ctx.clearRect(0, 0, resX, resY); //tømmer canvaset
  occupiedPoint = new Array(resX); //erstatter arrayet med posisjoner fra forrige runde med et nytt array med en verdi per pixel i x-aksen
  playerDead = [false, false]; // setter alle spillere til å være i live
  for (var i = 0; i < occupiedPoint.length; i++) {
    occupiedPoint[i] = []; //legger til ett array for hver pixel i x-aksen
  }
  //legger til elementer i scoreboard for hver spiller
  for (let i = 0; i < playerAmount; i++) {
    var elementExists = !!document.getElementById('player' + i); //sjekker om elementet allerede eksisterer
    if (elementExists) {
      //hopper over å lage elementet hvis det allerede eksisterer
      document.getElementById('player' + i).innerText = score[i];
      continue;
    }
    let strong = document.createElement('strong');
    strong.innerText = score[i];
    strong.id = 'player' + i;
    document.getElementById('scoreListe' + i).append(strong);
  }

  //velger en tilfeldig startretning for hver spiller
  for (let i = 0; i < xPos.length; i++) {
    direction[i] = Math.floor(Math.random() * 20);
  }

  //genererer tilfeldig startposisjon
  for (let i = 0; i < playerAmount; i++) {
    xPos[i] = Math.floor(Math.random() * (resX - 100)) + 50;
    yPos[i] = Math.floor(Math.random() * (resY - 100)) + 50;
    ctx.beginPath();
    ctx.rect(xPos[i], yPos[i], 5, 5);
    ctx.fillStyle = color[i];
    ctx.fill();
    ctx.closePath();
  }
  countdown(playerAmount);
}

function countdown(playerAmount) {
  if (!muted) {
    music.play();
  }
  givePoints = false;
  ctx.beginPath();
  ctx.textAlign = 'center';
  ctx.font = '60px Arial';
  ctx.fillStyle = '#269098';
  ctx.fillText('3', resX / 2, resY / 2);
  ctx.closePath();
  startGamePlay(playerAmount);
  for (var i = 0; i < countDownId.length; i++) {
    clearTimeout(countDownId[i]);
  }
  countDownId[0] = setTimeout(() => {
    if (roundActive) {
      ctx.beginPath();
      ctx.clearRect(0, 0, resX, resY);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#269098';
      ctx.font = '60px Arial';
      ctx.fillText('2', resX / 2, resY / 2);
      ctx.closePath();
    }
  }, 800);
  countDownId[1] = setTimeout(() => {
    if (roundActive) {
      ctx.beginPath();
      ctx.clearRect(0, 0, resX, resY);
      ctx.textAlign = 'center';
      ctx.font = '60px Arial';
      ctx.fillStyle = '#269098';
      ctx.fillText('1', resX / 2, resY / 2);
      ctx.closePath();
    }
  }, 1600);
  countDownId[2] = setTimeout(() => {
    if (roundActive) {
      ctx.beginPath();
      ctx.clearRect(0, 0, resX, resY);
      ctx.textAlign = 'center';
      ctx.font = '60px Arial';
      ctx.fillStyle = '#269098';
      ctx.fillText('Start!', resX / 2, resY / 2);
      ctx.closePath();
    }
  }, 2400);
  countDownId[3] = setTimeout(() => {
    if (roundActive) {
      givePoints = true;
      ctx.clearRect(0, 0, resX, resY);
    }
  }, 3000);
}

//all logikk til selve spillet kjøres her
function startGamePlay(playerAmount) {
  let scoreLimit = 5; //grense for score, når en spiller når denne scoren har denne spilleren vunnet

  intervalID = setInterval(() => {
    let playersAlive = 0;
    for (let i = 0; i < playerAmount; i++) {
      if (!playerDead[i]) {
        player(i);
      }
      if (!playerDead[i]) {
        playersAlive++;
      }
    }
    if (playersAlive == 1) {
      //tøm siden og tegn inn posisjonene for spillerne hvis spillet avsluttes før nedtellingen er
      //ferdig, for å unngå overlapp mellom teksten for å starte neste runde, og nedtellingen
      if (!givePoints) {
        ctx.clearRect(0, 0, resX, resY);
        for (let i = 0; i < playerAmount; i++) {
          ctx.beginPath();
          ctx.rect(xPos[i], yPos[i], 5, 5);
          ctx.fillStyle = color[i];
          ctx.fill();
          ctx.closePath();
        }
      }
      for (let i = 0; i < playerAmount; i++) {
        if (!playerDead[i]) {
          if (givePoints) {
            score[i]++;
          }
          document.getElementById('player' + i).innerText = score[i];
          if (score[i] == scoreLimit) {
            gameActive = false;
            roundActive = false;
            music.pause();
            ctx.beginPath();
            ctx.textAlign = 'center';
            ctx.font = '30px Arial';
            ctx.fillStyle = '#269098';
            ctx.fillText(playerName[i] + ' won!', resX / 2, resY / 2);
            ctx.closePath();
            clearInterval(intervalID);
            for (let i = 0; i < score.length; i++) {
              score[i] = 0;
            }
          } else {
            music.pause();
            clearInterval(intervalID);
            ctx.beginPath();
            ctx.textAlign = 'center';
            ctx.font = '30px Arial';
            ctx.fillStyle = '#269098';
            ctx.fillText('Press space to start next round!', resX / 2, resY / 2);

            roundActive = false;
            ctx.closePath();
          }
        }
      }
    } else if (playersAlive == 0) {
      //tøm siden og tegn inn posisjonene for spillerne hvis spillet avsluttes før nedtellingen er
      //ferdig, for å unngå overlapp mellom teksten for å starte neste runde, og nedtellingen
      if (!givePoints) {
        ctx.clearRect(0, 0, resX, resY);
        for (let i = 0; i < playerAmount; i++) {
          ctx.beginPath();
          ctx.rect(xPos[i], yPos[i], 5, 5);
          ctx.fillStyle = color[i];
          ctx.fill();
          ctx.closePath();
        }
      }
      music.pause();
      clearInterval(intervalID);
      roundActive = false;
      ctx.beginPath();
      ctx.textAlign = 'center';
      ctx.font = '30px Arial';
      ctx.fillStyle = '#269098';
      ctx.fillText('Press space to start next round!', resX / 2, resY / 2);
      ctx.closePath();
    }
  }, /*tallet her velger hastighet på spillet, må være 50 pga nedtelling*/ 50);
}

function player(playerNr) {
  if (counterLimit[playerNr] == 0) {
    counterLimit[playerNr] = 65;
    breakActive[playerNr] = true;
  }
  if (counter[playerNr] >= counterLimit[playerNr]) {
    if (breakActive[playerNr]) {
      counterLimit[playerNr] = Math.floor(Math.random() * 15) + 60;
    } else {
      counterLimit[playerNr] = Math.floor(Math.random() * 15) + 10;
    }
    breakActive[playerNr] = !breakActive[playerNr];
    counter[playerNr] = 0;
    firstLoop[playerNr] = true;
  }

  if (leftPressed[playerNr] == rightPressed[playerNr]) {
  } else if (leftPressed[playerNr] == true) {
    direction[playerNr]--;
  } else {
    direction[playerNr]++;
  }
  //gjør at retningen "ruller tilbake" til motsatt ende hvis retningen går over 19 eller under 0
  if (direction[playerNr] > 19) {
    direction[playerNr] = 0;
  }
  if (direction[playerNr] < 0) {
    direction[playerNr] = 19;
  }
  lastXPos[playerNr] = xPos[playerNr];
  lastYPos[playerNr] = yPos[playerNr];
  xPos[playerNr] += movX[direction[playerNr]];
  yPos[playerNr] += movY[direction[playerNr]];
  counter[playerNr]++;
  ctx.beginPath();
  ctx.rect(xPos[playerNr], yPos[playerNr], 5, 5);
  ctx.fillStyle = color[playerNr];
  ctx.fill();
  ctx.closePath();
  if (firstLoop[playerNr]) {
    firstLoop[playerNr] = false;
    if (!breakActive[playerNr]) {
      ctx.clearRect(lastXPos[playerNr], lastYPos[playerNr], 5, 5);
      ctx.beginPath();
      ctx.rect(xPos[playerNr], yPos[playerNr], 5, 5);
      ctx.fillStyle = color[playerNr];
      ctx.fill();
      ctx.closePath();
    }
  } else if (breakActive[playerNr]) {
    ctx.clearRect(lastXPos[playerNr], lastYPos[playerNr], 5, 5);
    ctx.beginPath();
    ctx.rect(xPos[playerNr], yPos[playerNr], 5, 5);
    ctx.fillStyle = color[playerNr];
    ctx.fill();
    ctx.closePath();
  }

  checkCollision(playerNr);

  //sjekker om knappene for bevegelse er trykket ned, og endrer retningen hvis enten høyre eller venstre er trykket inn(ikke begge).
}
function checkCollision(playerNr) {
  if (
    //sjekker om spilleren er utenfor canvaset
    xPos[playerNr] < 0 ||
    yPos[playerNr] < 0 ||
    xPos[playerNr] > resX - 4 ||
    yPos[playerNr] > resY - 4
  ) {
    //hvis spilleren er utenfor canvaset blir spilleren satt til "død", og siste posisjon blir tegnet
    playerDead[playerNr] = true;
    if (!breakActive[playerNr]) {
      ctx.beginPath();
      ctx.rect(xPos[playerNr], yPos[playerNr], 5, 5);
      ctx.fillStyle = color[playerNr];
      ctx.fill();
      ctx.closePath();
    }
    return;
  }
  for (let i = xPos[playerNr] - 4; i < xPos[playerNr] + 5; i++) {
    if (i < 0 || i > resX) {
      continue;
    }
    jLoop: for (let j = 0; j < occupiedPoint[i].length; j++) {
      if (
        //gjør at spillet ikke sjekker kollisjon mot forrige posisjon, slik at man ikke kolliderer med seg selv når man ikke skal det.
        lastXPos[playerNr] == i &&
        lastYPos[playerNr] == occupiedPoint[i][j]
      ) {
        continue jLoop;
      }
      if (
        //sjekker om det er kollisjon mellom den nyeste posisjonen til spilleren og tidligere tegnede kvadrater
        xPos[playerNr] + 5 >= i &&
        xPos[playerNr] <= i + 5 &&
        yPos[playerNr] + 5 >= occupiedPoint[i][j] &&
        yPos[playerNr] <= occupiedPoint[i][j] + 5
      ) {
        //hvis det er en kollisjon, blir spilleren satt til "død", og siste posisjon blir tegnet, og lagt inn i occupiedPoint arrayet
        playerDead[playerNr] = true;
        if (!breakActive[playerNr]) {
          ctx.beginPath();
          ctx.rect(xPos[playerNr], yPos[playerNr], 5, 5);
          ctx.fillStyle = color[playerNr];
          ctx.fill();
          ctx.closePath();
          occupiedPoint[xPos[playerNr]].push(yPos[playerNr]);
        } else {
          ctx.clearRect(lastXPos[playerNr], lastYPos[playerNr], 5, 5);
        }
        ctx.beginPath();
        ctx.rect(i, occupiedPoint[i][j], 5, 5);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.closePath();
        return;
      }
    }
  }
  //legger inn posisjonen i occupiedPoint arrayet, slik at det kan bli sjekket kollisjon mot arrayet.
  if (!breakActive[playerNr]) {
    occupiedPoint[xPos[playerNr]].push(yPos[playerNr]);
  }
}
