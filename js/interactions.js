/* ============================================================
   HeraChat — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Header scroll + progress bar ---------- */
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }
  document.querySelectorAll('.mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
  });

  /* ---------- Dynamic headline rotator ---------- */
  var rotator = document.getElementById('rotator');
  if (rotator) {
    var words = ['organizado', 'integrado', 'automatizado', 'escalável', 'inteligente'];
    var idx = 0;
    function pinWord() {
      var w = rotator.querySelector('.word');
      if (w) setTimeout(function () { w.style.animation = 'none'; w.style.opacity = '1'; w.style.filter = 'none'; w.style.transform = 'none'; }, 700);
    }
    pinWord(); // pin the initial word
    setInterval(function () {
      if (document.body.classList.contains('reduce-motion')) {
        idx = (idx + 1) % words.length;
        rotator.innerHTML = '<span class="word in">' + words[idx] + '</span>';
        pinWord();
        return;
      }
      var cur = rotator.querySelector('.word');
      if (cur) { cur.classList.remove('in'); cur.classList.add('out'); }
      setTimeout(function () {
        idx = (idx + 1) % words.length;
        rotator.innerHTML = '<span class="word in">' + words[idx] + '</span>';
        pinWord();
      }, 460);
    }, 2600);
  }

  /* ---------- Unified in-view detection (rect-based; reliable in all frames) ---------- */
  function inView(el, ratio) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.height === 0 && r.width === 0) return false;
    var margin = vh * (ratio == null ? 0.1 : ratio);
    return r.top < vh - margin && r.bottom > 0;
  }
  var revealEls = [];
  function registerReveal(el) { revealEls.push(el); }
  document.querySelectorAll('.reveal').forEach(registerReveal);

  function pinReveal(el) {
    el.classList.add('in');
    // Safety net: in throttled contexts CSS transitions can freeze at opacity 0.
    // After the (potential) animation window, force the final visible state.
    setTimeout(function () {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 1500);
  }
  function checkReveals() {
    for (var i = revealEls.length - 1; i >= 0; i--) {
      var el = revealEls[i];
      if (inView(el, 0.06)) { pinReveal(el); revealEls.splice(i, 1); }
    }
  }

  /* ---------- Animated counters (setInterval — survives rAF throttling) ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var isInt = target % 1 === 0;
    function setVal(v) { el.textContent = prefix + (isInt ? Math.round(v) : v.toFixed(1)) + suffix; }
    if (document.body.classList.contains('reduce-motion')) { setVal(target); return; }
    var dur = 1400, start = Date.now();
    var timer = setInterval(function () {
      var p = Math.min((Date.now() - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p >= 1) { clearInterval(timer); setVal(target); }
    }, 40);
  }
  var counterEls = [].slice.call(document.querySelectorAll('[data-count]'));
  function checkCounters() {
    for (var i = counterEls.length - 1; i >= 0; i--) {
      if (inView(counterEls[i], 0.0)) { animateCount(counterEls[i]); counterEls.splice(i, 1); }
    }
  }

  /* ---------- Chart line draw ---------- */
  var chartLine = document.getElementById('chartLine');
  var chartArea = document.getElementById('chartArea');
  var chartDone = false;
  function checkChart() {
    if (chartDone || !chartLine) return;
    if (!inView(chartLine, 0.0)) return;
    chartDone = true;
    if (document.body.classList.contains('reduce-motion')) {
      chartLine.style.strokeDashoffset = 0;
    } else {
      chartLine.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)';
      setTimeout(function () { chartLine.style.strokeDashoffset = 0; }, 30);
      // safety pin
      setTimeout(function () { chartLine.style.transition = 'none'; chartLine.style.strokeDashoffset = 0; }, 1900);
    }
    if (chartArea) setTimeout(function () { chartArea.style.opacity = 1; }, 500);
  }
  if (chartLine) {
    var len = chartLine.getTotalLength();
    chartLine.style.strokeDasharray = len;
    chartLine.style.strokeDashoffset = len;
  }

  /* ---------- Flow reveal ---------- */
  var flow = document.getElementById('flow');
  var flowDone = false;
  function checkFlow() {
    if (flowDone || !flow) return;
    if (inView(flow, 0.1)) {
      flow.classList.add('in');
      flowDone = true;
      // safety pin for throttled contexts
      setTimeout(function () {
        flow.querySelectorAll('.flow-node').forEach(function (n) {
          n.style.transition = 'none'; n.style.opacity = '1'; n.style.transform = 'none';
        });
      }, 1700);
    }
  }

  /* ---------- FAQ accordion ---------- */
  var faqData = [
    { q: 'O que é o HeraChat?', a: 'O HeraChat é uma plataforma de atendimento, automação e vendas para empresas que usam o WhatsApp como principal canal de comunicação.' },
    { q: 'Preciso trocar meu número?', a: 'Não necessariamente. A ideia é organizar sua operação usando o número empresarial da sua empresa, conforme a configuração indicada.' },
    { q: 'Quantos atendentes posso usar?', a: 'O plano pode permitir até 20 atendentes conectados na mesma operação.' },
    { q: 'Posso separar por setores?', a: 'Sim. O HeraChat permite organizar atendimentos por setores, filas e equipes.' },
    { q: 'Tem integração com Instagram e Facebook?', a: 'Sim. O sistema pode centralizar conexões com Instagram e Facebook, dependendo da configuração contratada.' },
    { q: 'Tem bot com IA?', a: 'Sim. O HeraChat pode trabalhar com automações e bot de IA para acelerar o atendimento.' },
    { q: 'Posso enviar campanhas?', a: 'Sim. A plataforma permite recursos de envio, campanhas e agendamento de mensagens, conforme a configuração do sistema.' },
    { q: 'É seguro?', a: 'O HeraChat foi pensado para comunicar segurança, controle e profissionalização da operação, mantendo seus dados protegidos.' }
  ];
  var faqWrap = document.getElementById('faq');
  if (faqWrap) {
    faqData.forEach(function (item, i) {
      var el = document.createElement('div');
      el.className = 'faq-item reveal';
      if (i < 5) el.setAttribute('data-delay', String(Math.min(i, 5)));
      el.innerHTML =
        '<button class="faq-q" aria-expanded="false">' + item.q +
        '<span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span></button>' +
        '<div class="faq-a"><div class="faq-a-inner">' + item.a + '</div></div>';
      faqWrap.appendChild(el);
      registerReveal(el);
      var btn = el.querySelector('.faq-q');
      var ans = el.querySelector('.faq-a');
      btn.addEventListener('click', function () {
        var isOpen = el.classList.contains('open');
        faqWrap.querySelectorAll('.faq-item.open').forEach(function (other) {
          if (other !== el) { other.classList.remove('open'); other.querySelector('.faq-a').style.maxHeight = null; other.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); }
        });
        if (isOpen) { el.classList.remove('open'); ans.style.maxHeight = null; btn.setAttribute('aria-expanded', 'false'); }
        else { el.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  /* ---------- Modal ---------- */
  var modal = document.getElementById('modal');
  var modalForm = document.getElementById('demoForm');
  var modalSuccess = document.getElementById('modalSuccess');
  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.classList.remove('menu-open');
    // safety: ensure visible even if open transition is throttled
    setTimeout(function () {
      if (modal.classList.contains('open')) {
        modal.style.opacity = '1';
        var box = modal.querySelector('.modal');
        if (box) box.style.transform = 'none';
      }
    }, 420);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.style.opacity = '';
    var box = modal.querySelector('.modal');
    if (box) box.style.transform = '';
    document.body.style.overflow = '';
    setTimeout(function () {
      if (modalForm) modalForm.style.display = '';
      if (modalSuccess) modalSuccess.classList.remove('show');
    }, 350);
  }
  document.querySelectorAll('[data-open-modal]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });
  var mc = document.getElementById('modalClose');
  if (mc) mc.addEventListener('click', closeModal);
  var sc = document.getElementById('successClose');
  if (sc) sc.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  /* ---------- Form validation ---------- */
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      function setError(id, cond) {
        var field = document.getElementById(id).closest('.field');
        if (cond) { field.classList.add('error'); valid = false; }
        else { field.classList.remove('error'); }
      }
      var email = document.getElementById('f-email').value.trim();
      var whats = document.getElementById('f-whats').value.replace(/\D/g, '');
      setError('f-nome', document.getElementById('f-nome').value.trim().length < 2);
      setError('f-empresa', document.getElementById('f-empresa').value.trim().length < 2);
      setError('f-whats', whats.length < 10);
      setError('f-email', !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email));
      setError('f-seg', document.getElementById('f-seg').value === '');
      setError('f-aten', document.getElementById('f-aten').value === '');
      if (!valid) {
        var firstErr = modalForm.querySelector('.field.error input, .field.error select');
        if (firstErr) firstErr.focus();
        return;
      }
      var formData = {
        nome: document.getElementById('f-nome').value.trim(),
        empresa: document.getElementById('f-empresa').value.trim(),
        whatsapp: document.getElementById('f-whats').value.trim(),
        email: email,
        segmento: document.getElementById('f-seg').value,
        atendentes: document.getElementById('f-aten').value,
        dificuldade: (document.getElementById('f-dif').value || '').trim(),
        origem: window.location.href,
      };
      var btn = modalForm.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
      var submit = window._heraSubmit || function () { return Promise.resolve(); };
      submit(formData).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Quero organizar meu WhatsApp'; }
        modalForm.style.display = 'none';
        if (modalSuccess) modalSuccess.classList.add('show');
      });
    });
    // clear error on input
    modalForm.querySelectorAll('input, select').forEach(function (inp) {
      inp.addEventListener('input', function () { var f = inp.closest('.field'); if (f) f.classList.remove('error'); });
      inp.addEventListener('change', function () { var f = inp.closest('.field'); if (f) f.classList.remove('error'); });
    });
    // WhatsApp mask
    var whatsInput = document.getElementById('f-whats');
    if (whatsInput) {
      whatsInput.addEventListener('input', function () {
        var v = whatsInput.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 6) whatsInput.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
        else if (v.length > 2) whatsInput.value = '(' + v.slice(0, 2) + ') ' + v.slice(2);
        else if (v.length > 0) whatsInput.value = '(' + v;
      });
    }
  }

  /* ---------- Mouse-follow glow on final CTA ---------- */
  var ctaGlow = document.getElementById('ctaGlow');
  var finalCta = document.querySelector('.final-cta');
  if (ctaGlow && finalCta) {
    finalCta.addEventListener('mousemove', function (e) {
      if (document.body.classList.contains('reduce-motion')) return;
      var r = finalCta.getBoundingClientRect();
      ctaGlow.style.left = (e.clientX - r.left - 300) + 'px';
      ctaGlow.style.top = (e.clientY - r.top - 300) + 'px';
    });
  }
  /* ---------- Master scroll loop ---------- */
  function runChecks() { checkReveals(); checkCounters(); checkChart(); checkFlow(); }
  window.addEventListener('scroll', runChecks, { passive: true });
  window.addEventListener('resize', runChecks);
  window.addEventListener('load', function () { runChecks(); setTimeout(runChecks, 200); });
  runChecks();
  [60, 200, 500, 1000].forEach(function (d) { setTimeout(runChecks, d); });
})();
