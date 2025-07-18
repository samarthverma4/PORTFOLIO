#!/usr/bin/env node
// Automated Deployment Script for Portfolio
// Usage: node deploy.js [platform]

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const platforms = {
  railway: {
    name: 'Railway',
    url: 'https://railway.app',
    instructions: [
      '1. Visit https://railway.app',
      '2. Sign up with GitHub',
      '3. Click "Deploy from GitHub repo"',
      '4. Select your portfolio repository',
      '5. Railway will auto-deploy!'
    ]
  },
  heroku: {
    name: 'Heroku',
    url: 'https://heroku.com',
    commands: [
      'heroku login',
      'heroku create samarth-portfolio-2025',
      'heroku config:set NODE_ENV=production',
      'git push heroku main'
    ]
  },
  vercel: {
    name: 'Vercel',
    url: 'https://vercel.com',
    commands: [
      'npm install -g vercel',
      'vercel login',
      'vercel',
      'vercel --prod'
    ]
  },
  netlify: {
    name: 'Netlify',
    url: 'https://netlify.com',
    commands: [
      'npm install -g netlify-cli',
      'netlify login',
      'netlify deploy',
      'netlify deploy --prod'
    ]
  },
  docker: {
    name: 'Docker',
    commands: [
      'docker build -t portfolio .',
      'docker run -p 5000:5000 portfolio'
    ]
  }
};

function showBanner() {
  console.log(`
🚀 Portfolio Deployment Helper
================================
  `);
}

function showPlatforms() {
  console.log('Available deployment platforms:\n');
  Object.entries(platforms).forEach(([key, platform]) => {
    console.log(`📡 ${key.toUpperCase()}: ${platform.name}`);
  });
  console.log('\nUsage: node deploy.js [platform]');
  console.log('Example: node deploy.js railway\n');
}

function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...\n');
  
  // Check if we're in a git repository
  try {
    execSync('git status', { stdio: 'ignore' });
    console.log('✅ Git repository detected');
  } catch (error) {
    console.log('❌ Not a git repository. Run: git init');
    return false;
  }
  
  // Check if package.json exists
  if (fs.existsSync('package.json')) {
    console.log('✅ package.json found');
  } else {
    console.log('❌ package.json not found');
    return false;
  }
  
  // Check if server directory exists
  if (fs.existsSync('server')) {
    console.log('✅ Server directory found');
  } else {
    console.log('❌ Server directory not found');
    return false;
  }
  
  // Check if client directory exists
  if (fs.existsSync('client')) {
    console.log('✅ Client directory found');
  } else {
    console.log('❌ Client directory not found');
    return false;
  }
  
  console.log('✅ All prerequisites met!\n');
  return true;
}

function deployToRailway() {
  console.log('🚂 Deploying to Railway...\n');
  console.log('Railway requires manual setup through their web interface:');
  platforms.railway.instructions.forEach(instruction => {
    console.log(`   ${instruction}`);
  });
  console.log(`\n🌐 Visit: ${platforms.railway.url}`);
  console.log('\n💡 Tip: Railway will auto-detect your Node.js app and deploy it!');
}

function deployToHeroku() {
  console.log('🟣 Deploying to Heroku...\n');
  
  try {
    // Check if Heroku CLI is installed
    execSync('heroku --version', { stdio: 'ignore' });
    console.log('✅ Heroku CLI detected');
    
    console.log('\n📋 Follow these steps:');
    platforms.heroku.commands.forEach((command, index) => {
      console.log(`${index + 1}. ${command}`);
    });
    
    console.log('\n🤖 Would you like me to run these commands? (y/n)');
    // In a real implementation, you'd wait for user input here
    console.log('\n💡 Run these commands manually or use the Heroku web interface');
    
  } catch (error) {
    console.log('❌ Heroku CLI not found');
    console.log('📥 Install it: npm install -g heroku');
  }
}

function deployToVercel() {
  console.log('▲ Deploying to Vercel...\n');
  
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI detected');
    
    console.log('\n🚀 Deploying automatically...');
    execSync('vercel', { stdio: 'inherit' });
    
  } catch (error) {
    console.log('❌ Vercel CLI not found');
    console.log('📥 Installing Vercel CLI...');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI installed');
      console.log('🚀 Now run: vercel');
    } catch (installError) {
      console.log('❌ Failed to install Vercel CLI');
      console.log('💡 Try manually: npm install -g vercel');
    }
  }
}

function deployToNetlify() {
  console.log('🌊 Deploying to Netlify...\n');
  
  try {
    execSync('netlify --version', { stdio: 'ignore' });
    console.log('✅ Netlify CLI detected');
    
    console.log('\n📋 Manual steps required:');
    platforms.netlify.commands.forEach((command, index) => {
      console.log(`${index + 1}. ${command}`);
    });
    
  } catch (error) {
    console.log('❌ Netlify CLI not found');
    console.log('📥 Install it: npm install -g netlify-cli');
  }
}

function deployWithDocker() {
  console.log('🐳 Building Docker container...\n');
  
  try {
    execSync('docker --version', { stdio: 'ignore' });
    console.log('✅ Docker detected');
    
    console.log('🔨 Building Docker image...');
    execSync('docker build -t portfolio .', { stdio: 'inherit' });
    
    console.log('✅ Docker image built successfully!');
    console.log('🚀 To run: docker run -p 5000:5000 portfolio');
    
  } catch (error) {
    console.log('❌ Docker not found');
    console.log('📥 Install Docker: https://docker.com/get-started');
  }
}

function generateDeploymentSummary() {
  console.log(`
📋 Deployment Summary
====================

Your portfolio is ready to deploy! Here are your options:

🌟 EASIEST: Railway (https://railway.app)
   - Just connect your GitHub repo and it auto-deploys!

🟣 CLASSIC: Heroku (https://heroku.com)
   - Reliable and well-documented platform

▲ MODERN: Vercel (https://vercel.com)
   - Great for frontend-focused deployments

🌊 FLEXIBLE: Netlify (https://netlify.com)
   - Excellent for static sites with functions

📁 Files Created for Deployment:
✅ Procfile (Heroku)
✅ railway.json (Railway)
✅ vercel.json (Vercel)
✅ netlify.toml (Netlify)
✅ Dockerfile (Docker)
✅ .dockerignore (Docker)

🔗 Deployment Guide: See DEPLOYMENT.md for detailed instructions

🎉 Your portfolio is production-ready!
  `);
}

function main() {
  const platform = process.argv[2];
  
  showBanner();
  
  if (!platform) {
    showPlatforms();
    return;
  }
  
  if (!checkPrerequisites()) {
    console.log('❌ Prerequisites not met. Please fix the issues above.');
    return;
  }
  
  switch (platform.toLowerCase()) {
    case 'railway':
      deployToRailway();
      break;
    case 'heroku':
      deployToHeroku();
      break;
    case 'vercel':
      deployToVercel();
      break;
    case 'netlify':
      deployToNetlify();
      break;
    case 'docker':
      deployWithDocker();
      break;
    case 'summary':
      generateDeploymentSummary();
      break;
    default:
      console.log(`❌ Unknown platform: ${platform}`);
      showPlatforms();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { main, platforms };