//Declaring variables
let leftEyeBlinking = document.querySelectorAll("#LeftEyeBlinking")[1];
let rightEyeBlinking = document.querySelectorAll("#RightEyeBlinking")[1];

// Blinkds down, waits half a sencond and calls blink up function
function SlothBlinkDown() {
  leftEyeBlinking.classList.toggle("hidden");
  rightEyeBlinking.classList.toggle("hidden");
  setTimeout(function() {
    SlothBlinkUp();
  }, 500);
}

// Opens eye, waits 4 seconds and starts cycle again
function SlothBlinkUp() {
  leftEyeBlinking.classList.toggle("hidden");
  rightEyeBlinking.classList.toggle("hidden");
  setTimeout(function() {
    SlothBlinkDown();
  }, 4000);
}

// Initiates the blink loop
SlothBlinkDown();

// Links range slider to rotate style of sloth
document.querySelector("#colorslider").addEventListener("input", function() {
  let slider = document.querySelector("#colorslider");
  document.querySelectorAll("#RotateArea")[1].style.transform =
    "rotate(" + parseInt(slider.value) + "deg)";
});
