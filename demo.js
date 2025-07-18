#!/usr/bin/env node
// Portfolio Demo Script
// This script demonstrates the portfolio API endpoints and functionality

const axios = require('axios').default || require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function demoPortfolioAPI() {
  console.log('🚀 Portfolio API Demo Starting...\n');

  try {
    // Health check
    console.log('1. Health Check:');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log(`   Status: ${health.data.status}`);
    console.log(`   Uptime: ${health.data.uptime.toFixed(2)} seconds\n`);

    // Get all projects
    console.log('2. Fetching Projects:');
    const projects = await axios.get(`${BASE_URL}/portfolio/projects`);
    console.log(`   Total Projects: ${projects.data.total}`);
    console.log(`   Featured Projects: ${projects.data.data.filter(p => p.featured).length}`);
    projects.data.data.slice(0, 2).forEach(project => {
      console.log(`   - ${project.title} (${project.category})`);
    });
    console.log();

    // Get skills
    console.log('3. Fetching Skills:');
    const skills = await axios.get(`${BASE_URL}/portfolio/skills`);
    Object.entries(skills.data.data).forEach(([category, skillList]) => {
      console.log(`   ${category.toUpperCase()}: ${skillList.length} skills`);
    });
    console.log();

    // Get portfolio stats
    console.log('4. Portfolio Statistics:');
    const stats = await axios.get(`${BASE_URL}/portfolio/stats`);
    console.log(`   Total Projects: ${stats.data.data.totalProjects}`);
    console.log(`   Completed Projects: ${stats.data.data.completedProjects}`);
    console.log(`   Technologies Used: ${stats.data.data.technologies}`);
    console.log(`   Average Skill Level: ${stats.data.data.averageSkillLevel}%\n`);

    // Test contact form (simulation)
    console.log('5. Testing Contact Form:');
    const contactData = {
      name: 'Demo User',
      email: 'demo@example.com',
      subject: 'API Demo Test',
      message: 'This is a test message from the demo script.'
    };
    
    try {
      const contact = await axios.post(`${BASE_URL}/contact`, contactData);
      console.log(`   Contact Form: ${contact.data.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`   Message: ${contact.data.message}\n`);
    } catch (contactError) {
      console.log(`   Contact Form: Rate limited or email not configured\n`);
    }

    // Track analytics event
    console.log('6. Analytics Tracking:');
    const analyticsData = {
      event: 'demo_run',
      data: { timestamp: new Date().toISOString() }
    };
    
    const analytics = await axios.post(`${BASE_URL}/analytics/track`, analyticsData);
    console.log(`   Event Tracked: ${analytics.data.success ? 'SUCCESS' : 'FAILED'}\n`);

    // Get analytics summary
    const analyticsSummary = await axios.get(`${BASE_URL}/analytics/summary`);
    console.log('7. Analytics Summary:');
    console.log(`   Total Page Views: ${analyticsSummary.data.data.totalPageViews}`);
    console.log(`   Unique Sessions: ${analyticsSummary.data.data.uniqueSessions}`);
    console.log(`   Contact Submissions: ${analyticsSummary.data.data.totalContactSubmissions}\n`);

    console.log('✅ Portfolio API Demo Completed Successfully!');
    console.log('\n🌐 Access your portfolio at: http://localhost:5000');
    console.log('📊 API Documentation available in README.md');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\n💡 Make sure the server is running with: npm start');
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  demoPortfolioAPI();
}

module.exports = { demoPortfolioAPI };