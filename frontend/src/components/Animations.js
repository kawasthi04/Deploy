// Main animation script for sci-fi themed page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initPageAnimations();
    initHoverEffects();
    initScrollEffects();
    initLayoutToggleEffects();
    initParticleBackground();
  });
  
  // Create a sci-fi particle background effect
  function initParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-background';
    
    // Set canvas styling
    Object.assign(canvas.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none'
    });
    
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to match window dimensions
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle system
    const particles = [];
    const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive particle count
    const particleColors = ['#45a29e', '#66fcf1', '#415a77', '#1f2833'];
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    
    // Animation loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Random direction changes
        if (Math.random() < 0.01) {
          p.vx = Math.random() * 0.2 - 0.1;
          p.vy = Math.random() * 0.2 - 0.1;
        }
      });
      
      // Connect particles with lines when they're close
      connectParticles();
      
      requestAnimationFrame(animateParticles);
    }
    
    // Connect nearby particles with subtle lines
    function connectParticles() {
      const maxDistance = 100;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = '#45a29e';
            ctx.globalAlpha = 0.2 * (1 - distance / maxDistance);
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    animateParticles();
  }
  
  // Page loading animations
  function initPageAnimations() {
    // Staggered fade-in for news items
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 + (index * 50)); // Staggered timing
    });
    
    // Gradient pulse effect for header
    const header = document.querySelector('header.top');
    if (header) {
      header.style.background = 'linear-gradient(90deg, #1f2833, #0b0c10)';
      header.style.backgroundSize = '200% 100%';
      header.style.animation = 'gradientPulse 8s ease infinite';
      
      // Add keyframe animation
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes gradientPulse {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Create a holographic glow effect for buttons
    const buttons = document.querySelectorAll('button:not(.close-btn), .add-article-btn, .custom-file-upload');
    buttons.forEach(button => {
      button.classList.add('holographic-glow');
    });
    
    // Add holographic glow CSS
    const glowStyle = document.createElement('style');
    glowStyle.innerHTML = `
      .holographic-glow {
        position: relative;
        overflow: hidden;
      }
      
      .holographic-glow::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent 45%,
          rgba(66, 220, 219, 0.1) 50%,
          transparent 55%
        );
        transform: rotate(30deg);
        animation: holographicSweep 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      
      @keyframes holographicSweep {
        0% { transform: rotate(30deg) translateY(100%); }
        100% { transform: rotate(30deg) translateY(-100%); }
      }
    `;
    document.head.appendChild(glowStyle);
  }
  
  // Hover effects for interactive elements
  function initHoverEffects() {
    // Enhanced hover effect for news items
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, background 0.3s ease';
        this.style.transform = 'translateY(-5px) scale(1.01)';
        this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4), 0 0 10px rgba(69, 162, 158, 0.3)';
        this.style.background = '#27303f';
        
        // Highlight tags on hover
        const tags = this.querySelectorAll('.tag');
        tags.forEach(tag => {
          tag.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
          tag.style.transform = 'scale(1.05)';
          tag.style.boxShadow = '0 0 8px rgba(69, 162, 158, 0.5)';
        });
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        this.style.background = '#1f2833';
        
        // Restore tags
        const tags = this.querySelectorAll('.tag');
        tags.forEach(tag => {
          tag.style.transform = 'scale(1)';
          tag.style.boxShadow = 'none';
        });
      });
    });
    
    // Pulsing effect for tags
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
      if (tag.classList.contains('category-tag')) {
        tag.style.animation = 'tagPulse 3s infinite alternate';
      }
    });
    
    // Add keyframe for tag pulse
    const tagStyle = document.createElement('style');
    tagStyle.innerHTML = `
      @keyframes tagPulse {
        0% { box-shadow: 0 0 2px rgba(69, 162, 158, 0.2); }
        100% { box-shadow: 0 0 8px rgba(69, 162, 158, 0.6); }
      }
    `;
    document.head.appendChild(tagStyle);
    
    // Interactive button effects
    const buttons = document.querySelectorAll('button:not(.close-btn), .add-article-btn, .custom-file-upload');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s ease, box-shadow 0.3s ease';
        this.style.transform = 'translateY(-2px) scale(1.02)';
        this.style.boxShadow = '0 4px 12px rgba(69, 162, 158, 0.4)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
      });
      
      button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(1px) scale(0.98)';
      });
      
      button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      });
    });
  }
  
  // Scroll effects
  function initScrollEffects() {
    // Smooth scrolling for news container
    const newsContainer = document.querySelector('.news-container');
    if (newsContainer) {
      // Add a subtle scroll track glow
      newsContainer.style.scrollBehavior = 'smooth';
      
      // Reveal items on scroll
      const revealOnScroll = function() {
        const newsItems = document.querySelectorAll('.news-item');
        const containerTop = newsContainer.scrollTop;
        const containerBottom = containerTop + newsContainer.clientHeight;
        
        newsItems.forEach(item => {
          const itemTop = item.offsetTop - newsContainer.offsetTop;
          const itemBottom = itemTop + item.clientHeight;
          
          // Check if item is at least partially visible
          if (itemTop < containerBottom && itemBottom > containerTop) {
            if (!item.classList.contains('item-visible')) {
              item.classList.add('item-visible');
              item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }
          } else {
            if (!item.classList.contains('always-visible')) {
              item.style.opacity = '0.7';
              item.style.transform = 'translateY(10px) scale(0.98)';
            }
          }
        });
      };
      
      // Initialize items
      const newsItems = document.querySelectorAll('.news-item');
      newsItems.forEach(item => {
        item.style.opacity = '0.7';
        item.style.transform = 'translateY(10px) scale(0.98)';
      });
      
      newsContainer.addEventListener('scroll', revealOnScroll);
      // Initial call to show visible items
      setTimeout(revealOnScroll, 200);
    }
    
    // Add style for item-visible class
    const scrollStyle = document.createElement('style');
    scrollStyle.innerHTML = `
      .item-visible {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
      }
      
      .news-container::-webkit-scrollbar-track {
        animation: trackGlow 4s infinite alternate;
      }
      
      @keyframes trackGlow {
        0% { box-shadow: 0 0 2px rgba(69, 162, 158, 0.2); }
        100% { box-shadow: 0 0 8px rgba(69, 162, 158, 0.4); }
      }
    `;
    document.head.appendChild(scrollStyle);
  }
  
  // Layout toggle animations
  function initLayoutToggleEffects() {
    const layoutLabels = document.querySelectorAll('.layout-label');
    const newsContainer = document.querySelector('.news-container');
    
    if (layoutLabels.length > 0 && newsContainer) {
      layoutLabels.forEach(label => {
        label.addEventListener('click', function() {
          // Remove active class from all labels
          layoutLabels.forEach(l => l.classList.remove('active'));
          
          // Add active class to clicked label
          this.classList.add('active');
          
          // Apply layout change with animation
          const layoutType = this.getAttribute('data-layout');
          
          // Animate container transition
          newsContainer.style.transition = 'opacity 0.3s ease';
          newsContainer.style.opacity = '0';
          
          setTimeout(() => {
            // Remove previous layout classes
            newsContainer.classList.remove('grid', 'inline');
            // Add new layout class
            newsContainer.classList.add(layoutType);
            
            // Animate items into new positions
            const newsItems = document.querySelectorAll('.news-item');
            newsItems.forEach((item, index) => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '0';
              item.style.transform = layoutType === 'grid' ? 
                'translateY(20px)' : 'translateX(-20px)';
              
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translate(0)';
              }, 100 + (index * 30));
            });
            
            // Fade container back in
            newsContainer.style.opacity = '1';
          }, 300);
        });
      });
    }
  }
  
  // Modal/popup animations
  function setupModalAnimations() {
    // This function gets called when a modal is opened
    const modalOverlay = document.querySelector('.popup-overlay, .login-popup-overlay');
    const modalContent = document.querySelector('.popup-content, .login-popup-content');
    
    if (modalOverlay && modalContent) {
      // Initial state
      modalOverlay.style.opacity = '0';
      modalContent.style.opacity = '0';
      modalContent.style.transform = 'translateY(-20px) scale(0.95)';
      
      // Animation
      modalOverlay.style.transition = 'opacity 0.3s ease';
      modalContent.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      // Show animation
      setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0) scale(1)';
      }, 10);
      
      // Add close animation
      const closeBtn = document.querySelector('.close-btn, .login-popup-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Close animation
          modalOverlay.style.opacity = '0';
          modalContent.style.opacity = '0';
          modalContent.style.transform = 'translateY(20px) scale(0.95)';
          
          // Remove after animation completes
          setTimeout(() => {
            modalOverlay.remove();
          }, 300);
        });
      }
    }
  }
  
  // Watch for new modals
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        for (const node of mutation.addedNodes) {
          if (node.classList && 
              (node.classList.contains('popup-overlay') || 
               node.classList.contains('login-popup-overlay'))) {
            setupModalAnimations();
            break;
          }
        }
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, { childList: true });
  
  // Add dynamic glow effect for interactive elements
  const dynamicGlowStyle = document.createElement('style');
  dynamicGlowStyle.innerHTML = `
    @keyframes borderGlow {
      0% { box-shadow: 0 0 5px rgba(69, 162, 158, 0.2), inset 0 0 5px rgba(69, 162, 158, 0.1); }
      50% { box-shadow: 0 0 10px rgba(69, 162, 158, 0.5), inset 0 0 10px rgba(69, 162, 158, 0.2); }
      100% { box-shadow: 0 0 5px rgba(69, 162, 158, 0.2), inset 0 0 5px rgba(69, 162, 158, 0.1); }
    }
    
    .react-calendar, .calendar-section, .news-item, .popup-content, input[type="text"], 
    input[type="password"], textarea, select, .login-popup-content {
      animation: borderGlow 8s ease infinite;
    }
    
    .tag:hover, button:hover, .add-article-btn:hover, .custom-file-upload:hover {
      text-shadow: 0 0 5px rgba(69, 162, 158, 0.7);
    }
    
    /* Magnetic cursor effect for buttons */
    button:not(.close-btn), .add-article-btn, .custom-file-upload, .tag {
      position: relative;
      overflow: visible;
    }
    
    /* Futuristic loading animation */
    @keyframes loadingPulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .loading::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle, #45a29e, transparent);
      z-index: -1;
      animation: loadingPulse 1.5s infinite;
    }
  `;
  document.head.appendChild(dynamicGlowStyle);
  
  // Implement smooth content transitions
  document.addEventListener('click', function(e) {
    // For links that should have page transitions
    if (e.target.tagName === 'A' && !e.target.getAttribute('target') && 
        e.target.href && e.target.href.startsWith(window.location.origin)) {
      e.preventDefault();
      
      // Fade out current content
      const content = document.querySelector('.content');
      if (content) {
        content.style.transition = 'opacity 0.3s ease';
        content.style.opacity = '0';
        
        // Navigate after animation
        setTimeout(() => {
          window.location.href = e.target.href;
        }, 300);
      } else {
        window.location.href = e.target.href;
      }
    }
  });
  
  // Add ripple effect for clickable elements
  function createRippleEffect() {
    document.addEventListener('click', function(e) {
      const clickableElements = ['BUTTON', 'A', '.tag', '.layout-label', '.news-item', '.custom-file-upload'];
      let targetElement = null;
      
      // Find if the click was on or within a clickable element
      for (const selector of clickableElements) {
        if (selector.startsWith('.')) {
          // Class selector
          if (e.target.classList.contains(selector.substring(1)) || 
              e.target.closest(selector)) {
            targetElement = e.target.classList.contains(selector.substring(1)) ? 
                            e.target : e.target.closest(selector);
            break;
          }
        } else {
          // Tag selector
          if (e.target.tagName === selector || 
              (e.target.closest(selector) && selector !== 'A')) {
            targetElement = e.target.tagName === selector ? 
                            e.target : e.target.closest(selector);
            break;
          }
        }
      }
      
      if (targetElement && !targetElement.classList.contains('close-btn')) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        // Position the ripple
        const rect = targetElement.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        // Add ripple to element
        targetElement.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove();
        }, 600);
      }
    });
    
    // Add ripple effect styles
    const rippleStyle = document.createElement('style');
    rippleStyle.innerHTML = `
      .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(69, 162, 158, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
      }
      
      @keyframes ripple {
        to {
          transform: scale(1);
          opacity: 0;
        }
      }
      
      button, a, .tag, .layout-label, .news-item, .custom-file-upload {
        position: relative;
        overflow: hidden;
      }
    `;
    document.head.appendChild(rippleStyle);
  }
  
  // Initialize ripple effect
  createRippleEffect();
  
  // Add scroll-triggered effects
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    // Parallax effect for the background
    document.body.style.backgroundPosition = `0px ${scrollY * 0.2}px`;
    
    // Change grid opacity based on scroll position
    const gridOpacity = Math.max(0.03, Math.min(0.08, 0.03 + (scrollY * 0.0001)));
    document.body.style.backgroundImage = `
      linear-gradient(0deg, transparent 24%, rgba(255,255,255,${gridOpacity}) 25%, rgba(255,255,255,${gridOpacity}) 26%, transparent 27%, transparent 74%, rgba(255,255,255,${gridOpacity}) 75%, rgba(255,255,255,${gridOpacity}) 76%, transparent 77%, transparent),
      linear-gradient(90deg, transparent 24%, rgba(255,255,255,${gridOpacity}) 25%, rgba(255,255,255,${gridOpacity}) 26%, transparent 27%, transparent 74%, rgba(255,255,255,${gridOpacity}) 75%, rgba(255,255,255,${gridOpacity}) 76%, transparent 77%, transparent)
    `;
  });
  
  // Add interactive typing effect for headers
  function addTypingEffect() {
    const headers = document.querySelectorAll('h1, h2, .popup-header h2');
    
    headers.forEach(header => {
      if (!header.dataset.hasTypingEffect) {
        const text = header.innerText;
        header.innerText = '';
        header.dataset.hasTypingEffect = 'true';
        
        // Create cursor element
        const cursor = document.createElement('span');
        cursor.classList.add('typing-cursor');
        cursor.innerHTML = '|';
        cursor.style.animation = 'cursorBlink 1s infinite';
        
        // Add cursor style
        const cursorStyle = document.createElement('style');
        cursorStyle.innerHTML = `
          @keyframes cursorBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          .typing-cursor {
            color: #45a29e;
            font-weight: bold;
          }
        `;
        document.head.appendChild(cursorStyle);
        
        // Typing animation
        header.appendChild(cursor);
        let i = 0;
        
        function typeChar() {
          if (i < text.length) {
            // Create a new character span
            const charSpan = document.createElement('span');
            charSpan.innerText = text.charAt(i);
            charSpan.style.opacity = '0';
            charSpan.style.animation = 'charFadeIn 0.1s forwards';
            
            // Add animation style
            const fadeStyle = document.createElement('style');
            fadeStyle.innerHTML = `
              @keyframes charFadeIn {
                to { opacity: 1; }
              }
            `;
            document.head.appendChild(fadeStyle);
            
            // Insert character before cursor
            header.insertBefore(charSpan, cursor);
            i++;
            
            // Random typing speed for realistic effect
            setTimeout(typeChar, 30 + Math.random() * 50);
          } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
              cursor.remove();
            }, 1000);
          }
        }
        
        // Start typing after a short delay
        setTimeout(typeChar, 300);
      }
    });
  }
  
  // Initialize typing effect for visible headers
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(addTypingEffect, 500);
  });
  
  // Watch for new headers (from popups, etc.)
  const headerObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        setTimeout(addTypingEffect, 300);
      }
    });
  });
  
  // Start observing
  headerObserver.observe(document.body, { childList: true, subtree: true });