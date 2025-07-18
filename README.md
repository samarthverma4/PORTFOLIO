# Modern Portfolio Website

A full-stack portfolio website showcasing modern web development skills with beautiful GSAP animations, responsive design, and a robust backend API.

## 🚀 Features

### Frontend
- **Modern Design**: Clean, professional interface with smooth animations
- **GSAP Animations**: High-performance animations and transitions
- **Responsive**: Mobile-first design that works on all devices
- **Interactive**: Book-style page navigation with smooth transitions
- **Dynamic Content**: Projects and skills loaded from backend API
- **Contact Form**: Functional contact form with validation
- **Analytics**: User interaction tracking
- **Performance**: Optimized loading and rendering

### Backend
- **Express.js API**: RESTful API for portfolio data
- **Contact System**: Email functionality for contact form
- **Analytics**: Track user interactions and portfolio views
- **Security**: Rate limiting, CORS, and security headers
- **Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error handling and logging

## 🛠 Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- GSAP (GreenSock Animation Platform)
- Modern CSS Grid & Flexbox
- Progressive Web App features

### Backend
- Node.js
- Express.js
- CORS & Helmet (Security)
- Nodemailer (Email)
- Rate Limiting
- dotenv (Environment variables)

### Development Tools
- Nodemon (Development)
- Concurrently (Run multiple commands)
- Live Server (Development server)

## 📁 Project Structure

```
portfolio/
├── client/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── main.css           # Original styles
│   ├── about.css          # About page styles
│   ├── main.js            # Original JavaScript
│   ├── about.js           # About page logic
│   ├── css/
│   │   └── enhanced.css   # Enhanced modern styles
│   ├── js/
│   │   ├── api.js         # API client
│   │   ├── gsap-animations.js # GSAP animations
│   │   └── portfolio.js   # Main portfolio logic
│   └── assets/            # Images and static files
├── server/                # Backend files
│   ├── index.js          # Main server file
│   ├── routes/           # API routes
│   │   ├── contact.js    # Contact endpoints
│   │   ├── portfolio.js  # Portfolio data endpoints
│   │   └── analytics.js  # Analytics endpoints
│   ├── models/           # Data models (if using database)
│   ├── middleware/       # Custom middleware
│   └── controllers/      # Route controllers
├── package.json          # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md           # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Email configuration (optional)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CONTACT_EMAIL=your-email@gmail.com
   ```

4. **Start Development Server**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

5. **Production Build**
   ```bash
   npm start
   ```

### Development Commands

```bash
npm run dev      # Start development servers (frontend + backend)
npm run server   # Start backend server with nodemon
npm run client   # Start frontend with live server
npm start        # Start production server
npm run build    # Build for production
```

## 🎯 API Endpoints

### Portfolio Data
- `GET /api/portfolio/projects` - Get all projects
- `GET /api/portfolio/projects/:id` - Get single project
- `GET /api/portfolio/skills` - Get all skills
- `GET /api/portfolio/stats` - Get portfolio statistics

### Contact
- `POST /api/contact` - Send contact form
- `GET /api/contact/info` - Get contact information

### Analytics
- `POST /api/analytics/track` - Track user events
- `GET /api/analytics/summary` - Get analytics summary

### Health
- `GET /api/health` - Server health check

## 🎨 Customization

### Adding Projects
Edit `server/routes/portfolio.js` and add your projects to the `projects` array:

```javascript
{
  id: 6,
  title: "Your Project",
  description: "Project description",
  technologies: ["React", "Node.js"],
  category: "Web Development",
  image: "/assets/images/project-preview.jpg",
  demoUrl: "https://demo.com",
  githubUrl: "https://github.com/username/repo",
  featured: true,
  status: "completed",
  completedDate: "2024-01-01"
}
```

### Adding Skills
Update the `skills` object in `server/routes/portfolio.js`:

```javascript
frontend: [
  { name: "Your Skill", level: 85, category: "framework" }
]
```

### Styling
- Main styles: `client/main.css` and `client/about.css`
- Enhanced styles: `client/css/enhanced.css`
- Colors and themes can be customized in CSS custom properties

### Animations
- GSAP animations: `client/js/gsap-animations.js`
- Add custom animations by extending the `GSAPAnimations` class

## 🔧 Configuration

### Email Setup
For contact form functionality:

1. **Gmail Setup**:
   - Enable 2-factor authentication
   - Generate an app password
   - Use app password in `EMAIL_PASS`

2. **Other Providers**:
   - Update `EMAIL_SERVICE` in `.env`
   - Configure SMTP settings in `server/routes/contact.js`

### Analytics
The built-in analytics track:
- Page views
- Project interactions
- Contact form submissions
- User sessions

### Security
- Rate limiting on contact form
- CORS configuration
- Security headers with Helmet
- Input validation and sanitization

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Frontend Only (Static Hosting)
Deploy the `client` folder to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

### Full Stack Deployment
Deploy to platforms like:
- Heroku
- Railway
- DigitalOcean
- AWS
- Google Cloud Platform

#### Heroku Deployment
```bash
# Add Heroku remote
heroku create your-portfolio-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password

# Deploy
git push heroku main
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GSAP](https://greensock.com/gsap/) for amazing animations
- [Express.js](https://expressjs.com/) for the backend framework
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: rajeevnikky.15@gmail.com

---

Made with ❤️ by Samarth Verma