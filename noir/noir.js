/**
 * Noir Photography - Gallery JavaScript
 * @author Aimeri Baddouh
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize gallery
  initGallery();
  
  // Initialize view toggle
  initViewToggle();
  
  // Initialize lightbox
  initLightbox();
});

/**
 * Load and display gallery images
 */
function initGallery() {
  const gallery = document.getElementById('gallery');
  const loader = document.querySelector('.gallery-loader');
  
  const cloudinaryUrl = 'https://res.cloudinary.com/slothcrew/image/list/slothcrewnoir.json';
  const thumbnailSize = window.innerWidth <= 768 ? 300 : 400;
  const thumbnailUrl = `https://res.cloudinary.com/slothcrew/image/upload/c_fill,g_auto,w_${thumbnailSize},h_${thumbnailSize}/`;
  
  // Show loader
  loader.style.display = 'flex';
  
  // Fetch images from Cloudinary
  fetch(cloudinaryUrl)
    .then(response => response.json())
    .then(data => {
      // Hide loader when data is received
      loader.style.display = 'none';
      
      // Process each image
      data.resources.forEach((resource, index) => {
        const imageUrl = thumbnailUrl + resource.public_id + '.' + resource.format;
        const fullImageUrl = `https://res.cloudinary.com/slothcrew/image/upload/${resource.public_id}.${resource.format}`;
        
        // Create gallery item
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.animationDelay = `${index * 0.05}s`;
        
        // Create image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Noir photograph ${index + 1}`;
        img.loading = 'lazy';
        
        // Add click event to open lightbox
        galleryItem.addEventListener('click', () => {
          openLightbox(fullImageUrl);
        });
        
        // Append image to gallery item
        galleryItem.appendChild(img);
        
        gallery.appendChild(galleryItem);
      });
      shuffleGallery(gallery);
    })
    .catch(error => {
      console.error('Error loading images:', error);
      loader.style.display = 'none';
      gallery.innerHTML = `
        <div class="error-message">
          <p>Could not load images. Please try again later.</p>
        </div>
      `;
    });  
}

function shuffleGallery(gallery) {
  // Convert children to array
  const children = Array.from(gallery.children);
  
  // Shuffle array using Fisher-Yates algorithm
  for (let i = children.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * children.length);
    // Remove and reinsert in random order
    gallery.appendChild(children[j]);
  }
}

/**
 * Initialize gallery view toggle
 */
function initViewToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const gallery = document.getElementById('gallery');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      toggleBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Get view type from data attribute
      const viewType = btn.getAttribute('data-view');
      
      // Remove all view classes
      gallery.classList.remove('grid-view', 'column-view');
      
      // Add selected view class
      gallery.classList.add(`${viewType}-view`);
    });
  });
}

/**
 * Initialize lightbox functionality
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxDownload = document.getElementById('lightbox-download');
  
  // Close lightbox when clicking close button
  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * Open lightbox with specified image
 */
function openLightbox(imageUrl) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxDownload = document.getElementById('lightbox-download');
  
  // Set image source
  lightboxImg.src = imageUrl;
  
  // Set download link
  lightboxDownload.href = imageUrl;
  
  // Show lightbox
  lightbox.classList.add('active');
  
  // Prevent scrolling on body
  document.body.style.overflow = 'hidden';
}

/**
 * Close the lightbox
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  
  // Hide lightbox
  lightbox.classList.remove('active');
  
  // Restore scrolling on body
  document.body.style.overflow = '';
} 