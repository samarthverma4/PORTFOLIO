// Animation is now handled by main.js animateAboutPage() function
// This prevents conflicts with the book flip transition system

// Live background animation for about page
document.addEventListener('DOMContentLoaded', function() {
  const aboutPage = document.querySelector('.dark-about');
  if (!aboutPage) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Create floating particles container
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'floating-particles';
  aboutPage.appendChild(particlesContainer);

  // Create particles with variety
  function createParticle() {
    const particle = document.createElement('div');
    const particleType = Math.random();
    
    if (particleType < 0.3) {
      particle.className = 'particle large';
    } else if (particleType < 0.7) {
      particle.className = 'particle';
    } else {
      particle.className = 'particle small';
    }
    
    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation properties
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 6 + 8) + 's';
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.6 + 0.2;
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 15000);
  }

  // Create initial particles
  for (let i = 0; i < 20; i++) {
    setTimeout(() => createParticle(), i * 150);
  }

  // Continuously create new particles
  const particleInterval = setInterval(createParticle, 600);

  // Add subtle mouse interaction
  let mouseX = 50, mouseY = 50;
  
  aboutPage.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
    
    // Update CSS custom properties for dynamic effects
    aboutPage.style.setProperty('--mouse-x', mouseX + '%');
    aboutPage.style.setProperty('--mouse-y', mouseY + '%');
  });

  // Create particles on mouse movement
  aboutPage.addEventListener('mousemove', function(e) {
    if (Math.random() < 0.1) { // 10% chance to create particle on mouse move
      const mouseParticle = document.createElement('div');
      mouseParticle.className = 'particle';
      mouseParticle.style.left = (e.clientX / window.innerWidth) * 100 + '%';
      mouseParticle.style.top = (e.clientY / window.innerHeight) * 100 + '%';
      mouseParticle.style.animationDuration = '3s';
      mouseParticle.style.opacity = '0.8';
      
      particlesContainer.appendChild(mouseParticle);
      
      setTimeout(() => {
        if (mouseParticle.parentNode) {
          mouseParticle.parentNode.removeChild(mouseParticle);
        }
      }, 3000);
    }
  });

  // Clean up on page unload
  window.addEventListener('beforeunload', function() {
    clearInterval(particleInterval);
  });
});