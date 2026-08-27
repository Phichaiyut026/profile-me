const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('mobile-nav', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('mobile-nav');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const galleryImages = Array.from(document.querySelectorAll('.memory-gallery img'));
const lightbox = document.querySelector('.image-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('figcaption');
const closeLightboxButton = lightbox?.querySelector('.lightbox-close');
const prevLightboxButton = lightbox?.querySelector('.lightbox-prev');
const nextLightboxButton = lightbox?.querySelector('.lightbox-next');
let currentImageIndex = 0;

function showLightboxImage(index) {
  if (!lightbox || !lightboxImage || !lightboxCaption || galleryImages.length === 0) return;

  currentImageIndex = (index + galleryImages.length) % galleryImages.length;
  const selectedImage = galleryImages[currentImageIndex];

  lightboxImage.src = selectedImage.src;
  lightboxImage.alt = selectedImage.alt;
  lightboxCaption.textContent = `${selectedImage.alt} (${currentImageIndex + 1}/${galleryImages.length})`;
}

function openLightbox(index) {
  if (!lightbox) return;

  showLightboxImage(index);
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
}

galleryImages.forEach((image, index) => {
  image.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openLightbox(index);
  });
});

closeLightboxButton?.addEventListener('click', closeLightbox);
prevLightboxButton?.addEventListener('click', () => showLightboxImage(currentImageIndex - 1));
nextLightboxButton?.addEventListener('click', () => showLightboxImage(currentImageIndex + 1));

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox?.classList.contains('is-open')) return;

  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
  if (event.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
});

const progressBar = document.querySelector('.scroll-progress');
const backToTopButton = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('section, .timeline-item, .project, .service-list > div, .contact-card');
const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
const typewriter = document.querySelector('.typewriter');
const heroArt = document.querySelector('.hero-art');
const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollEffects() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  if (progressBar) progressBar.style.width = `${progress}%`;
  backToTopButton?.classList.toggle('is-visible', window.scrollY > 520);
}

window.addEventListener('scroll', updateScrollEffects, { passive: true });
window.addEventListener('resize', updateScrollEffects);
updateScrollEffects();

backToTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (motionAllowed && 'IntersectionObserver' in window) {
  revealItems.forEach((item) => item.classList.add('reveal-item'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if ('IntersectionObserver' in window) {
  const sectionsById = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-42% 0px -48% 0px' });

  sectionsById.forEach((section) => activeNavObserver.observe(section));
}

if (motionAllowed && typewriter) {
  const words = typewriter.dataset.words?.split('|').filter(Boolean) ?? [];
  let wordIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  function typeNextCharacter() {
    if (words.length === 0) return;

    const currentWord = words[wordIndex];
    typewriter.textContent = currentWord.slice(0, characterIndex);

    if (!deleting && characterIndex < currentWord.length) {
      characterIndex += 1;
      window.setTimeout(typeNextCharacter, 72);
      return;
    }

    if (!deleting) {
      deleting = true;
      window.setTimeout(typeNextCharacter, 1200);
      return;
    }

    if (characterIndex > 0) {
      characterIndex -= 1;
      window.setTimeout(typeNextCharacter, 34);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(typeNextCharacter, 260);
  }

  typeNextCharacter();
}

if (motionAllowed && heroArt) {
  heroArt.addEventListener('pointermove', (event) => {
    const rect = heroArt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroArt.style.setProperty('--move-x', `${x * 18}px`);
    heroArt.style.setProperty('--move-y', `${y * 18}px`);
  });

  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--move-x', '0px');
    heroArt.style.setProperty('--move-y', '0px');
  });
}
