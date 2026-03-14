import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Google Fonts injection ─────────────────────────────────────────────── */
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap";

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('${FONT_LINK}');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --ink: #0f1117; --cream: #f5f0e8; --gold: #c9a84c; --rust: #b5451b; --sage: #4a6741; --white: #fdfcf9; --error: #c0392b; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; cursor: none; }
  a, button, [role="button"], select, input, textarea, label { cursor: none; }

  #c-dot { position:fixed;top:0;left:0;z-index:99999;pointer-events:none;width:8px;height:8px;background:var(--gold);border-radius:50%;transform:translate(-50%,-50%);transition:width .2s,height .2s,background .2s,opacity .2s;mix-blend-mode:multiply; }
  #c-ring { position:fixed;top:0;left:0;z-index:99998;pointer-events:none;width:36px;height:36px;border:1.5px solid var(--gold);border-radius:50%;transform:translate(-50%,-50%);transition:width .35s cubic-bezier(.23,1,.32,1),height .35s cubic-bezier(.23,1,.32,1),border-color .3s,opacity .3s,border-radius .3s;opacity:.6; }
  #c-trail { position:fixed;top:0;left:0;z-index:99997;pointer-events:none;width:6px;height:6px;background:rgba(201,168,76,.35);border-radius:50%;transform:translate(-50%,-50%);transition:opacity .4s; }
  body.cur-hover #c-dot   { width:12px;height:12px;background:var(--rust); }
  body.cur-hover #c-ring  { width:52px;height:52px;border-color:var(--rust);opacity:.4; }
  body.cur-click #c-dot   { width:6px;height:6px;background:var(--ink); }
  body.cur-click #c-ring  { width:22px;height:22px;border-color:var(--ink);opacity:1; }
  body.cur-text  #c-ring  { width:3px;height:32px;border-radius:2px;border-color:var(--ink);opacity:.5; }
  body.cur-text  #c-dot   { opacity:0; }

  nav.main-nav { position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1.2rem 4rem;background:rgba(245,240,232,.93);backdrop-filter:blur(10px);border-bottom:1px solid rgba(201,168,76,.25);transition:box-shadow .3s; }
  .nav-logo { font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;color:var(--ink);letter-spacing:-.5px;text-decoration:none; }
  .nav-logo span { color:var(--gold); }
  .nav-links { display:flex;gap:2.2rem;align-items:center; }
  .nav-links a { text-decoration:none;color:var(--ink);font-size:.9rem;font-weight:500;transition:color .2s; }
  .nav-links a:hover { color:var(--gold); }
  .btn-nav { padding:.55rem 1.4rem;border:1.5px solid var(--ink);background:transparent;color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;border-radius:2px;transition:all .25s;text-decoration:none;display:inline-block; }
  .btn-nav:hover { background:var(--ink);color:var(--cream); }
  .btn-nav-admin { padding:.55rem 1.4rem;border:1.5px solid var(--gold);background:transparent;color:var(--gold);font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;border-radius:2px;transition:all .25s;text-decoration:none;display:inline-block; }
  .btn-nav-admin:hover { background:var(--gold);color:var(--ink); }

  .hero { min-height:100vh;display:flex;justify-content:center;align-items:center;padding-top:80px; }
  .hero-left { display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:6rem 4rem;max-width:700px; }
  .hero-tag { display:inline-flex;align-items:center;gap:.6rem;font-size:.75rem;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:1.8rem; }
  h1.hero-h1 { font-family:'Playfair Display',serif;font-size:clamp(3rem,5vw,4.8rem);font-weight:900;line-height:1.05;letter-spacing:-1px;margin-bottom:1.6rem; }
  h1.hero-h1 em { font-style:italic;color:var(--gold); }
  .hero-desc { font-size:1.05rem;line-height:1.75;color:#444;max-width:460px;margin-bottom:3rem;font-weight:300; }
  .hero-actions { display:flex;flex-direction:column;gap:1rem;align-items:center;width:100%; }
  .hero-actions .btn-primary,.hero-actions .btn-secondary,.hero-actions .btn-outline-gold { width:280px;text-align:center; }

  .btn-primary { padding:.9rem 2.2rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;text-decoration:none;display:inline-block;position:relative;overflow:hidden;transition:all .25s; }
  .btn-primary::after { content:'';position:absolute;inset:0;background:var(--gold);transform:translateX(-101%);transition:transform .3s ease; }
  .btn-primary:hover::after { transform:translateX(0); }
  .btn-primary span { position:relative;z-index:1; }
  .btn-secondary { padding:.9rem 2.2rem;background:transparent;color:var(--ink);border:1.5px solid var(--ink);border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;text-decoration:none;display:inline-block;transition:all .25s; }
  .btn-secondary:hover { background:var(--sage);color:var(--cream);border-color:var(--sage); }
  .btn-outline-gold { padding:.9rem 2.2rem;background:transparent;color:var(--gold);border:1.5px solid var(--gold);border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;text-decoration:none;display:inline-block;transition:all .25s; }
  .btn-outline-gold:hover { background:var(--gold);color:var(--ink); }

  .features { display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(15,17,23,.1);border-bottom:1px solid rgba(15,17,23,.1); }
  .feature-item { padding:3.5rem 3rem;border-right:1px solid rgba(15,17,23,.1);transition:background .3s,opacity .5s,transform .5s;opacity:0;transform:translateY(18px); }
  .feature-item.visible { opacity:1;transform:translateY(0); }
  .feature-item:last-child { border-right:none; }
  .feature-item:hover { background:rgba(201,168,76,.06); }
  .feature-icon { font-size:2rem;margin-bottom:1.2rem;display:block; }
  .feature-title { font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;margin-bottom:.7rem; }
  .feature-text { font-size:.9rem;line-height:1.7;color:#555;font-weight:300; }

  .events-section { padding:7rem 6rem; }
  .section-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:3.5rem; }
  .section-tag { font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:.8rem;display:block; }
  .section-title-lg { font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:900;line-height:1.15; }
  .events-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1.5px;background:rgba(15,17,23,.1); }
  .event-card { background:var(--cream);padding:2.5rem 2rem;transition:background .3s,transform .3s;text-decoration:none;color:inherit;display:block; }
  .event-card:hover { background:var(--ink);color:var(--cream);transform:translateY(-3px); }
  .event-card:hover .event-date { color:var(--gold); }
  .event-card:hover .event-venue,.event-card:hover .event-meta { color:rgba(245,240,232,.6); }
  .event-date { font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:1rem;font-weight:500;transition:color .3s; }
  .event-name { font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;margin-bottom:.7rem;line-height:1.25; }
  .event-venue { font-size:.85rem;color:#666;margin-bottom:1.5rem;font-weight:300;transition:color .3s; }
  .event-meta { display:flex;gap:1.5rem;font-size:.8rem;color:#888;transition:color .3s; }

  .admin-banner { margin:0 6rem;padding:1.8rem 3rem;background:linear-gradient(135deg,var(--ink) 0%,#1a1d27 100%);border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:space-between;gap:2rem; }
  .admin-banner-text h3 { font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:var(--cream);margin-bottom:.3rem; }
  .admin-banner-text p { font-size:.85rem;color:rgba(245,240,232,.45);font-weight:300; }
  .admin-banner-btns { display:flex;gap:.8rem;flex-shrink:0; }

  .cta-section { margin:2rem 6rem 7rem;background:var(--ink);color:var(--cream);padding:5rem;display:grid;grid-template-columns:1fr auto;gap:3rem;align-items:center;position:relative;overflow:hidden; }
  .cta-section::before { content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.15),transparent 70%); }
  .cta-title { font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;line-height:1.2;margin-bottom:1rem; }
  .cta-title em { color:var(--gold);font-style:italic; }
  .cta-text { font-size:.95rem;color:rgba(245,240,232,.65);font-weight:300;line-height:1.7; }
  .cta-btns { display:flex;flex-direction:column;gap:1rem;white-space:nowrap; }

  footer.main-footer { background:#0a0b0e;color:rgba(245,240,232,.4);padding:3rem 6rem;display:flex;justify-content:space-between;align-items:center; }
  .footer-logo { font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:var(--cream); }
  .footer-logo span { color:var(--gold); }
  .footer-links { display:flex;gap:2rem; }
  .footer-links a { font-size:.8rem;color:rgba(245,240,232,.4);text-decoration:none;transition:color .2s; }
  .footer-links a:hover { color:var(--gold); }
  .footer-text { font-size:.8rem; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .hero-left > * { animation:fadeUp .7s ease both; }
  .hero-left > *:nth-child(2){animation-delay:.1s} .hero-left > *:nth-child(3){animation-delay:.2s} .hero-left > *:nth-child(4){animation-delay:.3s}

  .modal-overlay { position:fixed;inset:0;z-index:200;background:rgba(15,17,23,.7);backdrop-filter:blur(4px);display:flex;justify-content:center;align-items:center; }
  .modal-box { background:var(--cream);width:100%;max-width:520px;padding:3rem;position:relative;animation:fadeUp .3s ease both; }
  .modal-close { position:absolute;top:1.2rem;right:1.5rem;background:none;border:none;font-size:1.4rem;color:var(--ink);line-height:1;transition:color .2s; }
  .modal-close:hover { color:var(--rust); }
  .modal-tag { font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;display:block; }
  .modal-title { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:900;margin-bottom:1.8rem; }
  .modal-fg { margin-bottom:1.2rem; }
  .modal-fg label { display:block;font-size:.82rem;font-weight:500;margin-bottom:.4rem;color:var(--ink); }
  .modal-fg select,.modal-fg textarea { width:100%;padding:.7rem .9rem;border:1.5px solid rgba(15,17,23,.18);background:var(--white);font-family:'DM Sans',sans-serif;font-size:.9rem;color:var(--ink);border-radius:2px;outline:none;transition:border-color .2s; }
  .modal-fg select:focus,.modal-fg textarea:focus { border-color:var(--gold); }
  .modal-fg textarea { resize:vertical;min-height:110px; }
  .star-rating { display:flex;flex-direction:row-reverse;justify-content:flex-end;gap:.4rem;margin-top:.3rem; }
  .star-rating input { display:none; }
  .star-rating label { font-size:1.6rem;color:rgba(15,17,23,.2);transition:color .15s;user-select:none; }
  .star-rating label:hover,.star-rating label:hover ~ label,.star-rating input:checked ~ label { color:var(--gold); }
  .modal-submit { margin-top:1.6rem;width:100%;padding:.9rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;position:relative;overflow:hidden;transition:all .25s; }
  .modal-submit::after { content:'';position:absolute;inset:0;background:var(--gold);transform:translateX(-101%);transition:transform .3s ease; }
  .modal-submit:hover::after { transform:translateX(0); }
  .modal-submit span { position:relative;z-index:1; }
  .access-denied { text-align:center;padding:1rem 0; }
  .access-denied .deny-icon { font-size:2.5rem;margin-bottom:1rem;display:block; }
  .access-denied p { font-size:.9rem;color:#666;font-weight:300;line-height:1.7; }
  .access-denied strong { color:var(--rust); }
  .feedback-success { text-align:center;padding:1rem 0; }
  .feedback-success .fs-icon { font-size:2.5rem;margin-bottom:1rem;display:block; }
  .feedback-success p { font-size:.9rem;color:#555;font-weight:300;line-height:1.7; }

  .login-page { min-height:100vh;display:flex;background:var(--ink); }
  .left-panel { width:45%;background:var(--ink);display:flex;flex-direction:column;justify-content:space-between;padding:3.5rem 4rem;position:relative;overflow:hidden; }
  .left-panel::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 80% 50%,rgba(201,168,76,.08),transparent 65%);pointer-events:none; }
  .brand-lg { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:900;color:var(--cream);letter-spacing:-.5px; }
  .brand-lg span { color:var(--gold); }
  .brand-back { display:flex;align-items:center;gap:1rem;text-decoration:none; }
  .back-arrow { width:32px;height:32px;border:1px solid rgba(245,240,232,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--cream);font-size:.9rem;transition:all .2s; }
  .back-arrow:hover { border-color:var(--gold);color:var(--gold); }
  .panel-middle { position:relative;z-index:1; }
  .panel-quote { font-family:'Playfair Display',serif;font-size:2.6rem;font-weight:900;color:var(--cream);line-height:1.15;margin-bottom:1.5rem; }
  .panel-quote em { color:var(--gold);font-style:italic; }
  .panel-desc { font-size:.9rem;color:rgba(245,240,232,.45);line-height:1.75;font-weight:300;max-width:340px; }
  .deco-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:3rem; }
  .deco-cell { height:8px;background:rgba(201,168,76,.15);border-radius:1px;animation:pulse 2s ease-in-out infinite; }
  .deco-cell:nth-child(odd){animation-delay:.3s} .deco-cell:nth-child(3n){background:rgba(201,168,76,.35)}
  @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
  .redirect-info { margin-top:2rem;padding:1rem 1.2rem;border:1px solid rgba(201,168,76,.2);border-radius:6px;background:rgba(201,168,76,.05); }
  .redirect-info p { font-size:.78rem;color:rgba(245,240,232,.4);line-height:1.6; }
  .redirect-info strong { color:var(--gold); }
  .panel-footer { font-size:.75rem;color:rgba(245,240,232,.25); }
  .right-panel { flex:1;background:var(--cream);display:flex;align-items:center;justify-content:center;padding:3rem; }
  .login-box { width:100%;max-width:420px;animation:slideIn .5s ease both; }
  @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  .login-heading { font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;margin-bottom:.4rem; }
  .login-sub { font-size:.9rem;color:#666;margin-bottom:2.5rem;font-weight:300; }
  .login-sub a { color:var(--rust);text-decoration:none;font-weight:500; }
  .role-toggle { display:grid;grid-template-columns:1fr 1fr;border:1.5px solid rgba(15,17,23,.15);border-radius:3px;margin-bottom:2rem;overflow:hidden; }
  .role-btn { padding:.75rem 1rem;text-align:center;background:transparent;border:none;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;transition:all .25s;color:#888; }
  .role-btn.active { background:var(--ink);color:var(--cream); }
  .cred-hint { background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);padding:.75rem 1rem;border-radius:4px;font-size:.78rem;color:#665a2a;margin-bottom:1.4rem;line-height:1.6; }
  .cred-hint strong { color:#9a7d1a; }
  .form-group { margin-bottom:1.4rem; }
  .form-group label { display:block;font-size:.78rem;font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:.5rem;color:#444; }
  .input-wrap { position:relative; }
  .input-wrap .icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:.9rem;pointer-events:none;color:#aaa; }
  .input-wrap input { width:100%;padding:.85rem 1rem .85rem 2.8rem;border:1.5px solid rgba(15,17,23,.15);background:var(--white);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.95rem;border-radius:2px;outline:none;transition:border-color .2s,box-shadow .2s; }
  .input-wrap input:focus { border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.12); }
  .form-footer { display:flex;justify-content:flex-end;margin-top:-.8rem;margin-bottom:1.6rem; }
  .form-footer a { font-size:.8rem;color:var(--rust);text-decoration:none;font-weight:500; }
  .form-footer a:hover { text-decoration:underline; }
  .btn-login { width:100%;padding:1rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:500;position:relative;overflow:hidden;transition:transform .15s; }
  .btn-login::after { content:'';position:absolute;inset:0;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .3s ease; }
  .btn-login:hover::after { transform:scaleX(1); }
  .btn-login span { position:relative;z-index:1; }
  .btn-login:active { transform:scale(.99); }
  .divider { display:flex;align-items:center;gap:1rem;margin:1.8rem 0;color:#bbb;font-size:.8rem; }
  .divider::before,.divider::after { content:'';flex:1;height:1px;background:rgba(15,17,23,.1); }
  .quick-links { display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6rem;margin-bottom:1.4rem; }
  .quick-link { padding:.6rem .5rem;text-align:center;border-radius:4px;font-size:.75rem;font-weight:600;text-decoration:none;border:1px solid rgba(15,17,23,.12);color:var(--ink);transition:all .2s;display:block; }
  .quick-link:hover { border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,.06); }
  .register-link { text-align:center;font-size:.88rem;color:#666; }
  .register-link a { color:var(--ink);font-weight:600;text-decoration:none;border-bottom:1.5px solid var(--gold);padding-bottom:1px; }
  .error-msg { background:rgba(192,57,43,.08);border:1px solid rgba(192,57,43,.25);color:var(--error);padding:.8rem 1rem;border-radius:2px;font-size:.85rem;margin-bottom:1.2rem;animation:shake .4s ease; }
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

  .topbar { background:var(--ink);padding:1.1rem 4rem;display:flex;align-items:center;justify-content:space-between; }
  .topbar .brand-lg { font-size:1.4rem; }
  .topbar-right { display:flex;align-items:center;gap:1.5rem; }
  .topbar-link { font-size:.85rem;color:rgba(245,240,232,.55);text-decoration:none;transition:color .2s; }
  .topbar-link:hover { color:var(--gold); }
  .topbar-admin { font-size:.8rem;font-weight:600;color:var(--gold);text-decoration:none;border:1px solid rgba(201,168,76,.35);padding:.35rem .9rem;border-radius:3px;transition:all .2s; }
  .topbar-admin:hover { background:var(--gold);color:var(--ink); }
  .page-wrap { max-width:960px;margin:0 auto;padding:4rem 2rem 6rem; }
  .role-select-wrap { margin-bottom:2.5rem; }
  .role-select-label { font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:.8rem;display:block;font-weight:500; }
  .steps { display:flex;align-items:center;justify-content:center;margin-bottom:3.5rem; }
  .step { display:flex;align-items:center;gap:.6rem;font-size:.78rem;font-weight:500;letter-spacing:.5px;text-transform:uppercase;color:#aaa;transition:color .3s; }
  .step.active { color:var(--ink); } .step.done { color:var(--sage); }
  .step-num { width:28px;height:28px;border-radius:50%;border:1.5px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:600;transition:all .3s; }
  .step.active .step-num { background:var(--ink);color:var(--cream);border-color:var(--ink); }
  .step.done .step-num { background:var(--sage);color:var(--cream);border-color:var(--sage); }
  .step-line { width:60px;height:1px;background:rgba(15,17,23,.15);margin:0 .5rem; }
  .form-card { background:var(--white);border:1px solid rgba(15,17,23,.1);padding:3.5rem 4rem;position:relative; }
  .form-card::before { content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--gold),var(--rust)); }
  .admin-stripe::before { background:linear-gradient(90deg,var(--gold),#8b5cf6)!important; }
  .section-label { font-size:.7rem;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem;font-weight:500; }
  .section-title { font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;margin-bottom:2.2rem;line-height:1.2; }
  .two-col { display:grid;grid-template-columns:1fr 1fr;gap:1.4rem; }
  .full { grid-column:1/-1; }
  .reg-label { display:block;font-size:.78rem;font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:.5rem;color:#555; }
  .req { color:var(--rust);margin-left:2px; }
  .reg-input-wrap { position:relative; }
  .reg-input-wrap .icon { position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:.85rem;pointer-events:none;color:#bbb; }
  .reg-input-wrap input { width:100%;padding:.82rem 1rem .82rem 2.6rem;border:1.5px solid rgba(15,17,23,.12);background:var(--cream);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.93rem;border-radius:2px;outline:none;transition:border-color .2s,box-shadow .2s;appearance:none; }
  .reg-input-wrap input:focus { border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1);background:var(--white); }
  select.reg-sel,textarea.reg-ta { width:100%;padding:.82rem 1rem;border:1.5px solid rgba(15,17,23,.12);background:var(--cream);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.93rem;border-radius:2px;outline:none;transition:border-color .2s,box-shadow .2s;appearance:none; }
  select.reg-sel:focus,textarea.reg-ta:focus { border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1);background:var(--white); }
  textarea.reg-ta { resize:vertical;min-height:90px;line-height:1.6; }
  .skills-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem;margin-top:.5rem; }
  .skill-chip { padding:.55rem .9rem;border:1.5px solid rgba(15,17,23,.12);border-radius:2px;font-size:.8rem;font-weight:500;transition:all .2s;background:var(--cream);user-select:none;text-align:center; }
  .skill-chip:hover { border-color:var(--gold); }
  .skill-chip.selected { background:var(--ink);color:var(--cream);border-color:var(--ink); }
  .avail-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:.6rem;margin-top:.5rem; }
  .day-chip { padding:.65rem .3rem;border:1.5px solid rgba(15,17,23,.12);border-radius:2px;font-size:.75rem;font-weight:500;text-align:center;transition:all .2s;background:var(--cream);user-select:none; }
  .day-chip:hover { border-color:var(--gold); }
  .day-chip.selected { background:var(--sage);color:var(--cream);border-color:var(--sage); }
  .form-divider { border:none;border-top:1px solid rgba(15,17,23,.08);margin:2.5rem 0; }
  .form-actions { display:flex;gap:1rem;justify-content:flex-end;margin-top:2.5rem;align-items:center; }
  .btn-cancel { padding:.9rem 1.8rem;background:transparent;color:#666;border:1.5px solid rgba(15,17,23,.15);border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;text-decoration:none;transition:all .2s; }
  .btn-cancel:hover { border-color:var(--ink);color:var(--ink); }
  .btn-submit { padding:.9rem 2.5rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;position:relative;overflow:hidden;transition:transform .15s; }
  .btn-submit::after { content:'';position:absolute;inset:0;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .3s ease; }
  .btn-submit:hover::after { transform:scaleX(1); }
  .btn-submit span { position:relative;z-index:1; }
  .btn-submit:active { transform:scale(.99); }
  .admin-badge { display:inline-flex;align-items:center;gap:.5rem;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);color:#7a5f10;font-size:.78rem;font-weight:600;padding:.4rem .9rem;border-radius:3px;margin-bottom:1.5rem;letter-spacing:.5px;text-transform:uppercase; }
  .success-box { text-align:center;padding:4rem 2rem; }
  .success-icon { font-size:4rem;margin-bottom:1.5rem;display:block; }
  .success-title { font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;margin-bottom:1rem; }
  .success-text { font-size:.95rem;color:#666;max-width:380px;margin:0 auto 2rem;line-height:1.7; }
  .success-actions { display:flex;gap:1rem;justify-content:center;flex-wrap:wrap; }
  .field-error { font-size:.75rem;color:var(--error);margin-top:.35rem; }
  .strength-bar { height:3px;border-radius:2px;margin-top:.5rem;background:rgba(15,17,23,.08);overflow:hidden; }
  .strength-fill { height:100%;border-radius:2px;transition:width .4s,background .4s; }
  .strength-text { font-size:.73rem;color:#aaa;margin-top:.3rem; }
  .terms-label { display:flex;align-items:center;gap:.6rem;font-size:.85rem;text-transform:none;letter-spacing:0; }
  .terms-label a { color:var(--gold);text-decoration:none; }

  @media(max-width:700px){
    .two-col{grid-template-columns:1fr} .skills-grid{grid-template-columns:repeat(2,1fr)}
    .avail-grid{grid-template-columns:repeat(4,1fr)} .form-card{padding:2rem 1.5rem}
    .topbar,nav.main-nav{padding:1rem 1.5rem} .left-panel{display:none}
    .events-section,.admin-banner,.cta-section,footer.main-footer{padding-left:1.5rem;padding-right:1.5rem}
    .admin-banner,.cta-section{margin-left:0;margin-right:0}
  }
`;

/* ─── Cursor ─────────────────────────────────────────────────────────────── */
function Cursor() {
  const dotRef = useRef(null), ringRef = useRef(null), trailRef = useRef(null);
  const pos = useRef({ mx:0,my:0,tx:0,ty:0 });
  useEffect(() => {
    const dot=dotRef.current, ring=ringRef.current, trail=trailRef.current;
    const onMove = e => {
      pos.current.mx=e.clientX; pos.current.my=e.clientY;
      dot.style.left=e.clientX+'px'; dot.style.top=e.clientY+'px';
      ring.style.left=e.clientX+'px'; ring.style.top=e.clientY+'px';
    };
    let raf;
    const animTrail = () => {
      pos.current.tx+=(pos.current.mx-pos.current.tx)*.18;
      pos.current.ty+=(pos.current.my-pos.current.ty)*.18;
      trail.style.left=pos.current.tx+'px'; trail.style.top=pos.current.ty+'px';
      raf=requestAnimationFrame(animTrail);
    };
    animTrail();
    const HOVER='a,button,[role="button"],.skill-chip,.day-chip,.event-card,.feature-item,.quick-link,.role-btn,.btn-submit,.btn-cancel,.modal-submit,.modal-close';
    const TEXT='input,textarea,select';
    const onOver=e=>{
      if(e.target.closest(TEXT)){document.body.classList.remove('cur-hover');document.body.classList.add('cur-text');}
      else if(e.target.closest(HOVER)) document.body.classList.add('cur-hover');
    };
    const onOut=e=>{
      if(e.target.closest(TEXT)) document.body.classList.remove('cur-text');
      if(e.target.closest(HOVER)) document.body.classList.remove('cur-hover');
    };
    const onDown=()=>document.body.classList.add('cur-click');
    const onUp=()=>document.body.classList.remove('cur-click');
    const onLeave=()=>{dot.style.opacity='0';ring.style.opacity='0';trail.style.opacity='0';};
    const onEnter=()=>{dot.style.opacity='1';ring.style.opacity='.6';trail.style.opacity='1';};
    document.addEventListener('mousemove',onMove);
    document.addEventListener('mouseover',onOver);
    document.addEventListener('mouseout',onOut);
    document.addEventListener('mousedown',onDown);
    document.addEventListener('mouseup',onUp);
    document.addEventListener('mouseleave',onLeave);
    document.addEventListener('mouseenter',onEnter);
    return ()=>{
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove',onMove);
      document.removeEventListener('mouseover',onOver);
      document.removeEventListener('mouseout',onOut);
      document.removeEventListener('mousedown',onDown);
      document.removeEventListener('mouseup',onUp);
      document.removeEventListener('mouseleave',onLeave);
      document.removeEventListener('mouseenter',onEnter);
    };
  }, []);
  return (<><div id="c-dot" ref={dotRef}/><div id="c-ring" ref={ringRef}/><div id="c-trail" ref={trailRef}/></>);
}

/* ─── Feedback Modal ─────────────────────────────────────────────────────── */
function FeedbackModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const allowed = true; // SESSION_ROLE = coordinator
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        {!allowed ? (
          <div className="access-denied">
            <span className="deny-icon">🔒</span>
            <span className="modal-tag">Restricted Access</span>
            <div className="modal-title">Access Denied</div>
            <p>The <strong>Feedback</strong> feature is only available to <strong>Event Coordinators</strong> and <strong>Admins</strong>.</p>
          </div>
        ) : submitted ? (
          <div className="feedback-success">
            <span className="fs-icon">✅</span>
            <span className="modal-tag">Submitted</span>
            <div className="modal-title">Feedback Sent!</div>
            <p>Your feedback has been recorded successfully.</p>
          </div>
        ) : (
          <>
            <span className="modal-tag">Coordinator / Admin Only</span>
            <div className="modal-title">Submit Feedback</div>
            <div className="modal-fg"><label>Select Event</label><select className="reg-sel"><option value="">— Choose an event —</option><option>City Clean-Up Drive (May 12)</option><option>Youth Literacy Camp (May 18)</option><option>Blood Donation Camp (May 25)</option></select></div>
            <div className="modal-fg"><label>Select Volunteer</label><select className="reg-sel"><option value="">— Choose a volunteer —</option><option>Alice Johnson</option><option>Bob Martinez</option><option>Carol Singh</option><option>David Lee</option></select></div>
            <div className="modal-fg"><label>Rating</label><div className="star-rating">{[5,4,3,2,1].map(n=><span key={n}><input type="radio" name="rating" id={`s${n}`} value={n}/><label htmlFor={`s${n}`}>★</label></span>)}</div></div>
            <div className="modal-fg"><label>Feedback Comments</label><textarea className="reg-ta" placeholder="Write your feedback about the volunteer's performance…"/></div>
            <button className="modal-submit" onClick={()=>setSubmitted(true)}><span>Submit Feedback</span></button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Home ───────────────────────────────────────────────────────────────── */
function HomePage({ goTo }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const featureRefs = useRef([]);
  useEffect(() => {
    const onScroll=()=>setNavShadow(window.scrollY>10);
    window.addEventListener('scroll',onScroll);
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.15});
    featureRefs.current.forEach((el,i)=>{if(el){el.style.transition=`opacity .5s ease ${i*.12}s,transform .5s ease ${i*.12}s`;obs.observe(el);}});
    return ()=>{window.removeEventListener('scroll',onScroll);obs.disconnect();};
  },[]);
  return (
    <div>
      <nav className="main-nav" style={{boxShadow:navShadow?'0 2px 20px rgba(15,17,23,.08)':'none'}}>
        <a className="nav-logo" onClick={()=>goTo('home')} style={{cursor:'none'}}>Volunteer<span>Hub</span></a>
        <div className="nav-links">
          <a href="#events">Events</a>
          <a onClick={()=>setShowFeedback(true)}>Feedback</a>
          <a onClick={()=>goTo('login')}>Login</a>
          <a onClick={()=>goTo('register')} className="btn-nav">Register</a>
          <a href="admin.html" className="btn-nav-admin">⚙ Admin Panel</a>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Volunteer Management System</div>
          <h1 className="hero-h1">Make a<br/><em>Difference</em><br/>Together</h1>
          <p className="hero-desc">Connect passionate volunteers with meaningful events. Streamline scheduling, track attendance, and build a community that cares.</p>
          <div className="hero-actions">
            <a onClick={()=>goTo('login')} className="btn-primary"><span>Login to Dashboard</span></a>
            <a onClick={()=>goTo('register')} className="btn-secondary">Register as Volunteer</a>
            <a href="#events" className="btn-outline-gold">View Events</a>
          </div>
        </div>
      </section>
      <div className="features">
        {[{icon:'📋',title:'Smart Scheduling',text:'Assign volunteers to shifts and roles automatically based on availability and skill sets.'},{icon:'📊',title:'Attendance Tracking',text:'Real-time check-in and attendance records for every event, shift, and assignment.'},{icon:'⭐',title:'Performance Reviews',text:'Coordinators can provide feedback and ratings to recognize outstanding volunteer work.'}].map((f,i)=>(
          <div className="feature-item" key={i} ref={el=>featureRefs.current[i]=el}><span className="feature-icon">{f.icon}</span><div className="feature-title">{f.title}</div><p className="feature-text">{f.text}</p></div>
        ))}
      </div>
      <div className="admin-banner">
        <div className="admin-banner-text"><h3>⚙ Admin / Coordinator Panel</h3><p>Manage volunteers, events, roles, shifts, assignments, attendance and feedback from one place.</p></div>
        <div className="admin-banner-btns"><a href="admin.html" className="btn-primary"><span>Open Admin Panel →</span></a><a onClick={()=>goTo('login')} className="btn-outline-gold">Login First</a></div>
      </div>
      <section className="events-section" id="events">
        <div className="section-header">
          <div><span className="section-tag">Upcoming</span><h2 className="section-title-lg">Events Open<br/>for Volunteers</h2></div>
          <a href="admin.html" className="btn-secondary">See All Events</a>
        </div>
        <div className="events-grid">
          {[{date:'May 12, 2025',name:'City Clean-Up Drive',venue:'📍 Riverside Park, Block C',time:'🕗 8:00 AM – 12:00 PM',slots:'👥 24 slots open'},{date:'May 18, 2025',name:'Youth Literacy Camp',venue:'📍 Community Hall, Sector 7',time:'🕗 9:00 AM – 5:00 PM',slots:'👥 12 slots open'},{date:'May 25, 2025',name:'Blood Donation Camp',venue:'📍 Civil Hospital, Main Gate',time:'🕗 10:00 AM – 4:00 PM',slots:'👥 8 slots open'}].map((ev,i)=>(
            <a className="event-card" href="admin.html" key={i}><div className="event-date">{ev.date}</div><div className="event-name">{ev.name}</div><div className="event-venue">{ev.venue}</div><div className="event-meta"><span>{ev.time}</span><span>{ev.slots}</span></div></a>
          ))}
        </div>
      </section>
      <div className="cta-section">
        <div><div className="cta-title">Ready to make an <em>impact?</em></div><p className="cta-text">Join hundreds of volunteers already making a difference in their communities. Sign up today — it's free and takes less than 2 minutes.</p></div>
        <div className="cta-btns"><a onClick={()=>goTo('register')} className="btn-primary"><span>Join as Volunteer →</span></a><a onClick={()=>goTo('login')} className="btn-outline-gold">Sign In</a></div>
      </div>
      <footer className="main-footer">
        <div className="footer-logo">Volunteer<span>Hub</span></div>
        <div className="footer-links"><a onClick={()=>goTo('home')}>Home</a><a onClick={()=>goTo('login')}>Login</a><a onClick={()=>goTo('register')}>Register</a><a href="admin.html">Admin Panel</a></div>
        <div className="footer-text">© 2025 VolunteerHub. All rights reserved.</div>
      </footer>
      {showFeedback && <FeedbackModal onClose={()=>setShowFeedback(false)}/>}
    </div>
  );
}

/* ─── Login ──────────────────────────────────────────────────────────────── */
function LoginPage({ goTo }) {
  const [role,setRole]=useState('admin');
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [error,setError]=useState('');
  const hints={admin:<><strong>Admin demo:</strong> admin@hub.com / admin123</>,volunteer:<><strong>Volunteer demo:</strong> vol@hub.com / vol123</>};
  const handleLogin=()=>{
    setError('');
    if(!email||!pass){setError('⚠ Please enter both email and password.');return;}
    if(role==='admin'){if(email==='admin@hub.com'&&pass==='admin123'){window.location.href='admin.html';return;}}
    else{if(email==='vol@hub.com'&&pass==='vol123'){goTo('home');return;}}
    setError('⚠ Invalid credentials. Please check your email and password.');
  };
  useEffect(()=>{
    const onKey=e=>{if(e.key==='Enter')handleLogin();};
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[email,pass,role]);
  return (
    <div className="login-page">
      <div className="left-panel">
        <a className="brand-back" onClick={()=>goTo('home')} style={{cursor:'none'}}>
          <div className="back-arrow">←</div>
          <div className="brand-lg">Volunteer<span>Hub</span></div>
        </a>
        <div className="panel-middle">
          <div className="panel-quote">Welcome<br/><em>back,</em><br/>changemaker.</div>
          <p className="panel-desc">Your dashboard awaits. Manage events, assign volunteers, and track the impact your team is making every day.</p>
          <div className="deco-grid">{Array.from({length:8}).map((_,i)=><div className="deco-cell" key={i}/>)}</div>
          <div className="redirect-info"><p><strong>Admin</strong> → Redirects to Admin Panel<br/><strong>Volunteer</strong> → Redirects to Home Page<br/>Demo: <strong>admin@hub.com / admin123</strong><br/>Demo: <strong>vol@hub.com / vol123</strong></p></div>
        </div>
        <div className="panel-footer">© 2025 VolunteerHub · All rights reserved</div>
      </div>
      <div className="right-panel">
        <div className="login-box">
          <h1 className="login-heading">Sign In</h1>
          <p className="login-sub">New here? <a onClick={()=>goTo('register')}>Create a volunteer account →</a></p>
          <div className="role-toggle">
            <button className={`role-btn${role==='admin'?' active':''}`} onClick={()=>{setRole('admin');setError('');setEmail('');setPass('');}}>🛡 Admin / Coordinator</button>
            <button className={`role-btn${role==='volunteer'?' active':''}`} onClick={()=>{setRole('volunteer');setError('');setEmail('');setPass('');}}>🙋 Volunteer</button>
          </div>
          <div className="cred-hint">{hints[role]}</div>
          {error&&<div className="error-msg">{error}</div>}
          <div className="form-group"><label>Email Address</label><div className="input-wrap"><span className="icon">✉</span><input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} placeholder="you@example.com"/></div></div>
          <div className="form-group"><label>Password</label><div className="input-wrap"><span className="icon">🔒</span><input type="password" value={pass} onChange={e=>{setPass(e.target.value);setError('');}} placeholder="Enter your password"/></div></div>
          <div className="form-footer"><a href="#">Forgot password?</a></div>
          <button className="btn-login" onClick={handleLogin}><span>Sign In →</span></button>
          <div className="divider">quick links</div>
          <div className="quick-links">
            <a className="quick-link" onClick={()=>goTo('home')}>🏠 Home</a>
            <a className="quick-link" onClick={()=>goTo('register')}>📝 Register</a>
            <a className="quick-link" href="admin.html">⚙ Admin</a>
          </div>
          <p className="register-link">Don't have an account? <a onClick={()=>goTo('register')}>Register now</a></p>
        </div>
      </div>
    </div>
  );
}

/* ─── Password Strength ──────────────────────────────────────────────────── */
function PasswordStrength({value}){
  const L=[{w:'0%',c:'#e74c3c',t:'Too short'},{w:'25%',c:'#e67e22',t:'Weak'},{w:'50%',c:'#f1c40f',t:'Fair'},{w:'75%',c:'#3498db',t:'Good'},{w:'100%',c:'#27ae60',t:'Strong ✓'}];
  let s=0;
  if(value.length>=8)s++;if(/[A-Z]/.test(value))s++;if(/[0-9]/.test(value))s++;if(/[^A-Za-z0-9]/.test(value))s++;
  return(<><div className="strength-bar"><div className="strength-fill" style={{width:L[s].w,background:L[s].c}}/></div><div className="strength-text" style={{color:L[s].c}}>{L[s].t}</div></>);
}

/* ─── Step Bar ───────────────────────────────────────────────────────────── */
function StepBar({current,labels}){
  return(
    <div className="steps">
      {labels.map((label,i)=>{
        const n=i+1,cls=n<current?'step done':n===current?'step active':'step';
        return(<span key={n} style={{display:'contents'}}>
          <div className={cls}><div className="step-num">{n<current?'✓':n}</div><span>{label}</span></div>
          {i<labels.length-1&&<div className="step-line"/>}
        </span>);
      })}
    </div>
  );
}

/* ─── Volunteer Form ─────────────────────────────────────────────────────── */
const SKILLS=['🎤 Public Speaking','🏥 First Aid','💻 Tech / IT','🎨 Design','📷 Photography','🍳 Cooking','🚗 Driving','📚 Teaching','🌐 Translation','🎵 Music','⚽ Sports','🔧 Logistics'];
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function VolunteerForm({goTo}){
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  const [skills,setSkills]=useState([]);
  const [days,setDays]=useState([]);
  const [errors,setErrors]=useState({});
  const [f,setF]=useState({name:'',phone:'',email:'',dob:'',city:'',bio:'',time:'',exp:'',emailConfirm:'',password:'',password2:'',terms:false});
  const upd=(k,v)=>setF(p=>({...p,[k]:v}));
  const err=(k,msg)=>setErrors(p=>({...p,[k]:msg}));
  const clr=k=>setErrors(p=>{const n={...p};delete n[k];return n;});
  const v1=()=>{let ok=true;if(!f.name){err('name','Please enter your full name.');ok=false;}else clr('name');if(!f.phone){err('phone','Please enter a valid phone number.');ok=false;}else clr('phone');if(!f.email||!f.email.includes('@')){err('email','Please enter a valid email address.');ok=false;}else clr('email');return ok;};
  const v2=()=>{if(skills.length===0){err('skills','Please select at least one skill.');return false;}clr('skills');return true;};
  const submit=()=>{let ok=true;if(f.emailConfirm!==f.email){err('ec','Email does not match.');ok=false;}else clr('ec');if(f.password.length<8){err('pw','Password must be at least 8 characters.');ok=false;}else clr('pw');if(f.password!==f.password2){err('pw2','Passwords do not match.');ok=false;}else clr('pw2');if(!f.terms){err('terms','You must agree to the terms.');ok=false;}else clr('terms');if(ok)setDone(true);};
  const go=n=>{if(n===2&&!v1())return;if(n===3&&!v2())return;setStep(n);if(n===3)upd('emailConfirm',f.email);window.scrollTo({top:0,behavior:'smooth'});};
  if(done)return(<div className="success-box"><span className="success-icon">🎉</span><div className="success-title">You're Registered!</div><p className="success-text">Welcome to VolunteerHub! Your volunteer account has been created. You can now log in and explore upcoming events.</p><div className="success-actions"><button className="btn-submit" onClick={()=>goTo('login')}><span>Go to Login →</span></button><button className="btn-cancel" onClick={()=>goTo('home')}>← Home</button></div></div>);
  return(<>
    <StepBar current={step} labels={['Personal Info','Skills & Availability','Account Setup']}/>
    <div className="form-card">
      {step===1&&(<>
        <div className="section-label">Step 1 of 3</div><div className="section-title">Personal Information</div>
        <div className="two-col">
          <div><label className="reg-label">Full Name <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">👤</span><input type="text" value={f.name} onChange={e=>{upd('name',e.target.value);clr('name');}} placeholder="John Doe"/></div>{errors.name&&<div className="field-error">{errors.name}</div>}</div>
          <div><label className="reg-label">Phone Number <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">📞</span><input type="tel" value={f.phone} onChange={e=>{upd('phone',e.target.value);clr('phone');}} placeholder="+91 555 000 0000"/></div>{errors.phone&&<div className="field-error">{errors.phone}</div>}</div>
          <div className="full"><label className="reg-label">Email Address <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">✉</span><input type="email" value={f.email} onChange={e=>{upd('email',e.target.value);clr('email');}} placeholder="you@example.com"/></div>{errors.email&&<div className="field-error">{errors.email}</div>}</div>
          <div><label className="reg-label">Date of Birth</label><div className="reg-input-wrap"><span className="icon">📅</span><input type="date" value={f.dob} onChange={e=>upd('dob',e.target.value)}/></div></div>
          <div><label className="reg-label">City / Location</label><div className="reg-input-wrap"><span className="icon">📍</span><input type="text" value={f.city} onChange={e=>upd('city',e.target.value)} placeholder="Your city"/></div></div>
          <div className="full"><label className="reg-label">Brief Bio / Motivation</label><textarea className="reg-ta" value={f.bio} onChange={e=>upd('bio',e.target.value)} placeholder="Tell us why you want to volunteer..."/></div>
        </div>
        <div className="form-actions"><button className="btn-cancel" onClick={()=>goTo('home')}>← Home</button><button className="btn-submit" onClick={()=>go(2)}><span>Next: Skills &amp; Availability →</span></button></div>
      </>)}
      {step===2&&(<>
        <div className="section-label">Step 2 of 3</div><div className="section-title">Skills &amp; Availability</div>
        <div style={{marginBottom:'1.8rem'}}><label className="reg-label">Select your Skills <span className="req">*</span></label><div className="skills-grid">{SKILLS.map(s=><div key={s} className={`skill-chip${skills.includes(s)?' selected':''}`} onClick={()=>{setSkills(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);clr('skills');}}>{s}</div>)}</div>{errors.skills&&<div className="field-error">{errors.skills}</div>}</div>
        <hr className="form-divider"/>
        <div style={{marginBottom:'1.8rem'}}><label className="reg-label">Days Available</label><div className="avail-grid">{DAYS.map(d=><div key={d} className={`day-chip${days.includes(d)?' selected':''}`} onClick={()=>setDays(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d])}>{d}</div>)}</div></div>
        <div className="two-col">
          <div><label className="reg-label">Preferred Time</label><select className="reg-sel" value={f.time} onChange={e=>upd('time',e.target.value)}><option value="">— Select —</option><option>Morning (6 AM – 12 PM)</option><option>Afternoon (12 PM – 5 PM)</option><option>Evening (5 PM – 9 PM)</option><option>Flexible</option></select></div>
          <div><label className="reg-label">Experience Level</label><select className="reg-sel" value={f.exp} onChange={e=>upd('exp',e.target.value)}><option value="">— Select —</option><option>First-time volunteer</option><option>Some experience (1–3 events)</option><option>Experienced (3+ events)</option></select></div>
        </div>
        <div className="form-actions"><button className="btn-cancel" onClick={()=>go(1)}>← Back</button><button className="btn-submit" onClick={()=>go(3)}><span>Next: Account Setup →</span></button></div>
      </>)}
      {step===3&&(<>
        <div className="section-label">Step 3 of 3</div><div className="section-title">Create Your Account</div>
        <div className="two-col">
          <div className="full"><label className="reg-label">Email Address <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">✉</span><input type="email" value={f.emailConfirm} onChange={e=>{upd('emailConfirm',e.target.value);clr('ec');}} placeholder="Confirm your email"/></div>{errors.ec&&<div className="field-error">{errors.ec}</div>}</div>
          <div><label className="reg-label">Password <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">🔒</span><input type="password" value={f.password} onChange={e=>{upd('password',e.target.value);clr('pw');}} placeholder="Create a password"/></div><PasswordStrength value={f.password}/>{errors.pw&&<div className="field-error">{errors.pw}</div>}</div>
          <div><label className="reg-label">Confirm Password <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">🔒</span><input type="password" value={f.password2} onChange={e=>{upd('password2',e.target.value);clr('pw2');}} placeholder="Repeat password"/></div>{errors.pw2&&<div className="field-error">{errors.pw2}</div>}</div>
        </div>
        <hr className="form-divider"/>
        <div style={{marginBottom:'1rem'}}><label className="terms-label"><input type="checkbox" checked={f.terms} onChange={e=>{upd('terms',e.target.checked);clr('terms');}} style={{width:16,height:16,accentColor:'var(--ink)'}}/>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>{errors.terms&&<div className="field-error">{errors.terms}</div>}</div>
        <div className="form-actions"><button className="btn-cancel" onClick={()=>go(2)}>← Back</button><button className="btn-submit" onClick={submit}><span>Complete Registration →</span></button></div>
      </>)}
    </div>
  </>);
}

/* ─── Admin Reg Form ─────────────────────────────────────────────────────── */
function AdminRegForm({goTo}){
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  const [errors,setErrors]=useState({});
  const [f,setF]=useState({name:'',phone:'',email:'',designation:'',dob:'',bio:'',org:'',orgType:'',city:'',website:'',code:'',emailConfirm:'',password:'',password2:'',terms:false});
  const upd=(k,v)=>setF(p=>({...p,[k]:v}));
  const err=(k,msg)=>setErrors(p=>({...p,[k]:msg}));
  const clr=k=>setErrors(p=>{const n={...p};delete n[k];return n;});
  const v1=()=>{let ok=true;if(!f.name){err('name','Please enter your full name.');ok=false;}else clr('name');if(!f.phone){err('phone','Please enter a valid phone number.');ok=false;}else clr('phone');if(!f.email||!f.email.includes('@')){err('email','Please enter a valid email address.');ok=false;}else clr('email');if(!f.designation){err('desig','Please enter your designation.');ok=false;}else clr('desig');return ok;};
  const v2=()=>{let ok=true;if(!f.org){err('org','Please enter your organisation name.');ok=false;}else clr('org');if(!f.orgType){err('ot','Please select organisation type.');ok=false;}else clr('ot');if(!f.city){err('city','Please enter your city.');ok=false;}else clr('city');const valid=f.code==='ADMHUB2025';if(!valid){err('code',f.code?'Invalid access code.':'Please enter the admin access code.');ok=false;}else clr('code');return ok;};
  const submit=()=>{let ok=true;if(f.emailConfirm!==f.email){err('ec','Email does not match.');ok=false;}else clr('ec');if(f.password.length<8){err('pw','Password must be at least 8 characters.');ok=false;}else clr('pw');if(f.password!==f.password2){err('pw2','Passwords do not match.');ok=false;}else clr('pw2');if(!f.terms){err('terms','You must agree to the terms.');ok=false;}else clr('terms');if(ok)setDone(true);};
  const go=n=>{if(n===2&&!v1())return;if(n===3&&!v2())return;setStep(n);if(n===3)upd('emailConfirm',f.email);window.scrollTo({top:0,behavior:'smooth'});};
  if(done)return(<div className="success-box"><span className="success-icon">🛡</span><div className="success-title">Admin Account Created!</div><p className="success-text">Your admin account has been registered. You can now log in to access the Admin Panel.</p><div className="success-actions"><button className="btn-submit" onClick={()=>goTo('login')}><span>Go to Login →</span></button><a href="admin.html" className="btn-cancel">⚙ Admin Panel</a><button className="btn-cancel" onClick={()=>goTo('home')}>← Home</button></div></div>);
  return(<>
    <StepBar current={step} labels={['Admin Info','Organisation','Account Setup']}/>
    <div className="form-card admin-stripe">
      {step===1&&(<>
        <div className="admin-badge">🛡 Admin / Coordinator Registration</div>
        <div className="section-label">Step 1 of 3</div><div className="section-title">Admin Information</div>
        <div className="two-col">
          <div><label className="reg-label">Full Name <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">👤</span><input type="text" value={f.name} onChange={e=>{upd('name',e.target.value);clr('name');}} placeholder="Jane Smith"/></div>{errors.name&&<div className="field-error">{errors.name}</div>}</div>
          <div><label className="reg-label">Phone Number <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">📞</span><input type="tel" value={f.phone} onChange={e=>{upd('phone',e.target.value);clr('phone');}} placeholder="+91 555 000 0000"/></div>{errors.phone&&<div className="field-error">{errors.phone}</div>}</div>
          <div className="full"><label className="reg-label">Official Email <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">✉</span><input type="email" value={f.email} onChange={e=>{upd('email',e.target.value);clr('email');}} placeholder="admin@organisation.com"/></div>{errors.email&&<div className="field-error">{errors.email}</div>}</div>
          <div><label className="reg-label">Designation <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">🏷</span><input type="text" value={f.designation} onChange={e=>{upd('designation',e.target.value);clr('desig');}} placeholder="e.g. Event Coordinator"/></div>{errors.desig&&<div className="field-error">{errors.desig}</div>}</div>
          <div><label className="reg-label">Date of Birth</label><div className="reg-input-wrap"><span className="icon">📅</span><input type="date" value={f.dob} onChange={e=>upd('dob',e.target.value)}/></div></div>
          <div className="full"><label className="reg-label">Brief Introduction</label><textarea className="reg-ta" value={f.bio} onChange={e=>upd('bio',e.target.value)} placeholder="Tell us about your role and responsibilities..."/></div>
        </div>
        <div className="form-actions"><button className="btn-cancel" onClick={()=>goTo('home')}>← Home</button><button className="btn-submit" onClick={()=>go(2)}><span>Next: Organisation →</span></button></div>
      </>)}
      {step===2&&(<>
        <div className="admin-badge">🛡 Admin / Coordinator Registration</div>
        <div className="section-label">Step 2 of 3</div><div className="section-title">Organisation Details</div>
        <div className="two-col">
          <div className="full"><label className="reg-label">Organisation Name <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">🏢</span><input type="text" value={f.org} onChange={e=>{upd('org',e.target.value);clr('org');}} placeholder="e.g. City Volunteer Network"/></div>{errors.org&&<div className="field-error">{errors.org}</div>}</div>
          <div><label className="reg-label">Organisation Type <span className="req">*</span></label><select className="reg-sel" value={f.orgType} onChange={e=>{upd('orgType',e.target.value);clr('ot');}}><option value="">— Select —</option><option>NGO / Non-Profit</option><option>Government Body</option><option>Educational Institution</option><option>Corporate CSR</option><option>Community Group</option><option>Other</option></select>{errors.ot&&<div className="field-error">{errors.ot}</div>}</div>
          <div><label className="reg-label">City <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">📍</span><input type="text" value={f.city} onChange={e=>{upd('city',e.target.value);clr('city');}} placeholder="Your city"/></div>{errors.city&&<div className="field-error">{errors.city}</div>}</div>
          <div className="full"><label className="reg-label">Website / Social Link</label><div className="reg-input-wrap"><span className="icon">🌐</span><input type="text" value={f.website} onChange={e=>upd('website',e.target.value)} placeholder="https://yourorganisation.com"/></div></div>
          <div className="full"><label className="reg-label">Admin Access Code <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">🔑</span><input type="password" value={f.code} onChange={e=>{upd('code',e.target.value);clr('code');}} placeholder="Enter the admin access code"/></div>{errors.code&&<div className="field-error">{errors.code}</div>}<div style={{fontSize:'.75rem',color:'#888',marginTop:'.4rem'}}>Demo code: <strong>ADMHUB2025</strong></div></div>
        </div>
        <div className="form-actions"><button className="btn-cancel" onClick={()=>go(1)}>← Back</button><button className="btn-submit" onClick={()=>go(3)}><span>Next: Account Setup →</span></button></div>
      </>)}
      {step===3&&(<>
        <div className="admin-badge">🛡 Admin / Coordinator Registration</div>
        <div className="section-label">Step 3 of 3</div><div className="section-title">Create Admin Account</div>
        <div className="two-col">
          <div className="full"><label className="reg-label">Email Address <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">✉</span><input type="email" value={f.emailConfirm} onChange={e=>{upd('emailConfirm',e.target.value);clr('ec');}} placeholder="Confirm your email"/></div>{errors.ec&&<div className="field-error">{errors.ec}</div>}</div>
          <div><label className="reg-label">Password <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">🔒</span><input type="password" value={f.password} onChange={e=>{upd('password',e.target.value);clr('pw');}} placeholder="Create a strong password"/></div><PasswordStrength value={f.password}/>{errors.pw&&<div className="field-error">{errors.pw}</div>}</div>
          <div><label className="reg-label">Confirm Password <span className="req">*</span></label><div className="reg-input-wrap"><span className="icon">🔒</span><input type="password" value={f.password2} onChange={e=>{upd('password2',e.target.value);clr('pw2');}} placeholder="Repeat password"/></div>{errors.pw2&&<div className="field-error">{errors.pw2}</div>}</div>
        </div>
        <hr className="form-divider"/>
        <div style={{marginBottom:'1rem'}}><label className="terms-label"><input type="checkbox" checked={f.terms} onChange={e=>{upd('terms',e.target.checked);clr('terms');}} style={{width:16,height:16,accentColor:'var(--ink)'}}/>I agree to the <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a> and <a href="#">Admin Code of Conduct</a></label>{errors.terms&&<div className="field-error">{errors.terms}</div>}</div>
        <div className="form-actions"><button className="btn-cancel" onClick={()=>go(2)}>← Back</button><button className="btn-submit" onClick={submit}><span>Complete Admin Registration →</span></button></div>
      </>)}
    </div>
  </>);
}

/* ─── Register Page ──────────────────────────────────────────────────────── */
function RegisterPage({goTo}){
  const [regRole,setRegRole]=useState('volunteer');
  return(
    <div>
      <div className="topbar">
        <a className="brand-lg" onClick={()=>goTo('home')} style={{cursor:'none'}}>Volunteer<span>Hub</span></a>
        <div className="topbar-right">
          <a className="topbar-link" onClick={()=>goTo('login')}>Already registered? Sign in →</a>
          <a href="admin.html" className="topbar-admin">⚙ Admin Panel</a>
        </div>
      </div>
      <div className="page-wrap">
        <div className="role-select-wrap">
          <span className="role-select-label">Register as</span>
          <div className="role-toggle">
            <button className={`role-btn${regRole==='volunteer'?' active':''}`} onClick={()=>setRegRole('volunteer')}>🙋 Volunteer</button>
            <button className={`role-btn${regRole==='admin'?' active':''}`} onClick={()=>setRegRole('admin')}>🛡 Admin / Coordinator</button>
          </div>
        </div>
        {regRole==='volunteer'?<VolunteerForm goTo={goTo}/>:<AdminRegForm goTo={goTo}/>}
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────── */
export default function VolunteerHub() {
  const [page, setPage] = useState('home');
  const goTo = useCallback(p => { setPage(p); window.scrollTo(0,0); }, []);

  useEffect(() => {
    const id = 'vh-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <>
      <Cursor/>
      {page==='home'     && <HomePage     goTo={goTo}/>}
      {page==='login'    && <LoginPage    goTo={goTo}/>}
      {page==='register' && <RegisterPage goTo={goTo}/>}
    </>
  );
}
