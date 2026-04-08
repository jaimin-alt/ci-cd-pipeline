/* ═══════════════════════════════════════════════════════════
   MAIN.JS — Awwwards Level Animation Engine
   GSAP, ScrollTrigger, Lenis Smooth Scroll, Magnetic Physics
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ━━━ LENIS SMOOTH SCROLLING ━━━ */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Integrate Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);



  /* ━━━ NAVIGATION SCROLL STATE ━━━ */
  const nav = document.querySelector('.nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: self => {
        if (self.direction === 1) {
          nav.classList.add('scrolled');
        } else if (self.scroll() <= 80) {
          nav.classList.remove('scrolled');
        }
      }
    });
  }

  /* ━━━ MOBILE MENU TOGGLE ━━━ */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      if(isActive) {
        lenis.stop();
        gsap.fromTo('.mobile-menu__link', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.2 }
        );
      } else {
        lenis.start();
      }
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        lenis.start();
      });
    });
  }

  /* ━━━ INITIAL LOAD REVEALS (HERO) ━━━ */
  // Animate the masked h1 elements specifically
  if(document.querySelector('.line-inner')) {
    gsap.to('.line-inner', {
      y: "0%",
      rotation: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.2
    });
  }

  // Classic fade up for other hero elements
  gsap.fromTo('.fade-up', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out", delay: 0.4 }
  );


  /* ━━━ GSAP SCROLL REVEALS ━━━ */
  // Replaces the old IntersectionObserver
  gsap.utils.toArray('.reveal').forEach((el) => {
    // If it has a delay data attribute, we can use it, but scrollTrigger staggering is nicer
    const delay = parseInt(el.getAttribute('data-delay') || '0', 10) / 1000;
    
    gsap.fromTo(el, 
      { opacity: 0, y: 40 },
      {
        opacity: 1, 
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // trigger when top of element hits 85% of viewport
          toggleActions: "play none none reverse" // re-animates if scrolled back up
        }
      }
    );
  });

  /* ━━━ HOME PAGE SPECIFIC: PARALLAX & PINNING ━━━ */
  const archSection = document.getElementById('architecture');
  if (archSection && window.innerWidth > 768) {
    // Subtle background parallax on the overall hero
    gsap.to('.hero__grid', {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Draw SVG connectors tightly linked to scroll scrub
    gsap.utils.toArray('.connector-path').forEach(path => {
      // Setup dasharray identical to path length
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length; // start hidden
      
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: path,
          start: "top 70%",
          end: "top 30%",
          scrub: 1.5 // Smooth scrubbing catchup
        }
      });
    });
  }

  /* ━━━ SVG ARCHITECTURE DIAGRAM (HERO) - MAGIC PROXIMITY ━━━ */
  const archDiagram = document.querySelector('.arch-diagram');
  const archNodes = document.querySelectorAll('.arch-node');
  
  if (archDiagram && window.innerWidth > 768) {
    archDiagram.addEventListener('mousemove', (e) => {
      const rect = archDiagram.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      archNodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        // Calculate center of node relative to the diagram
        const nodeX = (nodeRect.left - rect.left) + nodeRect.width / 2;
        const nodeY = (nodeRect.top - rect.top) + nodeRect.height / 2;
        const distance = Math.sqrt(Math.pow(mouseX - nodeX, 2) + Math.pow(mouseY - nodeY, 2));

        const circle = node.querySelector('.arch-node__circle');
        
        if (distance < 140) {
          // GSAP interpolation for smooth scaling
          const scale = 1 + (1 - distance / 140) * 0.15;
          gsap.to(circle, {
            scale: scale,
            boxShadow: `0 0 ${25 - distance / 6}px rgba(201, 241, 75, ${0.4 - distance / 350})`,
            duration: 0.3,
            ease: "power2.out"
          });
        } else {
          gsap.to(circle, {
            scale: 1,
            boxShadow: 'none',
            duration: 0.5,
            ease: "power2.out"
          });
        }
      });
    });

    archDiagram.addEventListener('mouseleave', () => {
      archNodes.forEach(node => {
        const circle = node.querySelector('.arch-node__circle');
        gsap.to(circle, { scale: 1, boxShadow: 'none', duration: 0.6, ease: "elastic.out(1, 0.3)" });
      });
    });
  }

  /* ━━━ COPY CODE BLOCK ━━━ */
  document.querySelectorAll('.code-block__copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock.querySelector('.code-block__content');
      const text = code.innerText.replace(/^\d+\s*/gm, '');
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        // Fancy GSAP text pop
        gsap.to(btn, { scale: 1.1, color: '#C9F14B', duration: 0.2, yoyo: true, repeat: 1 });
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = '';
        }, 2000);
      });
    });
  });

  /* ━━━ BLOG FILTER (GSAP FLIP-like fade) ━━━ */
  const filterChips = document.querySelectorAll('.filter-chip');
  const blogCards = document.querySelectorAll('.blog-card');

  if (filterChips.length > 0 && blogCards.length > 0) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('filter-chip--active'));
        chip.classList.add('filter-chip--active');

        const category = chip.getAttribute('data-filter');

        const targets = [];
        const toHide = [];
        
        blogCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            targets.push(card);
            card.style.display = 'flex'; // assure it's visible in dom
          } else {
            toHide.push(card);
          }
        });

        // GSAP animate out
        if(toHide.length) {
          gsap.to(toHide, {
            opacity: 0,
            y: 15,
            duration: 0.3,
            onComplete: () => toHide.forEach(c => c.style.display = 'none')
          });
        }

        // GSAP animate in
        if(targets.length) {
          gsap.fromTo(targets, 
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.1 }
          );
        }
      });
    });
  }

  /* ━━━ CONTACT FORM VALIDATION ━━━ */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');

  if (contactForm) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(input) {
      const error = input.parentElement.querySelector('.form-error');
      const value = input.value.trim();

      if (!value) {
        input.classList.add('form-input--error');
        input.classList.remove('form-input--valid');
        if (error) {
          error.textContent = 'This field is required';
          error.classList.add('visible');
        }
        return false;
      }

      if (input.type === 'email' && !emailRegex.test(value)) {
        input.classList.add('form-input--error');
        input.classList.remove('form-input--valid');
        if (error) {
          error.textContent = 'Please enter a valid email address';
          error.classList.add('visible');
        }
        return false;
      }

      input.classList.remove('form-input--error');
      input.classList.add('form-input--valid');
      if (error) error.classList.remove('visible');
      return true;
    }

    contactForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('form-input--error')) {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('.form-input');
      let isValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) isValid = false;
      });

      if (isValid) {
        // Dramatic GSAP exit
        gsap.to(contactForm, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => {
            contactForm.style.display = 'none';
            if (formSuccess) {
              formSuccess.classList.add('visible');
              gsap.fromTo(formSuccess, 
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }
              );
            }
          }
        });
      }
    });
  }

  /* ━━━ SMOOTH SCROLL FOR ANCHOR LINKS (Via Lenis) ━━━ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -64, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    });
  });

})();
