/* ─── app.js — STACKLY Law Services ─────────────────────── */

// ── Preloader ─────────────────────────────────────────────
window.addEventListener('load', () => {
  const pre = document.querySelector('.preloader');
  if (pre) { pre.classList.add('done'); }
  initReveal();
});

// ── Theme ─────────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('stackly-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-theme-toggle]');
  if (!btn) return;
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('stackly-theme', next);
});

// ── Scroll Progress Bar ───────────────────────────────────
window.addEventListener('scroll', () => {
  const bar = document.querySelector('.progress-bar');
  if (bar) {
    const total = document.body.scrollHeight - window.innerHeight;
    if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
  }
  const header = document.querySelector('.site-header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  const btt = document.querySelector('.back-to-top');
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  highlightNav();
});

// ── Custom Cursor ─────────────────────────────────────────
(function cursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .card, .practice-card, .team-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

// ── Reveal on Scroll ──────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Nav Highlight ─────────────────────────────────────────
function highlightNav() {
  const page = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const ap = a.getAttribute('data-page');
    if (ap && ap === page) a.setAttribute('data-active', '');
    else a.removeAttribute('data-active');
  });
}
highlightNav();


// ── Inject mobile sidebar header + auth buttons (once) ───
(function buildMobileSidebar() {
  const nav = document.querySelector('.nav-links');
  if (!nav || nav.querySelector('.mob-sidebar-header')) return;

  const actions = document.querySelector('.nav-actions');
  const loginHref  = actions?.querySelector('a[href*="login"]')?.getAttribute('href')  || './pages/login.html';
  const signupHref = actions?.querySelector('a[href*="signup"]')?.getAttribute('href') || './pages/signup.html';

  // Header: X close button only
  const header = document.createElement('div');
  header.className = 'mob-sidebar-header';
  header.innerHTML = '<button class="mob-sidebar-close sidebar-nav-close" aria-label="Close menu">&#x2715;</button>';
  nav.insertBefore(header, nav.firstChild);

  // Login + Sign Up pinned at bottom
  const auth = document.createElement('div');
  auth.className = 'mob-sidebar-auth';
  auth.innerHTML =
    '<a href="' + loginHref  + '" class="btn btn-secondary btn-sm mob-auth-btn">Login</a>' +
    '<a href="' + signupHref + '" class="btn btn-primary  btn-sm mob-auth-btn">Sign Up</a>';
  nav.appendChild(auth);
})();

// ── Mobile Menu ───────────────────────────────────────────
// Store where nav-links lives so we can restore it after close
var _navOrigParent = null, _navOrigNext = null;

function closeNav() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  nav.classList.remove('open');
  // Restore nav to its original position inside the header
  if (_navOrigParent) {
    if (_navOrigNext) _navOrigParent.insertBefore(nav, _navOrigNext);
    else _navOrigParent.appendChild(nav);
    _navOrigParent = null; _navOrigNext = null;
  }
  const mt = document.querySelector('.menu-toggle');
  if (mt) mt.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.body.classList.remove('nav-open');
}

document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  if (toggle) {
    // Move nav to <body> to escape header's backdrop-filter containing block
    if (!nav.classList.contains('open')) {
      _navOrigParent = nav.parentElement;
      _navOrigNext   = nav.nextSibling;
      document.body.appendChild(nav);
    }
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('nav-open');
  } else if (e.target.closest('.sidebar-nav-close')) {
    closeNav();
  } else if (e.target.closest('.sidebar-nav-back')) {
    closeNav(); history.back();
  } else if (e.target.closest('.nav-links a:not(.sidebar-auth-btn)')) {
    closeNav();
  } else if (!e.target.closest('.nav-links')) {
    closeNav();
  }
});

// ── Typing Effect ─────────────────────────────────────────
(function typing() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;
  const phrases = ['Cross-Border Transactions', 'Corporate Compliance', 'M&A Advisory', 'Dispute Resolution', 'International Arbitration'];
  let pi = 0, ci = 0, del = false;
  function tick() {
    const phrase = phrases[pi];
    el.textContent = del ? phrase.slice(0, ci--) : phrase.slice(0, ci++);
    if (!del && ci === phrase.length + 1) { del = true; setTimeout(tick, 1800); return; }
    if (del && ci < 0) { del = false; pi = (pi + 1) % phrases.length; ci = 0; }
    setTimeout(tick, del ? 60 : 80);
  }
  tick();
})();

