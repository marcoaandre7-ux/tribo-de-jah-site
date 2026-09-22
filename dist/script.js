const menuButton = document.querySelector('.menu-button');
const menuPanel = document.querySelector('.menu-panel');
const menuLinks = document.querySelectorAll('.menu-panel a');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-open', open);

  if (open) {
    menuPanel.hidden = false;
    requestAnimationFrame(() => menuPanel.classList.add('is-open'));
    menuPanel.querySelector('a').focus({ preventScroll: true });
  } else {
    menuPanel.classList.remove('is-open');
    window.setTimeout(() => { menuPanel.hidden = true; }, 650);
  }
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const introStory = document.querySelector('.intro-story');
const introStage = document.querySelector('.intro-stage');
const introVideo = document.querySelector('.intro-video');
const showContent = document.querySelector('.show-content');
const starCanvas = document.querySelector('.starfield');
const starContext = starCanvas.getContext('2d', { alpha: true });
const route = document.querySelector('.route');
const routePath = document.querySelector('#tour-route-path');
const routeBus = document.querySelector('.map-bus');
const routeSlider = document.querySelector('#route-slider');
const routeOutput = document.querySelector('.route-control output');

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
let videoDuration = 0;
let targetVideoTime = 0;
let storyProgress = 0;
let starsOpacity = 0;
let starSpeed = 1;
let starBoost = 0;
let stars = [];
let introInView = true;
let routeIsManual = false;
let animationFrame = 0;

function sizeStarfield() {
  const width = starCanvas.clientWidth;
  const height = starCanvas.clientHeight;
  const density = window.innerWidth < 700 ? 150 : 220;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

  starCanvas.width = Math.round(width * pixelRatio);
  starCanvas.height = Math.round(height * pixelRatio);
  starContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  stars = Array.from({ length: density }, () => ({
    x: (Math.random() - 0.5) * width,
    y: (Math.random() - 0.5) * height,
    z: Math.random() * Math.max(width, 1) + 1
  }));
}

function drawStarfield() {
  const width = starCanvas.clientWidth;
  const height = starCanvas.clientHeight;
  if (!width || !height) return;

  const phase = clamp((storyProgress - 0.53) / 0.22);
  const targetSpeed = starBoost || 1.2 + phase * 4.8;
  starSpeed += (targetSpeed - starSpeed) * 0.08;
  starContext.fillStyle = 'rgba(0,0,0,.38)';
  starContext.fillRect(0, 0, width, height);
  const centerX = width / 2;
  const centerY = height / 2;

  stars.forEach((star) => {
    const previousZ = star.z;
    star.z -= starSpeed * 4;
    if (star.z < 1) {
      star.z = width;
      star.x = (Math.random() - 0.5) * width;
      star.y = (Math.random() - 0.5) * height;
    }
    const scale = 128 / star.z;
    const previousScale = 128 / previousZ;
    const x = centerX + star.x * scale;
    const y = centerY + star.y * scale;
    const previousX = centerX + star.x * previousScale;
    const previousY = centerY + star.y * previousScale;
    const brightness = clamp(1 - star.z / width, 0.08, 1);
    starContext.strokeStyle = `rgba(255,255,255,${brightness.toFixed(2)})`;
    starContext.lineWidth = brightness * 1.8;
    starContext.beginPath();
    starContext.moveTo(previousX, previousY);
    starContext.lineTo(x, y);
    starContext.stroke();
  });
}

function animateMotion() {
  let keepAnimating = false;
  if (introInView && videoDuration > 0) {
    const difference = targetVideoTime - introVideo.currentTime;
    if (Math.abs(difference) > 0.012) {
      if (!introVideo.seeking) {
        const smoothing = Math.abs(difference) > 1.2 ? 0.34 : 0.22;
        introVideo.currentTime += difference * smoothing;
      }
      keepAnimating = true;
    }
  }
  if (introInView && starsOpacity > 0.01) {
    drawStarfield();
    keepAnimating = true;
  }
  animationFrame = keepAnimating ? requestAnimationFrame(animateMotion) : 0;
}

function requestMotionFrame() {
  if (!animationFrame && !reduceMotion.matches) animationFrame = requestAnimationFrame(animateMotion);
}

function positionBus(value) {
  const progress = clamp(Number(value) / 100);
  const length = routePath.getTotalLength();
  const point = routePath.getPointAtLength(length * progress);
  const nextPoint = routePath.getPointAtLength(Math.min(length, length * progress + 1));
  const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
  routeBus.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
  routeOutput.value = `${Math.round(progress * 100)}%`;
}

