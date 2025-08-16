// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

// Mobile navigation toggle
function toggleMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  if (toggle) toggle.classList.toggle('menu-open');
  
  const card = document.querySelector('.mobile-nav-card');
  if (card.classList.contains('show')) {
    gsap.to(card, {
      x: '100%',
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => card.classList.remove('show')
    });
    // Enable body scrolling
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
  } else {
    card.classList.add('show');
    gsap.fromTo(card, {
      x: '100%',
      opacity: 0
    }, {
      x: '0%',
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
    // Disable body scrolling when menu is open
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Footer animation
  gsap.from(".footer", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power1.out",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 90%",
      toggleActions: "play none none none"
    }
  });

  // 3D hover effect for product images - only on desktop
  if (window.innerWidth > 768) {
    document.querySelectorAll('.image').forEach(card => {
      const image = card.querySelector('img');
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * -10;
        
        image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
      });
      
      card.addEventListener('mouseleave', () => {
        image.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // Scroll button functionality
  document.querySelector('.scroll-btn').addEventListener('click', function(e) {
    e.preventDefault();
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: '#products', offsetY: 0 },
      ease: 'power2.inOut'
    });
  });

  // Navigation link smooth scrolling
  document.querySelectorAll('.navbar a[href^="#"], .mobile-nav-card a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      
      // Close mobile nav if it's open
      if (document.querySelector('.mobile-nav-card').classList.contains('show')) {
        toggleMobileNav();
      }
      
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: target, offsetY: 0 },
        ease: 'power2.inOut'
      });
    });
  });

  // Back to top button functionality
  const backToTopBtn = document.getElementById('backToTop');
  
  backToTopBtn.addEventListener('click', function() {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: '#home', offsetY: 0 },
      ease: 'power2.inOut'
    });
  });

  // Show/hide back to top button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  // Contact form character counter
  const messageTextarea = document.querySelector('textarea[name="message"]');
  if (messageTextarea) {
    messageTextarea.addEventListener('input', function() {
      updateWordCount(this, 400);
    });
  }

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showConfirmation();
    });
  }
  
  // Add touch support for ingredient cards on mobile
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.querySelectorAll('.ingredient-card').forEach(card => {
      card.addEventListener('touchstart', function() {
        // Close any other open tooltips
        document.querySelectorAll('.ingredient-card .tooltip-info').forEach(tip => {
          tip.style.opacity = '0';
          tip.style.visibility = 'hidden';
        });
        
        // Show this tooltip
        const tooltip = this.querySelector('.tooltip-info');
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        
        // Hide after 3 seconds
        setTimeout(() => {
          tooltip.style.opacity = '0';
          tooltip.style.visibility = 'hidden';
        }, 3000);
      });
    });
  }
  
  // Handle orientation changes
  window.addEventListener('orientationchange', function() {
    // Small delay to allow the browser to complete the orientation change
    setTimeout(() => {
      adjustLayoutForOrientation();
    }, 200);
  });
  
  // Initial orientation check
  adjustLayoutForOrientation();
});

// Adjust layout based on orientation
function adjustLayoutForOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobile = window.innerWidth <= 768;
  
  if (isLandscape && isMobile) {
    // Optimize for mobile landscape
    document.documentElement.style.setProperty('--home-height', 'auto');
  } else {
    // Reset to default
    document.documentElement.style.removeProperty('--home-height');
  }
}

// Update character count for textarea
function updateWordCount(el, maxChars) {
  const count = el.value.length;
  if (count > maxChars) {
    el.value = el.value.substring(0, maxChars);
  }
  
  const wordCountElement = document.getElementById("wordCount");
  if (wordCountElement) {
    wordCountElement.textContent = el.value.length;
    
    if (el.value.length >= 350) {
      wordCountElement.style.color = '#d32f2f';
    } else {
      wordCountElement.style.color = '#2e7d32';
    }
  }
}

// Show form confirmation message
function showConfirmation() {
  const confirmationMessage = document.getElementById('form-confirmation');
  if (confirmationMessage) {
    confirmationMessage.style.display = 'block';
    
    // Reset form
    document.getElementById('contact-form').reset();
    document.getElementById('wordCount').textContent = '0';
    
    // Hide message after 5 seconds
    setTimeout(() => {
      confirmationMessage.style.display = 'none';
    }, 5000);
  }
} 