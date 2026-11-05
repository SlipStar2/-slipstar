/* Сайты для каждого — landing interactions */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Header shadow on scroll */
const header = document.getElementById('site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Mobile nav */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* Reveal on scroll */
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
}

/* Animated stat counters */
const stats = document.querySelectorAll('[data-count]');
const runCounter = (el) => {
  const target = Number(el.dataset.count);
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 1200;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if ('IntersectionObserver' in window) {
  const so = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        so.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach((el) => so.observe(el));
} else {
  stats.forEach(runCounter);
}

/* Lead form: validation + demo feedback */
const form = document.getElementById('lead-form');
const formOk = document.getElementById('form-ok');
const fields = {
  name: document.getElementById('f-name'),
  phone: document.getElementById('f-phone'),
};
const setValidity = (input, valid) => {
  input.closest('.field').classList.toggle('invalid', !valid);
  input.setAttribute('aria-invalid', String(!valid));
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const okName = fields.name.value.trim().length >= 2;
  const okPhone = fields.phone.value.replace(/\D/g, '').length >= 10;
  setValidity(fields.name, okName);
  setValidity(fields.phone, okPhone);
  if (!okName || !okPhone) {
    (okName ? fields.phone : fields.name).focus();
    return;
  }
  form.style.display = 'none';
  formOk.classList.add('show');
});
[fields.name, fields.phone].forEach((input) => {
  input.addEventListener('input', () => setValidity(input, true));
});

/* Dialogs (policy / terms) */
const openDialog = (id) => {
  const dlg = document.getElementById(id);
  if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
};
document.querySelectorAll('[data-open-policy]').forEach((b) =>
  b.addEventListener('click', () => openDialog('policy-dialog')));
document.querySelectorAll('[data-open-terms]').forEach((b) =>
  b.addEventListener('click', () => openDialog('terms-dialog')));
document.querySelectorAll('[data-close-dialog]').forEach((b) =>
  b.addEventListener('click', () => b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach((dlg) => {
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close(); /* backdrop click */
  });
});
