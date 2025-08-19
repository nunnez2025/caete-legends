// drag.js - Pointer Events based drag/drop compatible with desktop & mobile
(() => {
  const root = document.getElementById('game-root') || document.body;
  let dragging = null;
  let startX = 0, startY = 0;
  let originLeft = 0, originTop = 0;
  let pointerId = null;

  // Utility: get absolute position
  function getAbsPos(el) {
    const r = el.getBoundingClientRect();
    return { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
  }

  root.addEventListener('pointerdown', (ev) => {
    const card = ev.target.closest('.card');
    if (!card) return;
    if (ev.cancelable) ev.preventDefault();

    dragging = card;
    pointerId = ev.pointerId;
    dragging.setPointerCapture && dragging.setPointerCapture(pointerId);
    dragging.classList.add('dragging');

    const pos = getAbsPos(dragging);
    originLeft = pos.left;
    originTop = pos.top;

    startX = ev.clientX;
    startY = ev.clientY;

    // set absolute positioning to allow free movement
    dragging.style.position = 'absolute';
    dragging.style.left = originLeft + 'px';
    dragging.style.top = originTop + 'px';
    dragging.style.margin = '0';
    dragging.style.transform = 'translate3d(0,0,0)';
  }, { passive: false });

  root.addEventListener('pointermove', (ev) => {
    if (!dragging || ev.pointerId !== pointerId) return;
    if (ev.cancelable) ev.preventDefault();

    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;

    dragging.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  }, { passive: false });

  root.addEventListener('pointerup', (ev) => {
    if (!dragging || ev.pointerId !== pointerId) return;
    if (ev.cancelable) ev.preventDefault();

    // check for drop over slot
    const slots = Array.from(document.querySelectorAll('.slot'));
    const cardRect = dragging.getBoundingClientRect();
    let droppedOn = null;
    for (const s of slots) {
      const r = s.getBoundingClientRect();
      if (!(cardRect.right < r.left || cardRect.left > r.right || cardRect.bottom < r.top || cardRect.top > r.bottom)) {
        droppedOn = s;
        break;
      }
    }

    if (droppedOn) {
      // snap to center of slot
      const sr = droppedOn.getBoundingClientRect();
      const cx = sr.left + sr.width/2;
      const cy = sr.top + sr.height/2;
      const newLeft = cx - cardRect.width/2 + window.scrollX;
      const newTop = cy - cardRect.height/2 + window.scrollY;
      dragging.style.left = newLeft + 'px';
      dragging.style.top = newTop + 'px';
      dragging.style.transform = '';
    } else {
      // return to original hand area (simple fallback: remove inline positioning so CSS layout returns)
      dragging.style.removeProperty('left');
      dragging.style.removeProperty('top');
      dragging.style.removeProperty('position');
      dragging.style.removeProperty('transform');
    }

    dragging.classList.remove('dragging');
    dragging.releasePointerCapture && dragging.releasePointerCapture(pointerId);
    dragging = null;
    pointerId = null;
  }, { passive: false });

  // prevent the browser from doing default gestures that interfere
  document.addEventListener('touchmove', (e) => {
    if (dragging) e.preventDefault();
  }, { passive:false });
})();
