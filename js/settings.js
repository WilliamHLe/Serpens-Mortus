var c1 = document.getElementById("col1");
var c2 = document.getElementById("col2");

c1.addEventListener("change", c);
c2.addEventListener("change", c);

function c() {
  color.splice(0, 2, c1.value, c2.value);
}

var name1 = document.getElementById("i1");
var name2 = document.getElementById("i2");

function name() {
  if (name1.value !== "" && name2.value !== "") {
    document.getElementById("n1").innerHTML = name1.value;
    document.getElementById("n2").innerHTML = name2.value;
  }
}

var aud = document.getElementById("myAudio");

function playAud() {
  aud.currentTime = 2.5;
  aud.play();
}
