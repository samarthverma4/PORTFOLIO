// Mini-game: Brick Breaker
document.addEventListener('DOMContentLoaded', function() {
  const beCreativeBtn = Array.from(document.querySelectorAll('.about-footer-center'))
    .find(el => el.textContent.trim().toUpperCase() === 'BE CREATIVE');
  if (!beCreativeBtn) return;

  let gameActive = false;
  let gameEnded = false;
  let brokenElements = new Set();
  let isPaused = false;

  beCreativeBtn.style.cursor = 'pointer';
  beCreativeBtn.addEventListener('click', startGame);

  function startGame() {
    if (gameActive) return;
    gameActive = true;
    gameEnded = false;
    brokenElements.clear();
    isPaused = false;

    const darkAbout = document.querySelector('.dark-about');
    if (!darkAbout) return;

    // Setup canvas
    const canvas = document.createElement('canvas');
    canvas.width = darkAbout.clientWidth;
    canvas.height = darkAbout.clientHeight;
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '2000';
    canvas.style.pointerEvents = 'auto';
    darkAbout.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Hide slider
    const slider = document.querySelector('.about-slider-bar-container');
    if (slider) slider.style.display = 'none';

    // Get breakable elements
    const nav = document.querySelector('.about-nav');
    const grid = document.querySelector('.about-center-grid');
    const footer = document.querySelector('.about-footer');
    const breakables = [
      ...Array.from(nav?.querySelectorAll('.about-nav-left span, .about-nav-right span, .about-newsletter') || []),
      ...Array.from(grid?.children || []),
      document.querySelector('.about-photo'),
      document.getElementById('prevBtn'),
      document.getElementById('nextBtn')
    ].filter(el => el && el !== footer);

    // Save original styles
    const originalStyles = new Map();
    breakables.forEach(el => {
      const rect = el.getBoundingClientRect();
      const parentRect = darkAbout.getBoundingClientRect();
      originalStyles.set(el, {
        className: el.className,
        style: el.getAttribute('style'),
        rect: {
          left: rect.left - parentRect.left,
          top: rect.top - parentRect.top,
          width: rect.width,
          height: rect.height
        }
      });

      // Lock position
      el.style.position = 'absolute';
      el.style.left = originalStyles.get(el).rect.left + 'px';
      el.style.top = originalStyles.get(el).rect.top + 'px';
      el.style.width = originalStyles.get(el).rect.width + 'px';
      el.style.height = originalStyles.get(el).rect.height + 'px';
      el.style.margin = '0';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });

    // Create counter
    const counter = document.createElement('div');
    Object.assign(counter.style, {
      position: 'absolute',
      left: '50%',
      top: '18px',
      transform: 'translateX(-50%)',
      zIndex: '2100',
      background: 'rgba(255,255,255,0.85)',
      color: '#222',
      padding: '7px 22px',
      borderRadius: '22px',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '1.08rem',
      fontWeight: '600',
      letterSpacing: '0.04em',
      border: '1.5px solid #ececec',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      transition: 'all 0.3s ease'
    });
    counter.textContent = `Broken: 0 / ${breakables.length}`;
    darkAbout.appendChild(counter);

    // Create controls
    const controls = document.createElement('div');
    Object.assign(controls.style, {
      position: 'absolute',
      right: '20px',
      top: '18px',
      zIndex: '2100',
      display: 'flex',
      gap: '8px'
    });
    darkAbout.appendChild(controls);

    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'breaker-pause-btn';
    pauseBtn.textContent = '⏸️';
    pauseBtn.onclick = () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
      if (!isPaused) gameLoop();
    };
    controls.appendChild(pauseBtn);

    // Game objects
    let mouseX = canvas.width / 2;
    
    const paddle = {
      x: canvas.width / 2 - 40,
      y: canvas.height - 30,
      width: 80,
      height: 10
    };

    const ball = {
      x: paddle.x + paddle.width / 2 - 4,
      y: paddle.y - 8,
      size: 8,
      dx: 3,
      dy: -3,
      speed: 3,
      held: true
    };

    // Mouse movement
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    });

    // Click to release ball
    canvas.addEventListener('click', () => {
      if (ball.held && !gameEnded) {
        ball.held = false;
        ball.dx = (Math.random() - 0.5) * 4;
        ball.dy = -Math.abs(ball.dy);
      }
    });

    // Try again functionality
    counter.addEventListener('click', () => {
      if (!gameEnded) return;
      cleanup();
      setTimeout(() => {
        startGame();
      }, 300);
    });

    function cleanup() {
      if (canvas && canvas.parentElement) canvas.remove();
      if (counter && counter.parentElement) counter.remove();
      if (controls && controls.parentElement) controls.remove();
      
      // Reset game state
      gameActive = false;
      gameEnded = false;
      brokenElements.clear();
      isPaused = false;
      
      // Restore slider
      const slider = document.querySelector('.about-slider-bar-container');
      if (slider) slider.style.display = '';
      
      // Restore all breakable elements
      breakables.forEach(el => {
        const orig = originalStyles.get(el);
        if (!orig) return;
        
        el.className = orig.className;
        if (orig.style) {
          el.setAttribute('style', orig.style);
        } else {
          el.removeAttribute('style');
        }
        
        // Make sure element is visible
        el.style.visibility = '';
        el.style.opacity = '';
      });
    }

    function checkCollisions() {
      breakables.forEach(el => {
        if (brokenElements.has(el)) return;
        
        const rect = el.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const elRect = {
          x: rect.left - canvasRect.left,
          y: rect.top - canvasRect.top,
          width: rect.width,
          height: rect.height
        };

        // Check ball collision with element
        if (ball.x < elRect.x + elRect.width &&
            ball.x + ball.size > elRect.x &&
            ball.y < elRect.y + elRect.height &&
            ball.y + ball.size > elRect.y) {
          
          brokenElements.add(el);
          el.style.visibility = 'hidden';
          ball.dy *= -1;
          
          counter.textContent = `Broken: ${brokenElements.size} / ${breakables.length}`;
          
          if (brokenElements.size === breakables.length) {
            endGame(true);
          }
        }
      });
    }

    function gameLoop() {
      if (gameEnded || isPaused) {
        if (!gameEnded && !isPaused) {
          requestAnimationFrame(gameLoop);
        }
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update paddle position
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, mouseX - paddle.width / 2));

      // Update ball position
      if (!ball.held) {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with walls
        if (ball.x <= 0 || ball.x + ball.size >= canvas.width) {
          ball.dx *= -1;
          ball.x = Math.max(0, Math.min(canvas.width - ball.size, ball.x));
        }
        if (ball.y <= 0) {
          ball.dy *= -1;
          ball.y = 0;
        }

        // Ball collision with paddle
        if (ball.y + ball.size >= paddle.y && 
            ball.y + ball.size <= paddle.y + paddle.height + 5 &&
            ball.x + ball.size >= paddle.x && 
            ball.x <= paddle.x + paddle.width) {
          
          ball.dy = -Math.abs(ball.dy);
          ball.y = paddle.y - ball.size;
          
          // Calculate angle based on where ball hits paddle
          const hitPosition = (ball.x + ball.size/2 - paddle.x) / paddle.width;
          ball.dx = ball.speed * (hitPosition - 0.5) * 2;
        }

        // Check if ball is lost
        if (ball.y + ball.size > canvas.height) {
          endGame(false);
          return;
        }

        // Check collisions with breakable elements
        checkCollisions();
      } else {
        // Ball follows paddle when held
        ball.x = paddle.x + paddle.width / 2 - ball.size / 2;
        ball.y = paddle.y - ball.size - 2;
      }

      // Draw paddle (visible and prominent)
      ctx.fillStyle = '#333';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      
      // Add paddle border for better visibility
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

      // Draw ball
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(ball.x + ball.size/2, ball.y + ball.size/2, ball.size/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Add ball border for better visibility
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.stroke();

      requestAnimationFrame(gameLoop);
    }

    function endGame(win) {
      if (gameEnded) return;
      gameEnded = true;

      counter.style.background = win ? '#4CAF50' : '#ff6b6b';
      counter.style.color = '#fff';
      counter.style.borderColor = 'transparent';
      counter.textContent = win ? '🎉 You Win! Click to Try Again' : 'Game Over - Click to Try Again';
      counter.style.cursor = 'pointer';
    }

    // Start the game loop
    gameLoop();
  }
});