// ── Particles ─────────────────────────────────────────────
(function particles() {
  const wrap = document.querySelector('.particles');
  if (!wrap) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*8}s;animation-duration:${6+Math.random()*6}s;`;
    wrap.appendChild(p);
  }
})();

// ── Counter Animation ─────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const dur = 1800;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target * ease;
    el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); countObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(el => countObs.observe(el));

// ── Password Toggle ───────────────────────────────────────
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.toggle-pass');
  if (!btn) return;
  const inp = btn.closest('.input-icon-wrapper')?.querySelector('input');
  if (!inp) return;
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
});

// ── Password Strength ─────────────────────────────────────
document.addEventListener('input', (e) => {
  if (!e.target.id?.includes('password') && !e.target.id?.includes('pass')) return;
  const val = e.target.value;
  const wrap = e.target.closest('.form-group');
  if (!wrap) return;
  const segs = wrap.querySelectorAll('.strength-segment');
  const label = wrap.querySelector('.strength-label');
  if (!segs.length) return;
  segs.forEach(s => s.className = 'strength-segment');
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const classes = ['', 'weak', 'fair', 'strong', 'strong'];
  for (let i = 0; i < score; i++) segs[i]?.classList.add(classes[score]);
  if (label) label.textContent = score ? labels[score] : '';
});

// ── Role Selector ─────────────────────────────────────────
document.querySelectorAll('.role-option').forEach(opt => {
  opt.addEventListener('click', () => {
    opt.closest('.role-selector')?.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    const radio = opt.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  });
});

// ── Error helpers (use :not(:empty) CSS approach) ─────────
function showError(field, msgEl, msg) {
  field.classList.add('error');
  if (msgEl) msgEl.textContent = msg;
}
function clearError(field, msgEl) {
  field.classList.remove('error');
  if (msgEl) msgEl.textContent = '';
}

// ── Auth Form Validation ──────────────────────────────────
function validateAuthForm(form) {
  let valid = true;
  form.querySelectorAll('input[required], input[data-required]').forEach(field => {
    const errEl = field.closest('.form-group')?.querySelector('.error-text');
    clearError(field, errEl);
    const val = field.value.trim();
    if (!val) {
      showError(field, errEl, 'This field is required'); valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(field, errEl, 'Enter a valid email address'); valid = false;
    } else if ((field.name === 'firstname' || field.name === 'lastname') && !/^[a-zA-Z\s'\-]{2,}$/.test(val)) {
      showError(field, errEl, 'Name must contain letters only (min 2 characters)'); valid = false;
    } else if (field.type === 'tel' && val && !/^[\+\d\s\-\(\)]{7,20}$/.test(val)) {
      showError(field, errEl, 'Enter a valid phone number (e.g. +1 555 000 0000)'); valid = false;
    } else if ((field.id?.includes('password') || field.name === 'password') && !field.id?.includes('confirm') && field.value.length < 6) {
      showError(field, errEl, 'Password must be at least 6 characters'); valid = false;
    }
  });
  // Also validate optional phone fields when the user filled them in
  form.querySelectorAll('input[type="tel"]').forEach(field => {
    if (field.hasAttribute('required') || field.hasAttribute('data-required')) return;
    const val = field.value.trim();
    if (!val) return;
    const errEl = field.closest('.form-group')?.querySelector('.error-text');
    clearError(field, errEl);
    if (!/^[\+\d\s\-\(\)]{7,20}$/.test(val)) {
      showError(field, errEl, 'Enter a valid phone number (e.g. +1 555 000 0000)'); valid = false;
    }
  });
  const pass = form.querySelector('#signup-password');
  const conf = form.querySelector('#signup-confirm');
  if (pass && conf && pass.value && conf.value && pass.value !== conf.value) {
    const errEl = conf.closest('.form-group')?.querySelector('.error-text');
    showError(conf, errEl, 'Passwords do not match'); valid = false;
  }
  return valid;
}

function getSelectedRole() {
  const radio = document.querySelector('.role-option.selected input[type="radio"]') || document.querySelector('input[name="role"]:checked');
  return radio ? radio.value : 'client';
}

// ── Login Form (navigates to dashboard) ───────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {
  const rememberBox = loginForm.querySelector('#remember-me');
  const rememberErr = document.getElementById('remember-error');

  // Reset email and checkbox to blank/unchecked on every page load
  const emailInput = loginForm.querySelector('#login-email');
  if (emailInput) emailInput.value = '';
  if (rememberBox) rememberBox.checked = false;

  if (rememberBox) {
    rememberBox.addEventListener('change', () => {
      if (rememberBox.checked && rememberErr) rememberErr.textContent = '';
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAuthForm(loginForm)) return;
    if (rememberBox && !rememberBox.checked) {
      if (rememberErr) rememberErr.textContent = 'Please check "Remember me" to continue.';
      rememberBox.focus();
      return;
    }
    if (rememberErr) rememberErr.textContent = '';
    const role = getSelectedRole();
    const userEmail = loginForm.querySelector('#login-email').value.trim();
    localStorage.setItem('stackly-user-email', userEmail);
    const btn = loginForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Signing in…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = orig;
      const dest = role === 'admin' ? './admin-dashboard.html' : './client-dashboard.html';
      window.location.href = dest;
    }, 900);
  });
}

// ── Signup Form (does NOT navigate to dashboard) ──────────
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAuthForm(signupForm)) return;
    const termsCheck = signupForm.querySelector('#terms-agree');
    const termsErr = document.getElementById('terms-error');
    if (termsCheck && !termsCheck.checked) {
      if (termsErr) termsErr.textContent = 'You must agree to the Terms & Privacy Policy to continue';
      return;
    }
    if (termsErr) termsErr.textContent = '';
    const btn = signupForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Creating account…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = orig;
      showToast('Account created successfully! Please sign in to continue.', 'success');
      signupForm.reset();
      signupForm.querySelectorAll('.role-option').forEach((o, i) => o.classList.toggle('selected', i === 0));
      setTimeout(() => { window.location.href = './login.html'; }, 2500);
    }, 1000);
  });
}

// ── Newsletter / Generic Form Validation ──────────────────
document.querySelectorAll('[data-validate]').forEach(form => {
  if (form.id === 'login-form' || form.id === 'signup-form' || form.id === 'contact-form') return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[data-required]').forEach(field => {
      const errEl = field.closest('.form-field, .form-group')?.querySelector('.error-text') || form.querySelector('[data-form-message]');
      clearError(field, errEl);
      const val = field.value.trim();
      if (!val) { showError(field, errEl, 'This field is required'); valid = false; return; }
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(field, errEl, 'Enter a valid email (e.g. you@company.com)'); valid = false; return; }
    });
    if (valid) {
      const msg = form.querySelector('[data-form-message]');
      if (msg) { msg.textContent = 'Thank you! We\'ll be in touch.'; msg.style.color = 'var(--success)'; }
      form.reset();
      setTimeout(() => { if (msg) { msg.textContent = ''; msg.style.color = ''; } }, 4000);
    }
  });
});

// ── Inline field validation (realtime) ───────────────────
document.addEventListener('blur', (e) => {
  const field = e.target;
  if (!field.matches('input[data-required], textarea[data-required]')) return;
  const errEl = field.closest('.form-group')?.querySelector('.error-text');
  const val = field.value.trim();
  if (!val) { showError(field, errEl, 'Required'); }
  else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(field, errEl, 'Enter a valid email'); }
  else if ((field.name === 'firstname' || field.name === 'lastname') && !/^[a-zA-Z\s'\-]{2,}$/.test(val)) { showError(field, errEl, 'Letters only'); }
  else if (field.type === 'tel' && val && !/^[\+\d\s\-\(\)]{7,20}$/.test(val)) { showError(field, errEl, 'Invalid phone format'); }
  else { clearError(field, errEl); }
}, true);

// ── Dashboard Sidebar Toggle ──────────────────────────────
(function dashboardMenu() {
  const burger = document.querySelector('.topbar-burger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const closeBtn = document.querySelector('.sidebar-close');
  if (!burger || !sidebar) return;
  function openSB() { sidebar.classList.add('open'); overlay?.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function closeSB() { sidebar.classList.remove('open'); overlay?.classList.remove('show'); document.body.style.overflow = ''; }
  burger.addEventListener('click', openSB);
  closeBtn?.addEventListener('click', closeSB);
  overlay?.addEventListener('click', closeSB);
})();

// ── Dashboard Nav Active State ────────────────────────────
(function dashNav() {
  const cur = window.location.hash || '#overview';
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    if (a.getAttribute('href') === cur) a.classList.add('active');
    else a.classList.remove('active');
    a.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      if (window.innerWidth < 960) {
        document.querySelector('.sidebar')?.classList.remove('open');
        document.querySelector('.sidebar-overlay')?.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  });
})();

// ── Mini Calendar ─────────────────────────────────────────
(function miniCal() {
  const grid = document.querySelector('.cal-grid');
  if (!grid) return;
  let now = new Date();
  function render(d) {
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    const label = document.querySelector('.cal-month-label');
    if (label) label.textContent = `${month} ${year}`;
    const days = grid.querySelectorAll('.day');
    const first = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    const total = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const today = new Date();
    const eventDays = [3, 7, 12, 18, 22, 28];
    days.forEach((el, i) => {
      const dayNum = i - first + 1;
      if (dayNum < 1 || dayNum > total) { el.textContent = ''; el.className = 'day other-month'; }
      else {
        el.textContent = dayNum; el.className = 'day';
        if (dayNum === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) el.classList.add('today');
        if (eventDays.includes(dayNum)) el.classList.add('has-event');
      }
    });
  }
  render(now);
  document.querySelector('.cal-prev')?.addEventListener('click', () => { now = new Date(now.getFullYear(), now.getMonth() - 1, 1); render(now); });
  document.querySelector('.cal-next')?.addEventListener('click', () => { now = new Date(now.getFullYear(), now.getMonth() + 1, 1); render(now); });
})();

// ── Toast ─────────────────────────────────────────────────
window.showToast = function(msg, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) { container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container); }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ'}</span><span class="toast-msg">${msg}</span><span class="toast-close">✕</span>`;
  container.appendChild(t);
  t.querySelector('.toast-close').addEventListener('click', () => t.remove());
  setTimeout(() => { if (t.parentNode) t.remove(); }, 5000);
};

