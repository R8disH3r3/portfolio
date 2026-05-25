// ================================================================
// THEME TOGGLE — Dark / Light mode
// ================================================================
const html       = document.documentElement;
const toggleBtn  = document.getElementById('themeToggle');
const themeIcon  = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

// Load saved theme from browser, default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateToggleUI(savedTheme);

toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next); // remember preference
  updateToggleUI(next);
});

// Updates the icon and label on the toggle button
function updateToggleUI(theme) {
  if (theme === 'dark') {
    themeIcon.className    = 'fas fa-moon';
    themeLabel.textContent = 'Dark';
  } else {
    themeIcon.className    = 'fas fa-sun';
    themeLabel.textContent = 'Light';
  }
}

// ================================================================
// MOBILE HAMBURGER MENU
// ================================================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Called by onclick on each mobile menu link
function closeMobile() {
  mobileMenu.classList.remove('open');
}

// ================================================================
// TYPING ANIMATION
// Edit the roles array below to change what gets typed in hero
// ================================================================
const roles = [
  'Junior Application Developer',
  'Frontend Developer',
  'Vue.js & Flutter Dev',
  'Fresh CS Graduate 🎓',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

const typedEl = document.getElementById('typedText');

function typeLoop() {
  const current = roles[roleIndex];

  if (!isDeleting) {
    // Typing forward one character at a time
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800); // pause before deleting
      return;
    }
  } else {
    // Deleting one character at a time
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length; // move to next role
    }
  }

  // Typing: 80ms per character | Deleting: 40ms per character
  setTimeout(typeLoop, isDeleting ? 40 : 80);
}

typeLoop();

// ================================================================
// SCROLL REVEAL ANIMATION
// Watches .reveal elements — adds .visible when scrolled into view
// ================================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ================================================================
// CONTACT FORM — Formspree AJAX submit
// Replace YOUR_FORM_ID in index.html with your actual Formspree ID
// ================================================================
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method:  'POST',
      body:    data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.style.display           = 'none';
      success.style.display        = 'flex'; // show success message
    } else {
      alert('Something went wrong. Please email me directly.');
    }
  } catch {
    alert('Network error. Please check your connection.');
  }
});

// ================================================================
// AUTO-UPDATE FOOTER YEAR
// No need to manually update the year every year
// ================================================================
document.getElementById('year').textContent = new Date().getFullYear();