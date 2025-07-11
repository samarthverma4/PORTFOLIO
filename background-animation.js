// Live animated background for about page
class BackgroundAnimation {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    
    // Base configuration
    this.baseConfig = {
      colors: {
        particle: 'rgba(255, 179, 71, 0.4)', // accent color
        connection: 'rgba(255, 179, 71, 0.1)',
        particleHover: 'rgba(255, 94, 98, 0.6)' // accent2 color
      }
    };
    
    // Get responsive configuration
    this.config = { ...this.baseConfig, ...this.getResponsiveConfig() };
    
    this.mouse = { x: 0, y: 0 };
    this.init();
  }
  
  init() {
    if (!this.shouldInitialize()) return;
    
    this.createCanvas();
    this.createParticles();
    this.addEventListeners();
    this.start();
  }
  
  shouldInitialize() {
    // Only initialize on about page
    return document.querySelector('.dark-about') !== null;
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'background-animation-canvas';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.7;
    `;
    
    const aboutContainer = document.querySelector('.dark-about');
    aboutContainer.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        size: Math.random() * this.config.particleSize + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  addEventListeners() {
    window.addEventListener('resize', () => this.resize());
    
    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    // Pause animation when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }
  
  resize() {
    const aboutContainer = document.querySelector('.dark-about');
    if (!aboutContainer) return;
    
    const rect = aboutContainer.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    // Update configuration for new screen size
    this.updateConfig();
    
    // Redistribute particles after resize
    this.particles.forEach(particle => {
      particle.x = Math.min(particle.x, this.canvas.width);
      particle.y = Math.min(particle.y, this.canvas.height);
    });
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x <= 0 || particle.x >= this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y <= 0 || particle.y >= this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Keep particles within bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      
      // Mouse interaction
      const mouseDistance = Math.sqrt(
        Math.pow(particle.x - this.mouse.x, 2) + 
        Math.pow(particle.y - this.mouse.y, 2)
      );
      
      if (mouseDistance < 100) {
        particle.size = Math.min(particle.size * 1.02, 3);
        particle.opacity = Math.min(particle.opacity * 1.05, 0.8);
      } else {
        particle.size = Math.max(particle.size * 0.98, 0.5);
        particle.opacity = Math.max(particle.opacity * 0.98, 0.2);
      }
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      
      // Change color based on mouse proximity
      const mouseDistance = Math.sqrt(
        Math.pow(particle.x - this.mouse.x, 2) + 
        Math.pow(particle.y - this.mouse.y, 2)
      );
      
      if (mouseDistance < 100) {
        this.ctx.fillStyle = this.config.colors.particleHover;
      } else {
        this.ctx.fillStyle = this.config.colors.particle;
      }
      
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
    });
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        
        const distance = Math.sqrt(
          Math.pow(particle1.x - particle2.x, 2) + 
          Math.pow(particle1.y - particle2.y, 2)
        );
        
        if (distance < this.config.connectionDistance) {
          const opacity = 1 - (distance / this.config.connectionDistance);
          
          this.ctx.beginPath();
          this.ctx.moveTo(particle1.x, particle1.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.strokeStyle = this.config.colors.connection;
          this.ctx.globalAlpha = opacity * 0.3;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }
  
  animate() {
    if (!this.isRunning) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    
    // Reset global alpha
    this.ctx.globalAlpha = 1;
    
    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }
  
  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  resume() {
    if (!this.isRunning && this.canvas) {
      this.start();
    }
  }
  
  destroy() {
    this.pause();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
  
  // Enhanced configuration for different screen sizes
  getResponsiveConfig() {
    const width = window.innerWidth;
    
    if (width < 480) {
      return {
        particleCount: 20,
        particleSize: 0.8,
        particleSpeed: 0.2,
        connectionDistance: 80,
        fadeDistance: 60
      };
    } else if (width < 768) {
      return {
        particleCount: 30,
        particleSize: 1,
        particleSpeed: 0.25,
        connectionDistance: 100,
        fadeDistance: 70
      };
    } else {
      return {
        particleCount: 50,
        particleSize: 1,
        particleSpeed: 0.3,
        connectionDistance: 120,
        fadeDistance: 80
      };
    }
  }
  
  // Add method to update configuration on resize
  updateConfig() {
    const newConfig = this.getResponsiveConfig();
    this.config = { ...this.baseConfig, ...newConfig };
    
    // Recreate particles with new count
    this.createParticles();
  }
}

// Initialize animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for about page to be visible
  setTimeout(() => {
    if (document.querySelector('.dark-about')) {
      window.backgroundAnimation = new BackgroundAnimation();
    }
  }, 1000);
});

// Initialize when about page becomes active
document.addEventListener('click', () => {
  setTimeout(() => {
    if (document.querySelector('.dark-about') && !window.backgroundAnimation) {
      window.backgroundAnimation = new BackgroundAnimation();
    }
  }, 500);
});
