// Portfolio initialization function for Barba.js compatibility
function initPortfolio() {
  // Cover click transition with previous animation
  const cover = document.getElementById('cover');
  const mainContent = document.getElementById('mainContent');

  // Animated morph for cover card (expands from center, title always centered)
  if (cover) {
    cover.addEventListener('click', function handleCoverClick(e) {
      if (cover.classList.contains('anim-rect') || cover.classList.contains('anim-expand')) return;
      cover.classList.add('anim-overflow');
      // Step 1: Morph to horizontal rectangle
      cover.classList.add('anim-rect');
      // Step 2: After width/height transition, round corners
      setTimeout(() => {
        cover.classList.add('anim-rounded');
        // Step 3: After border-radius, expand to fullscreen from center
        setTimeout(() => {
          cover.classList.add('anim-expand');
          // Step 4: After expand, fade out cover and fade in welcome
          setTimeout(() => {
            cover.classList.add('anim-fadeout');
            const welcome = document.getElementById('welcome');
            if (welcome) welcome.classList.add('visible');
            // After fade, hide cover and show main content
            setTimeout(() => {
              cover.style.display = 'none';
              mainContent.classList.add('visible');
              setTimeout(showBookFlip, 800);
            }, 600);
          }, 800);
        }, 500);
      }, 600);
    });
  }

let aboutPageAnimated = false;

function showBookFlip() {
  const welcome = document.getElementById('welcome');
  const book = document.getElementById('bookFlip');
  
  // Use GSAP for smoother transitions
  if (typeof gsap !== 'undefined') {
    // Fade out welcome with GSAP
    gsap.to(welcome, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    });
    
    // Show and animate book
    setTimeout(() => {
      book.style.display = "flex";
      gsap.fromTo(book, 
        { opacity: 0, scale: 0.95 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            // Animate about page after book is visible
            if (pages[0].classList.contains('active') && !aboutPageAnimated) {
              setTimeout(() => {
                animateAboutPage();
                aboutPageAnimated = true;
              }, 300);
            }
            // Hide welcome after animation
            setTimeout(() => {
              welcome.style.display = "none";
            }, 200);
          }
        }
      );
    }, 200);
  } else {
    // Fallback for if GSAP isn't loaded
    welcome.style.transition = "opacity 0.7s";
    welcome.style.opacity = 0;
    setTimeout(() => {
      book.style.display = "flex";
      book.style.opacity = "0";
      book.style.transition = "opacity 0.8s cubic-bezier(.77,0,.18,1)";
      setTimeout(() => {
        book.style.opacity = "1";
        if (pages[0].classList.contains('active') && !aboutPageAnimated) {
          setTimeout(() => {
            animateAboutPage();
            aboutPageAnimated = true;
          }, 800);
        }
        setTimeout(() => {
          welcome.style.display = "none";
        }, 200);
      }, 100);
    }, 400);
  }
}
const pages = [
  document.getElementById('page1'),
  document.getElementById('page2'),
  document.getElementById('page3'),
  document.getElementById('page4')
];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let current = 0;
function updatePages() {
  // Add Barba.js-style transition to page changes
  const currentPage = pages.find(p => p.classList.contains('active'));
  
  // Leave animation for current page
  if (currentPage && typeof gsap !== 'undefined') {
    gsap.to(currentPage, {
      opacity: 0,
      x: '-30px',
      duration: 0.3,
      ease: "power2.out"
    });
  }
  
  setTimeout(() => {
    pages.forEach((page, i) => {
      page.classList.remove('left', 'active', 'right');
      if (i < current) page.classList.add('left');
      else if (i === current) page.classList.add('active');
      else page.classList.add('right');
    });
    
    // Enter animation for new page
    const newPage = pages[current];
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(newPage, 
        { opacity: 0, x: '30px' },
        { 
          opacity: 1, 
          x: '0px',
          duration: 0.3,
          ease: "power2.out"
        }
      );
    }
    
    // Special animation for about page
    if (current === 0 && !aboutPageAnimated) {
      setTimeout(() => {
        animateAboutPage();
        aboutPageAnimated = true;
      }, 150);
    }
    
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === pages.length - 1;
  }, 150);
}
prevBtn.addEventListener('click', () => {
  if (current > 0) {
    // Add slide transition effect
    const currentPage = pages.find(p => p.classList.contains('active'));
    if (currentPage && typeof gsap !== 'undefined') {
      gsap.to(currentPage, {
        opacity: 0,
        x: '50px',
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          current--;
          updatePages();
        }
      });
    } else {
      current--;
      updatePages();
    }
  }
});
nextBtn.addEventListener('click', () => {
  if (current < pages.length - 1) {
    // Add slide transition effect
    const currentPage = pages.find(p => p.classList.contains('active'));
    if (currentPage && typeof gsap !== 'undefined') {
      gsap.to(currentPage, {
        opacity: 0,
        x: '-50px',
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          current++;
          updatePages();
        }
      });
    } else {
      current++;
      updatePages();
    }
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
});
let startX = null;
document.getElementById('bookFlip').addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});
document.getElementById('bookFlip').addEventListener('touchend', e => {
  if (startX !== null) {
    let dx = e.changedTouches[0].clientX - startX;
    if (dx > 40) prevBtn.click();
    if (dx < -40) nextBtn.click();
    startX = null;
  }
});
updatePages();

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.about-center-grid');
  if (grid) {
    Array.from(grid.children).forEach(el => el.classList.add('about-animate-hide'));
  }
  const nav = document.querySelector('.about-nav');
  const footer = document.querySelector('.about-footer');
  if (nav) nav.classList.add('about-animate-hide');
  if (footer) footer.classList.add('about-animate-hide');
});

