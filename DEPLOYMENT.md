# 🚀 Portfolio Deployment Guide

This guide shows you how to deploy your portfolio to various hosting platforms. Choose the one that works best for you!

## 🌟 Quick Deploy Options

### 1. 📡 **Railway (Recommended - Easiest)**

Railway is perfect for full-stack apps and offers great free tier.

**Steps:**
1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your portfolio repository
5. Railway will auto-deploy! 🎉

**One-click deploy:**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/portfolio)

**Environment Variables (Optional):**
```
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

### 2. 🟣 **Heroku (Classic Choice)**

Heroku is a reliable platform for Node.js applications.

**Steps:**
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-portfolio-name`
4. Deploy: `git push heroku main`

**Commands:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new app
heroku create samarth-portfolio-2025

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Open your app
heroku open
```

---

### 3. ▲ **Vercel (Frontend Focused)**

Great for static sites and serverless functions.

**Steps:**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your site is live! 🎉

**Commands:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NODE_ENV
vercel env add EMAIL_USER
vercel env add EMAIL_PASS

# Deploy to production
vercel --prod
```

---

### 4. 🌊 **Netlify (Static + Functions)**

Perfect for static sites with serverless backend.

**Steps:**
1. Visit [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `client`
5. Deploy! 🚀

**Or use Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

### 5. ☁️ **DigitalOcean App Platform**

Professional hosting with great performance.

**Steps:**
1. Visit [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Select your repository
4. Configure build settings:
   - Build command: `npm install`
   - Run command: `npm start`
5. Deploy! 🌊

---

### 6. 🚢 **Docker Deployment**

For containerized deployment on any platform.

First, let me create a Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Commands:**
```bash
# Build Docker image
docker build -t portfolio .

# Run container
docker run -p 5000:5000 portfolio

# Or with environment variables
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e EMAIL_USER=your-email@gmail.com \
  -e EMAIL_PASS=your-app-password \
  portfolio
```

---

## 🔧 Pre-Deployment Setup

Before deploying, make sure to:

### 1. **Environment Variables**
Set these in your hosting platform:

```env
NODE_ENV=production
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com
```

### 2. **Update CORS Origins**
Edit `server/index.js` and update the CORS configuration:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://your-app.herokuapp.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
```

### 3. **Update API Base URL**
Edit `client/js/api.js` if needed:

```javascript
constructor() {
  this.baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://your-deployed-domain.com'
    : window.location.origin;
  this.apiURL = `${this.baseURL}/api`;
}
```

---

## 🌍 Custom Domain Setup

### For any platform:
1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In your hosting platform, add custom domain
3. Update DNS records:
   - Type: CNAME
   - Name: www
   - Value: your-app-url.platform.com
4. Add SSL certificate (usually automatic)

---

## 📊 Monitoring & Analytics

### Add to your deployed app:
- **Google Analytics** for user tracking
- **Uptime monitoring** (UptimeRobot, Pingdom)
- **Error tracking** (Sentry, LogRocket)
- **Performance monitoring** (New Relic, DataDog)

---

## 🔍 Testing Deployment

After deployment, test these URLs:

```bash
# Health check
curl https://your-app.com/api/health

# Projects API
curl https://your-app.com/api/portfolio/projects

# Skills API
curl https://your-app.com/api/portfolio/skills

# Frontend
curl https://your-app.com/
```

---

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**: Check Node.js version in hosting platform
2. **API 404**: Verify API routes and CORS settings
3. **Static Files**: Ensure client folder is served correctly
4. **Environment Variables**: Check all required vars are set
5. **Port Issues**: Use `process.env.PORT || 5000`

### Debug Commands:
```bash
# Check logs (Heroku)
heroku logs --tail

# Check status
heroku ps:scale web=1

# Restart app
heroku restart
```

---

## 🎉 Success!

Once deployed, your portfolio will be live at:
- **Railway**: `https://your-app.up.railway.app`
- **Heroku**: `https://your-app.herokuapp.com`
- **Vercel**: `https://your-app.vercel.app`
- **Netlify**: `https://your-app.netlify.app`

Share your portfolio with the world! 🌟

---

## 📞 Need Help?

If you encounter issues:
1. Check the hosting platform's documentation
2. Review the deployment logs
3. Test locally with `npm start`
4. Check environment variables
5. Verify API endpoints are working

**Happy Deploying!** 🚀