// ── Modal Handlers ────────────────────────────────────────
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-modal]');
  const close = e.target.closest('[data-modal-close]');
  const backdrop = e.target.closest('.modal-backdrop');
  if (trigger) { const id = trigger.dataset.modal; document.getElementById(id)?.classList.add('open'); }
  if (close || (backdrop && e.target === backdrop)) { document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open')); }
});

// ── Back to top ───────────────────────────────────────────
document.querySelector('.back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Lazy load images ──────────────────────────────────────
if ('IntersectionObserver' in window) {
  const imgObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { const img = e.target; if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); } imgObs.unobserve(img); } });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObs.observe(img));
}

// ── Dashboard quick actions ───────────────────────────────
document.querySelectorAll('.quick-action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const msgs = {
      'new-case': 'Opening new case form…',
      'schedule': 'Opening calendar scheduler…',
      'invoice': 'Creating invoice…',
      'report': 'Generating report…',
      'message': 'Opening messages…',
      'upload': 'Opening file upload…',
      'consultation': 'Scheduling consultation…',
      'support': 'Opening support ticket…',
    };
    showToast(msgs[action] || 'Processing…', 'info');
  });
});

// ── Show login email on dashboards ───────────────────────
(function injectUserEmail() {
  const email = localStorage.getItem('stackly-user-email');
  if (!email) return;
  const roleEl = document.querySelector('.sidebar-user-info .role');
  if (roleEl && !roleEl.nextElementSibling?.classList.contains('user-email')) {
    const el = document.createElement('div');
    el.className = 'user-email';
    el.textContent = email;
    el.style.cssText = 'font-size:.78rem;color:var(--text-secondary);margin-top:.2rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px;';
    roleEl.after(el);
  }
  const avatar = document.querySelector('.topbar-avatar');
  if (avatar) avatar.setAttribute('title', email);
})();

// ── Logout ────────────────────────────────────────────────
document.querySelectorAll('[data-logout]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Sign out of your account?')) {
      localStorage.removeItem('stackly-user-email');
      window.location.href = '../pages/login.html';
    }
  });
});