// Function to animate the about page elements
function animateAboutPage() {
  const grid = document.querySelector('.about-center-grid');
  if (!grid) return;

  // Add hide class to all grid items, nav, and footer
  const items = Array.from(grid.children);
  items.forEach(el => el.classList.add('about-animate-hide'));
  const nav = document.querySelector('.about-nav');
  const footer = document.querySelector('.about-footer');
  if (nav) nav.classList.add('about-animate-hide');
  if (footer) footer.classList.add('about-animate-hide');

  // Also add hide class to all descendants of nav and footer
  if (nav) nav.querySelectorAll('*').forEach(el => el.classList.add('about-animate-hide'));
  if (footer) footer.querySelectorAll('*').forEach(el => el.classList.add('about-animate-hide'));

  // Force reflow
  void grid.offsetWidth;

  // Start animations immediately (no outer delay)
  // Animate navigation first
  if (nav) {
    nav.classList.remove('about-animate-hide');
    nav.style.transition = 'opacity 0.6s ease-out, transform 0.8s ease-out';
    nav.style.opacity = '1';
    nav.style.transform = 'translateY(0)';
    // Reveal all nav descendants
    nav.querySelectorAll('*').forEach(el => {
      el.classList.remove('about-animate-hide');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
  // Animate footer
  if (footer) {
    setTimeout(() => {
      footer.classList.remove('about-animate-hide');
      footer.style.transition = 'opacity 0.6s ease-out, transform 0.8s ease-out';
      footer.style.opacity = '1';
      footer.style.transform = 'translateY(0)';
      // Reveal all footer descendants
      footer.querySelectorAll('*').forEach(el => {
        el.classList.remove('about-animate-hide');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 60);
  }
  // Animate each grid element with minimal stagger
  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.remove('about-animate-hide');
      el.style.transition = 'opacity 0.4s cubic-bezier(.77,0,.18,1), transform 0.5s cubic-bezier(.77,0,.18,1)';
      el.style.opacity = '1';
      el.style.transform = 'scale(1) translateY(0)';
      setTimeout(() => {
        el.style.transform = 'scale(1.05) translateY(0)';
        setTimeout(() => {
          el.style.transform = 'scale(1) translateY(0)';
        }, 80);
      }, 180);
    }, i * 40);
  });

  // Barba.js navigation helpers
  function navigateToPage(page) {
    // Trigger Barba.js page transition
    if (typeof barba !== 'undefined') {
      barba.go(page);
    }
  }

  // Add event listeners for navigation
  document.querySelectorAll('[data-barba]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) {
        navigateToPage(href);
      }
    });
  });
}

// Navigation function for book pages
window.showBookPage = function(pageIndex) {
  const targetIndex = pageIndex - 1; // Convert to 0-based index
  if (targetIndex >= 0 && targetIndex < pages.length && targetIndex !== current) {
    // Add transition effect
    const currentPage = pages.find(p => p.classList.contains('active'));
    
    if (currentPage && typeof gsap !== 'undefined') {
      gsap.to(currentPage, {
        opacity: 0,
        rotateY: -15,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          current = targetIndex;
          updatePages();
        }
      });
    } else {
      current = targetIndex;
      updatePages();
    }
  }
}

}

// Initialize portfolio on first load
document.addEventListener('DOMContentLoaded', initPortfolio);
