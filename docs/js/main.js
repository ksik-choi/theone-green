/* =========================================================================
   (주)더원그린건설 홈페이지 공통 스크립트
   지금 하는 일은 하나뿐입니다 — 모바일에서 햄버거(≡) 버튼으로 메뉴 열고 닫기.
   ========================================================================= */

(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var gnb = document.getElementById('gnb');
  if (!toggle || !gnb) return;

  function setOpen(open) {
    gnb.classList.toggle('is-open', open);
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
