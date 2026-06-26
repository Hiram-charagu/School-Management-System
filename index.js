const params = new URLSearchParams(window.location.search);
const portal = params.get('portal');

if (portal && ['lecturer', 'admin', 'student'].includes(portal)) {
  localStorage.setItem('umma_selected_portal', portal);
}

const heroData = {
  title: 'Welcome to AL Suhaim University',
  subtitle: 'Modern. Accessible. Efficient Academic Management',
  description: 'Seamless access to your academic information anytime, anywhere',
  buttons: [
    { label: 'Access Portal', href: '#portals', variant: 'primary' },
    { label: 'Learn More', href: '#about', variant: 'secondary' }
  ],
  slides: [
    {
      image: './assets/magnific_a-modern-university-campu_jSEq0QTLD0.png',
      label: 'Modern campus'
    },
    {
      image: './assets/magnific_an-aerial-view-of-the-als_UybreKEwny.png',
      label: 'Aerial campus view'
    },
    {
      image: './assets/magnific_alsuhaim-university-grand_LUubTFWswO.png',
      label: 'Grand campus facade'
    }
  ]
};

const hero = document.querySelector('.hero');
const heroControls = document.querySelector('.hero-background-controls');
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroDescription = document.querySelector('.hero-description');
const heroButtonsElement = document.querySelector('.hero-buttons');
let activeHeroSlide = 0;
let heroSlideTimer = null;

const renderHeroContent = () => {
  if (heroTitle) heroTitle.textContent = heroData.title;
  if (heroSubtitle) heroSubtitle.textContent = heroData.subtitle;
  if (heroDescription) heroDescription.textContent = heroData.description;
  if (heroButtonsElement) {
    heroButtonsElement.innerHTML = heroData.buttons
      .map(button => `
        <a href="${button.href}" class="btn btn-${button.variant}">${button.label}</a>
      `)
      .join('');
  }
};

const heroSlides = heroData.slides;

const setHeroSlide = (index) => {
  if (!hero || !heroSlides.length) return;
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[activeHeroSlide];
  hero.style.setProperty('--hero-bg-image', `url("${slide.image}")`);

  document.querySelectorAll('.hero-bg-dot').forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === activeHeroSlide);
    dot.setAttribute('aria-pressed', String(dotIndex === activeHeroSlide));
  });
};

const startHeroSlider = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => setHeroSlide(activeHeroSlide + 1), 6500);
};

if (hero && heroControls) {
  heroControls.innerHTML = heroSlides
    .map((slide, index) => `<button class="hero-bg-dot" type="button" aria-label="${slide.label}" aria-pressed="false" data-slide="${index}"></button>`)
    .join('');

  heroControls.addEventListener('click', (event) => {
    const slideIndex = Number(event.target.dataset.slide);
    if (Number.isNaN(slideIndex)) return;
    setHeroSlide(slideIndex);
    startHeroSlider();
  });

  renderHeroContent();
  setHeroSlide(0);
  startHeroSlider();
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Animate elements on scroll with stagger effect
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
    }
  });
}, observerOptions);

// Observe all animated elements
const animateElements = document.querySelectorAll('.feature-card, .contact-card, .about-section, .portal-card');
animateElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.12)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = '0 2px 12px rgba(15, 23, 42, 0.08)';
    }
  });
}

// Animated counter for stats
const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
};

// Observer for stats section
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach((num, index) => {
        setTimeout(() => {
          const text = num.textContent.replace(/[^0-9.]/g, '');
          const target = parseFloat(text);
          if (num.textContent.includes('+')) {
            animateCounter(num, target, 2000);
            setTimeout(() => {
              num.textContent += '+';
            }, 2000);
          } else if (num.textContent.includes('%')) {
            animateCounter(num, target, 2000);
            setTimeout(() => {
              num.textContent += '%';
            }, 2000);
          }
        }, index * 200);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

const portalCards = document.querySelectorAll('.portal-card');

// Particles background effect
const createParticle = () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
  particle.style.opacity = Math.random() * 0.5 + 0.3;
  
  hero.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 5000);
};

// Create particles periodically
setInterval(createParticle, 300);

// Tilt effect on portal cards
portalCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// Pulse animation for CTA buttons
const ctaButtons = document.querySelectorAll('.btn-primary');
setInterval(() => {
  ctaButtons.forEach(btn => {
    btn.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
      btn.style.animation = '';
    }, 500);
  });
}, 5000);

// Ripple effect on feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
  card.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});
