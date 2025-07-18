const express = require('express');
const router = express.Router();

// Mock project data (in production, this would come from a database)
const projects = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern, responsive portfolio website built with cutting-edge technologies.",
    technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Node.js", "Express"],
    category: "Web Development",
    image: "/assets/images/portfolio-preview.jpg",
    demoUrl: "#",
    githubUrl: "https://github.com/samarthverma/portfolio",
    featured: true,
    status: "completed",
    completedDate: "2025-01-15"
  },
  {
    id: 2,
    title: "Club Event Portal",
    description: "A comprehensive event management system for university clubs with real-time updates.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Express", "JWT"],
    category: "Full Stack",
    image: "/assets/images/club-portal-preview.jpg",
    demoUrl: "#",
    githubUrl: "https://github.com/samarthverma/club-portal",
    featured: true,
    status: "completed",
    completedDate: "2024-12-20"
  },
  {
    id: 3,
    title: "AI Agent Event Creatives",
    description: "Automated creative generation system using AI for event marketing materials.",
    technologies: ["Python", "OpenAI API", "React", "FastAPI", "PostgreSQL"],
    category: "AI/ML",
    image: "/assets/images/ai-creatives-preview.jpg",
    demoUrl: "#",
    githubUrl: "https://github.com/samarthverma/ai-creatives",
    featured: true,
    status: "in-progress",
    completedDate: null
  },
  {
    id: 4,
    title: "E-Commerce Dashboard",
    description: "Analytics dashboard for e-commerce platforms with real-time data visualization.",
    technologies: ["Vue.js", "D3.js", "Laravel", "MySQL", "Redis"],
    category: "Data Visualization",
    image: "/assets/images/dashboard-preview.jpg",
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    status: "completed",
    completedDate: "2024-11-30"
  },
  {
    id: 5,
    title: "Mobile Task Manager",
    description: "Cross-platform mobile application for task management and productivity.",
    technologies: ["React Native", "Firebase", "Redux", "Expo"],
    category: "Mobile Development",
    image: "/assets/images/task-manager-preview.jpg",
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    status: "completed",
    completedDate: "2024-10-15"
  }
];

const skills = {
  frontend: [
    { name: "HTML5", level: 95, category: "markup" },
    { name: "CSS3", level: 90, category: "styling" },
    { name: "JavaScript", level: 88, category: "programming" },
    { name: "React", level: 85, category: "framework" },
    { name: "Vue.js", level: 80, category: "framework" },
    { name: "GSAP", level: 75, category: "animation" },
    { name: "Bootstrap", level: 90, category: "framework" },
    { name: "Tailwind CSS", level: 85, category: "framework" }
  ],
  backend: [
    { name: "Node.js", level: 85, category: "runtime" },
    { name: "Express.js", level: 80, category: "framework" },
    { name: "Python", level: 75, category: "programming" },
    { name: "FastAPI", level: 70, category: "framework" },
    { name: "Laravel", level: 65, category: "framework" },
    { name: "REST APIs", level: 85, category: "api" }
  ],
  database: [
    { name: "MongoDB", level: 80, category: "nosql" },
    { name: "MySQL", level: 75, category: "sql" },
    { name: "PostgreSQL", level: 70, category: "sql" },
    { name: "Redis", level: 65, category: "cache" },
    { name: "Firebase", level: 75, category: "baas" }
  ],
  tools: [
    { name: "Git & GitHub", level: 90, category: "version-control" },
    { name: "Docker", level: 70, category: "containerization" },
    { name: "AWS", level: 65, category: "cloud" },
    { name: "Azure", level: 60, category: "cloud" },
    { name: "Figma", level: 85, category: "design" },
    { name: "Adobe XD", level: 80, category: "design" }
  ]
};

// GET /api/portfolio/projects - Get all projects
router.get('/projects', (req, res) => {
  const { category, featured, status, limit } = req.query;
  
  let filteredProjects = [...projects];
  
  // Apply filters
  if (category) {
    filteredProjects = filteredProjects.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  if (featured === 'true') {
    filteredProjects = filteredProjects.filter(p => p.featured);
  }
  
  if (status) {
    filteredProjects = filteredProjects.filter(p => p.status === status);
  }
  
  // Apply limit
  if (limit && !isNaN(parseInt(limit))) {
    filteredProjects = filteredProjects.slice(0, parseInt(limit));
  }
  
  res.json({
    success: true,
    data: filteredProjects,
    total: filteredProjects.length
  });
});

// GET /api/portfolio/projects/:id - Get single project
router.get('/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id === parseInt(id));
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }
  
  res.json({
    success: true,
    data: project
  });
});

// GET /api/portfolio/skills - Get all skills
router.get('/skills', (req, res) => {
  const { category } = req.query;
  
  if (category && skills[category]) {
    return res.json({
      success: true,
      data: { [category]: skills[category] }
    });
  }
  
  res.json({
    success: true,
    data: skills
  });
});

// GET /api/portfolio/stats - Get portfolio statistics
router.get('/stats', (req, res) => {
  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    inProgressProjects: projects.filter(p => p.status === 'in-progress').length,
    featuredProjects: projects.filter(p => p.featured).length,
    technologies: [...new Set(projects.flatMap(p => p.technologies))].length,
    categories: [...new Set(projects.map(p => p.category))],
    totalSkills: Object.values(skills).flat().length,
    averageSkillLevel: Math.round(
      Object.values(skills).flat().reduce((sum, skill) => sum + skill.level, 0) /
      Object.values(skills).flat().length
    )
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// GET /api/portfolio/categories - Get project categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(projects.map(p => p.category))].map(category => ({
    name: category,
    count: projects.filter(p => p.category === category).length
  }));
  
  res.json({
    success: true,
    data: categories
  });
});

// GET /api/portfolio/technologies - Get all technologies used
router.get('/technologies', (req, res) => {
  const techCounts = {};
  
  projects.forEach(project => {
    project.technologies.forEach(tech => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });
  
  const technologies = Object.entries(techCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  res.json({
    success: true,
    data: technologies
  });
});

module.exports = router;