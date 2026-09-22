/**
* Template Name: Kelly - v4.7.0
* Template URL: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Theme toggle
   */
  const rootBody = document.body;
  const rootHtml = document.documentElement;
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {
    savedTheme = null;
  }

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    if (isDark) {
      rootBody.setAttribute('data-theme', 'dark');
      rootHtml.setAttribute('data-theme', 'dark');
      rootHtml.classList.add('theme-dark');
    } else {
      rootBody.removeAttribute('data-theme');
      rootHtml.removeAttribute('data-theme');
      rootHtml.classList.remove('theme-dark');
    }

    document.querySelectorAll('.theme-toggle').forEach((toggle) => {
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  };

  const systemPrefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  on('click', '.theme-toggle', function() {
    const nextTheme = rootBody.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem('theme', nextTheme);
    } catch (e) {
      // Ignore storage failures and still apply the theme for this session.
    }
  }, true)

  /**
   * Small, self-contained project playgrounds
   */
  const selectPlaygroundChip = (choiceGroup, selectedChip) => {
    choiceGroup.querySelectorAll('.playground-chip').forEach((chip) => {
      const isSelected = chip === selectedChip;
      chip.classList.toggle('is-selected', isSelected);
      chip.setAttribute('aria-pressed', String(isSelected));
    });
  };

  document.querySelectorAll('.playground-choices').forEach((choiceGroup) => {
    choiceGroup.addEventListener('click', (event) => {
      const selectedChip = event.target.closest('.playground-chip');
      if (!selectedChip || !choiceGroup.contains(selectedChip)) return;
      selectPlaygroundChip(choiceGroup, selectedChip);
    });
  });

  const daycraftPlayground = document.querySelector('[data-daycraft-playground]');
  if (daycraftPlayground) {
    const focusBlocks = {
      deep: '75-minute focus block: shape the roadmap, then leave a 15-minute reset before the next commitment.',
      steady: '45-minute steady block: resolve the highest-priority task, then take a five-minute breather.',
      light: '20-minute quick win: clear one small task and create momentum for the rest of the day.'
    };
    const buildBlock = daycraftPlayground.querySelector('[data-daycraft-generate]');
    const daycraftResult = daycraftPlayground.querySelector('[data-daycraft-result]');

    if (buildBlock && daycraftResult) {
      buildBlock.addEventListener('click', () => {
        const selectedEnergy = daycraftPlayground.querySelector('[data-daycraft-energy][aria-pressed="true"]');
        if (!selectedEnergy) return;
        daycraftResult.textContent = focusBlocks[selectedEnergy.dataset.daycraftEnergy] || focusBlocks.deep;
      });
    }
  }

  const rebookedPlayground = document.querySelector('[data-rebooked-playground]');
  if (rebookedPlayground) {
    const countOutput = rebookedPlayground.querySelector('[data-rebooked-count]');
    const rebookedResult = rebookedPlayground.querySelector('[data-rebooked-result]');
    const decreaseButton = rebookedPlayground.querySelector('[data-rebooked-adjust="-1"]');
    const increaseButton = rebookedPlayground.querySelector('[data-rebooked-adjust="1"]');
    const matchButton = rebookedPlayground.querySelector('[data-rebooked-match]');
    const bookMatches = {
      children: {
        singular: "children's book",
        plural: "children's books",
        destination: 'community reading shelf'
      },
      textbook: {
        singular: 'textbook',
        plural: 'textbooks',
        destination: 'school library'
      },
      fiction: {
        singular: 'fiction book',
        plural: 'fiction books',
        destination: 'neighbourhood reading room'
      }
    };
    let bookCount = 3;

    const updateBookCount = () => {
      if (!countOutput || !decreaseButton || !increaseButton) return;
      countOutput.textContent = String(bookCount);
      countOutput.setAttribute('aria-label', `${bookCount} ${bookCount === 1 ? 'book' : 'books'} selected`);
      decreaseButton.disabled = bookCount === 1;
      increaseButton.disabled = bookCount === 12;
    };

    const resetRebookedMessage = () => {
      if (rebookedResult) {
        rebookedResult.textContent = `${bookCount} ${bookCount === 1 ? 'book' : 'books'} ready for ${bookCount === 1 ? 'its' : 'their'} next reader.`;
      }
    };

    [decreaseButton, increaseButton].forEach((button) => {
      if (!button) return;
      button.addEventListener('click', () => {
        const adjustment = Number(button.dataset.rebookedAdjust);
        bookCount = Math.max(1, Math.min(12, bookCount + adjustment));
        updateBookCount();
        resetRebookedMessage();
      });
    });

    if (matchButton && rebookedResult) {
      matchButton.addEventListener('click', () => {
        const selectedKind = rebookedPlayground.querySelector('[data-rebooked-kind][aria-pressed="true"]');
        const selectedMatch = selectedKind
          ? bookMatches[selectedKind.dataset.rebookedKind]
          : bookMatches.children;
        const bookLabel = bookCount === 1 ? selectedMatch.singular : selectedMatch.plural;
        rebookedResult.textContent = `${bookCount} ${bookLabel} ${bookCount === 1 ? 'is' : 'are'} ready for a ${selectedMatch.destination}.`;
      });
    }

    updateBookCount();
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    const navbar = select('#navbar');
    const isOpen = navbar.classList.toggle('navbar-mobile');
    const icon = this.querySelector('i') || this;
    icon.classList.toggle('bi-list');
    icon.classList.toggle('bi-x');
    this.setAttribute('aria-expanded', String(isOpen));
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        let navbarToggleIcon = navbarToggle.querySelector('i') || navbarToggle
        navbarToggleIcon.classList.toggle('bi-list')
        navbarToggleIcon.classList.toggle('bi-x')
        navbarToggle.setAttribute('aria-expanded', 'false')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 760,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

  /**
   * Keep the small footer stamp accurate without making the page depend on it.
   */
  const year = select('#year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

})()
