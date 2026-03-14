/* ══════════════════════════════════════════════════════
   CUSTOM CURSOR — source: VolunteerHub__2_.html
   Self-contained: injects HTML + CSS + runs logic.
   Usage: <script src="cursor.js"></script>  (before </body>)
══════════════════════════════════════════════════════ */

(function () {

  /* ── 1. Inject cursor HTML elements ── */
  document.body.insertAdjacentHTML('beforeend', `
    <div id="cursor-dot"></div>
    <div id="cursor-ring"></div>
    <div id="cursor-trail"></div>
  `);

  /* ── 2. Inject CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    body,
    a, button, [onclick], select, input, textarea, label {
      cursor: none;
    }

    #cursor-dot {
      position: fixed; top: 0; left: 0; z-index: 99999; pointer-events: none;
      width: 8px; height: 8px; background: #c9a84c;
      border-radius: 50%; transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background 0.2s, opacity 0.2s;
      mix-blend-mode: multiply;
    }

    #cursor-ring {
      position: fixed; top: 0; left: 0; z-index: 99998; pointer-events: none;
      width: 36px; height: 36px; border: 1.5px solid #c9a84c;
      border-radius: 50%; transform: translate(-50%, -50%);
      transition: width 0.35s cubic-bezier(.23,1,.32,1),
                  height 0.35s cubic-bezier(.23,1,.32,1),
                  border-color 0.3s, opacity 0.3s, border-radius 0.3s;
      opacity: 0.6;
    }

    #cursor-trail {
      position: fixed; top: 0; left: 0; z-index: 99997; pointer-events: none;
      width: 6px; height: 6px; background: rgba(201,168,76,0.35);
      border-radius: 50%; transform: translate(-50%, -50%);
      transition: left 0.12s ease, top 0.12s ease, opacity 0.4s;
    }

    /* Hover */
    body.cursor-hover #cursor-dot  { width: 12px; height: 12px; background: #b5451b; }
    body.cursor-hover #cursor-ring { width: 52px;  height: 52px;  border-color: #b5451b; opacity: 0.4; }

    /* Click */
    body.cursor-click #cursor-dot  { width: 6px;  height: 6px;  background: #0f1117; }
    body.cursor-click #cursor-ring { width: 22px; height: 22px; border-color: #0f1117; opacity: 1; }

    /* Text input */
    body.cursor-text #cursor-ring { width: 3px; height: 32px; border-radius: 2px; border-color: #0f1117; opacity: 0.5; }
    body.cursor-text #cursor-dot  { opacity: 0; }
  `;
  document.head.appendChild(style);

  /* ── 3. Cursor logic ── */
  const dot   = document.getElementById('cursor-dot');
  const ring  = document.getElementById('cursor-ring');
  const trail = document.getElementById('cursor-trail');

  let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

  // Dot & ring follow mouse instantly
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left   = mouseX + 'px'; dot.style.top   = mouseY + 'px';
    ring.style.left  = mouseX + 'px'; ring.style.top  = mouseY + 'px';
  });

  // Trail lags behind with lerp
  (function animateTrail() {
    trailX += (mouseX - trailX) * 0.18;
    trailY += (mouseY - trailY) * 0.18;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  })();

  // Hover state
  const hoverTargets = 'a, button, [onclick], .skill-chip, .day-chip, .event-card, .feature-item, .quick-link, .role-btn, .btn-submit, .btn-cancel, .modal-submit, .modal-close';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover'); });

  // Text state
  const textTargets = 'input, textarea, select';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(textTargets)) {
      document.body.classList.remove('cursor-hover');
      document.body.classList.add('cursor-text');
    }
  });
  document.addEventListener('mouseout', e => { if (e.target.closest(textTargets)) document.body.classList.remove('cursor-text'); });

  // Click state
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // Hide/show on window leave/enter
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; trail.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.6'; trail.style.opacity = '1'; });

})();
