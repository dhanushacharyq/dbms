import { useState, useEffect, useRef } from "react";

// ── CSS injected as a style tag to preserve all original styles exactly ──
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f1117; --cream: #f5f0e8; --gold: #c9a84c;
    --rust: #b5451b; --sage: #4a6741; --white: #fdfcf9; --error: #c0392b;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }

  /* ── NAV ── */
  nav.main-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 4rem;
    background: rgba(245,240,232,0.93);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(201,168,76,0.25);
    transition: box-shadow 0.3s;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900;
    color: var(--ink); letter-spacing: -0.5px; cursor: pointer; background: none; border: none;
  }
  .nav-logo span { color: var(--gold); }
  .nav-links { display: flex; gap: 2.2rem; align-items: center; }
  .nav-links button {
    background: none; border: none; text-decoration: none; color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; font-weight: 500; transition: color 0.2s; cursor: pointer;
  }
  .nav-links button:hover { color: var(--gold); }
  .btn-nav {
    padding: 0.55rem 1.4rem; border: 1.5px solid var(--ink);
    background: transparent; color: var(--ink); font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500; cursor: pointer; border-radius: 2px;
    transition: all 0.25s;
  }
  .btn-nav:hover { background: var(--ink); color: var(--cream); }
  .btn-nav-admin {
    padding: 0.55rem 1.4rem; border: 1.5px solid var(--gold);
    background: transparent; color: var(--gold); font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 2px;
    transition: all 0.25s;
  }
  .btn-nav-admin:hover { background: var(--gold); color: var(--ink); }

  /* ── HERO ── */
  .hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; padding-top: 80px; overflow: hidden; }
  .hero-left { display: flex; flex-direction: column; justify-content: center; padding: 6rem 4rem 6rem 6rem; position: relative; z-index: 2; }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-size: 0.75rem; font-weight: 500; letter-spacing: 2px;
    text-transform: uppercase; color: var(--rust); margin-bottom: 1.8rem;
  }
  .hero-tag::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--rust); }
  h1.hero-h1 {
    font-family: 'Playfair Display', serif; font-size: clamp(3rem, 5vw, 4.8rem);
    font-weight: 900; line-height: 1.05; letter-spacing: -1px; margin-bottom: 1.6rem;
  }
  h1.hero-h1 em { font-style: italic; color: var(--gold); }
  .hero-desc { font-size: 1.05rem; line-height: 1.75; color: #444; max-width: 460px; margin-bottom: 3rem; font-weight: 300; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

  .btn-primary {
    padding: 0.9rem 2.2rem; background: var(--ink); color: var(--cream);
    border: none; border-radius: 2px; font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; font-weight: 500; cursor: pointer;
    display: inline-block; position: relative; overflow: hidden; transition: all 0.25s;
  }
  .btn-primary::after { content: ''; position: absolute; inset: 0; background: var(--gold); transform: translateX(-101%); transition: transform 0.3s ease; }
  .btn-primary:hover::after { transform: translateX(0); }
  .btn-primary span { position: relative; z-index: 1; }

  .btn-secondary {
    padding: 0.9rem 2.2rem; background: transparent; color: var(--ink);
    border: 1.5px solid var(--ink); border-radius: 2px; font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; font-weight: 500; cursor: pointer;
    display: inline-block; transition: all 0.25s;
  }
  .btn-secondary:hover { background: var(--sage); color: var(--cream); border-color: var(--sage); }

  .btn-outline-gold {
    padding: 0.9rem 2.2rem; background: transparent; color: var(--gold);
    border: 1.5px solid var(--gold); border-radius: 2px; font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; font-weight: 500; cursor: pointer;
    display: inline-block; transition: all 0.25s;
  }
  .btn-outline-gold:hover { background: var(--gold); color: var(--ink); }

  .hero-right { position: relative; overflow: hidden; background: var(--ink); }
  .hero-right-inner { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2rem; padding: 3rem; }
  .stat-block { text-align: center; color: var(--cream); animation: fadeUp 0.8s ease both; }
  .stat-block:nth-child(2) { animation-delay: 0.15s; }
  .stat-block:nth-child(3) { animation-delay: 0.3s; }
  .stat-block:nth-child(4) { animation-delay: 0.45s; }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900; color: var(--gold); line-height: 1; margin-bottom: 0.3rem; }
  .stat-label { font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(245,240,232,0.5); }
  .hero-divider { width: 40px; height: 1px; background: rgba(201,168,76,0.3); margin: 0 auto; }
  .corner-decor { position: absolute; top: 2rem; right: 2rem; width: 80px; height: 80px; border-top: 1.5px solid var(--gold); border-right: 1.5px solid var(--gold); opacity: 0.4; }
  .corner-decor-bl { position: absolute; bottom: 2rem; left: 2rem; width: 80px; height: 80px; border-bottom: 1.5px solid var(--gold); border-left: 1.5px solid var(--gold); opacity: 0.4; }

  /* ── FEATURES ── */
  .features { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(15,17,23,0.1); border-bottom: 1px solid rgba(15,17,23,0.1); }
  .feature-item { padding: 3.5rem 3rem; border-right: 1px solid rgba(15,17,23,0.1); transition: background 0.3s; }
  .feature-item:last-child { border-right: none; }
  .feature-item:hover { background: rgba(201,168,76,0.06); }
  .feature-icon { font-size: 2rem; margin-bottom: 1.2rem; display: block; }
  .feature-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.7rem; }
  .feature-text { font-size: 0.9rem; line-height: 1.7; color: #555; font-weight: 300; }

  /* ── EVENTS ── */
  .events-section { padding: 7rem 6rem; }
  .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3.5rem; }
  .section-tag { font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 0.8rem; display: block; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 900; line-height: 1.15; }
  .events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; background: rgba(15,17,23,0.1); }
  .event-card { background: var(--cream); padding: 2.5rem 2rem; transition: background 0.3s, transform 0.3s; cursor: pointer; display: block; }
  .event-card:hover { background: var(--ink); color: var(--cream); transform: translateY(-3px); }
  .event-card:hover .event-date { color: var(--gold); }
  .event-card:hover .event-venue, .event-card:hover .event-meta { color: rgba(245,240,232,0.6); }
  .event-date { font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: var(--rust); margin-bottom: 1rem; font-weight: 500; transition: color 0.3s; }
  .event-name { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 0.7rem; line-height: 1.25; }
  .event-venue { font-size: 0.85rem; color: #666; margin-bottom: 1.5rem; font-weight: 300; transition: color 0.3s; }
  .event-meta { display: flex; gap: 1.5rem; font-size: 0.8rem; color: #888; transition: color 0.3s; }

  /* ── ADMIN BANNER ── */
  .admin-banner {
    margin: 0 6rem; padding: 1.8rem 3rem;
    background: linear-gradient(135deg, var(--ink) 0%, #1a1d27 100%);
    border: 1px solid rgba(201,168,76,0.25);
    display: flex; align-items: center; justify-content: space-between; gap: 2rem;
  }
  .admin-banner-text h3 { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 900; color: var(--cream); margin-bottom: 0.3rem; }
  .admin-banner-text p { font-size: 0.85rem; color: rgba(245,240,232,0.45); font-weight: 300; }
  .admin-banner-btns { display: flex; gap: 0.8rem; flex-shrink: 0; }

  /* ── CTA ── */
  .cta-section {
    margin: 2rem 6rem 7rem; background: var(--ink); color: var(--cream);
    padding: 5rem; display: grid; grid-template-columns: 1fr auto;
    gap: 3rem; align-items: center; position: relative; overflow: hidden;
  }
  .cta-section::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%); }
  .cta-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; line-height: 1.2; margin-bottom: 1rem; }
  .cta-title em { color: var(--gold); font-style: italic; }
  .cta-text { font-size: 0.95rem; color: rgba(245,240,232,0.65); font-weight: 300; line-height: 1.7; }
  .cta-btns { display: flex; flex-direction: column; gap: 1rem; white-space: nowrap; }

  /* ── FOOTER ── */
  footer { background: #0a0b0e; color: rgba(245,240,232,0.4); padding: 3rem 6rem; display: flex; justify-content: space-between; align-items: center; }
  .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 900; color: var(--cream); }
  .footer-logo span { color: var(--gold); }
  .footer-links { display: flex; gap: 2rem; }
  .footer-links button { font-size: 0.8rem; color: rgba(245,240,232,0.4); background: none; border: none; cursor: pointer; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
  .footer-links button:hover { color: var(--gold); }
  .footer-text { font-size: 0.8rem; }

  /* ── LOGIN ── */
  .login-page { min-height: 100vh; display: flex; background: var(--ink); }
  .left-panel {
    width: 45%; background: var(--ink);
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 3.5rem 4rem; position: relative; overflow: hidden;
  }
  .left-panel::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(201,168,76,0.08), transparent 65%);
    pointer-events: none;
  }
  .brand-link { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 900; color: var(--cream); letter-spacing: -0.5px; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 1rem; }
  .brand-link span { color: var(--gold); }
  .back-arrow { width: 32px; height: 32px; border: 1px solid rgba(245,240,232,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--cream); font-size: 0.9rem; transition: all 0.2s; }
  .back-arrow:hover { border-color: var(--gold); color: var(--gold); }
  .panel-middle { position: relative; z-index: 1; }
  .panel-quote { font-family: 'Playfair Display', serif; font-size: 2.6rem; font-weight: 900; color: var(--cream); line-height: 1.15; margin-bottom: 1.5rem; }
  .panel-quote em { color: var(--gold); font-style: italic; }
  .panel-desc { font-size: 0.9rem; color: rgba(245,240,232,0.45); line-height: 1.75; font-weight: 300; max-width: 340px; }
  .deco-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 3rem; }
  .deco-cell { height: 8px; background: rgba(201,168,76,0.15); border-radius: 1px; animation: pulse 2s ease-in-out infinite; }
  .deco-cell:nth-child(odd) { animation-delay: 0.3s; }
  .deco-cell:nth-child(3n) { background: rgba(201,168,76,0.35); }
  .redirect-info { margin-top: 2rem; padding: 1rem 1.2rem; border: 1px solid rgba(201,168,76,0.2); border-radius: 6px; background: rgba(201,168,76,0.05); }
  .redirect-info p { font-size: 0.78rem; color: rgba(245,240,232,0.4); line-height: 1.6; }
  .redirect-info strong { color: var(--gold); }
  .panel-footer { font-size: 0.75rem; color: rgba(245,240,232,0.25); }
  .right-panel { flex: 1; background: var(--cream); display: flex; align-items: center; justify-content: center; padding: 3rem; }
  .login-box { width: 100%; max-width: 420px; animation: slideIn 0.5s ease both; }
  .login-heading { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; margin-bottom: 0.4rem; }
  .login-sub { font-size: 0.9rem; color: #666; margin-bottom: 2.5rem; font-weight: 300; }
  .login-sub button { color: var(--rust); background: none; border: none; cursor: pointer; font-weight: 500; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; }
  .role-toggle { display: grid; grid-template-columns: 1fr 1fr; border: 1.5px solid rgba(15,17,23,0.15); border-radius: 3px; margin-bottom: 2rem; overflow: hidden; }
  .role-btn { padding: 0.75rem 1rem; text-align: center; background: transparent; border: none; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.25s; color: #888; }
  .role-btn.active { background: var(--ink); color: var(--cream); }
  .cred-hint { background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); padding: 0.75rem 1rem; border-radius: 4px; font-size: 0.78rem; color: #665a2a; margin-bottom: 1.4rem; line-height: 1.6; }
  .cred-hint strong { color: #9a7d1a; }
  .form-group { margin-bottom: 1.4rem; }
  .form-label { display: block; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 0.5rem; color: #444; }
  .input-wrap { position: relative; }
  .input-wrap .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 0.9rem; pointer-events: none; color: #aaa; }
  .form-input {
    width: 100%; padding: 0.85rem 1rem 0.85rem 2.8rem;
    border: 1.5px solid rgba(15,17,23,0.15); background: var(--white); color: var(--ink);
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; border-radius: 2px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.12); }
  .form-footer-row { display: flex; justify-content: flex-end; margin-top: -0.8rem; margin-bottom: 1.6rem; }
  .form-footer-row button { font-size: 0.8rem; color: var(--rust); background: none; border: none; cursor: pointer; font-weight: 500; font-family: 'DM Sans', sans-serif; }
  .btn-login { width: 100%; padding: 1rem; background: var(--ink); color: var(--cream); border: none; border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.15s; }
  .btn-login::after { content: ''; position: absolute; inset: 0; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
  .btn-login:hover::after { transform: scaleX(1); }
  .btn-login span { position: relative; z-index: 1; }
  .btn-login:active { transform: scale(0.99); }
  .divider { display: flex; align-items: center; gap: 1rem; margin: 1.8rem 0; color: #bbb; font-size: 0.8rem; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(15,17,23,0.1); }
  .quick-links { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem; margin-bottom: 1.4rem; }
  .quick-link { padding: 0.6rem 0.5rem; text-align: center; border-radius: 4px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(15,17,23,0.12); color: var(--ink); transition: all 0.2s; cursor: pointer; background: none; font-family: 'DM Sans', sans-serif; }
  .quick-link:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.06); }
  .register-link { text-align: center; font-size: 0.88rem; color: #666; }
  .register-link button { color: var(--ink); font-weight: 600; background: none; border: none; border-bottom: 1.5px solid var(--gold); padding-bottom: 1px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; }
  .error-msg { background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.25); color: var(--error); padding: 0.8rem 1rem; border-radius: 2px; font-size: 0.85rem; margin-bottom: 1.2rem; animation: shake 0.4s ease; }

  /* ── REGISTER ── */
  .register-page { background: var(--cream); min-height: 100vh; }
  .topbar { background: var(--ink); padding: 1.1rem 4rem; display: flex; align-items: center; justify-content: space-between; }
  .topbar-brand { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 900; color: var(--cream); background: none; border: none; cursor: pointer; }
  .topbar-brand span { color: var(--gold); }
  .topbar-right { display: flex; align-items: center; gap: 1.5rem; }
  .topbar-link { font-size: 0.85rem; color: rgba(245,240,232,0.55); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .topbar-link:hover { color: var(--gold); }
  .topbar-admin { font-size: 0.8rem; font-weight: 600; color: var(--gold); background: none; border: 1px solid rgba(201,168,76,0.35); padding: 0.35rem 0.9rem; border-radius: 3px; transition: all 0.2s; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .topbar-admin:hover { background: var(--gold); color: var(--ink); }
  .page-wrap { max-width: 960px; margin: 0 auto; padding: 4rem 2rem 6rem; }
  .steps { display: flex; align-items: center; justify-content: center; margin-bottom: 3.5rem; }
  .step { display: flex; align-items: center; gap: 0.6rem; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; color: #aaa; transition: color 0.3s; }
  .step.active { color: var(--ink); }
  .step.done { color: var(--sage); }
  .step-num { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; transition: all 0.3s; }
  .step.active .step-num { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .step.done .step-num { background: var(--sage); color: var(--cream); border-color: var(--sage); }
  .step-line { width: 60px; height: 1px; background: rgba(15,17,23,0.15); margin: 0 0.5rem; }
  .form-card { background: var(--white); border: 1px solid rgba(15,17,23,0.1); padding: 3.5rem 4rem; position: relative; }
  .form-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--gold), var(--rust)); }
  .section-label { font-size: 0.7rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; font-weight: 500; }
  .reg-section-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; margin-bottom: 2.2rem; line-height: 1.2; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; }
  .full { grid-column: 1 / -1; }
  .reg-label { display: block; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 0.5rem; color: #555; }
  .req { color: var(--rust); margin-left: 2px; }
  .reg-input-wrap { position: relative; }
  .reg-input-wrap .icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.85rem; pointer-events: none; color: #bbb; }
  .reg-input { width: 100%; padding: 0.82rem 1rem 0.82rem 2.6rem; border: 1.5px solid rgba(15,17,23,0.12); background: var(--cream); color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 0.93rem; border-radius: 2px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; appearance: none; -webkit-appearance: none; }
  .reg-input.no-icon { padding-left: 1rem; }
  .reg-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); background: var(--white); }
  .skills-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.7rem; margin-top: 0.5rem; }
  .skill-chip { padding: 0.55rem 0.9rem; border: 1.5px solid rgba(15,17,23,0.12); border-radius: 2px; cursor: pointer; font-size: 0.8rem; font-weight: 500; transition: all 0.2s; background: var(--cream); user-select: none; text-align: center; }
  .skill-chip:hover { border-color: var(--gold); }
  .skill-chip.selected { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .avail-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.6rem; margin-top: 0.5rem; }
  .day-chip { padding: 0.65rem 0.3rem; border: 1.5px solid rgba(15,17,23,0.12); border-radius: 2px; cursor: pointer; font-size: 0.75rem; font-weight: 500; text-align: center; transition: all 0.2s; background: var(--cream); user-select: none; }
  .day-chip:hover { border-color: var(--gold); }
  .day-chip.selected { background: var(--sage); color: var(--cream); border-color: var(--sage); }
  .form-divider { border: none; border-top: 1px solid rgba(15,17,23,0.08); margin: 2.5rem 0; }
  .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2.5rem; align-items: center; }
  .btn-cancel { padding: 0.9rem 1.8rem; background: transparent; color: #666; border: 1.5px solid rgba(15,17,23,0.15); border-radius: 2px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; transition: all 0.2s; }
  .btn-cancel:hover { border-color: var(--ink); color: var(--ink); }
  .btn-submit { padding: 0.9rem 2.5rem; background: var(--ink); color: var(--cream); border: none; border-radius: 2px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500; position: relative; overflow: hidden; transition: transform 0.15s; }
  .btn-submit::after { content: ''; position: absolute; inset: 0; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
  .btn-submit:hover::after { transform: scaleX(1); }
  .btn-submit span { position: relative; z-index: 1; }
  .btn-submit:active { transform: scale(0.99); }
  .success-box { text-align: center; padding: 4rem 2rem; }
  .success-icon { font-size: 4rem; margin-bottom: 1.5rem; display: block; }
  .success-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; margin-bottom: 1rem; }
  .success-text { font-size: 0.95rem; color: #666; max-width: 380px; margin: 0 auto 2rem; line-height: 1.7; }
  .success-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .field-error { font-size: 0.75rem; color: var(--error); margin-top: 0.35rem; }
  .strength-bar { height: 3px; border-radius: 2px; margin-top: 0.5rem; background: rgba(15,17,23,0.08); overflow: hidden; }
  .strength-fill { height: 100%; border-radius: 2px; transition: width 0.4s, background 0.4s; }
  .strength-text { font-size: 0.73rem; color: #aaa; margin-top: 0.3rem; }
  .terms-label { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; }
  .terms-label a { color: var(--gold); text-decoration: none; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

  .hero-left > * { animation: fadeUp 0.7s ease both; }
  .hero-left > *:nth-child(2) { animation-delay: 0.1s; }
  .hero-left > *:nth-child(3) { animation-delay: 0.2s; }
  .hero-left > *:nth-child(4) { animation-delay: 0.3s; }
`;

// ─────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const heroRightRef = useRef(null);
  const statsAnimated = useRef(false);
  const [stats, setStats] = useState({ s1: "0", s2: "0", s3: "0", s4: "0" });
  const [navShadow, setNavShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavShadow(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = heroRightRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated.current) {
          statsAnimated.current = true;
          animateCount(1240, 1800, (v) => setStats(s => ({ ...s, s1: v >= 1000 ? (v / 1000).toFixed(1) + "K+" : Math.floor(v) + "+" })));
          animateCount(86,   1800, (v) => setStats(s => ({ ...s, s2: Math.floor(v).toString() })));
          animateCount(14000,1800, (v) => setStats(s => ({ ...s, s3: v >= 1000 ? (v / 1000).toFixed(1) + "K" : Math.floor(v).toString() })));
          animateCount(4.9,  1800, (v) => setStats(s => ({ ...s, s4: v.toFixed(1) + "★" })), true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function animateCount(target, duration, setter, decimal = false) {
    const start = performance.now();
    const update = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setter(target * eased);
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const scrollToEvents = () => {
    document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="main-nav" style={{ boxShadow: navShadow ? "0 2px 20px rgba(15,17,23,0.08)" : "none" }}>
        <button className="nav-logo" onClick={() => navigate("home")}>Volunteer<span>Hub</span></button>
        <div className="nav-links">
          <button onClick={scrollToEvents}>Events</button>
          <button onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}>About</button>
          <button onClick={() => navigate("login")}>Login</button>
          <button className="btn-nav" onClick={() => navigate("register")}>Register</button>
          <button className="btn-nav-admin" onClick={() => alert("Admin panel would open here.")}>⚙ Admin Panel</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Volunteer Management System</div>
          <h1 className="hero-h1">Make a<br /><em>Difference</em><br />Together</h1>
          <p className="hero-desc">Connect passionate volunteers with meaningful events. Streamline scheduling, track attendance, and build a community that cares.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("login")}><span>Login to Dashboard</span></button>
            <button className="btn-secondary" onClick={() => navigate("register")}>Register as Volunteer</button>
            <button className="btn-outline-gold" onClick={scrollToEvents}>View Events</button>
          </div>
        </div>
        <div className="hero-right" ref={heroRightRef}>
          <div className="corner-decor"></div>
          <div className="corner-decor-bl"></div>
          <div className="hero-right-inner">
            <div className="stat-block"><div className="stat-num">{stats.s1}</div><div className="stat-label">Active Volunteers</div></div>
            <div className="hero-divider"></div>
            <div className="stat-block"><div className="stat-num">{stats.s2}</div><div className="stat-label">Events This Year</div></div>
            <div className="hero-divider"></div>
            <div className="stat-block"><div className="stat-num">{stats.s3}</div><div className="stat-label">Hours Contributed</div></div>
            <div className="hero-divider"></div>
            <div className="stat-block"><div className="stat-num">{stats.s4}</div><div className="stat-label">Avg. Feedback Rating</div></div>
          </div>
        </div>
      </section>

      <div className="features" id="about-section">
        {[
          { icon: "📋", title: "Smart Scheduling", text: "Assign volunteers to shifts and roles automatically based on availability and skill sets." },
          { icon: "📊", title: "Attendance Tracking", text: "Real-time check-in and attendance records for every event, shift, and assignment." },
          { icon: "⭐", title: "Performance Reviews", text: "Coordinators can provide feedback and ratings to recognize outstanding volunteer work." },
        ].map((f) => (
          <div className="feature-item" key={f.title}>
            <span className="feature-icon">{f.icon}</span>
            <div className="feature-title">{f.title}</div>
            <p className="feature-text">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="admin-banner">
        <div className="admin-banner-text">
          <h3>⚙ Admin / Coordinator Panel</h3>
          <p>Manage volunteers, events, roles, shifts, assignments, attendance and feedback from one place.</p>
        </div>
        <div className="admin-banner-btns">
          <button className="btn-primary" onClick={() => alert("Admin panel would open here.")}><span>Open Admin Panel →</span></button>
          <button className="btn-outline-gold" onClick={() => navigate("login")}>Login First</button>
        </div>
      </div>

      <section className="events-section" id="events-section">
        <div className="section-header">
          <div>
            <span className="section-tag">Upcoming</span>
            <h2 className="section-title">Events Open<br />for Volunteers</h2>
          </div>
          <button className="btn-secondary" onClick={() => alert("All events would be shown here.")}>See All Events</button>
        </div>
        <div className="events-grid">
          {[
            { date: "May 12, 2025", name: "City Clean-Up Drive",   venue: "📍 Riverside Park, Block C",     time: "🕗 8:00 AM – 12:00 PM", slots: "👥 24 slots open" },
            { date: "May 18, 2025", name: "Youth Literacy Camp",   venue: "📍 Community Hall, Sector 7",   time: "🕗 9:00 AM – 5:00 PM",  slots: "👥 12 slots open" },
            { date: "May 25, 2025", name: "Blood Donation Camp",   venue: "📍 Civil Hospital, Main Gate",  time: "🕗 10:00 AM – 4:00 PM", slots: "👥 8 slots open" },
          ].map((e) => (
            <div className="event-card" key={e.name}>
              <div className="event-date">{e.date}</div>
              <div className="event-name">{e.name}</div>
              <div className="event-venue">{e.venue}</div>
              <div className="event-meta"><span>{e.time}</span><span>{e.slots}</span></div>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-section">
        <div>
          <div className="cta-title">Ready to <em>volunteer</em><br />your time?</div>
          <p className="cta-text">Join hundreds of dedicated volunteers making real change. Register today and get matched to events that fit your skills and schedule.</p>
        </div>
        <div className="cta-btns">
          <button className="btn-primary" onClick={() => navigate("register")}><span>Register as Volunteer</span></button>
          <button className="btn-outline-gold" onClick={() => navigate("login")}>Login</button>
          <button className="btn-secondary" onClick={() => alert("Admin panel would open here.")}>Admin Panel</button>
        </div>
      </div>

      <footer>
        <div className="footer-logo">Volunteer<span>Hub</span></div>
        <div className="footer-links">
          <button onClick={() => navigate("home")}>Home</button>
          <button onClick={() => navigate("login")}>Login</button>
          <button onClick={() => navigate("register")}>Register</button>
          <button onClick={() => alert("Admin panel would open here.")}>Admin Panel</button>
        </div>
        <div className="footer-text">© 2025 VolunteerHub. All rights reserved.</div>
      </footer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────
function LoginPage({ navigate }) {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const hints = {
    admin: <><strong>Admin demo:</strong> admin@hub.com / admin123</>,
    volunteer: <><strong>Volunteer demo:</strong> vol@hub.com / vol123</>,
  };

  const handleLogin = () => {
    setError("");
    if (!email || !password) { setError("⚠ Please enter both email and password."); return; }
    if (role === "admin") {
      if (email === "admin@hub.com" && password === "admin123") { alert("✅ Admin login successful! Admin panel would open here."); return; }
    } else {
      if (email === "vol@hub.com" && password === "vol123") { navigate("home"); return; }
    }
    setError("⚠ Invalid credentials. Please check your email and password.");
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        <button className="brand-link" onClick={() => navigate("home")}>
          <div className="back-arrow">←</div>
          Volunteer<span>Hub</span>
        </button>
        <div className="panel-middle">
          <div className="panel-quote">Welcome<br /><em>back,</em><br />changemaker.</div>
          <p className="panel-desc">Your dashboard awaits. Manage events, assign volunteers, and track the impact your team is making every day.</p>
          <div className="deco-grid">
            {Array.from({ length: 8 }).map((_, i) => <div className="deco-cell" key={i}></div>)}
          </div>
          <div className="redirect-info">
            <p>
              <strong>Admin</strong> → Redirects to Admin Panel<br />
              <strong>Volunteer</strong> → Redirects to Home Page<br />
              Demo: <strong>admin@hub.com / admin123</strong><br />
              Demo: <strong>vol@hub.com / vol123</strong>
            </p>
          </div>
        </div>
        <div className="panel-footer">© 2025 VolunteerHub · All rights reserved</div>
      </div>

      <div className="right-panel">
        <div className="login-box">
          <h1 className="login-heading">Sign In</h1>
          <p className="login-sub">New here? <button onClick={() => navigate("register")}>Create a volunteer account →</button></p>

          <div className="role-toggle">
            <button className={`role-btn${role === "admin" ? " active" : ""}`} onClick={() => { setRole("admin"); setError(""); setEmail(""); setPassword(""); }}>🛡 Admin / Coordinator</button>
            <button className={`role-btn${role === "volunteer" ? " active" : ""}`} onClick={() => { setRole("volunteer"); setError(""); setEmail(""); setPassword(""); }}>🙋 Volunteer</button>
          </div>

          <div className="cred-hint">{hints[role]}</div>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <span className="icon">✉</span>
              <input className="form-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <span className="icon">🔒</span>
              <input className="form-input" type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Enter your password" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
          </div>
          <div className="form-footer-row"><button>Forgot password?</button></div>

          <button className="btn-login" onClick={handleLogin}><span>Sign In →</span></button>

          <div className="divider">quick links</div>
          <div className="quick-links">
            <button className="quick-link" onClick={() => navigate("home")}>🏠 Home</button>
            <button className="quick-link" onClick={() => navigate("register")}>📝 Register</button>
            <button className="quick-link" onClick={() => alert("Admin panel would open here.")}>⚙ Admin</button>
          </div>
          <p className="register-link">Don't have an account? <button onClick={() => navigate("register")}>Register now</button></p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REGISTER PAGE
// ─────────────────────────────────────────────────────────────
const SKILLS_LIST = ["🎤 Public Speaking","🏥 First Aid","💻 Tech / IT","🎨 Design","📷 Photography","🍳 Cooking","🚗 Driving","📚 Teaching","🌐 Translation","🎵 Music","⚽ Sports","🔧 Logistics"];
const DAYS_LIST = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function RegisterPage({ navigate }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  // Step 1
  const [name, setName] = useState(""); const [nameErr, setNameErr] = useState(false);
  const [phone, setPhone] = useState(""); const [phoneErr, setPhoneErr] = useState(false);
  const [email, setEmail] = useState(""); const [emailErr, setEmailErr] = useState(false);
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");

  // Step 2
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsErr, setSkillsErr] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [experience, setExperience] = useState("");

  // Step 3
  const [emailConfirm, setEmailConfirm] = useState(""); const [emailConfirmErr, setEmailConfirmErr] = useState(false);
  const [password, setPassword] = useState(""); const [passErr, setPassErr] = useState(false);
  const [password2, setPassword2] = useState(""); const [pass2Err, setPass2Err] = useState(false);
  const [terms, setTerms] = useState(false); const [termsErr, setTermsErr] = useState(false);
  const [strength, setStrength] = useState({ w: "0%", c: "#e74c3c", t: "Too short" });

  const levels = [
    { w:"0%",  c:"#e74c3c", t:"Too short" },
    { w:"25%", c:"#e67e22", t:"Weak" },
    { w:"50%", c:"#f1c40f", t:"Fair" },
    { w:"75%", c:"#3498db", t:"Good" },
    { w:"100%",c:"#27ae60", t:"Strong ✓" },
  ];

  const handlePasswordChange = (val) => {
    setPassword(val);
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(levels[score]);
  };

  const goStep = (n) => {
    if (n === 2) {
      const ne = !name.trim(), pe = !phone.trim(), ee = !email.trim() || !email.includes("@");
      setNameErr(ne); setPhoneErr(pe); setEmailErr(ee);
      if (ne || pe || ee) return;
    }
    if (n === 3) {
      const se = selectedSkills.length === 0;
      setSkillsErr(se);
      if (se) return;
      setEmailConfirm(email);
    }
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitForm = () => {
    const ec = emailConfirm !== email;
    const pe = password.length < 8;
    const p2e = password !== password2;
    const te = !terms;
    setEmailConfirmErr(ec); setPassErr(pe); setPass2Err(p2e); setTermsErr(te);
    if (ec || pe || p2e || te) return;
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSkill = (s) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleDay   = (d) => setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const stepClass = (n) => n < step ? "step done" : n === step ? "step active" : "step";

  return (
    <div className="register-page">
      <div className="topbar">
        <button className="topbar-brand" onClick={() => navigate("home")}>Volunteer<span>Hub</span></button>
        <div className="topbar-right">
          <button className="topbar-link" onClick={() => navigate("login")}>Already registered? Sign in →</button>
          <button className="topbar-admin" onClick={() => alert("Admin panel would open here.")}>⚙ Admin Panel</button>
        </div>
      </div>

      <div className="page-wrap">
        <div className="steps">
          <div className={stepClass(1)}><div className="step-num">{step > 1 ? "✓" : "1"}</div><span>Personal Info</span></div>
          <div className="step-line"></div>
          <div className={stepClass(2)}><div className="step-num">{step > 2 ? "✓" : "2"}</div><span>Skills &amp; Availability</span></div>
          <div className="step-line"></div>
          <div className={stepClass(3)}><div className="step-num">{done ? "✓" : "3"}</div><span>Account Setup</span></div>
        </div>

        <div className="form-card">
          {done ? (
            <div className="success-box">
              <span className="success-icon">🎉</span>
              <div className="success-title">You're Registered!</div>
              <p className="success-text">Welcome to VolunteerHub! Your account has been created. You can now log in and explore upcoming events.</p>
              <div className="success-actions">
                <button className="btn-submit" onClick={() => navigate("login")}><span>Go to Login →</span></button>
                <button className="btn-cancel" onClick={() => navigate("home")}>← Home</button>
                <button className="btn-cancel" onClick={() => alert("Admin panel would open here.")}>⚙ Admin Panel</button>
              </div>
            </div>
          ) : step === 1 ? (
            <>
              <div className="section-label">Step 1 of 3</div>
              <div className="reg-section-title">Personal Information</div>
              <div className="two-col">
                <div>
                  <label className="reg-label">Full Name <span className="req">*</span></label>
                  <div className="reg-input-wrap"><span className="icon">👤</span><input className="reg-input" type="text" value={name} onChange={e => { setName(e.target.value); setNameErr(false); }} placeholder="John Doe" /></div>
                  {nameErr && <div className="field-error">Please enter your full name.</div>}
                </div>
                <div>
                  <label className="reg-label">Phone Number <span className="req">*</span></label>
                  <div className="reg-input-wrap"><span className="icon">📞</span><input className="reg-input" type="tel" value={phone} onChange={e => { setPhone(e.target.value); setPhoneErr(false); }} placeholder="+91 555 000 0000" /></div>
                  {phoneErr && <div className="field-error">Please enter a valid phone number.</div>}
                </div>
                <div className="full">
                  <label className="reg-label">Email Address <span className="req">*</span></label>
                  <div className="reg-input-wrap"><span className="icon">✉</span><input className="reg-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailErr(false); }} placeholder="you@example.com" /></div>
                  {emailErr && <div className="field-error">Please enter a valid email address.</div>}
                </div>
                <div>
                  <label className="reg-label">Date of Birth</label>
                  <input className="reg-input no-icon" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div>
                  <label className="reg-label">City / Location</label>
                  <div className="reg-input-wrap"><span className="icon">📍</span><input className="reg-input" type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" /></div>
                </div>
                <div className="full">
                  <label className="reg-label">Brief Bio / Motivation</label>
                  <textarea className="reg-input" style={{ paddingLeft: "1rem", resize: "vertical", minHeight: "90px", lineHeight: "1.6" }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us why you want to volunteer..." />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => navigate("home")}>← Home</button>
                <button className="btn-submit" onClick={() => goStep(2)}><span>Next: Skills &amp; Availability →</span></button>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div className="section-label">Step 2 of 3</div>
              <div className="reg-section-title">Skills &amp; Availability</div>
              <div style={{ marginBottom: "1.8rem" }}>
                <label className="reg-label">Select your Skills <span className="req">*</span></label>
                <div className="skills-grid">
                  {SKILLS_LIST.map(s => (
                    <div key={s} className={`skill-chip${selectedSkills.includes(s) ? " selected" : ""}`} onClick={() => { toggleSkill(s); setSkillsErr(false); }}>{s}</div>
                  ))}
                </div>
                {skillsErr && <div className="field-error">Please select at least one skill.</div>}
              </div>
              <hr className="form-divider" />
              <div style={{ marginBottom: "1.8rem" }}>
                <label className="reg-label">Days Available</label>
                <div className="avail-grid">
                  {DAYS_LIST.map(d => (
                    <div key={d} className={`day-chip${selectedDays.includes(d) ? " selected" : ""}`} onClick={() => toggleDay(d)}>{d}</div>
                  ))}
                </div>
              </div>
              <div className="two-col">
                <div>
                  <label className="reg-label">Preferred Time</label>
                  <select className="reg-input" style={{ paddingLeft: "1rem" }} value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
                    <option value="">— Select —</option>
                    <option>Morning (6 AM – 12 PM)</option>
                    <option>Afternoon (12 PM – 5 PM)</option>
                    <option>Evening (5 PM – 9 PM)</option>
                    <option>Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="reg-label">Experience Level</label>
                  <select className="reg-input" style={{ paddingLeft: "1rem" }} value={experience} onChange={e => setExperience(e.target.value)}>
                    <option value="">— Select —</option>
                    <option>First-time volunteer</option>
                    <option>Some experience (1–3 events)</option>
                    <option>Experienced (3+ events)</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => goStep(1)}>← Back</button>
                <button className="btn-submit" onClick={() => goStep(3)}><span>Next: Account Setup →</span></button>
              </div>
            </>
          ) : (
            <>
              <div className="section-label">Step 3 of 3</div>
              <div className="reg-section-title">Create Your Account</div>
              <div className="two-col">
                <div className="full">
                  <label className="reg-label">Email Address <span className="req">*</span></label>
                  <div className="reg-input-wrap"><span className="icon">✉</span><input className="reg-input" type="email" value={emailConfirm} onChange={e => { setEmailConfirm(e.target.value); setEmailConfirmErr(false); }} placeholder="Confirm your email" /></div>
                  {emailConfirmErr && <div className="field-error">Email does not match.</div>}
                </div>
                <div>
                  <label className="reg-label">Password <span className="req">*</span></label>
                  <div className="reg-input-wrap"><span className="icon">🔒</span><input className="reg-input" type="password" value={password} onChange={e => { handlePasswordChange(e.target.value); setPassErr(false); }} placeholder="Create a password" /></div>
                  <div className="strength-bar"><div className="strength-fill" style={{ width: strength.w, background: strength.c }}></div></div>
                  <div className="strength-text" style={{ color: strength.c }}>{strength.t}</div>
                  {passErr && <div className="field-error">Password must be at least 8 characters.</div>}
                </div>
                <div>
                  <label className="reg-label">Confirm Password <span className="req">*</span></label>
                  <div className="reg-input-wrap"><span className="icon">🔒</span><input className="reg-input" type="password" value={password2} onChange={e => { setPassword2(e.target.value); setPass2Err(false); }} placeholder="Repeat password" /></div>
                  {pass2Err && <div className="field-error">Passwords do not match.</div>}
                </div>
              </div>
              <hr className="form-divider" />
              <div style={{ marginBottom: "1rem" }}>
                <label className="terms-label">
                  <input type="checkbox" checked={terms} onChange={e => { setTerms(e.target.checked); setTermsErr(false); }} style={{ width: "16px", height: "16px", accentColor: "var(--ink)" }} />
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>
                {termsErr && <div className="field-error">You must agree to the terms.</div>}
              </div>
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => goStep(2)}>← Back</button>
                <button className="btn-submit" onClick={submitForm}><span>Complete Registration →</span></button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{STYLES}</style>
      {page === "home"     && <HomePage     navigate={navigate} />}
      {page === "login"    && <LoginPage    navigate={navigate} />}
      {page === "register" && <RegisterPage navigate={navigate} />}
    </>
  );
}
