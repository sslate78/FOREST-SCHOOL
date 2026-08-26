(function () {
  'use strict';

  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  const emptyMessage = document.querySelector('[data-gallery-empty]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const lightboxCounter = document.querySelector('[data-lightbox-counter]');
  const closeButton = document.querySelector('[data-lightbox-close]');
  const prevButton = document.querySelector('[data-lightbox-prev]');
  const nextButton = document.querySelector('[data-lightbox-next]');

  const rawItems = Array.isArray(window.FOREST_GALLERY_IMAGES)
    ? window.FOREST_GALLERY_IMAGES
    : [];

  const items = rawItems.map(function (item) {
    if (typeof item === 'string') {
      return { src: item, caption: 'Forest School photograph' };
    }
    return {
      src: item.src,
      caption: item.caption || 'Forest School photograph'
    };
  }).filter(function (item) { return item.src; });

  let activeIndex = 0;
  let lastFocused = null;

  if (!items.length) {
    if (emptyMessage) emptyMessage.hidden = false;
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach(function (item, index) {
    const figure = document.createElement('figure');
    figure.className = 'portfolio-item';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portfolio-photo';
    button.setAttribute('aria-label', 'Open photo ' + (index + 1) + ' of ' + items.length);

    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.caption;
    image.loading = index < 4 ? 'eager' : 'lazy';
    image.decoding = 'async';

    const overlay = document.createElement('span');
    overlay.className = 'portfolio-photo-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<span>View photo</span><span class="portfolio-plus">+</span>';

    button.appendChild(image);
    button.appendChild(overlay);
    button.addEventListener('click', function () {
      openLightbox(index, button);
    });

    figure.appendChild(button);
    fragment.appendChild(figure);
  });

  gallery.appendChild(fragment);

  function renderLightbox() {
    if (!lightbox || !lightboxImage) return;
    const item = items[activeIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.caption;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxCounter) {
      lightboxCounter.textContent = (activeIndex + 1) + ' / ' + items.length;
    }
  }

  function openLightbox(index, trigger) {
    if (!lightbox) return;
    activeIndex = index;
    lastFocused = trigger || document.activeElement;
    renderLightbox();
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    if (closeButton) closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function showPrevious() {
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    renderLightbox();
  }

  function showNext() {
    activeIndex = (activeIndex + 1) % items.length;
    renderLightbox();
  }

  if (closeButton) closeButton.addEventListener('click', closeLightbox);
  if (prevButton) prevButton.addEventListener('click', showPrevious);
  if (nextButton) nextButton.addEventListener('click', showNext);

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPrevious();
    if (event.key === 'ArrowRight') showNext();
  });
})();
