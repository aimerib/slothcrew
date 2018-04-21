function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
document.querySelector("#colorslider").value = parseInt("FF0066", 16);
document.querySelector("#Color").style.fill = "#FF0066";
document.querySelector("#colorslider").addEventListener("input", function() {
  let slider = document.querySelector("#colorslider");
  document.querySelector("#Color").style.fill = parseInt(slider.value)
    .toString(16)
    .padStart(6, "0");
  document.querySelector("#selectedcolor").value =
    "#" +
    parseInt(slider.value)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();
});
document.querySelector("#selectedcolor").addEventListener("change", function() {
  let slider = document.querySelector("#colorslider");
  document.querySelector("#Color").style.fill = document.querySelector(
    "#selectedcolor"
  ).value;
  document.querySelector("#colorslider").value = parseInt(
    rgb2hex(document.querySelector("#Color").style.fill),
    16
  );
});
