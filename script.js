/* =============== SHOW MENU =============== */
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

/* Menu show */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/* Menu hidden */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/* =============== REMOVE MENU MOBILE =============== */
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
};
navLink.forEach(n => n.addEventListener('click', linkAction));

/* =============== SCROLL REVEAL ANIMATION =============== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

/* =============== CHANGE BACKGROUND HEADER =============== */
const scrollHeader = () => {
    const header = document.getElementById('header');
    window.scrollY >= 50 ? header.classList.add('scroll-header')
        : header.classList.remove('scroll-header');
};
window.addEventListener('scroll', scrollHeader);

/* =============== SCROLL SECTIONS ACTIVE LINK =============== */
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 100,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            if (sectionsClass) sectionsClass.classList.add('active-link');
        } else {
            if (sectionsClass) sectionsClass.classList.remove('active-link');
        }
    });
};
window.addEventListener('scroll', scrollActive);

/* =============== FORM FEEDBACK =============== */
const contactForm = document.querySelector('.contact__form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = contactForm.querySelector('.button');
        const originalText = button.textContent;

        button.textContent = 'Mission Initiated';
        button.style.background = 'var(--accent-cyan)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

/* =============== FUTURISTIC LIVE READOUT =============== */
const utcClock = document.getElementById('utc-clock');
const latencyReadout = document.getElementById('latency-readout');

const tickTelemetry = () => {
    if (utcClock) {
        const now = new Date();
        utcClock.textContent = now.toISOString().slice(11, 19);
    }

    if (latencyReadout) {
        const jitter = Math.floor(Math.random() * 7) - 3;
        const value = Math.max(8, 12 + jitter);
        latencyReadout.textContent = `${value}ms`;
    }
};

tickTelemetry();
setInterval(tickTelemetry, 1000);

/* =============== METRIC COUNT-UP =============== */
const metricValues = document.querySelectorAll('.highlights__value');
const animateMetric = (el) => {
  const finalText = el.dataset.final || el.textContent.trim();
  const suffix = finalText.replace(/[\d.]/g, '');
  const numeric = parseFloat(finalText);
  if (Number.isNaN(numeric)) return;
  const start = performance.now();
  const duration = 1200;
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const current = finalText.includes('.') ? (numeric * eased).toFixed(2) : Math.round(numeric * eased).toString();
    el.textContent = `${current}${suffix}`;
    if (p < 1) requestAnimationFrame(step); else el.textContent = finalText;
  };
  requestAnimationFrame(step);
};
const metricObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateMetric(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.5 });
metricValues.forEach((el) => { el.dataset.final = el.textContent.trim(); el.textContent = '0'; metricObserver.observe(el); });

/* =============== LIVE ACTIVITY FEED =============== */
const liveFeed = document.getElementById('live-feed');
const uptimeReadout = document.getElementById('uptime-readout');
const sessionReadout = document.getElementById('session-readout');

const liveEvents = [
  'SYNCHRONIZING CLOUD REGIONS · AP-SOUTH / EU-WEST',
  'AUTONOMOUS MONITORING: 0 CRITICAL INCIDENTS',
  'PIPELINE DEPLOYMENT WINDOW VERIFIED',
  'EDGE CACHE REFRESH COMPLETE · +14% THROUGHPUT',
  'SECURITY SWEEP PASSED · ZERO-TRUST POLICIES ACTIVE'
];

let liveEventIndex = 0;
const cycleLiveFeed = () => {
  if (!liveFeed) return;
  liveFeed.textContent = liveEvents[liveEventIndex];
  liveEventIndex = (liveEventIndex + 1) % liveEvents.length;
};

const updateLiveStats = () => {
  if (uptimeReadout) {
    const uptime = (99.94 + Math.random() * 0.05).toFixed(2);
    uptimeReadout.textContent = `${uptime}%`;
  }
  if (sessionReadout) {
    const sessions = 120 + Math.floor(Math.random() * 36);
    sessionReadout.textContent = sessions.toString();
  }
};

cycleLiveFeed();
updateLiveStats();
setInterval(cycleLiveFeed, 3200);
setInterval(updateLiveStats, 2400);
