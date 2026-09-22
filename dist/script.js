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
const heroVideo = document.querySelector('.hero-video');
const heroCopy = document.querySelector('.hero-copy');
const route = document.querySelector('.route');

function updateMotion() {
  if (reduceMotion.matches) return;

  const scrollTop = window.scrollY;
  const heroHeight = document.querySelector('.hero').offsetHeight;
  const heroProgress = Math.min(scrollTop / heroHeight, 1);
  heroVideo.style.transform = `scale(${1 + heroProgress * 0.08})`;
  heroVideo.style.filter = `brightness(${1 - heroProgress * 0.62})`;
  heroCopy.style.transform = `translateY(${heroProgress * 36}px)`;
  heroCopy.style.opacity = String(1 - heroProgress * 1.25);

  const routeRect = route.getBoundingClientRect();
  const viewport = window.innerHeight;
  const routeProgress = Math.max(0, Math.min(1, (viewport - routeRect.top) / (viewport + routeRect.height * 0.45)));
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
