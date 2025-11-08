let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');
const homeSection = document.querySelector('.home');
const homeHeading = document.querySelector('.home .row .content h3');
const mainHomeImage = document.querySelector('.main-home-image');
const sliderOptions = document.querySelectorAll('.image-slider .slider-option');
const themeClasses = Array.from(new Set(Array.from(sliderOptions).map(option => option.dataset.theme ? `theme-${option.dataset.theme}` : null).filter(Boolean)));

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
};

sliderOptions.forEach(option => {
    option.onclick = () => {
        const { src, title, theme } = option.dataset;
        const themeClass = theme ? `theme-${theme}` : null;

        if (mainHomeImage && src) {
            mainHomeImage.src = src;
        }

        if (homeHeading && title) {
            homeHeading.textContent = title;
        }

        if (homeSection && themeClass) {
            homeSection.classList.remove(...themeClasses);
            homeSection.classList.add(themeClass);
        }

        // Update active visual state and accessibility
        sliderOptions.forEach(btn => {
            const isActive = btn === option;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };
});

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
    grabCursor: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        }
    },
});
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-in');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Certificates modal (About page)
(() => {
  const modal = document.getElementById('cert-modal');
  if (!modal) return; // only on about page
  const modalImg = document.getElementById('cert-modal-img');
  const closeBtn = modal.querySelector('.modal-close');
  const certButtons = document.querySelectorAll('.cert');

  const openModal = (src) => {
    if (!src) return;
    modalImg.src = src;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  };

  certButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.src));
  });

  closeBtn && closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });
})();

// Count-up numbers for About hero stats
(() => {
  const nums = document.querySelectorAll('[data-countup]');
  if (!nums.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-countup'), 10);
    const duration = 1200; // ms
    const start = performance.now();
    const startVal = 0;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = val.toString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // If already revealed, animate; otherwise, wait for reveal-in
  nums.forEach(el => {
    if (el.classList.contains('reveal-in') || el.closest('.reveal')?.classList.contains('reveal-in')) {
      animateCount(el);
    }
  });

  const onReveal = (e) => {
    if (e.target.matches('.reveal.reveal-in') || e.target.classList?.contains('reveal-in')) {
      e.target.querySelectorAll?.('[data-countup]').forEach(animateCount);
    }
  };

  // Observe class changes to know when 'reveal-in' is applied
  const mo = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class' && m.target.classList.contains('reveal-in')) {
        m.target.querySelectorAll?.('[data-countup]').forEach(animateCount);
      }
    });
  });
  document.querySelectorAll('.reveal').forEach(node => mo.observe(node, { attributes: true }));
})();

// Gallery lightbox (Gallery page)
(() => {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return; // only on gallery page
  const modalImg = document.getElementById('gallery-modal-img');
  const closeBtn = modal.querySelector('.modal-close');
  const items = document.querySelectorAll('.bento-item, .golden-item');

  const open = (src) => {
    if (!src) return;
    modalImg.src = src;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  };

  items.forEach(btn => btn.addEventListener('click', () => open(btn.dataset.lightbox)));
  closeBtn && closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close(); });
})();