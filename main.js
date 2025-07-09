// Cover click transition with previous animation
const cover = document.getElementById('cover');
const mainContent = document.getElementById('mainContent');

// Animated morph for cover card (expands from center, title always centered)
if (cover) {
  cover.addEventListener('click', function handleCoverClick(e) {
    if (cover.classList.contains('anim-rect') || cover.classList.contains('anim-expand')) return;
    cover.classList.add('anim-overflow');
    // Step 1: Morph to horizontal rectangle
    cover.classList.add('anim-rect');
    // Step 2: After width/height transition, round corners
    setTimeout(() => {
      cover.classList.add('anim-rounded');
      // Step 3: After border-radius, expand to fullscreen from center
      setTimeout(() => {
        cover.classList.add('anim-expand');
        // Step 4: After expand, fade out cover and fade in welcome
        setTimeout(() => {
          cover.classList.add('anim-fadeout');
          const welcome = document.getElementById('welcome');
          if (welcome) welcome.classList.add('visible');
          // After fade, hide cover and show main content
          setTimeout(() => {
            cover.style.display = 'none';
            mainContent.classList.add('visible');
            setTimeout(showBookFlip, 800);
          }, 600);
        }, 800);
      }, 500);
    }, 600);
  });
}

let aboutPageAnimated = false;

function showBookFlip() {
  const welcome = document.getElementById('welcome');
  const book = document.getElementById('bookFlip');
  // Fade out welcome
  welcome.style.transition = "opacity 0.7s";
  welcome.style.opacity = 0;
  // Fade in book with slight overlap
  setTimeout(() => {
    book.style.display = "flex";
    book.style.opacity = "0";
    book.style.transition = "opacity 0.8s cubic-bezier(.77,0,.18,1)";
    setTimeout(() => {
      book.style.opacity = "1";
      // Animate about page only after book is fully visible, and only once
      setTimeout(() => {
        if (pages[0].classList.contains('active') && !aboutPageAnimated) {
          animateAboutPage();
          aboutPageAnimated = true;
        }
        // Hide welcome after book is visible
        setTimeout(() => {
          welcome.style.display = "none";
        }, 200);
      }, 800); // match book fade duration
    }, 100); // slight overlap for smoothness
  }, 400); // start book fade in before welcome is fully gone
}
const pages = [
  document.getElementById('page1'),
  document.getElementById('page2'),
  document.getElementById('page3'),
  document.getElementById('page4')
];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let current = 0;
function updatePages() {
  pages.forEach((page, i) => {
    page.classList.remove('left', 'active', 'right');
    if (i < current) page.classList.add('left');
    else if (i === current) page.classList.add('active');
    else page.classList.add('right');
  });
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;
}
prevBtn.addEventListener('click', () => {
  if (current > 0) {
    current--;
    updatePages();
  }
});
nextBtn.addEventListener('click', () => {
  if (current < pages.length - 1) {
    current++;
    updatePages();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
});
let startX = null;
document.getElementById('bookFlip').addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});
document.getElementById('bookFlip').addEventListener('touchend', e => {
  if (startX !== null) {
    let dx = e.changedTouches[0].clientX - startX;
    if (dx > 40) prevBtn.click();
    if (dx < -40) nextBtn.click();
    startX = null;
  }
});
updatePages();

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.about-center-grid');
  if (grid) {
    Array.from(grid.children).forEach(el => el.classList.add('about-animate-hide'));
  }
  const nav = document.querySelector('.about-nav');
  const footer = document.querySelector('.about-footer');
  if (nav) nav.classList.add('about-animate-hide');
  if (footer) footer.classList.add('about-animate-hide');
});

