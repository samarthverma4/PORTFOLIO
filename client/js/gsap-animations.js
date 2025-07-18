// GSAP Animation Controller for Portfolio
class GSAPAnimations {
  constructor() {
    this.tl = gsap.timeline();
    this.isAnimating = false;
    this.initializeGSAP();
  }

  initializeGSAP() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    
    // Set default easing
    gsap.defaults({
      ease: "power2.out",
      duration: 0.8
    });
  }

  // Loading screen animations
  animateLoadingScreen() {
    const tl = gsap.timeline();
    
    // Animate loading bar
    tl.to("#loadingBar", {
      width: "100%",
      duration: 2.5,
      ease: "power2.inOut"
    })
    .to(".loading-text", {
      text: "Ready!",
      duration: 0.5,
      ease: "none"
    }, "-=0.5")
    .to(".loading-screen", {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        document.getElementById('loadingScreen').style.display = 'none';
        this.animateCoverEntrance();
      }
    }, "+=0.5");
    
    return tl;
  }

  // Cover screen entrance animation
  animateCoverEntrance() {
    const tl = gsap.timeline();
    
    // Animate cover elements
    tl.fromTo(".cover-title-line", {
      y: 100,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out"
    })
    .fromTo(".cover-footer span", {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1
    }, "-=0.8")
    .fromTo(".scroll-indicator", {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8
    }, "-=0.4");

    // Typing animation for subtitle
    this.animateTypingText();
    
    return tl;
  }

  // Typing text animation
  animateTypingText() {
    const texts = [
      "Full Stack Developer",
      "Creative Coder",
      "UI/UX Enthusiast",
      "Problem Solver"
    ];
    
    let currentIndex = 0;
    
    const animateText = () => {
      const tl = gsap.timeline();
      
      tl.to(".typing-text", {
        text: texts[currentIndex],
        duration: 1,
        ease: "none"
      })
      .to(".typing-text", {
        text: "",
        duration: 0.5,
        ease: "none",
        delay: 2
      })
      .call(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        animateText();
      });
    };
    
    animateText();
  }

  // Cover to main transition
  animateCoverTransition() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('mainContent');
    const mainNav = document.getElementById('mainNav');
    
    const tl = gsap.timeline({
      onComplete: () => {
        cover.style.display = 'none';
        this.isAnimating = false;
        this.animateMainContentEntrance();
      }
    });

    // Enhanced cover transition with morphing effect
    tl.to(cover, {
      scale: 0.8,
      rotation: 2,
      duration: 0.6,
      ease: "power2.inOut"
    })
    .to(cover, {
      scale: 20,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, "-=0.2")
    .fromTo(mainContent, {
      opacity: 0,
      scale: 0.9
    }, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.8")
    .fromTo(mainNav, {
      y: -100,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6");

    return tl;
  }

  // Main content entrance
  animateMainContentEntrance() {
    const welcome = document.getElementById('welcome');
    const bookFlip = document.getElementById('bookFlip');
    
    const tl = gsap.timeline();
    
    // Welcome message animation
    tl.fromTo(welcome, {
      y: 50,
      opacity: 0,
      scale: 0.9
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    })
    .to(welcome, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      delay: 1.5,
      onComplete: () => {
        welcome.style.display = 'none';
        this.showBookWithAnimation();
      }
    });

    return tl;
  }

  // Book flip entrance
  showBookWithAnimation() {
    const book = document.getElementById('bookFlip');
    const mainNav = document.getElementById('mainNav');
    
    book.style.display = 'flex';
    mainNav.classList.remove('hidden');
    
    const tl = gsap.timeline({
      onComplete: () => {
        this.animateAboutPage();
      }
    });
    
    tl.fromTo(book, {
      opacity: 0,
      scale: 0.8,
      rotationY: -15
    }, {
      opacity: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.2,
      ease: "power3.out"
    })
    .fromTo(".book-controls", {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8
    }, "-=0.5");

    return tl;
  }

  // About page animation
  animateAboutPage() {
    const tl = gsap.timeline();
    
    // Animate navigation
    tl.fromTo(".about-nav", {
      y: -50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    })
    // Animate grid items
    .fromTo(".about-center-grid > *", {
      scale: 0.6,
      opacity: 0,
      y: 30
    }, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.4")
    // Animate footer
    .fromTo(".about-footer", {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8
    }, "-=0.3");

    return tl;
  }

  // Page transition animation
  animatePageTransition(direction = 'next') {
    const currentPage = document.querySelector('.book-page.active');
    const pages = document.querySelectorAll('.book-page');
    
    const tl = gsap.timeline();
    
    if (direction === 'next') {
      tl.to(currentPage, {
        rotationY: -180,
        duration: 0.8,
        ease: "power2.inOut",
        transformOrigin: "left center"
      });
    } else {
      tl.to(currentPage, {
        rotationY: 0,
        duration: 0.8,
        ease: "power2.inOut",
        transformOrigin: "left center"
      });
    }
    
    return tl;
  }

  // Projects page animation
  animateProjectsPage() {
    const tl = gsap.timeline();
    
    tl.fromTo(".page-title", {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8
    })
    .fromTo(".projects-filter .filter-btn", {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1
    }, "-=0.4")
    .fromTo(".project-card", {
      y: 50,
      opacity: 0,
      scale: 0.9
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.2");

    return tl;
  }

  // Skills page animation
  animateSkillsPage() {
    const tl = gsap.timeline();
    
    tl.fromTo(".page-title", {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8
    })
    .fromTo(".stat-item", {
      y: 30,
      opacity: 0,
      scale: 0.8
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.2
    }, "-=0.4");

    // Animate stat numbers counting up
    this.animateStatNumbers();
    
    return tl;
  }

  // Animate counting numbers
  animateStatNumbers() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'));
      
      gsap.fromTo(el, {
        textContent: 0
      }, {
        textContent: target,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        delay: 0.5
      });
    });
  }

  // Animate skill bars
  animateSkillBars() {
    gsap.fromTo(".skill-progress", {
      width: 0
    }, {
      width: function(index, element) {
        return element.getAttribute('data-level') + '%';
      },
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.1
    });
  }

  // Contact page animation
  animateContactPage() {
    const tl = gsap.timeline();
    
    tl.fromTo(".page-title", {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8
    })
    .fromTo(".contact-item", {
      x: -50,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2
    }, "-=0.4")
    .fromTo(".form-group", {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1
    }, "-=0.4");

    return tl;
  }

  // Project card hover animation
  animateProjectCardHover(card, isHover) {
    const tl = gsap.timeline();
    
    if (isHover) {
      tl.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(card.querySelector('.project-image'), {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      }, 0);
    } else {
      tl.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(card.querySelector('.project-image'), {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      }, 0);
    }
    
    return tl;
  }

  // Toast notification animation
  animateToast(toast, type = 'show') {
    if (type === 'show') {
      return gsap.fromTo(toast, {
        x: 100,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    } else {
      return gsap.to(toast, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }

  // Modal animation
  animateModal(modal, type = 'show') {
    if (type === 'show') {
      const tl = gsap.timeline();
      
      modal.classList.remove('hidden');
      
      tl.fromTo(modal, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.3
      })
      .fromTo(modal.querySelector('.modal-content'), {
        scale: 0.8,
        y: 50
      }, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      }, 0);
      
      return tl;
    } else {
      return gsap.to(modal, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          modal.classList.add('hidden');
        }
      });
    }
  }

  // Scroll-triggered animations
  initScrollAnimations() {
    // Fade in elements as they come into view
    gsap.utils.toArray('.fade-in-scroll').forEach(element => {
      gsap.fromTo(element, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }

  // Destroy all animations (cleanup)
  destroy() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf("*");
  }
}

// Create global animation instance
const gsapAnimations = new GSAPAnimations();

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Start loading animation
  gsapAnimations.animateLoadingScreen();
  
  // Initialize scroll animations
  gsapAnimations.initScrollAnimations();
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GSAPAnimations;
}