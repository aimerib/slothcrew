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

  function toggleMenu () {
    document.querySelector('.navbar-burger').classList.toggle("is-active")
    document.querySelector('.navbar-menu').classList.toggle("is-active")
  }
  
  function changeStyle() {
    const bodyHtml = document.querySelector("body");
    const navbarHtml = document.querySelector("#slothcrewNavBar");
    const navbarBurgerHtml = document.querySelector(".navbar-burger");
    const navbarItemHtml = document.querySelectorAll(".navbar-item");
    const footerHtml = document.querySelector(".page-footer");
    const footerCopyrightHtml = document.querySelector(".footer-copyright");
    const pantoneBtn = document.querySelector("#pantoneBtn");
    const buttons = document.querySelectorAll('.pantoneBtn--regular')

    bodyHtml.classList.toggle("background-color-hotpink");
    navbarHtml.classList.toggle("background-color-hotpink");
    for (item of navbarItemHtml){
      item.classList.toggle("navbar-item-hotpink-style");
    }
    for (button of buttons) {
      button.classList.toggle('pantoneBtn')
    }
    footerHtml.classList.toggle("footer-background--hotpink");
    footerCopyrightHtml.classList.toggle("footer-background--hotpink");
    pantoneBtn.classList.toggle("pantoneBtn--regular");
    
  }