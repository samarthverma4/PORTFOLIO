// Portfolio Main Controller
class Portfolio {
  constructor() {
    this.currentPage = 0;
    this.totalPages = 4;
    this.projects = [];
    this.skills = {};
    this.isLoading = false;
    
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
      } else {
        this.setupEventListeners();
      }

      // Load initial data
      await this.loadPortfolioData();
      
      // Track initial page view
      portfolioUtils.trackPageView('home');
    } catch (error) {
      console.error('Portfolio initialization error:', error);
      this.showToast('Failed to load portfolio data', 'error');
    }
  }

  setupEventListeners() {
    // Cover click handler
    const cover = document.getElementById('cover');
    if (cover) {
      cover.addEventListener('click', () => this.handleCoverClick());
    }

    // Navigation handlers
    this.setupNavigationListeners();
    
    // Book controls
    this.setupBookControls();
    
    // Form handlers
    this.setupFormHandlers();
    
    // Filter handlers
    this.setupFilterHandlers();
    
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Responsive handlers
    this.setupResponsiveHandlers();

    // Project card interactions
    this.setupProjectInteractions();
  }

  setupNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(link.getAttribute('data-page'));
        this.navigateToPage(page);
      });
    });

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
      navToggle.addEventListener('click', () => this.toggleMobileNav());
    }
  }

  setupBookControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousPage());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextPage());
    }
  }

  setupFormHandlers() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
    }

    // Form input animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', () => this.animateFormFocus(input, true));
      input.addEventListener('blur', () => this.animateFormFocus(input, false));
    });
  }

  setupFilterHandlers() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.filterProjects(filter);
        this.updateFilterButtons(btn);
      });
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousPage();
      } else if (e.key === 'ArrowRight') {
        this.nextPage();
      } else if (e.key === 'Escape') {
        this.closeProjectModal();
      }
    });
  }

  setupResponsiveHandlers() {
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  setupProjectInteractions() {
    // This will be called after projects are loaded
    document.addEventListener('click', (e) => {
      if (e.target.closest('.project-card')) {
        const card = e.target.closest('.project-card');
        const projectId = card.getAttribute('data-project-id');
        this.openProjectModal(projectId);
      }
    });
  }

  handleCoverClick() {
    if (gsapAnimations.isAnimating) return;
    gsapAnimations.animateCoverTransition();
  }

  async loadPortfolioData() {
    try {
      this.isLoading = true;
      
      // Load projects and skills in parallel
      const [projectsResponse, skillsResponse] = await Promise.all([
        api.getProjects(),
        api.getSkills()
      ]);

      this.projects = projectsResponse.data;
      this.skills = skillsResponse.data;

      // Update project count
      this.updateProjectCount();
      
      // Load initial content for each page
      this.loadProjectsPage();
      this.loadSkillsPage();
      
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
      this.showToast('Failed to load portfolio data', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  updateProjectCount() {
    const countElement = document.querySelector('.project-count');
    if (countElement) {
      countElement.textContent = this.projects.length;
    }
  }

  loadProjectsPage() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    this.projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      projectsGrid.appendChild(projectCard);
    });

    // Animate project cards if on projects page
    if (this.currentPage === 2) {
      gsapAnimations.animateProjectsPage();
    }
  }

  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);
    card.setAttribute('data-category', project.category.toLowerCase().replace(/[^a-z]/g, ''));

    const formattedProject = portfolioUtils.formatProject(project);

    card.innerHTML = `
      <div class="project-image">
        ${project.title}
      </div>
      <div class="project-info">
        <h3 class="project-title">${project.title} ${formattedProject.statusBadge}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${project.demoUrl}" class="project-link" target="_blank" onclick="event.stopPropagation()">Live Demo</a>
          <a href="${project.githubUrl}" class="project-link" target="_blank" onclick="event.stopPropagation()">GitHub</a>
        </div>
      </div>
    `;

    // Add hover animations
    card.addEventListener('mouseenter', () => {
      gsapAnimations.animateProjectCardHover(card, true);
    });

    card.addEventListener('mouseleave', () => {
      gsapAnimations.animateProjectCardHover(card, false);
    });

    return card;
  }

  loadSkillsPage() {
    const skillsContainer = document.getElementById('skillsContainer');
    if (!skillsContainer || !this.skills) return;

    skillsContainer.innerHTML = '';

    Object.entries(this.skills).forEach(([category, skills]) => {
      const categorySection = this.createSkillsCategory(category, skills);
      skillsContainer.appendChild(categorySection);
    });

    // Animate skills if on skills page
    if (this.currentPage === 3) {
      gsapAnimations.animateSkillsPage();
      setTimeout(() => gsapAnimations.animateSkillBars(), 800);
    }
  }

  createSkillsCategory(category, skills) {
    const section = document.createElement('div');
    section.className = 'skills-category';

    section.innerHTML = `
      <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      <div class="skills-grid">
        ${skills.map(skill => `
          <div class="skill-item">
            <div class="skill-header">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" data-level="${skill.level}" style="width: 0%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    return section;
  }

  navigateToPage(pageIndex) {
    if (pageIndex === this.currentPage || pageIndex < 0 || pageIndex >= this.totalPages) return;

    const oldPage = this.currentPage;
    this.currentPage = pageIndex;

    this.updateBookPages();
    this.updatePageIndicator();
    this.updateNavigation();

    // Track page view
    const pageNames = ['about', 'projects', 'skills', 'contact'];
    portfolioUtils.trackPageView(pageNames[pageIndex]);

    // Trigger page-specific animations
    setTimeout(() => {
      this.triggerPageAnimations();
    }, 400);
  }

  updateBookPages() {
    const pages = document.querySelectorAll('.book-page');
    
    pages.forEach((page, index) => {
      page.classList.remove('left', 'active', 'right');
      
      if (index < this.currentPage) {
        page.classList.add('left');
      } else if (index === this.currentPage) {
        page.classList.add('active');
      } else {
        page.classList.add('right');
      }
    });

    // Update button states
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = this.currentPage === 0;
    if (nextBtn) nextBtn.disabled = this.currentPage === this.totalPages - 1;
  }

  updatePageIndicator() {
    const currentPageEl = document.querySelector('.current-page');
    if (currentPageEl) {
      currentPageEl.textContent = this.currentPage + 1;
    }
  }

  updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
      link.classList.toggle('active', index === this.currentPage);
    });
  }

  triggerPageAnimations() {
    switch (this.currentPage) {
      case 0:
        gsapAnimations.animateAboutPage();
        break;
      case 1:
        gsapAnimations.animateProjectsPage();
        portfolioUtils.trackProjectView('projects_page');
        break;
      case 2:
        gsapAnimations.animateSkillsPage();
        setTimeout(() => gsapAnimations.animateSkillBars(), 800);
        portfolioUtils.trackSkillsView();
        break;
      case 3:
        gsapAnimations.animateContactPage();
        break;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.navigateToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.navigateToPage(this.currentPage + 1);
    }
  }

  filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category.includes(filter);
      
      if (shouldShow) {
        gsap.to(card, { opacity: 1, scale: 1, duration: 0.3 });
      } else {
        gsap.to(card, { opacity: 0.3, scale: 0.9, duration: 0.3 });
      }
    });
  }

  updateFilterButtons(activeBtn) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  async handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    try {
      // Show loading state
      submitBtn.disabled = true;
      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      
      // Send form data
      const response = await api.sendContactForm(data);
      
      if (response.success) {
        this.showToast(response.message, 'success');
        form.reset();
        portfolioUtils.trackContactSubmit();
      } else {
        throw new Error(response.message);
      }
      
    } catch (error) {
      console.error('Contact form error:', error);
      this.showToast(error.message || 'Failed to send message', 'error');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
    }
  }

  animateFormFocus(input, isFocus) {
    const label = input.nextElementSibling;
    if (!label) return;

    if (isFocus || input.value) {
      gsap.to(label, {
        y: -25,
        scale: 0.8,
        color: '#ff6b6b',
        duration: 0.3
      });
    } else {
      gsap.to(label, {
        y: 0,
        scale: 1,
        color: '#999',
        duration: 0.3
      });
    }
  }

  async openProjectModal(projectId) {
    try {
      const project = await api.getProject(projectId);
      const modal = document.getElementById('projectModal');
      const modalBody = document.getElementById('modalBody');
      
      if (!modal || !modalBody) return;

      const formattedProject = portfolioUtils.formatProject(project.data);
      
      modalBody.innerHTML = `
        <h2>${formattedProject.title} ${formattedProject.statusBadge}</h2>
        <p><strong>Category:</strong> ${formattedProject.category}</p>
        <p><strong>Status:</strong> ${formattedProject.status}</p>
        <p><strong>Completed:</strong> ${formattedProject.formattedDate}</p>
        <p>${formattedProject.description}</p>
        <h3>Technologies Used:</h3>
        <div class="project-tech">
          ${formattedProject.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-links" style="margin-top: 2rem;">
          <a href="${formattedProject.demoUrl}" class="project-link" target="_blank">Live Demo</a>
          <a href="${formattedProject.githubUrl}" class="project-link" target="_blank">GitHub</a>
        </div>
      `;

      gsapAnimations.animateModal(modal, 'show');
      portfolioUtils.trackProjectView(projectId);
      
    } catch (error) {
      console.error('Failed to load project details:', error);
      this.showToast('Failed to load project details', 'error');
    }
  }

  closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal && !modal.classList.contains('hidden')) {
      gsapAnimations.animateModal(modal, 'hide');
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Animate in
    gsapAnimations.animateToast(toast, 'show');

    // Auto remove after 5 seconds
    setTimeout(() => {
      gsapAnimations.animateToast(toast, 'hide').then(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      });
    }, 5000);
  }

  toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.getElementById('navToggle');
    
    if (navLinks && navToggle) {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    }
  }

  handleResize() {
    // Handle responsive adjustments
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile-specific adjustments
      this.adjustForMobile();
    } else {
      // Desktop adjustments
      this.adjustForDesktop();
    }
  }

  adjustForMobile() {
    // Mobile-specific logic
  }

  adjustForDesktop() {
    // Desktop-specific logic
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.classList.remove('active');
    }
  }
}

// Global functions for HTML onclick handlers
window.openContactForm = function() {
  portfolio.navigateToPage(3);
};

window.closeProjectModal = function() {
  portfolio.closeProjectModal();
};

// Initialize portfolio when DOM is ready
let portfolio;

document.addEventListener('DOMContentLoaded', () => {
  portfolio = new Portfolio();
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Portfolio;
}