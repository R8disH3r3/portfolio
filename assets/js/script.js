/*-----------------------------------*\
  #script.js - Main JavaScript
\*-----------------------------------*/

'use strict';

// Force page to start at top on reload (overrides browser's scroll restoration)
window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});

// Also handle when page is restored from back/forward cache (bfcache)
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.scrollTo(0, 0);
  }
});

// =============================================
// SIDEBAR TOGGLE (Mobile)
// =============================================
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
}


// =============================================
// NAVBAR ACTIVE LINK (Scroll Spy)
// =============================================
const navbarLinks = document.querySelectorAll('[data-nav-link]');
const sections = document.querySelectorAll('article[id]');

function updateActiveLink() {
  let currentSection = 'about';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navbarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);


// =============================================
// CERTIFICATE MODAL
// =============================================
const certModalOverlay = document.getElementById('certModalOverlay');
const certModalImg = document.getElementById('certModalImg');
const certModalTitle = document.getElementById('certModalTitle');
const certModalClose = document.getElementById('certModalClose');
const certItems = document.querySelectorAll('.cert-item');

if (certModalOverlay) {
  certItems.forEach(item => {
    const viewBtn = item.querySelector('.cert-view-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const imgSrc = item.getAttribute('data-cert-img');
        const title = item.getAttribute('data-cert-title');

        certModalImg.src = imgSrc;
        certModalTitle.textContent = title;
        certModalOverlay.classList.add('active');
      });
    }
  });

  certModalClose.addEventListener('click', function () {
    certModalOverlay.classList.remove('active');
  });

  certModalOverlay.addEventListener('click', function (e) {
    if (e.target === certModalOverlay) {
      certModalOverlay.classList.remove('active');
    }
  });
}


// =============================================
// SCROLL TO TOP BUTTON
// =============================================
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


// =============================================
// CONTACT FORM - Enable Submit Button
// =============================================
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formInputs = document.querySelectorAll('[data-form-input]');

if (contactForm && submitBtn) {
  function checkFormValidity() {
    const allFilled = Array.from(formInputs).every(input => input.value.trim() !== '');
    submitBtn.disabled = !allFilled;
  }

  formInputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
  });

  // Helper function: show toast popup
  function showToast(message, isError = false) {
    let toast = document.querySelector('.toast-popup');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-popup';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.borderColor = isError ? '#ff6b6b' : 'rgba(163, 98, 255, 0.5)';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Add submit handler (using toast instead of inline messages)
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending...';

    // Send email via EmailJS
    emailjs.sendForm('service_7vvykd3', 'template_ro0agcz', this)
      .then(() => {
        showToast('✅ Message sent! I\'ll get back to you soon.', false);
        contactForm.reset();
        submitBtn.disabled = true;   // keep disabled until new input
        submitBtn.querySelector('span').textContent = 'Send Message';
        // Re-run validity check (optional)
        const allFilled = Array.from(formInputs).every(input => input.value.trim() !== '');
        submitBtn.disabled = !allFilled;
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        showToast('❌ Something went wrong. Please try again or email me directly.', true);
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
      });
  });
}


// =============================================
// SMOOTH SCROLL for Navbar Links
// =============================================
navbarLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// =============================================
// Scroll reveal for sidebar, articles, and cards
// =============================================
const revealElements = document.querySelectorAll('.sidebar, article:not(#about), .service-item, .achieve-card, .project-card-enhanced, .cert-item, .timeline-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 }); // trigger when 15% visible

revealElements.forEach(el => {
  observer.observe(el);
});

// =============================================
// Video Modal for Project Demos
// =============================================
const videoModalOverlay = document.getElementById('videoModal');
const videoClose = document.querySelector('.video-modal-close');
const demoButtons = document.querySelectorAll('[data-video]');

if (videoModalOverlay) {
  if (videoModalOverlay.parentElement !== document.body) {
    document.body.appendChild(videoModalOverlay);
  }
  // Open modal when clicking demo buttons
  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = btn.getAttribute('data-video');
      const videoElem = videoModalOverlay.querySelector('video');
      if (videoSrc) {
        videoElem.src = videoSrc;
        videoModalOverlay.style.display = 'flex';
        videoElem.play();
      }
    });
  });

  // Close modal with close button
  if (videoClose) {
    videoClose.addEventListener('click', () => {
      videoModalOverlay.style.display = 'none';
      const videoElem = videoModalOverlay.querySelector('video');
      videoElem.pause();
      videoElem.src = '';
    });
  }

  // Close modal when clicking outside the modal content
  videoModalOverlay.addEventListener('click', (e) => {
    if (e.target === videoModalOverlay) {
      videoModalOverlay.style.display = 'none';
      const videoElem = videoModalOverlay.querySelector('video');
      videoElem.pause();
      videoElem.src = '';
    }
  });
}