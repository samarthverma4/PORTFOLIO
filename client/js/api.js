// API Client for Portfolio Backend
class PortfolioAPI {
  constructor() {
    this.baseURL = window.location.origin;
    this.apiURL = `${this.baseURL}/api`;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.apiURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // GET methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST methods
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Portfolio endpoints
  async getProjects(filters = {}) {
    const params = new URLSearchParams(filters);
    const endpoint = `/portfolio/projects${params.toString() ? `?${params.toString()}` : ''}`;
    return this.get(endpoint);
  }

  async getProject(id) {
    return this.get(`/portfolio/projects/${id}`);
  }

  async getSkills(category = '') {
    const endpoint = `/portfolio/skills${category ? `?category=${category}` : ''}`;
    return this.get(endpoint);
  }

  async getPortfolioStats() {
    return this.get('/portfolio/stats');
  }

  async getCategories() {
    return this.get('/portfolio/categories');
  }

  async getTechnologies() {
    return this.get('/portfolio/technologies');
  }

  // Contact endpoints
  async sendContactForm(formData) {
    return this.post('/contact', formData);
  }

  async getContactInfo() {
    return this.get('/contact/info');
  }

  // Analytics endpoints
  async trackEvent(event, data = {}) {
    return this.post('/analytics/track', { event, data });
  }

  async getAnalyticsSummary() {
    return this.get('/analytics/summary');
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create global API instance
const api = new PortfolioAPI();

// Utility functions for common operations
const portfolioUtils = {
  // Track page views
  trackPageView: (page) => {
    api.trackEvent('page_view', { page }).catch(console.error);
  },

  // Track project views
  trackProjectView: (projectId) => {
    api.trackEvent('project_view', { projectId }).catch(console.error);
  },

  // Track skills view
  trackSkillsView: () => {
    api.trackEvent('skills_view').catch(console.error);
  },

  // Track contact form submission
  trackContactSubmit: () => {
    api.trackEvent('contact_submit').catch(console.error);
  },

  // Format project for display
  formatProject: (project) => {
    return {
      ...project,
      formattedDate: project.completedDate ? 
        new Date(project.completedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        }) : 'In Progress',
      statusBadge: project.status === 'completed' ? '✅' : '🚧'
    };
  },

  // Format skill level for display
  formatSkillLevel: (level) => {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 60) return 'Intermediate';
    if (level >= 40) return 'Beginner';
    return 'Learning';
  },

  // Get skill color by level
  getSkillColor: (level) => {
    if (level >= 90) return '#4caf50';
    if (level >= 75) return '#ff9800';
    if (level >= 60) return '#2196f3';
    if (level >= 40) return '#9c27b0';
    return '#f44336';
  }
};

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioAPI, portfolioUtils };
}