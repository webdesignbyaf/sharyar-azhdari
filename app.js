'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = $('#header');
const menu = $('#menu');
const menuToggle = $('.menu-toggle');
const dialog = $('#art-dialog');
const friendDialog = $('#friend-dialog');
let lastFriendTrigger;
const hero = $('.hero');
const manifesto = $('.manifesto');
const motionToggle = $('.motion-toggle');
let userMotionPaused = false;
const motionAllowed = () => !motion.matches && !userMotionPaused;
let lastArtTrigger;

function syncScrollLock() {
  document.body.classList.toggle('locked', menu.classList.contains('is-open') || dialog.open || friendDialog.open);
}
function toggleMenu(open) {
  menu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.firstChild.textContent = open ? 'Schließen ' : 'Menü ';
  menu.inert = !open;
  $('main').inert = open;
  syncScrollLock();
  if (open) $('nav a', menu).focus({preventScroll:true});
  else menuToggle.focus({preventScroll:true});
}
menuToggle.addEventListener('click', () => toggleMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
$$('a', header).forEach(a => a.addEventListener('click', () => { if(menu.classList.contains('is-open')) toggleMenu(false); }));
$$('a', menu).forEach(a => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', event => {
  if (!menu.classList.contains('is-open')) return;
  if (event.key === 'Escape') toggleMenu(false);
  if (event.key === 'Tab') {
    const focusables = [...$$('a, button', header), ...$$('a', menu)].filter(el => el.getClientRects().length);
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
    if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
  }
});
let scrollPending = false;
function updateHeader() {
  header.classList.toggle('is-fixed', window.scrollY > window.innerHeight * .75);
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  $('.reading-progress').style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
  if (motionAllowed()) {
    hero.style.setProperty('--scroll-y', `${Math.min(window.scrollY, hero.offsetHeight) * .16}px`);
    const rect = manifesto.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) manifesto.style.setProperty('--art-drift', `${(window.innerHeight / 2 - rect.top - rect.height / 2) * .1}px`);
  }
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { requestAnimationFrame(updateHeader); scrollPending = true; }
}, {passive:true});
updateHeader();

$$('.scene').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.scene);
  hero.dataset.scene = String(index);
  $$('.hero-image').forEach((image, i) => image.classList.toggle('is-active', i === index));
  $$('.scene').forEach((scene, i) => {
    scene.classList.toggle('is-active', i === index);
    scene.setAttribute('aria-pressed', String(i === index));
  });
}));

const artworks = {
  'neon-seduction': {title:'NEON SEDUCTION',size:'120 × 160 cm',description:'Neon, selbstbewusste Präsenz und urbane Energie. Ein farbstarkes Werk zwischen Rebellion, Freiheit und der Anziehungskraft der Nacht.'},
  'milano-artwork': {title:'MILANO',size:'130 × 200 cm',description:'Filmikone, mediterrane Eleganz und Italiens kulturelle Geschichte. Ein vielschichtiges Porträt zwischen klassischer Bildsprache und Popkultur.'},
  'neon-soul-ibiza': {title:'NEON SOUL OF IBIZA',size:'140 × 100 cm',description:'Pinke Leuchtkraft, Palmen und Straßenpoesie. Eine Liebeserklärung an Ibiza – und an das Gefühl eines Sommers, der bleibt.'},
  'money-icon': {title:'MONEY ICON',size:'180 × 80 cm',description:'Geldsymbolik, Markenästhetik und eine ikonische Figur treffen aufeinander. Eine S-ART Edition über Reichtum, Stil und Haltung.'},
  'virgin-artwork': {title:'VIRGIN',size:'130 × 200 cm',description:'Madonna als Sinnbild von Selbstbestimmung und Rebellion. Spitze, Schmuck und barocke Motive verschmelzen in einer expressiven Komposition.'},
  'velvet-icon-artwork': {title:'VELVET ICON',size:'200 × 130 cm',description:'Glamour und Verletzlichkeit, Erinnerung und Freiheit. Ein Porträt über die besondere Spannung, die eine Ikone unvergesslich macht.'}
};
$$('[data-art]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.art, art = artworks[key];
  lastArtTrigger = button;
  $('#dialog-title').textContent = art.title;
  $('#dialog-description').textContent = art.description;
  $('#dialog-size').textContent = art.size;
  $('#dialog-image').src = `assets/images/${key}.webp`;
  $('#dialog-image').alt = $('img', button).alt;
  $('#dialog-shop').href = `https://s-art.work/shop/${key}.html`;
  $('#dialog-inquiry').href = `mailto:info@sart.work?subject=${encodeURIComponent('Anfrage zum Kunstwerk '+art.title)}`;
  dialog.showModal();
  syncScrollLock();
  $('.dialog-close').focus();
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if(event.target === dialog) {const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();}});
dialog.addEventListener('close', () => {syncScrollLock(); lastArtTrigger?.focus({preventScroll:true});});
$$('.event').forEach(event => event.addEventListener('toggle', () => {
  if (event.open) $$('.event').forEach(other => {if(other !== event) other.open = false;});
}));

