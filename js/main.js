(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight active nav link based on scroll position
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.getAttribute('id');
          var link = navAnchors.filter(function (a) {
            return a.getAttribute('href') === '#' + id;
          })[0];
          if (!link) return;
          if (entry.isIntersecting) {
            navAnchors.forEach(function (a) {
              a.classList.remove('active');
            });
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // Back to top button
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    var toggleBackToTop = function () {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
  }

  // Only one FAQ item open at a time
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  var faqStorageKey = 'blockcraft-guide-faq-open';

  // Restore previously opened FAQ item
  var savedFaqIndex = localStorage.getItem(faqStorageKey);
  if (savedFaqIndex !== null && faqItems[savedFaqIndex]) {
    faqItems[savedFaqIndex].open = true;
  }

  faqItems.forEach(function (item, index) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other, otherIndex) {
          if (other !== item) {
            other.open = false;
          }
        });
        localStorage.setItem(faqStorageKey, index);
      } else {
        localStorage.removeItem(faqStorageKey);
      }
    });
  });
})();
