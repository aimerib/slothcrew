/**
 * Modern Portfolio - Main JavaScript
 * @author Alex Ribeiro
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavigation();
  initScrollEffects();
  initBackToTop();
});

/**
 * Handle mobile navigation menu
 */
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Close mobile menu when a link is clicked
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}

/**
 * Handle scroll effects
 */
function initScrollEffects() {
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add shadow to header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight active nav item
    updateActiveNavLink();
  });

  // Update active nav link based on scroll position
  function updateActiveNavLink() {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= (sectionTop - 200)) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Animate section elements as they come into view
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Add animation classes and observe elements
  document.querySelectorAll('.work-item, .about-grid, .contact-form, .contact-info').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  
  if (backToTop) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
} 