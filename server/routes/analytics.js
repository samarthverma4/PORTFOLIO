const express = require('express');
const router = express.Router();

// In-memory storage for analytics (in production, use a proper database)
let analytics = {
  pageViews: 0,
  projectViews: {},
  contactSubmissions: 0,
  skillsViewed: 0,
  dailyViews: {},
  userSessions: new Set(),
  interactions: []
};

// Helper function to get current date string
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Helper function to get user identifier
const getUserId = (req) => {
  return req.ip + '|' + (req.headers['user-agent'] || 'unknown');
};

// Middleware to track basic page views
router.use((req, res, next) => {
  const userId = getUserId(req);
  const today = getCurrentDate();
  
  // Track unique sessions
  analytics.userSessions.add(userId);
  
  // Track daily views
  if (!analytics.dailyViews[today]) {
    analytics.dailyViews[today] = 0;
  }
  analytics.dailyViews[today]++;
  
  next();
});

// POST /api/analytics/track - Track custom events
router.post('/track', (req, res) => {
  const { event, data } = req.body;
  const userId = getUserId(req);
  const timestamp = new Date().toISOString();
  
  // Store interaction
  analytics.interactions.push({
    event,
    data,
    userId,
    timestamp,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  // Update specific counters based on event type
  switch (event) {
    case 'page_view':
      analytics.pageViews++;
      break;
    case 'project_view':
      const projectId = data?.projectId;
      if (projectId) {
        analytics.projectViews[projectId] = (analytics.projectViews[projectId] || 0) + 1;
      }
      break;
    case 'contact_submit':
      analytics.contactSubmissions++;
      break;
    case 'skills_view':
      analytics.skillsViewed++;
      break;
  }
  
  res.json({ success: true, message: 'Event tracked' });
});

// GET /api/analytics/summary - Get analytics summary
router.get('/summary', (req, res) => {
  const today = getCurrentDate();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const weeklyViews = last7Days.reduce((sum, date) => {
    return sum + (analytics.dailyViews[date] || 0);
  }, 0);
  
  const summary = {
    totalPageViews: analytics.pageViews,
    uniqueSessions: analytics.userSessions.size,
    totalContactSubmissions: analytics.contactSubmissions,
    totalSkillsViewed: analytics.skillsViewed,
    todayViews: analytics.dailyViews[today] || 0,
    weeklyViews,
    mostViewedProjects: Object.entries(analytics.projectViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([id, views]) => ({ projectId: parseInt(id), views })),
    dailyViewsChart: last7Days.map(date => ({
      date,
      views: analytics.dailyViews[date] || 0
    }))
  };
  
  res.json({ success: true, data: summary });
});

// GET /api/analytics/interactions - Get recent interactions
router.get('/interactions', (req, res) => {
  const { limit = 50, event } = req.query;
  
  let interactions = [...analytics.interactions];
  
  if (event) {
    interactions = interactions.filter(i => i.event === event);
  }
  
  interactions = interactions
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, parseInt(limit));
  
  res.json({ success: true, data: interactions });
});

// GET /api/analytics/projects - Get project view statistics
router.get('/projects', (req, res) => {
  const projectStats = Object.entries(analytics.projectViews)
    .map(([id, views]) => ({
      projectId: parseInt(id),
      views,
      percentage: Math.round((views / analytics.pageViews) * 100) || 0
    }))
    .sort((a, b) => b.views - a.views);
  
  res.json({ success: true, data: projectStats });
});

// GET /api/analytics/events - Get event type statistics
router.get('/events', (req, res) => {
  const eventCounts = {};
  
  analytics.interactions.forEach(interaction => {
    eventCounts[interaction.event] = (eventCounts[interaction.event] || 0) + 1;
  });
  
  const eventStats = Object.entries(eventCounts)
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count);
  
  res.json({ success: true, data: eventStats });
});

// DELETE /api/analytics/reset - Reset analytics (development only)
router.delete('/reset', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Reset only allowed in development mode'
    });
  }
  
  analytics = {
    pageViews: 0,
    projectViews: {},
    contactSubmissions: 0,
    skillsViewed: 0,
    dailyViews: {},
    userSessions: new Set(),
    interactions: []
  };
  
  res.json({ success: true, message: 'Analytics reset successfully' });
});

module.exports = router;