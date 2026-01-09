class HeaderSticky {
  constructor() {
    this.header = document.querySelector('[data-js-header]');
    this.scrollThreshold = 450;
    this.heroElements = [];
    this.ticking = false;
    this.init();
  }

  init() {
    this.heroElements = [
      { element: document.querySelector('.hero__title'), name: 'title' },
      { element: document.querySelector('.hero__subtitle'), name: 'subtitle' },
      { element: document.querySelector('.hero__button'), name: 'button' }
    ].filter(item => item.element);

    window.addEventListener('scroll', this.handleScroll.bind(this),{ passive: true });
    this.handleScroll();
  }

  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        this.header.classList.toggle('header--scrolled', scrollY > this.scrollThreshold);

        const headerBottom = this.header.getBoundingClientRect().bottom;

        this.heroElements.forEach(({ element }) => {
          const elementRect = element.getBoundingClientRect();

          if (elementRect.top >= headerBottom) {
            element.style.opacity = 1;
            return;
          }

          if (elementRect.bottom <= headerBottom) {
            element.style.opacity = 0.1;
            return;
          }

          const overlapHeight = headerBottom - elementRect.top;
          const elementHeight = elementRect.height;
          const overlapRatio = overlapHeight / elementHeight;

          element.style.opacity = Math.max(0.1, 1 - overlapRatio);
        });

        this.ticking = false;
      });

      this.ticking = true;
    }
  }
}

export default HeaderSticky;