document.addEventListener('DOMContentLoaded', function () {

    // Get all "navbar-burger" elements
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
      // Add a click event on each of them
      $navbarBurgers.forEach(function ($el) {
        $el.addEventListener('click', function () {
  
          // Get the target from the "data-target" attribute
          var target = $el.dataset.target;
          var $target = document.getElementById(target);
  
          // Toggle the class on both the "navbar-burger" and the "navbar-menu"
          $el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
  
        });
      });
    }
  
  });
  
  function changeStyle() {
    const bodyHtml = document.querySelector("body");
    const navbarHtml = document.querySelector("#slothcrewNavBar");
    const navbarBurgerHtml = document.querySelector(".navbar-burger");
    const navbarItemHtml = document.querySelectorAll(".navbar-item");
    const footerHtml = document.querySelector(".page-footer");
    const footerCopyrightHtml = document.querySelector(".footer-copyright");
    const pantoneBtn = document.querySelector("#pantoneBtn");

    bodyHtml.classList.toggle("background-color-pantone");
    navbarHtml.classList.toggle("background-color-pantone");
    for (item of navbarItemHtml){
      item.classList.toggle("navbar-item-pantone-style");
    }
    footerHtml.classList.toggle("footer-background--pantone");
    footerCopyrightHtml.classList.toggle("footer-background--pantone");
    pantoneBtn.classList.toggle("pantoneBtn--regular");
    pantoneBtn.innerHTML = (pantoneBtn.innerHTML === "Pantone Ultra Violet") ? "Regular Style" : "Pantone Ultra Violet";
  }