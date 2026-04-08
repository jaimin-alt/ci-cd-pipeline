/* ===========================
   Main JavaScript
   - Mobile menu toggle
   - Navbar scroll effect
   - Scroll reveal animations
   - Contact form validation
   - Smooth scrolling
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Mobile Menu Toggle ───────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ─── Navbar Scroll Effect ─────────────────────────
  const navbar = document.getElementById('navbar');

  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run once on load
  }

  // ─── Scroll Reveal ────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ─── Active Nav Link ──────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── Contact Form Validation ──────────────────────
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    /**
     * Validates an email address format
     * @param {string} email
     * @returns {boolean}
     */
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    /**
     * Shows error state on an input field
     * @param {HTMLInputElement} input
     * @param {HTMLElement} errorEl
     * @param {string} message
     */
    function showError(input, errorEl, message) {
      input.classList.add('error');
      input.classList.remove('success');
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }

    /**
     * Clears error state from an input field
     * @param {HTMLInputElement} input
     * @param {HTMLElement} errorEl
     */
    function clearError(input, errorEl) {
      input.classList.remove('error');
      errorEl.classList.remove('show');
    }

    /**
     * Marks an input as valid
     * @param {HTMLInputElement} input
     * @param {HTMLElement} errorEl
     */
    function markValid(input, errorEl) {
      input.classList.remove('error');
      input.classList.add('success');
      errorEl.classList.remove('show');
    }

    // Real-time validation on blur
    nameInput.addEventListener('blur', () => {
      if (nameInput.value.trim() === '') {
        showError(nameInput, nameError, 'Please enter your name');
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, nameError, 'Name must be at least 2 characters');
      } else {
        markValid(nameInput, nameError);
      }
    });

    emailInput.addEventListener('blur', () => {
      if (emailInput.value.trim() === '') {
        showError(emailInput, emailError, 'Please enter your email');
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Please enter a valid email address');
      } else {
        markValid(emailInput, emailError);
      }
    });

    messageInput.addEventListener('blur', () => {
      if (messageInput.value.trim() === '') {
        showError(messageInput, messageError, 'Please enter a message');
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, messageError, 'Message must be at least 10 characters');
      } else {
        markValid(messageInput, messageError);
      }
    });

    // Clear errors on input
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        const errorEl = document.getElementById(`${input.id}-error`);
        if (input.classList.contains('error')) {
          clearError(input, errorEl);
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate name
      if (nameInput.value.trim() === '') {
        showError(nameInput, nameError, 'Please enter your name');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, nameError, 'Name must be at least 2 characters');
        isValid = false;
      } else {
        markValid(nameInput, nameError);
      }

      // Validate email
      if (emailInput.value.trim() === '') {
        showError(emailInput, emailError, 'Please enter your email');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        isValid = false;
      } else {
        markValid(emailInput, emailError);
      }

      // Validate message
      if (messageInput.value.trim() === '') {
        showError(messageInput, messageError, 'Please enter a message');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, messageError, 'Message must be at least 10 characters');
        isValid = false;
      } else {
        markValid(messageInput, messageError);
      }

      // If valid, show success toast and reset
      if (isValid) {
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        [nameInput, emailInput, messageInput].forEach(input => {
          input.classList.remove('success');
        });
      }
    });
  }

  // ─── Toast Notification ───────────────────────────
  /**
   * Displays a toast notification
   * @param {string} message
   * @param {'success'|'error'} type
   */
  window.showToast = function(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${type === 'success'
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
          }
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);

    // Remove after animation
    setTimeout(() => toast.remove(), 3000);
  };

  // ─── Smooth Scroll for Anchor Links ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── Typing Effect for Hero (optional) ────────────
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const words = ['Ideas', 'Stories', 'Knowledge', 'Insights'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500; // Pause before new word
      }

      setTimeout(type, speed);
    }

    type();
  }
});