$$('.art-card').forEach((card, i) => card.style.setProperty('--reveal-delay', `${(i % 3) * 90}ms`));

if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {entry.target.classList.add('is-visible'); observer.unobserve(entry.target);}
  }), {threshold:0.08});
  $$('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('js');
}
$('#year').textContent = new Date().getFullYear();


// Motion responds to system preferences and can be paused at any time.
function syncMotion() {
  const paused = !motionAllowed();
  document.documentElement.classList.toggle('motion-paused', paused);
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = motion.matches ? 'Bewegung reduziert' : paused ? 'Bewegung aktivieren' : 'Bewegung pausieren';
  motionToggle.disabled = motion.matches;
  if (paused) {
    hero.style.setProperty('--pointer-x', '0px');
    hero.style.setProperty('--pointer-y', '0px');
    $$('.art-card').forEach(card => {
      card.style.setProperty('--hover-x', '0deg');
      card.style.setProperty('--hover-y', '0deg');
    });
  }
  updateHeader();
}
motionToggle.addEventListener('click', () => {userMotionPaused = !userMotionPaused; syncMotion();});
motion.addEventListener('change', syncMotion);
syncMotion();
if (motionAllowed()) {
  hero.classList.add('intro');
  window.setTimeout(() => hero.classList.remove('intro'), 1900);
}
const finePointer = window.matchMedia('(pointer: fine)');
let pointerFrame = 0;
hero.addEventListener('pointermove', event => {
  if (!motionAllowed() || !finePointer.matches || pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    if (motionAllowed()) {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--pointer-x', `${(event.clientX / rect.width - .5) * 22}px`);
      hero.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - .5) * 15}px`);
    }
    pointerFrame = 0;
  });
}, {passive:true});
hero.addEventListener('pointerleave', () => {
  cancelAnimationFrame(pointerFrame); pointerFrame = 0;
  hero.style.setProperty('--pointer-x', '0px');
  hero.style.setProperty('--pointer-y', '0px');
});
$$('.art-card').forEach(card => {
  let bounds, frame = 0;
  card.addEventListener('pointerenter', () => {bounds = card.getBoundingClientRect();});
  card.addEventListener('pointermove', event => {
    if (!motionAllowed() || !finePointer.matches || !bounds || frame) return;
    frame = requestAnimationFrame(() => {
      if (motionAllowed()) {
        card.style.setProperty('--hover-x', `${(.5 - (event.clientY - bounds.top) / bounds.height) * 7}deg`);
        card.style.setProperty('--hover-y', `${((event.clientX - bounds.left) / bounds.width - .5) * 9}deg`);
      }
      frame = 0;
    });
  }, {passive:true});
  card.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame); frame = 0;
    card.style.setProperty('--hover-x', '0deg');
    card.style.setProperty('--hover-y', '0deg');
  });
});


$$('[data-friend]').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.friend-card');
  lastFriendTrigger = button;
  $('#friend-dialog-image').src = $('img', button).src;
  $('#friend-dialog-image').alt = $('img', button).alt;
  $('#friend-dialog-title').textContent = $('h3', card).textContent;
  $('#friend-dialog-description').textContent = $('.friend-copy p:not(.friend-kicker)', card).textContent;
  $('#friend-dialog-credit').textContent = $('.friend-copy small', card).textContent;
  friendDialog.showModal(); syncScrollLock(); $('.friend-close').focus();
}));
$('.friend-close').addEventListener('click', () => friendDialog.close());
friendDialog.addEventListener('click', event => {
  if (event.target !== friendDialog) return;
  const rect = friendDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) friendDialog.close();
});
friendDialog.addEventListener('close', () => {syncScrollLock(); lastFriendTrigger?.focus({preventScroll:true});});

// Keep the collage still when it is outside the viewport or the tab is hidden.
if ('IntersectionObserver' in window) {
  let heroInView = true;
  const syncHeroVisibility = () => hero.classList.toggle('is-offscreen', !heroInView || document.hidden);
  new IntersectionObserver(([entry]) => {heroInView = entry.isIntersecting; syncHeroVisibility();}, {threshold:0}).observe(hero);
  document.addEventListener('visibilitychange', syncHeroVisibility);
}
