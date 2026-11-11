/* =========================================================================
   (주)더원그린건설 홈페이지 공통 스크립트
   모바일에서 햄버거(≡) 버튼으로 메뉴 열고 닫기.
   ========================================================================= */

(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var gnb = document.getElementById('gnb');
  var header = document.querySelector('.site-header');
  if (!toggle || !gnb) return;

  function setOpen(open) {
    gnb.classList.toggle('is-open', open);
    if (header) header.classList.toggle('menu-open', open);   // 메인 페이지 투명 헤더를 흰색으로
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // 메뉴 항목을 누르면 자동으로 닫기
  gnb.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // ESC 키로 닫기
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // PC 폭으로 넓어지면 열린 상태를 초기화 (모바일 메뉴가 남아있지 않도록)
  window.matchMedia('(min-width: 769px)').addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();

/* =========================================================================
   시공실적 사진 확대 보기 (projects.html 에서만 동작)
   썸네일을 누르면 큰 사진을 띄우고, 좌우 화살표·키보드로 넘길 수 있습니다.
   ========================================================================= */

(function () {
  'use strict';

  var viewer = document.getElementById('viewer');
  if (!viewer) return;

  var img = viewer.querySelector('img');
  var counter = viewer.querySelector('.viewer-count');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.gallery button'));
  var index = 0;

  function show(i) {
    if (i < 0) i = buttons.length - 1;
    if (i >= buttons.length) i = 0;
    index = i;
    var btn = buttons[i];
    img.src = btn.getAttribute('data-full');
    img.alt = btn.querySelector('img').alt;
    counter.textContent = (i + 1) + ' / ' + buttons.length;
  }

  function open(i) {
    show(i);
    viewer.classList.add('is-open');
    document.body.style.overflow = 'hidden';   // 뒤 배경 스크롤 방지
    viewer.querySelector('.viewer-close').focus();
  }

  function close() {
    viewer.classList.remove('is-open');
    document.body.style.overflow = '';
    img.src = '';
    if (buttons[index]) buttons[index].focus();
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () { open(i); });
  });

  viewer.querySelector('.viewer-close').addEventListener('click', close);
  viewer.querySelector('.viewer-prev').addEventListener('click', function () { show(index - 1); });
  viewer.querySelector('.viewer-next').addEventListener('click', function () { show(index + 1); });

  // 사진 바깥(어두운 배경)을 누르면 닫기
  viewer.addEventListener('click', function (e) {
    if (e.target === viewer) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!viewer.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });
})();

/* =========================================================================
   현장사진 저장 방지 (index.html, projects.html)
   PC 우클릭 메뉴와 안드로이드 '꾹 누르기' 메뉴, 사진 끌어서 저장을 막습니다.
   ========================================================================= */

(function () {
  'use strict';

  var PHOTOS = '.gallery img, .viewer img, .proj-card img';

  document.addEventListener('contextmenu', function (e) {
    if (e.target.closest(PHOTOS)) e.preventDefault();
  });

  document.addEventListener('dragstart', function (e) {
    if (e.target.closest(PHOTOS)) e.preventDefault();
  });
})();

/* =========================================================================
   메인 페이지 헤더 — 맨 위에서는 투명(is-top), 스크롤하면 흰색 (index.html 에서만)
   ========================================================================= */

(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  if (!header || !document.body.classList.contains('home')) return;

  function update() {
    header.classList.toggle('is-top', window.scrollY <= 40);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* =========================================================================
   스크롤 등장 효과 — class="reveal" 이 붙은 요소가 화면에 들어오면 is-visible 추가
   (실제 움직임은 css/style.css 의 '스크롤 등장 효과' 부분)
   ========================================================================= */

(function () {
  'use strict';

  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // 이 표시가 붙어야만 CSS가 요소를 숨깁니다. 스크립트가 안 돌면 내용이 그냥 보입니다.
  document.documentElement.classList.add('js');

  function showAll() {
    for (var i = 0; i < items.length; i++) items[i].classList.add('is-visible');
  }

  // 아주 오래된 브라우저는 그냥 전부 보여줌
  if (!('IntersectionObserver' in window)) { showAll(); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);   // 한 번 나타나면 끝
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  for (var i = 0; i < items.length; i++) io.observe(items[i]);
})();
