// ============================================================
// Blindajes JR - Main JavaScript Controller
// ============================================================

(function() {
  'use strict';

  // ---- Header Scroll Effect ----
  const header = document.getElementById('site-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ---- Mobile Menu Toggle ----
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll Animations (Intersection Observer) ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ---- Counter Animation ----
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.dataset.target);
        const decimals = parseInt(counter.dataset.decimals) || 0;
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (easeOutExpo)
          const easeOut = 1 - Math.pow(2, -10 * progress);
          const current = target * easeOut;
          
          counter.textContent = decimals > 0 
            ? current.toFixed(decimals) 
            : Math.floor(current);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = decimals > 0 
              ? target.toFixed(decimals) 
              : target;
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
  });

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all items
      document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
        faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- Booking Widget ----
  let selectedService = null;
  let selectedZone = null;
  let selectedPrice = null;

  // Service buttons
  document.querySelectorAll('.widget-service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.widget-service-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedService = btn.dataset.service;
      selectedPrice = btn.dataset.price;
      document.getElementById('summary-service-name').textContent = selectedService;
      document.getElementById('summary-service-price').textContent = selectedPrice;
      document.getElementById('summary-price-row').style.display = 'flex';
      updateBookingButton();
    });
  });

  // Zone buttons
  document.querySelectorAll('.schedule-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.schedule-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedZone = btn.dataset.zone;
      document.getElementById('summary-zone-name').textContent = selectedZone;
      updateBookingButton();
    });
  });

  function updateBookingButton() {
    const submitBtn = document.getElementById('booking-submit-btn');
    if (selectedService && selectedZone) {
      submitBtn.disabled = false;
    }
  }

  // Submit booking via WhatsApp
  const submitBtn = document.getElementById('booking-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (selectedService && selectedZone) {
        const message = `Hola Blindajes JR, me interesa una cotización:\n\n` +
          `📋 Servicio: ${selectedService}\n` +
          `📍 Zona: ${selectedZone}\n` +
          `💰 Referencia: ${selectedPrice}\n\n` +
          `¿Podrían darme más información?`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/573242715156?text=${encodedMessage}`, '_blank');
      }
    });
  }

  // ---- Social Proof Toast ----
  const toastNames = [
    { name: 'Carlos M.', time: 'Hace 3 min', service: 'Puerta Blindada Nueva', avatar: 'avatar-carlos.jpg' },
    { name: 'Ana P.', time: 'Hace 8 min', service: 'Reparación de Puerta', avatar: 'avatar-ana.jpg' },
    { name: 'Diego R.', time: 'Hace 12 min', service: 'Cambio de Cerradura', avatar: 'avatar-diego.jpg' },
    { name: 'María L.', time: 'Hace 15 min', service: 'Puerta Acabado Madera', avatar: 'avatar-maria.jpg' },
    { name: 'Andrés G.', time: 'Hace 22 min', service: 'Cotización de Puerta', avatar: 'avatar-andres.jpg' },
    { name: 'Laura S.', time: 'Hace 30 min', service: 'Puerta Blindada Nueva', avatar: 'avatar-laura.jpg' },
  ];

  let toastIndex = 0;
  const toast = document.getElementById('social-proof-toast');

  function showToast() {
    const data = toastNames[toastIndex % toastNames.length];
    document.getElementById('toast-name').textContent = data.name;
    document.getElementById('toast-time').textContent = data.time;
    document.getElementById('toast-service').textContent = data.service;
    document.getElementById('toast-avatar-img').src = data.avatar;
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);

    toastIndex++;
  }

  // Show first toast after 8 seconds, then every 25 seconds
  setTimeout(() => {
    showToast();
    setInterval(showToast, 25000);
  }, 8000);

  // ---- Hero Entry Animation ----
  window.addEventListener('load', () => {
    document.querySelector('.hero-content')?.classList.add('animate-enter');
    document.querySelector('.hero-visual')?.classList.add('animate-enter-right');
  });

  // ---- Active Nav Highlight ----
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ---- Gallery Lightbox Effect ----
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('expanded');
    });
  });

})();