function initializeIntroVideo() {
  videoDuration = Number.isFinite(introVideo.duration) ? introVideo.duration : 0;
  introVideo.pause();
  updateMotion();
}

if (introVideo.readyState >= 1) {
  initializeIntroVideo();
} else {
  introVideo.addEventListener('loadedmetadata', initializeIntroVideo, { once: true });
}

function updateMotion() {
  if (reduceMotion.matches) return;

  const viewport = window.innerHeight;
  const introRect = introStory.getBoundingClientRect();
  const introDistance = Math.max(introStory.offsetHeight - viewport, 1);
  storyProgress = clamp(-introRect.top / introDistance);
  introInView = introRect.bottom > 0 && introRect.top < viewport;
  const openingOpacity = 1 - clamp((storyProgress - 0.08) / 0.18);
  const blackoutIn = clamp((storyProgress - 0.42) / 0.12);
  const blackoutOut = 1 - clamp((storyProgress - 0.79) / 0.11);
  const blackoutOpacity = blackoutIn * blackoutOut;
  const starsIn = clamp((storyProgress - 0.53) / 0.07);
  const starsOut = 1 - clamp((storyProgress - 0.70) / 0.08);
  starsOpacity = starsIn * starsOut;
  const revealOpacity = clamp((storyProgress - 0.78) / 0.14);
  const showOpacity = clamp((storyProgress - 0.86) / 0.1);

  introStage.style.setProperty('--story-progress', storyProgress.toFixed(4));
  introStage.style.setProperty('--opening-opacity', openingOpacity.toFixed(4));
  introStage.style.setProperty('--blackout-opacity', blackoutOpacity.toFixed(4));
  introStage.style.setProperty('--stars-opacity', starsOpacity.toFixed(4));
  introStage.style.setProperty('--reveal-opacity', revealOpacity.toFixed(4));
  introStage.style.setProperty('--show-opacity', showOpacity.toFixed(4));
  starCanvas.classList.toggle('is-active', starsOpacity > 0.08);
  showContent.classList.toggle('is-active', showOpacity > 0.85);

  if (videoDuration > 0) {
    const leadIn = Math.min(0.08, videoDuration * 0.01);
    targetVideoTime = leadIn + clamp(storyProgress / 0.48) * Math.max(videoDuration - leadIn - 0.04, 0);
  }

  if (!routeIsManual) {
    const routeRect = route.getBoundingClientRect();
    const routeProgress = clamp((viewport - routeRect.top) / (viewport + routeRect.height * 0.45));
    routeSlider.value = String(Math.round(routeProgress * 100));
    positionBus(routeSlider.value);
  }
  requestMotionFrame();
}

let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateMotion();
    scrollFrame = 0;
  });
}, { passive: true });

routeSlider.addEventListener('input', () => {
  routeIsManual = true;
  positionBus(routeSlider.value);
});

starCanvas.addEventListener('pointerdown', () => {
  starBoost = 8;
  requestMotionFrame();
});
window.addEventListener('pointerup', () => { starBoost = 0; });

window.addEventListener('resize', () => {
  sizeStarfield();
  updateMotion();
}, { passive: true });
sizeStarfield();
positionBus(0);
updateMotion();

let activeAlbum = null;
let previewTimer = null;

function stopAlbum(album) {
  if (!album) return;
  album.classList.remove('is-playing');
  const button = album.querySelector('.album-button');
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', `Reproduzir ${album.querySelector('.album-meta > span').textContent}`);
  album.querySelector('.album-status').textContent = 'Ouvir prévia';
  const progress = album.querySelector('.album-progress span');
  progress.style.animation = 'none';
  void progress.offsetWidth;
  progress.style.animation = '';
  if (activeAlbum === album) activeAlbum = null;
}

document.querySelectorAll('.album').forEach((album) => {
  const button = album.querySelector('.album-button');
  button.addEventListener('click', () => {
    if (activeAlbum === album) {
      window.clearTimeout(previewTimer);
      stopAlbum(album);
      return;
    }

    window.clearTimeout(previewTimer);
    stopAlbum(activeAlbum);
    activeAlbum = album;
    album.classList.add('is-playing');
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', `Parar ${album.querySelector('.album-meta > span').textContent}`);
    album.querySelector('.album-status').textContent = 'Prévia · 15s';

    previewTimer = window.setTimeout(() => stopAlbum(album), 15000);
  });
});
