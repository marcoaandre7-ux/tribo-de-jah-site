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
const route = document.querySelector('.route');

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
let videoDuration = 0;
let lastVideoTime = -1;

introVideo.addEventListener('loadedmetadata', () => {
  videoDuration = Number.isFinite(introVideo.duration) ? introVideo.duration : 0;
  introVideo.pause();
  updateMotion();
});

function updateMotion() {
  if (reduceMotion.matches) return;

  const viewport = window.innerHeight;
  const introRect = introStory.getBoundingClientRect();
  const introDistance = Math.max(introStory.offsetHeight - viewport, 1);
  const storyProgress = clamp(-introRect.top / introDistance);
  const openingOpacity = 1 - clamp((storyProgress - 0.08) / 0.18);
  const blackoutIn = clamp((storyProgress - 0.46) / 0.14);
  const blackoutOut = 1 - clamp((storyProgress - 0.72) / 0.16);
  const blackoutOpacity = blackoutIn * blackoutOut;
  const revealOpacity = clamp((storyProgress - 0.72) / 0.14);
  const showOpacity = clamp((storyProgress - 0.81) / 0.11);

  introStage.style.setProperty('--story-progress', storyProgress.toFixed(4));
  introStage.style.setProperty('--opening-opacity', openingOpacity.toFixed(4));
  introStage.style.setProperty('--blackout-opacity', blackoutOpacity.toFixed(4));
  introStage.style.setProperty('--reveal-opacity', revealOpacity.toFixed(4));
  introStage.style.setProperty('--show-opacity', showOpacity.toFixed(4));
  showContent.classList.toggle('is-active', showOpacity > 0.85);

  if (videoDuration > 0 && storyProgress <= 0.68) {
    const leadIn = Math.min(0.35, videoDuration * 0.04);
    const targetTime = leadIn + clamp(storyProgress / 0.58) * Math.max(videoDuration - leadIn - 0.04, 0);
    if (Math.abs(targetTime - lastVideoTime) > 0.025) {
      introVideo.currentTime = targetTime;
      lastVideoTime = targetTime;
    }
  }

  const routeRect = route.getBoundingClientRect();
  const routeProgress = clamp((viewport - routeRect.top) / (viewport + routeRect.height * 0.45));
  const position = 18 + routeProgress * 69;
  route.style.setProperty('--bus-position', `${position}%`);
  route.style.setProperty('--route-progress', `${position}%`);
}

let motionFrame = 0;
window.addEventListener('scroll', () => {
  if (motionFrame) return;
  motionFrame = requestAnimationFrame(() => {
    updateMotion();
    motionFrame = 0;
  });
}, { passive: true });
window.addEventListener('resize', updateMotion, { passive: true });
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
