(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── Config central ───────────────────────────────────────── */
  const PHONE = '5566992067818';

  const waLink = (msg) =>
    'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);

  /* Mensagens por contexto — formatadas para WhatsApp */
  const MSG = {
    geral: [
      'Olá, Dr. Jean Victor! 👋',
      '',
      'Gostaria de agendar uma consulta de fisioterapia.',
      '',
      '▸ Nome: ',
      '▸ Objetivo: ',
      '▸ Queixa / dor: ',
      '',
      'Aguardo retorno!',
    ].join('\n'),

    atletismo: [
      'Olá, Dr. Jean Victor! 🏃',
      '',
      'Tenho interesse no atendimento de *Atletismo & Performance*.',
      '',
      '▸ Nome: ',
      '▸ Modalidade / esporte: ',
      '▸ Lesão ou limitação atual: ',
      '▸ Objetivo: voltar a treinar / melhorar performance',
      '',
      'Aguardo retorno!',
    ].join('\n'),

    idosos: [
      'Olá, Dr. Jean Victor! 🙏',
      '',
      'Tenho interesse no atendimento de *Mobilidade & Idosos*.',
      '',
      '▸ Nome: ',
      '▸ Idade: ',
      '▸ Principal dificuldade (equilíbrio, dor, marcha...): ',
      '▸ Já faz outro acompanhamento de saúde? ',
      '',
      'Aguardo retorno!',
    ].join('\n'),

    criancas: [
      'Olá, Dr. Jean Victor! 👶',
      '',
      'Tenho interesse no atendimento para *Crianças com Deficiência*.',
      '',
      '▸ Nome da criança: ',
      '▸ Idade: ',
      '▸ Diagnóstico (se houver): ',
      '▸ Principal objetivo do tratamento: ',
      '',
      'Aguardo retorno!',
    ].join('\n'),

    endereco: [
      'Olá, Dr. Jean Victor! 📍',
      '',
      'Poderia me enviar o endereço completo do consultório',
      'e orientações de como chegar?',
      '',
      'Obrigado(a)!',
    ].join('\n'),
  };

  /* ─────────────────────────────────────────────────────────── */
  /* 1. ANO NO FOOTER                                            */
  /* ─────────────────────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────────────────────── */
  /* 2. PWA                                                      */
  /* ─────────────────────────────────────────────────────────── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 3. LINKS WHATSAPP — atribui href REAL antes de tudo         */
  /* ─────────────────────────────────────────────────────────── */
  var waMap = {
    whatsappTop:       MSG.geral,
    whatsappHero:      MSG.geral,
    whatsappFloat:     MSG.geral,
    whatsappFooter:    MSG.geral,
    whatsappSobre:     MSG.geral,
    whatsappAtletismo: MSG.atletismo,
    whatsappIdosos:    MSG.idosos,
    whatsappCriancas:  MSG.criancas,
    routeWhats:        MSG.endereco,
  };

  Object.keys(waMap).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.href = waLink(waMap[id]);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  /* ─────────────────────────────────────────────────────────── */
  /* 4. SMOOTH SCROLL (só âncoras internas, ignora wa links)     */
  /* ─────────────────────────────────────────────────────────── */
  $$('a[href^="#"]').forEach(function (a) {
    // pula links que já têm href real de WA (foram sobrescritos acima)
    if (a.href.indexOf('wa.me') !== -1) return;

    a.addEventListener('click', function (e) {
      var hash = a.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────────────────── */
  /* 5. HEADER — sombra no scroll                                */
  /* ─────────────────────────────────────────────────────────── */
  var header = $('header.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 6. MENU MOBILE                                              */
  /* ─────────────────────────────────────────────────────────── */
  var navToggle = $('.nav__toggle');
  var navEl     = $('.site-nav');

  if (navToggle && navEl) {
    navToggle.addEventListener('click', function () {
      var isOpen = navEl.classList.toggle('nav--open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    $$('.nav__list a').forEach(function (link) {
      link.addEventListener('click', function () {
        navEl.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });

    document.addEventListener('click', function (e) {
      if (navEl.classList.contains('nav--open') && !navEl.contains(e.target) && e.target !== navToggle) {
        navEl.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navEl.classList.contains('nav--open')) {
        navEl.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 7. REVEAL ON SCROLL                                         */
  /* ─────────────────────────────────────────────────────────── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = $$('[data-reveal]');

  if (!prefersReduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 8. FAQ ACCORDION                                            */
  /* ─────────────────────────────────────────────────────────── */
  $$('[data-faq]').forEach(function (btn) {
    var item   = btn.closest('.faq__item');
    var answer = item && item.querySelector('.faq__a');
    if (!answer) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // fecha todos
      $$('[data-faq]').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        var p = b.closest('.faq__item');
        var a = p && p.querySelector('.faq__a');
        if (a) a.hidden = true;
      });

      // abre se estava fechado
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  /* ─────────────────────────────────────────────────────────── */
  /* 9. CAROUSEL DE DEPOIMENTOS                                  */
  /* ─────────────────────────────────────────────────────────── */
  var carousel = $('.carousel');
  if (carousel) {
    var track    = $('[data-carousel-track]', carousel);
    var viewport = $('.carousel__viewport', carousel);
    var btnPrev  = $('[data-carousel-prev]', carousel);
    var btnNext  = $('[data-carousel-next]', carousel);

    if (track && viewport && btnPrev && btnNext) {
      track.style.transition = 'transform 280ms ease';
      var offset = 0;
      var busy   = false;

      function getCardW() {
        var c = $('.quote-card', track);
        return c ? c.getBoundingClientRect().width + 18 : 0;
      }

      function slide(dir) {
        if (busy) return;
        busy = true;
        var w = getCardW();
        if (!w) { busy = false; return; }

        if (dir === 'next') {
          offset -= w;
          track.style.transform = 'translateX(' + offset + 'px)';
          setTimeout(function () {
            track.appendChild(track.firstElementChild);
            offset += w;
            track.style.transition = 'none';
            track.style.transform  = 'translateX(' + offset + 'px)';
            void track.offsetWidth;
            track.style.transition = 'transform 280ms ease';
            busy = false;
          }, 280);
        } else {
          offset += w;
          track.style.transform = 'translateX(' + offset + 'px)';
          setTimeout(function () {
            track.insertBefore(track.lastElementChild, track.firstElementChild);
            offset -= w;
            track.style.transition = 'none';
            track.style.transform  = 'translateX(' + offset + 'px)';
            void track.offsetWidth;
            track.style.transition = 'transform 280ms ease';
            busy = false;
          }, 280);
        }
      }

      btnPrev.addEventListener('click', function () { slide('prev'); });
      btnNext.addEventListener('click', function () { slide('next'); });

      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  slide('prev');
        if (e.key === 'ArrowRight') slide('next');
      });

      // swipe touch
      var touchStartX = 0;
      viewport.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      viewport.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) slide(dx < 0 ? 'next' : 'prev');
      });

      // auto-play a cada 6s, pausa ao hover
      var autoplay = setInterval(function () { slide('next'); }, 6000);
      carousel.addEventListener('mouseenter', function () { clearInterval(autoplay); });
      carousel.addEventListener('mouseleave', function () {
        autoplay = setInterval(function () { slide('next'); }, 6000);
      });
    }
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 10. SLIDER ANTES / DEPOIS                                   */
  /* ─────────────────────────────────────────────────────────── */
  var compareFrame = $('.compare__frame');
  if (compareFrame) {
    var imgBefore = $('.compare__img--before', compareFrame);
    var imgAfter  = $('.compare__img--after',  compareFrame);
    var knob      = $('.compare__knob',         compareFrame);
    var line      = $('.compare__line',         compareFrame);

    if (imgBefore && imgAfter && knob && line) {
      function setPos(pct) {
        var p = Math.max(0, Math.min(100, pct));
        imgAfter.style.clipPath  = 'inset(0 ' + (100 - p) + '% 0 0)';
        imgBefore.style.clipPath = 'inset(0 0 0 ' + p + '%)';
        knob.style.left = 'calc(' + p + '% - 18px)';
        line.style.left = 'calc(' + p + '% - 1px)';
      }

      setPos(50);

      function getPct(clientX) {
        var r = compareFrame.getBoundingClientRect();
        return ((clientX - r.left) / r.width) * 100;
      }

      var dragging = false;
      compareFrame.addEventListener('pointerdown', function (e) {
        dragging = true;
        compareFrame.setPointerCapture(e.pointerId);
        setPos(getPct(e.clientX));
      });
      compareFrame.addEventListener('pointermove', function (e) {
        if (dragging) setPos(getPct(e.clientX));
      });
      compareFrame.addEventListener('pointerup',     function () { dragging = false; });
      compareFrame.addEventListener('pointercancel', function () { dragging = false; });
    }
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 11. CALCULADORA                                             */
  /* ─────────────────────────────────────────────────────────── */
  var calcGoal      = document.getElementById('calcGoal');
  var calcIntensity = document.getElementById('calcIntensity');
  var calcLabelEl   = document.getElementById('calcIntensityLabel');
  var calcPrevEl    = document.getElementById('calcPrev');
  var calcTimeEl    = document.getElementById('calcTime');
  var calcPriceEl   = document.getElementById('calcPrice');
  var calcWhatsBtn  = document.getElementById('calcWhats');
  var segBtns       = $$('.segmented__btn');

  if (calcGoal && calcIntensity && calcPrevEl && calcTimeEl && calcPriceEl) {
    var BASE_TIME  = { atletismo: 40, dor: 45, mobilidade: 35, crianca: 50 };
    var BASE_PRICE = { atletismo: 140, dor: 160, mobilidade: 130, crianca: 170 };

    function computeCalc() {
      var goal      = calcGoal.value;
      var intensity = Number(calcIntensity.value) || 3;
      var firstTime = calcPrevEl.value === 'nao';

      var time  = (BASE_TIME[goal]  || 40)  + intensity * 3  + (firstTime ? 8  : 0);
      var price = (BASE_PRICE[goal] || 150) + intensity * 6  + (firstTime ? 25 : 0);

      calcTimeEl.textContent  = String(Math.round(time));
      calcPriceEl.textContent = String(Math.round(price));

      if (calcWhatsBtn) {
        var goalLabel = calcGoal.options[calcGoal.selectedIndex]
          ? calcGoal.options[calcGoal.selectedIndex].text
          : goal;

        var calcMsg = [
          'Olá, Dr. Jean Victor! 🗓️',
          '',
          'Vi a calculadora no site e quero agendar.',
          '',
          '▸ Objetivo: ' + goalLabel,
          '▸ Intensidade do caso: ' + intensity + '/5',
          '▸ Primeira vez em fisioterapia: ' + (firstTime ? 'Sim' : 'Não'),
          '▸ Estimativa: ~' + Math.round(time) + ' min · R$ ' + Math.round(price),
          '',
          'Aguardo confirmação de horário!',
        ].join('\n');

        calcWhatsBtn.href   = waLink(calcMsg);
        calcWhatsBtn.target = '_blank';
        calcWhatsBtn.rel    = 'noopener noreferrer';
      }
    }

    function setPrev(val) {
      calcPrevEl.value = val;
      segBtns.forEach(function (b) {
        var active = b.getAttribute('data-seg') === val;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      computeCalc();
    }

    calcGoal.addEventListener('change', computeCalc);
    calcIntensity.addEventListener('input', function () {
      if (calcLabelEl) calcLabelEl.textContent = calcIntensity.value;
      computeCalc();
    });
    segBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        setPrev(b.getAttribute('data-seg'));
      });
    });

    if (calcLabelEl) calcLabelEl.textContent = calcIntensity.value;
    setPrev(calcPrevEl.value || 'sim');
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 12. CHATBOT DE TRIAGEM                                      */
  /* ─────────────────────────────────────────────────────────── */
  var botLog     = document.getElementById('botLog');
  var botNameEl  = document.getElementById('botName');
  var botWhatsEl = document.getElementById('botWhats');

  if (botLog && botNameEl && botWhatsEl) {
    var chips   = $$('[data-bot]');
    var botSend = $('[data-bot-send]');
    var picked  = null;

    var BOT_REPLIES = {
      atletismo:  'Ótimo! Para atletas avaliamos biomecânica e fazemos um plano de retorno seguro ao treino. Qual é o seu esporte?',
      dor:        'Entendido. Para dor e reabilitação a avaliação define o ponto de partida. Vamos agendar sua primeira sessão?',
      mobilidade: 'Perfeito. Para mobilidade trabalhamos força, equilíbrio e rotina segura. Podemos marcar sua avaliação?',
      crianca:    'Com prazer. Para crianças construímos o plano junto à família. Qual o diagnóstico ou necessidade principal?',
    };

    function addMsg(text, type) {
      var div = document.createElement('div');
      div.className = type === 'bot' ? 'msg msg--bot' : 'msg';
      div.textContent = text;
      botLog.appendChild(div);
      botLog.scrollTop = botLog.scrollHeight;
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        picked = chip.getAttribute('data-bot');
        addMsg(chip.textContent.trim(), 'user');
        setTimeout(function () {
          addMsg(BOT_REPLIES[picked] || 'Podemos agendar sua avaliação?', 'bot');
        }, 350);
      });
    });

    function sendTriagem() {
      var nome      = (botNameEl.value || '').trim();
      var goalLabel = picked || 'geral';

      var msg = [
        'Olá, Dr. Jean Victor! 👋',
        '',
        'Vim pelo chatbot do site.',
        '',
        nome ? ('▸ Nome: ' + nome) : null,
        '▸ Área de interesse: ' + goalLabel,
        '▸ Solicito agendamento para avaliação inicial.',
        '',
        'Aguardo retorno!',
      ].filter(function (l) { return l !== null; }).join('\n');

      botWhatsEl.href   = waLink(msg);
      botWhatsEl.target = '_blank';
      botWhatsEl.rel    = 'noopener noreferrer';
      botWhatsEl.click();
    }

    if (botSend) {
      botSend.addEventListener('click', sendTriagem);
    }
    botNameEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendTriagem();
    });
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 13. FORMULÁRIO DE CONTATO                                   */
  /* ─────────────────────────────────────────────────────────── */
  var form = document.getElementById('contactForm');
  if (form) {
    var F = {
      nome:     document.getElementById('nome'),
      idade:    document.getElementById('idade'),
      email:    document.getElementById('email'),
      objetivo: document.getElementById('objetivo'),
      mensagem: document.getElementById('mensagem'),
    };
    var E = {
      nome:     $('[data-err-for="nome"]'),
      email:    $('[data-err-for="email"]'),
      objetivo: $('[data-err-for="objetivo"]'),
      mensagem: $('[data-err-for="mensagem"]'),
    };
    var submitBtn = document.getElementById('formSubmit');
    var sampleBtn = $('[data-fill-sample]');
    var msgCount  = document.getElementById('msgCount');

    function setErr(key, txt) {
      if (E[key]) E[key].textContent = txt || '';
    }

    function emailOk(v) {
      return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }

    function validate() {
      var ok = true;

      var nome = (F.nome ? F.nome.value : '').trim();
      if (!nome) { setErr('nome', 'Informe seu nome.'); ok = false; }
      else        { setErr('nome', ''); }

      var email = (F.email ? F.email.value : '').trim();
      if (!emailOk(email)) { setErr('email', 'E-mail inválido.'); ok = false; }
      else                  { setErr('email', ''); }

      var obj = F.objetivo ? F.objetivo.value : '';
      if (!obj) { setErr('objetivo', 'Selecione um objetivo.'); ok = false; }
      else       { setErr('objetivo', ''); }

      var msg = (F.mensagem ? F.mensagem.value : '').trim();
      if (!msg || msg.length < 10) { setErr('mensagem', 'Descreva com pelo menos 10 caracteres.'); ok = false; }
      else if (msg.length > 500)   { setErr('mensagem', 'Máximo 500 caracteres.'); ok = false; }
      else                          { setErr('mensagem', ''); }

      if (submitBtn) submitBtn.disabled = !ok;
      return ok;
    }

    if (F.mensagem && msgCount) {
      F.mensagem.addEventListener('input', function () {
        msgCount.textContent = String(F.mensagem.value.length);
        validate();
      });
    }

    ['input', 'change'].forEach(function (ev) {
      Object.keys(F).forEach(function (k) {
        if (F[k]) F[k].addEventListener(ev, validate);
      });
    });

    if (sampleBtn) {
      sampleBtn.addEventListener('click', function () {
        if (F.nome)     F.nome.value     = 'Maria Silva';
        if (F.idade)    F.idade.value    = '42';
        if (F.email)    F.email.value    = 'maria@email.com';
        if (F.objetivo) F.objetivo.value = 'dor';
        if (F.mensagem) F.mensagem.value =
          'Sinto dor no joelho ao subir escadas há 3 semanas. Já tentei repouso mas não melhorou. Quero voltar a caminhar normalmente.';
        if (msgCount && F.mensagem) msgCount.textContent = String(F.mensagem.value.length);
        validate();
      });
    }

    validate();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var nome     = F.nome.value.trim();
      var idade    = F.idade    ? F.idade.value.trim()    : '';
      var email    = F.email    ? F.email.value.trim()    : '';
      var objetivo = F.objetivo
        ? (F.objetivo.options[F.objetivo.selectedIndex]
            ? F.objetivo.options[F.objetivo.selectedIndex].text
            : F.objetivo.value)
        : '';
      var mensagem = F.mensagem ? F.mensagem.value.trim() : '';

      var lines = [
        'Olá, Dr. Jean Victor! 📋',
        '',
        'Vim pelo formulário do site e gostaria de agendar:',
        '',
        '▸ Nome: ' + nome,
        idade   ? ('▸ Idade: ' + idade + ' anos') : null,
        email   ? ('▸ E-mail: ' + email)          : null,
        '▸ Objetivo: ' + objetivo,
        '',
        '▸ Mensagem:',
        mensagem,
        '',
        'Aguardo retorno para confirmar horário. Obrigado(a)!',
      ].filter(function (l) { return l !== null; });

      window.open(waLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
    });
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 14. BOTÃO "VER NO MAPS"                                     */
  /* ─────────────────────────────────────────────────────────── */
  var mapsBtn = $('[data-open-maps]');
  if (mapsBtn) {
    mapsBtn.addEventListener('click', function () {
      window.open(
        'https://www.google.com/maps/search/Fisioterapia+Peixoto+de+Azevedo+MT',
        '_blank',
        'noopener,noreferrer'
      );
    });
  }

  /* ─────────────────────────────────────────────────────────── */
  /* 15. VIDEO MODAL                                             */
  /* ─────────────────────────────────────────────────────────── */
  var videoOpenBtn = $('[data-open-video]');
  var videoModal   = document.getElementById('videoModal');
  if (videoOpenBtn && videoModal && videoModal.showModal) {
    videoOpenBtn.addEventListener('click', function () {
      try { videoModal.showModal(); } catch (err) {}
    });
    videoModal.addEventListener('close', function () {
      var v = $('video', videoModal);
      if (v) { v.pause(); v.currentTime = 0; }
    });
  }

})();
