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
const introVideo = document.querySelector('.intro-video');
const introVideoToggle = document.querySelector('.intro-video-toggle');
const routePath = document.querySelector('#tour-route-path');
const routeBus = document.querySelector('.map-bus');
const tourSection = document.querySelector('.tour');
const routeProgressBar = document.querySelector('.route-progress-track');
const routeOutput = document.querySelector('.route-control output');
const routeCountdownLabel = document.querySelector('.route-countdown span');
const routeCountdownTime = document.querySelector('.route-countdown strong');
const routeRestart = document.querySelector('.route-restart');

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
let introVisible = false;
let introPausedByUser = reduceMotion.matches;
const routeDemoDuration = 60000;
let routeDemoStartedAt = null;
let routeDemoFrame = 0;
let routeDemoVisible = false;
let lastRouteSecond = null;

function positionBus(value) {
  const progress = clamp(Number(value) / 100);
  const length = routePath.getTotalLength();
  const point = routePath.getPointAtLength(length * progress);
  const nextPoint = routePath.getPointAtLength(Math.min(length, length * progress + 1));
  const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
  routeBus.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
  const percentage = Math.round(progress * 100);
  routeOutput.value = `${percentage}%`;
  routeProgressBar.style.setProperty('--route-value', `${percentage}%`);
  routeProgressBar.setAttribute('aria-valuenow', String(percentage));
}

function updateRouteDemo() {
  routeDemoFrame = 0;
  if (reduceMotion.matches || routeDemoStartedAt === null) return;

  const elapsed = Date.now() - routeDemoStartedAt;
  const progress = clamp(elapsed / routeDemoDuration);
  const remainingSeconds = Math.max(0, Math.ceil((routeDemoDuration - elapsed) / 1000));
  positionBus(progress * 100);

  if (remainingSeconds !== lastRouteSecond) {
    lastRouteSecond = remainingSeconds;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    routeCountdownLabel.textContent = progress >= 1 ? 'Chegada concluída' : 'Chegada em';
    routeCountdownTime.textContent = progress >= 1
      ? '00:00'
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  if (progress < 1 && routeDemoVisible) routeDemoFrame = requestAnimationFrame(updateRouteDemo);
}

function restartRouteDemo() {
  if (reduceMotion.matches) return;
  routeDemoStartedAt = Date.now();
  lastRouteSecond = null;
  positionBus(0);
  if (routeDemoFrame) cancelAnimationFrame(routeDemoFrame);
  updateRouteDemo();
}

function updateIntroControl() {
  introVideoToggle.textContent = introVideo.paused ? 'Reproduzir vídeo' : 'Pausar vídeo';
}

function syncIntroVideo() {
  if (!introVisible || document.hidden || introPausedByUser) {
    introVideo.pause();
    updateIntroControl();
    return;
  }
  introVideo.play().then(updateIntroControl).catch(() => {
    introPausedByUser = true;
    updateIntroControl();
  });
}

introVideoToggle.addEventListener('click', () => {
  introPausedByUser = !introVideo.paused;
  syncIntroVideo();
});
document.addEventListener('visibilitychange', syncIntroVideo);
const introObserver = new IntersectionObserver(([entry]) => {
  introVisible = entry.isIntersecting;
  syncIntroVideo();
}, { threshold: 0.05 });
introObserver.observe(introStory);
updateIntroControl();

const routeObserver = new IntersectionObserver((entries) => {
  routeDemoVisible = entries[0].isIntersecting;
  if (routeDemoVisible) {
    if (routeDemoStartedAt === null) restartRouteDemo();
    else updateRouteDemo();
  } else if (routeDemoFrame) {
    cancelAnimationFrame(routeDemoFrame);
    routeDemoFrame = 0;
  }
}, { threshold: 0, rootMargin: '-20% 0px -20% 0px' });
routeObserver.observe(tourSection);

routeRestart.addEventListener('click', restartRouteDemo);

positionBus(0);
if (reduceMotion.matches) {
  positionBus(100);
  routeCountdownLabel.textContent = 'Rota exibida sem movimento';
  routeCountdownTime.textContent = '';
  routeRestart.disabled = true;
}
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