// Function to animate the about page elements
function animateAboutPage() {
  const grid = document.querySelector('.about-center-grid');
  if (!grid) return;

  // Add hide class to all grid items, nav, and footer
  const items = Array.from(grid.children);
  items.forEach(el => el.classList.add('about-animate-hide'));
  const nav = document.querySelector('.about-nav');
  const footer = document.querySelector('.about-footer');
  if (nav) nav.classList.add('about-animate-hide');
  if (footer) footer.classList.add('about-animate-hide');

  // Also add hide class to all descendants of nav and footer
  if (nav) nav.querySelectorAll('*').forEach(el => el.classList.add('about-animate-hide'));
  if (footer) footer.querySelectorAll('*').forEach(el => el.classList.add('about-animate-hide'));

  // Force reflow
  void grid.offsetWidth;

  // Start animations immediately (no outer delay)
  // Animate navigation first
  if (nav) {
    nav.classList.remove('about-animate-hide');
    nav.style.transition = 'opacity 0.6s ease-out, transform 0.8s ease-out';
    nav.style.opacity = '1';
    nav.style.transform = 'translateY(0)';
    // Reveal all nav descendants
    nav.querySelectorAll('*').forEach(el => {
      el.classList.remove('about-animate-hide');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
  // Animate footer
  if (footer) {
    setTimeout(() => {
      footer.classList.remove('about-animate-hide');
      footer.style.transition = 'opacity 0.6s ease-out, transform 0.8s ease-out';
      footer.style.opacity = '1';
      footer.style.transform = 'translateY(0)';
      // Reveal all footer descendants
      footer.querySelectorAll('*').forEach(el => {
        el.classList.remove('about-animate-hide');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 60);
  }
  // Animate each grid element with minimal stagger
  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.remove('about-animate-hide');
      el.style.transition = 'opacity 0.4s cubic-bezier(.77,0,.18,1), transform 0.5s cubic-bezier(.77,0,.18,1)';
      el.style.opacity = '1';
      el.style.transform = 'scale(1) translateY(0)';
      setTimeout(() => {
        el.style.transform = 'scale(1.05) translateY(0)';
        setTimeout(() => {
          el.style.transform = 'scale(1) translateY(0)';
        }, 80);
      }, 180);
    }, i * 40);
  });
}

// Mini-game: Brick Breaker on About Me page
(function() {
  const beCreativeBtn = Array.from(document.querySelectorAll('.about-footer-center')).find(el => el.textContent.trim().toUpperCase() === 'BE CREATIVE');
  if (!beCreativeBtn) return;
  let gameActive = false;
  let restoreTimeout = null;

  beCreativeBtn.style.cursor = 'pointer';
  beCreativeBtn.addEventListener('click', startGame);

  function startGame() {
    if (gameActive) return;
    gameActive = true;
    
    // Apply pixel retro effect to the entire page
    const aboutPage = document.querySelector('.dark-about');
    if (aboutPage) {
      aboutPage.style.filter = 'contrast(1.2) saturate(1.1)';
      aboutPage.style.imageRendering = 'pixelated';
      aboutPage.style.imageRendering = '-moz-crisp-edges';
      aboutPage.style.imageRendering = 'crisp-edges';
      aboutPage.style.transition = 'filter 0.3s ease-out';
    }
    
    // Lock all element positions to prevent layout shifts
    const allElements = document.querySelectorAll('.dark-about *');
    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        el.style.position = 'relative';
        el.style.left = '0';
        el.style.top = '0';
      }
    });
    
    // Hide slider bar (removed - no longer needed)
    
    // Get breakable elements: nav items (not .about-nav itself), newsletter, grid, photo
    const nav = document.querySelector('.about-nav');
    // Only direct nav items and newsletter button
    let navBreakables = [];
    if (nav) {
      navBreakables = Array.from(nav.querySelectorAll('.about-nav-left span, .about-nav-right span, .about-newsletter'));
    }
    const grid = document.querySelector('.about-center-grid');
    const gridChildren = grid ? Array.from(grid.children) : [];
    const photo = document.querySelector('.about-photo');
    // Exclude footer and its children
    const footer = document.querySelector('.about-footer');
    const footerChildren = footer ? Array.from(footer.querySelectorAll('*')) : [];
    // Collect all breakables except footer and its children
    let breakables = [];
    breakables = breakables.concat(navBreakables);
    breakables = breakables.concat(gridChildren);
    if (photo && !breakables.includes(photo)) breakables.push(photo);
    // Remove any footer elements from breakables
    breakables = breakables.filter(el => el !== footer && !footerChildren.includes(el));
    // Save original styles for full restoration
    const originalStyles = new Map();
    breakables.forEach(el => {
      originalStyles.set(el, {
        transition: el.style.transition,
        transform: el.style.transform,
        opacity: el.style.opacity,
        display: el.style.display
      });
    });
    const broken = new Set();

    // Create and show counter (centered in middle of header)
    let counter = document.createElement('div');
    counter.className = 'breaker-counter';
    // Position in absolute center of viewport width, middle of nav height
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const parentRect = document.querySelector('.dark-about').getBoundingClientRect();
    // Use 50% of viewport width for true center positioning
    let left = '50%';
    let top = navRect ? (navRect.top - parentRect.top + navRect.height/2) : 40;
    counter.style.position = 'absolute';
    counter.style.left = left;
    counter.style.top = `${top}px`;
    counter.style.transform = 'translate(-50%, -50%)';
    counter.style.zIndex = 2100;
    counter.style.background = 'rgba(0,0,0,0.85)';
    counter.style.color = '#00ff00';
    counter.style.fontWeight = 'bold';
    counter.style.fontFamily = 'monospace, Courier, Arial';
    counter.style.fontSize = '1.1rem';
    counter.style.padding = '6px 16px';
    counter.style.borderRadius = '0';
    counter.style.border = '2px solid #00ff00';
    counter.style.boxShadow = '0 0 10px rgba(0,255,0,0.3), inset 0 0 10px rgba(0,255,0,0.1)';
    counter.style.letterSpacing = '0.1em';
    counter.style.userSelect = 'none';
    counter.style.textShadow = '0 0 5px #00ff00';
    counter.style.imageRendering = 'pixelated';
    counter.textContent = `BROKEN: 0/${breakables.length}`;
    document.querySelector('.dark-about').appendChild(counter);

    // Create exit button with retro aesthetics
    let exitButton = document.createElement('button');
    exitButton.className = 'breaker-exit';
    exitButton.textContent = 'EXIT';
    exitButton.style.position = 'absolute';
    exitButton.style.top = '20px';
    exitButton.style.right = '20px';
    exitButton.style.zIndex = 2100;
    exitButton.style.background = 'rgba(255, 94, 98, 0.9)';
    exitButton.style.color = '#fff';
    exitButton.style.border = '2px solid #ff5e62';
    exitButton.style.fontFamily = 'monospace, Courier, Arial';
    exitButton.style.fontSize = '0.9rem';
    exitButton.style.fontWeight = 'bold';
    exitButton.style.padding = '8px 16px';
    exitButton.style.borderRadius = '0';
    exitButton.style.cursor = 'pointer';
    exitButton.style.letterSpacing = '0.1em';
    exitButton.style.textShadow = '0 0 5px #ff5e62';
    exitButton.style.boxShadow = '0 0 10px rgba(255,94,98,0.3), inset 0 0 10px rgba(255,94,98,0.1)';
    exitButton.style.imageRendering = 'pixelated';
    exitButton.style.userSelect = 'none';
    exitButton.style.transition = 'all 0.2s ease';
    exitButton.addEventListener('mouseenter', () => {
      exitButton.style.background = 'rgba(255, 94, 98, 1)';
      exitButton.style.transform = 'scale(1.05)';
    });
    exitButton.addEventListener('mouseleave', () => {
      exitButton.style.background = 'rgba(255, 94, 98, 0.9)';
      exitButton.style.transform = 'scale(1)';
    });
    exitButton.addEventListener('click', () => endGame(false));
    document.querySelector('.dark-about').appendChild(exitButton);

    // Create game canvas overlay with retro styling
    let canvas = document.createElement('canvas');
    canvas.className = 'breaker-canvas';
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = 2000;
    canvas.style.pointerEvents = 'none';
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';
    document.querySelector('.dark-about').appendChild(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let ctx = canvas.getContext('2d');
    
    // Disable anti-aliasing for pixel effect
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    // Paddle
    let paddle = {
      w: 120, h: 16,
      x: canvas.width/2 - 60,
      y: canvas.height - 40,
      vx: 0
    };
    let dragging = false, dragOffset = 0;
    // Paddle drag logic
    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('mousedown', e => {
      if (e.offsetY > paddle.y && e.offsetY < paddle.y + paddle.h && e.offsetX > paddle.x && e.offsetX < paddle.x + paddle.w) {
        dragging = true;
        dragOffset = e.offsetX - paddle.x;
      }
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const rect = canvas.getBoundingClientRect();
      let mx = e.clientX - rect.left;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, mx - dragOffset));
    });
    window.addEventListener('mouseup', () => dragging = false);

    // Ball
    let ball = {
      r: 10,
      x: paddle.x + paddle.w/2,
      y: paddle.y - 12,
      vx: (Math.random() > 0.5 ? 1 : -1) * 5,
      vy: -6
    };

    // Power-up/casualty state
    let balls = [{...ball}];
    let paddleGrowTimeout = null;
    let ballSpeedTimeout = null;
    let gameLostByBomb = false;

    // 60fps loop
    let lastTime = performance.now();
    function loop(now) {
      let dt = Math.min(1, (now - lastTime) / 16.67);
      lastTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddle
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 8);
      ctx.fillStyle = '#ffb347';
      ctx.shadowColor = '#ff5e62';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      // Draw all balls
      balls.forEach(ball => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
        ctx.fillStyle = '#ff5e62';
        ctx.shadowColor = '#ffb347';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      });

      // Draw counter (indestructible)
      // (already in DOM, so nothing to do here)

      // Ball movement and collision logic for all balls
      balls.forEach((ball, idx) => {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        // Paddle collision
        if (ball.y + ball.r > paddle.y && ball.y - ball.r < paddle.y + paddle.h && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
          ball.vy = -Math.abs(ball.vy);
          let hit = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
          ball.vx += hit * 2;
        }
        // Wall collision
        if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx *= -1; }
        if (ball.x + ball.r > canvas.width) { ball.x = canvas.width - ball.r; ball.vx *= -1; }
        if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy *= -1; }
        // Lose condition
        if (ball.y - ball.r > canvas.height) {
          balls.splice(idx, 1);
        }
      });
      // If all balls lost (and not by bomb), lose
      if (balls.length === 0 && !gameLostByBomb) {
        endGame(false);
        return;
      }

      // Element collision for all balls
      balls.forEach(ball => {
        breakables.forEach(el => {
          if (broken.has(el)) return;
          const rect = el.getBoundingClientRect();
          const parentRect = canvas.getBoundingClientRect();
          let ex = rect.left - parentRect.left;
          let ey = rect.top - parentRect.top;
          let ew = rect.width;
          let eh = rect.height;
          if (ball.x + ball.r > ex && ball.x - ball.r < ex + ew && ball.y + ball.r > ey && ball.y - ball.r < ey + eh) {
            broken.add(el);
            ball.vy *= -1;
            el.style.transition = 'transform 0.4s cubic-bezier(.77,0,.18,1), opacity 0.4s cubic-bezier(.77,0,.18,1)';
            el.style.transform = 'scale(0.2) rotate(20deg)';
            el.style.opacity = '0';
            setTimeout(() => { el.style.display = 'none'; }, 400);
            counter.textContent = `BROKEN: ${broken.size}/${breakables.length}`;
          }
        });
      });

      // Counter collision - now just bounces ball, no power-ups
      balls.forEach(ball => {
        const counterRect = counter.getBoundingClientRect();
        const parentRect = canvas.getBoundingClientRect();
        let cx = counterRect.left - parentRect.left;
        let cy = counterRect.top - parentRect.top;
        let cw = counterRect.width;
        let ch = counterRect.height;
        if (ball.x + ball.r > cx && ball.x - ball.r < cx + cw && ball.y + ball.r > cy && ball.y - ball.r < cy + ch) {
          // Ball bounces off counter
          ball.vy = Math.abs(ball.vy) * (Math.random() > 0.5 ? 1 : -1);
        }
      });

      // Win condition
      if (broken.size === breakables.length) {
        endGame(true);
        return;
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // End/reset logic
    function endGame(win) {
      gameActive = false;
      // Remove canvas, counter, and exit button
      canvas.remove();
      counter.remove();
      exitButton.remove();
      
      // Keep retro effect active - don't remove it
      // Comment out the retro effect removal to maintain pixelated theme
      // if (aboutPage) {
      //   aboutPage.style.filter = '';
      //   aboutPage.style.imageRendering = '';
      //   aboutPage.style.transition = '';
      // }
      
      // Unlock element positions
      allElements.forEach(el => {
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
      });
      
      // Restore slider (removed - no longer needed)
      // Restore all breakables to original state
      breakables.forEach(el => {
        const orig = originalStyles.get(el) || {};
        el.style.transition = orig.transition || '';
        el.style.transform = orig.transform || '';
        el.style.opacity = orig.opacity || '';
        el.style.display = orig.display || '';
      });
      broken.clear();
      // Reset variables
      gameLostByBomb = false;
      // Optionally show a message
      if (win) {
        beCreativeBtn.textContent = '🎉 You Win! Click to Play Again';
        restoreTimeout = setTimeout(() => { beCreativeBtn.textContent = 'BE CREATIVE'; }, 3000);
      } else {
        beCreativeBtn.textContent = 'Try Again?';
        restoreTimeout = setTimeout(() => { beCreativeBtn.textContent = 'BE CREATIVE'; }, 2000);
      }
    }
  }
})();

