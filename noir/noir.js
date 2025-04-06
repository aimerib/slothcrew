document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  
  initViewToggle();
  
  initLightbox();
});

function initGallery() {
  const gallery = document.getElementById('gallery');
  const loader = document.querySelector('.gallery-loader');
  
  const cloudinaryUrl = 'https://res.cloudinary.com/slothcrew/image/list/slothcrewnoir.json';
  const thumbnailSize = window.innerWidth <= 768 ? 300 : 400;
  const thumbnailUrl = `https://res.cloudinary.com/slothcrew/image/upload/c_fill,g_auto,w_${thumbnailSize},h_${thumbnailSize}/`;
  
  loader.style.display = 'flex';
  
  fetch(cloudinaryUrl)
    .then(response => response.json())
    .then(data => {
      loader.style.display = 'none';
      
      data.resources.forEach((resource, index) => {
        const imageUrl = thumbnailUrl + resource.public_id + '.' + resource.format;
        const fullImageUrl = `https://res.cloudinary.com/slothcrew/image/upload/${resource.public_id}.${resource.format}`;
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.animationDelay = `${index * 0.05}s`;
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Noir photograph ${index + 1}`;
        img.loading = 'lazy';
        
        galleryItem.addEventListener('click', () => {
          openLightbox(fullImageUrl);
        });
        
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
  const children = Array.from(gallery.children);
  
  for (let i = children.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * children.length);
    gallery.appendChild(children[j]);
  }
}

function initViewToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const gallery = document.getElementById('gallery');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      
      btn.classList.add('active');
      
      const viewType = btn.getAttribute('data-view');
      
      gallery.classList.remove('grid-view', 'column-view');
      
      gallery.classList.add(`${viewType}-view`);
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxDownload = document.getElementById('lightbox-download');
  
  lightboxClose.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function openLightbox(imageUrl) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxDownload = document.getElementById('lightbox-download');
  
  lightboxImg.src = imageUrl;
  
  lightboxDownload.href = imageUrl;
  
  lightbox.classList.add('active');
  
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  
  lightbox.classList.remove('active');
  
  document.body.style.overflow = '';
} 