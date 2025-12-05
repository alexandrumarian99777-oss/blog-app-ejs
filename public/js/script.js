// ================================
// Smooth Scrolling
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ================================
// Scroll to Top Button
// ================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ================================
// Newsletter Form Submission
// ================================
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    // Simulate newsletter subscription
    showNotification('✅ Successfully subscribed! Welcome to our community!', 'success');
    
    // Clear input
    emailInput.value = '';
  });
}

// ================================
// Notification System
// ================================
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;

  // Add to body
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Auto remove after 5 seconds
  const autoRemoveTimer = setTimeout(() => {
    removeNotification(notification);
  }, 5000);

  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    clearTimeout(autoRemoveTimer);
    removeNotification(notification);
  });
}

function removeNotification(notification) {
  notification.classList.remove('show');
  setTimeout(() => {
    notification.remove();
  }, 300);
}

// ================================
// Animate on Scroll
// ================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
  const elementsToAnimate = document.querySelectorAll('.blog-card, .review-card');
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// ================================
// Reading Time Calculator
// ================================
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// Add reading time to blog detail page
if (document.querySelector('.blog-detail-content')) {
  const content = document.querySelector('.blog-detail-content').textContent;
  const readingTime = calculateReadingTime(content);
  const meta = document.querySelector('.blog-detail-meta');
  
  if (meta) {
    const timeElement = document.createElement('span');
    timeElement.innerHTML = `⏱️ ${readingTime} min read`;
    meta.appendChild(timeElement);
  }
}

// ================================
// Search Functionality (if needed)
// ================================
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const blogCards = document.querySelectorAll('.blog-card');
      
      blogCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const excerpt = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
          card.style.display = 'block';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

// ================================
// Copy Code Block Functionality
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.innerHTML = '📋 Copy';
    
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(copyButton);
    wrapper.appendChild(block.parentNode);
    
    copyButton.addEventListener('click', () => {
      const code = block.textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.innerHTML = '✅ Copied!';
        setTimeout(() => {
          copyButton.innerHTML = '📋 Copy';
        }, 2000);
      });
    });
  });
});

// ================================
// Image Lazy Loading
// ================================
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ================================
// Dark Mode Toggle (Optional Enhancement)
// ================================
function initializeDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  if (darkModeToggle) {
    // Check for saved preference
    const darkMode = localStorage.getItem('darkMode');
    
    if (darkMode === 'enabled') {
      document.body.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.setItem('darkMode', null);
      }
    });
  }
}

// ================================
// Form Validation Helper
// ================================
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }
  });
  
  return isValid;
}

// ================================
// Navbar Scroll Effect
// ================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      navbar.classList.remove('scroll-up');
      return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
      navbar.classList.remove('scroll-up');
      navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
      navbar.classList.remove('scroll-down');
      navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
  });
}

// ================================
// Initialize All Features
// ================================
document.addEventListener('DOMContentLoaded', () => {
  initializeSearch();
  initializeDarkMode();
  
  console.log('🚀 MyBlog JavaScript Loaded Successfully!');
});

// ================================
// Share Functionality
// ================================
function sharePost(title, url) {
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    }).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(url);
    showNotification('🔗 Link copied to clipboard!', 'success');
  }
}

// ================================
// Progress Bar for Blog Reading
// ================================
if (document.querySelector('.blog-detail')) {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    progressBar.style.width = progress + '%';
  });
}