import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Google Fonts injected once ─────────────────────────────────────── */
const FontLoader = () => {
  useEffect(() => {
    if (!document.getElementById("vh-fonts")) {
      const l = document.createElement("link");
      l.id = "vh-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500&display=swap";
      document.head.appendChild(l);
    }
  }, []);
  return null;
};

/* ─── CSS Variables & global reset injected once ─────────────────────── */
const GlobalStyle = () => {
  useEffect(() => {
    if (!document.getElementById("vh-global")) {
      const s = document.createElement("style");
      s.id = "vh-global";
      s.textContent = `
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --ink:#0f1117;--cream:#f5f0e8;--gold:#c9a84c;
          --rust:#b5451b;--sage:#4a6741;--white:#fdfcf9;--error:#c0392b;
        }
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--ink);overflow-x:hidden}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
      `;
      document.head.appendChild(s);
    }
  }, []);
  return null;
};

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: HOME (index)
═══════════════════════════════════════════════════════════════════════ */
const HomePage = ({ navigate }) => {
  const [navShadow, setNavShadow] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackView, setFeedbackView] = useState("form"); // form | denied | success
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const featureRefs = useRef([]);
  const SESSION_ROLE = "coordinator"; // change to test: 'volunteer'

  useEffect(() => {
    const onScroll = () => setNavShadow(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Feature fade-in
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
          }
        }),
      { threshold: 0.15 }
    );
    featureRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const openFeedback = (e) => {
    e.preventDefault();
    setFeedbackView(
      SESSION_ROLE === "admin" || SESSION_ROLE === "coordinator"
        ? "form"
        : "denied"
    );
    setRating(0);
    setFeedbackOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFeedback = () => {
    setFeedbackOpen(false);
    document.body.style.overflow = "";
  };

  const events = [
    { date: "May 12, 2025", name: "City Clean-Up Drive", venue: "📍 Riverside Park, Block C", time: "🕗 8:00 AM – 12:00 PM", slots: "👥 24 slots open" },
    { date: "May 18, 2025", name: "Youth Literacy Camp", venue: "📍 Community Hall, Sector 7", time: "🕗 9:00 AM – 5:00 PM", slots: "👥 12 slots open" },
    { date: "May 25, 2025", name: "Blood Donation Camp", venue: "📍 Civil Hospital, Main Gate", time: "🕗 10:00 AM – 4:00 PM", slots: "👥 8 slots open" },
  ];

  const features = [
    { icon: "📋", title: "Smart Scheduling", text: "Assign volunteers to shifts and roles automatically based on availability and skill sets." },
    { icon: "📊", title: "Attendance Tracking", text: "Real-time check-in and attendance records for every event, shift, and assignment." },
    { icon: "⭐", title: "Performance Reviews", text: "Coordinators can provide feedback and ratings to recognize outstanding volunteer work." },
  ];

  const s = {
    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1.2rem 4rem",
      background: "rgba(245,240,232,0.93)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(201,168,76,0.25)",
      boxShadow: navShadow ? "0 2px 20px rgba(15,17,23,0.08)" : "none",
      transition: "box-shadow 0.3s",
    },
    navLogo: { fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.5px", cursor: "pointer", textDecoration: "none" },
    navLinks: { display: "flex", gap: "2.2rem", alignItems: "center" },
    navA: { textDecoration: "none", color: "var(--ink)", fontSize: "0.9rem", fontWeight: 500 },
    btnNav: { padding: "0.55rem 1.4rem", border: "1.5px solid var(--ink)", background: "transparent", color: "var(--ink)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", borderRadius: 2, textDecoration: "none" },
    btnNavAdmin: { padding: "0.55rem 1.4rem", border: "1.5px solid var(--gold)", background: "transparent", color: "var(--gold)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", borderRadius: 2, textDecoration: "none" },
    hero: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 80, overflow: "hidden" },
    heroLeft: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "6rem 4rem", position: "relative", zIndex: 2, maxWidth: 700 },
    heroTag: { display: "inline-flex", alignItems: "center", gap: "0.6rem", fontSize: "0.75rem", fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", color: "var(--rust)", marginBottom: "1.8rem", animation: "fadeUp 0.7s ease both" },
    h1: { fontFamily: "'Playfair Display',serif", fontSize: "clamp(3rem,5vw,4.8rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -1, marginBottom: "1.6rem", animation: "fadeUp 0.7s ease 0.1s both" },
    heroDesc: { fontSize: "1.05rem", lineHeight: 1.75, color: "#444", maxWidth: 460, marginBottom: "3rem", fontWeight: 300, animation: "fadeUp 0.7s ease 0.2s both" },
    heroActions: { display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", width: "100%", animation: "fadeUp 0.7s ease 0.3s both" },
    btnPrimary: { padding: "0.9rem 2.2rem", background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 2, fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", textDecoration: "none", display: "inline-block", width: 280, textAlign: "center" },
    btnSecondary: { padding: "0.9rem 2.2rem", background: "transparent", color: "var(--ink)", border: "1.5px solid var(--ink)", borderRadius: 2, fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", textDecoration: "none", display: "inline-block", width: 280, textAlign: "center" },
    btnOutlineGold: { padding: "0.9rem 2.2rem", background: "transparent", color: "var(--gold)", border: "1.5px solid var(--gold)", borderRadius: 2, fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", textDecoration: "none", display: "inline-block", width: 280, textAlign: "center" },
    features: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid rgba(15,17,23,0.1)", borderBottom: "1px solid rgba(15,17,23,0.1)" },
    featureItem: (i) => ({ padding: "3.5rem 3rem", borderRight: i < 2 ? "1px solid rgba(15,17,23,0.1)" : "none", transition: "background 0.3s", opacity: 0, transform: "translateY(18px)", transitionDelay: `${i * 0.12}s` }),
    adminBanner: { margin: "0 6rem", padding: "1.8rem 3rem", background: "linear-gradient(135deg,var(--ink) 0%,#1a1d27 100%)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem" },
    eventsSection: { padding: "7rem 6rem" },
    sectionHeader: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3.5rem" },
    eventsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5px", background: "rgba(15,17,23,0.1)" },
    footer: { background: "#0a0b0e", color: "rgba(245,240,232,0.4)", padding: "3rem 6rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
    modalOverlay: { position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,17,23,0.7)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center" },
    modalBox: { background: "var(--cream)", width: "100%", maxWidth: 520, padding: "3rem", position: "relative", animation: "fadeUp 0.3s ease both" },
  };

  return (
    <>
      {/* NAV */}
      <nav style={s.nav}>
        <span style={s.navLogo} onClick={() => navigate("home")}>
          Volunteer<span style={{ color: "var(--gold)" }}>Hub</span>
        </span>
        <div style={s.navLinks}>
          <a href="#events" style={s.navA}>Events</a>
          <a href="#" style={s.navA} onClick={openFeedback}>Feedback</a>
          <span style={{ ...s.navA, cursor: "pointer" }} onClick={() => navigate("login")}>Login</span>
          <span style={s.btnNav} onClick={() => navigate("register")}>Register</span>
          <span style={s.btnNavAdmin} onClick={() => navigate("admin")}>⚙ Admin Panel</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroLeft}>
          <div style={s.heroTag}>Volunteer Management System</div>
          <h1 style={s.h1}>
            Make a<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>Difference</em><br />Together
          </h1>
          <p style={s.heroDesc}>
            Connect passionate volunteers with meaningful events. Streamline scheduling, track attendance, and build a community that cares.
          </p>
          <div style={s.heroActions}>
            <span style={s.btnPrimary} onClick={() => navigate("login")}>Login to Dashboard</span>
            <span style={s.btnSecondary} onClick={() => navigate("register")}>Register as Volunteer</span>
            <a href="#events" style={s.btnOutlineGold}>View Events</a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div style={s.features}>
        {features.map((f, i) => (
          <div
            key={i}
            ref={(el) => { featureRefs.current[i] = el; if (el) { el.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`; } }}
            style={s.featureItem(i)}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(201,168,76,0.06)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: "2rem", marginBottom: "1.2rem", display: "block" }}>{f.icon}</span>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.7rem" }}>{f.title}</div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#555", fontWeight: 300 }}>{f.text}</p>
          </div>
        ))}
      </div>

      {/* ADMIN BANNER */}
      <div style={s.adminBanner}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 900, color: "var(--cream)", marginBottom: "0.3rem" }}>⚙ Admin / Coordinator Panel</h3>
          <p style={{ fontSize: "0.85rem", color: "rgba(245,240,232,0.45)", fontWeight: 300 }}>Manage volunteers, events, roles, shifts, assignments, attendance and feedback from one place.</p>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", flexShrink: 0 }}>
          <span style={s.btnPrimary} onClick={() => navigate("admin")}>Open Admin Panel →</span>
          <span style={s.btnOutlineGold} onClick={() => navigate("login")}>Login First</span>
        </div>
      </div>

      {/* EVENTS */}
      <section style={s.eventsSection} id="events">
        <div style={s.sectionHeader}>
          <div>
            <span style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "block" }}>Upcoming</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.4rem", fontWeight: 900, lineHeight: 1.15 }}>Events Open<br />for Volunteers</h2>
          </div>
          <span style={{ ...s.btnSecondary, cursor: "pointer" }} onClick={() => navigate("admin")}>See All Events</span>
        </div>
        <div style={s.eventsGrid}>
          {events.map((ev, i) => (
            <EventCard key={i} ev={ev} onClick={() => navigate("admin")} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 900, color: "var(--cream)" }}>
          Volunteer<span style={{ color: "var(--gold)" }}>Hub</span>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          {[["Home", "home"], ["Login", "login"], ["Register", "register"], ["Admin Panel", "admin"]].map(([label, page]) => (
            <span key={page} style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.4)", cursor: "pointer" }} onClick={() => navigate(page)}>{label}</span>
          ))}
        </div>
        <div style={{ fontSize: "0.8rem" }}>© 2025 VolunteerHub. All rights reserved.</div>
      </footer>

      {/* FEEDBACK MODAL */}
      {feedbackOpen && (
        <div style={s.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) closeFeedback(); }}>
          <div style={s.modalBox}>
            <button onClick={closeFeedback} style={{ position: "absolute", top: "1.2rem", right: "1.5rem", background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--ink)" }}>✕</button>

            {feedbackView === "denied" && (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <span style={{ fontSize: "2.5rem", marginBottom: "1rem", display: "block" }}>🔒</span>
                <span style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.6rem", display: "block" }}>Restricted Access</span>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 900, marginBottom: "1.8rem" }}>Access Denied</div>
                <p style={{ fontSize: "0.9rem", color: "#666", fontWeight: 300, lineHeight: 1.7 }}>
                  The <strong style={{ color: "var(--rust)" }}>Feedback</strong> feature is only available to <strong style={{ color: "var(--rust)" }}>Event Coordinators</strong> and <strong style={{ color: "var(--rust)" }}>Admins</strong>.<br /><br />
                  Volunteers are not permitted to submit feedback. Please contact your coordinator if you have concerns.
                </p>
              </div>
            )}

            {feedbackView === "form" && (
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.6rem", display: "block" }}>Coordinator / Admin Only</span>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 900, marginBottom: "1.8rem" }}>Submit Feedback</div>
                <ModalSelect label="Select Event" options={["City Clean-Up Drive (May 12)", "Youth Literacy Camp (May 18)", "Blood Donation Camp (May 25)"]} />
                <ModalSelect label="Select Volunteer" options={["Alice Johnson", "Bob Martinez", "Carol Singh", "David Lee"]} />
                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--ink)" }}>Rating</label>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} style={{ fontSize: "1.6rem", cursor: "pointer", color: n <= (hoverRating || rating) ? "var(--gold)" : "rgba(15,17,23,0.2)", transition: "color 0.15s" }}
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}>★</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--ink)" }}>Feedback Comments</label>
                  <textarea placeholder="Write your feedback about the volunteer's performance…" style={{ width: "100%", padding: "0.7rem 0.9rem", border: "1.5px solid rgba(15,17,23,0.18)", background: "var(--white)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "var(--ink)", borderRadius: 2, outline: "none", resize: "vertical", minHeight: 110 }} />
                </div>
                <button onClick={() => setFeedbackView("success")} style={{ marginTop: "1.6rem", width: "100%", padding: "0.9rem", background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 2, fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer" }}>
                  Submit Feedback
                </button>
              </div>
            )}

            {feedbackView === "success" && (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <span style={{ fontSize: "2.5rem", marginBottom: "1rem", display: "block" }}>✅</span>
                <span style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.6rem", display: "block" }}>Submitted</span>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 900, marginBottom: "1.8rem" }}>Feedback Sent!</div>
                <p style={{ fontSize: "0.9rem", color: "#555", fontWeight: 300, lineHeight: 1.7 }}>Your feedback has been recorded successfully. The volunteer will be notified by their coordinator.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const EventCard = ({ ev, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "var(--ink)" : "var(--cream)", color: hovered ? "var(--cream)" : "inherit", padding: "2.5rem 2rem", transition: "background 0.3s, transform 0.3s", transform: hovered ? "translateY(-3px)" : "none", cursor: "pointer" }}>
      <div style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: hovered ? "var(--gold)" : "var(--rust)", marginBottom: "1rem", fontWeight: 500 }}>{ev.date}</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.7rem", lineHeight: 1.25 }}>{ev.name}</div>
      <div style={{ fontSize: "0.85rem", color: hovered ? "rgba(245,240,232,0.6)" : "#666", marginBottom: "1.5rem", fontWeight: 300 }}>{ev.venue}</div>
      <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: hovered ? "rgba(245,240,232,0.6)" : "#888" }}>
        <span>{ev.time}</span><span>{ev.slots}</span>
      </div>
    </div>
  );
};

const ModalSelect = ({ label, options }) => (
  <div style={{ marginBottom: "1.2rem" }}>
    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, marginBottom: "0.4rem", color: "var(--ink)" }}>{label}</label>
    <select style={{ width: "100%", padding: "0.7rem 0.9rem", border: "1.5px solid rgba(15,17,23,0.18)", background: "var(--white)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "var(--ink)", borderRadius: 2, outline: "none" }}>
      <option value="">— Choose —</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: LOGIN
═══════════════════════════════════════════════════════════════════════ */
const LoginPage = ({ navigate }) => {
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
    if (role === "admin" && email === "admin@hub.com" && password === "admin123") { navigate("admin"); return; }
    if (role === "volunteer" && email === "vol@hub.com" && password === "vol123") { navigate("home"); return; }
    setError("⚠ Invalid credentials. Please check your email and password.");
  };

  const s = {
    wrap: { fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", display: "flex", background: "var(--ink)", color: "var(--ink)", overflow: "hidden" },
    left: { width: "45%", background: "var(--ink)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "3.5rem 4rem", position: "relative", overflow: "hidden" },
    right: { flex: 1, background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem" },
    box: { width: "100%", maxWidth: 420, animation: "slideIn 0.5s ease both" },
    roleToggle: { display: "grid", gridTemplateColumns: "1fr 1fr", border: "1.5px solid rgba(15,17,23,0.15)", borderRadius: 3, marginBottom: "2rem", overflow: "hidden" },
    input: { width: "100%", padding: "0.85rem 1rem 0.85rem 2.8rem", border: "1.5px solid rgba(15,17,23,0.15)", background: "var(--white)", color: "var(--ink)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", borderRadius: 2, outline: "none" },
  };

  return (
    <div style={s.wrap}>
      {/* LEFT PANEL */}
      <div style={s.left}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 50%,rgba(201,168,76,0.08),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", cursor: "pointer", position: "relative", zIndex: 1 }} onClick={() => navigate("home")}>
          <div style={{ width: 32, height: 32, border: "1px solid rgba(245,240,232,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cream)", fontSize: "0.9rem" }}>←</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 900, color: "var(--cream)", letterSpacing: "-0.5px" }}>Volunteer<span style={{ color: "var(--gold)" }}>Hub</span></div>
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.6rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.15, marginBottom: "1.5rem" }}>
            Welcome<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>back,</em><br />changemaker.
          </div>
          <p style={{ fontSize: "0.9rem", color: "rgba(245,240,232,0.45)", lineHeight: 1.75, fontWeight: 300, maxWidth: 340 }}>
            Your dashboard awaits. Manage events, assign volunteers, and track the impact your team is making every day.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, marginTop: "3rem" }}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i} style={{ height: 8, background: i % 3 === 2 ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.15)", borderRadius: 1, animation: `pulse 2s ease-in-out ${i % 2 ? "0.3s" : "0s"} infinite` }} />
            ))}
          </div>
          <div style={{ marginTop: "2rem", padding: "1rem 1.2rem", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6, background: "rgba(201,168,76,0.05)" }}>
            <p style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--gold)" }}>Admin</strong> → Redirects to Admin Panel<br />
              <strong style={{ color: "var(--gold)" }}>Volunteer</strong> → Redirects to Home Page<br />
              Demo: <strong style={{ color: "var(--gold)" }}>admin@hub.com / admin123</strong><br />
              Demo: <strong style={{ color: "var(--gold)" }}>vol@hub.com / vol123</strong>
            </p>
          </div>
        </div>
        <div style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.25)" }}>© 2025 VolunteerHub · All rights reserved</div>
      </div>

      {/* RIGHT PANEL */}
      <div style={s.right}>
        <div style={s.box}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", fontWeight: 900, marginBottom: "0.4rem" }}>Sign In</h1>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "2.5rem", fontWeight: 300 }}>
            New here? <span style={{ color: "var(--rust)", cursor: "pointer", fontWeight: 500 }} onClick={() => navigate("register")}>Create a volunteer account →</span>
          </p>

          <div style={s.roleToggle}>
            {[["admin", "🛡 Admin / Coordinator"], ["volunteer", "🙋 Volunteer"]].map(([r, label]) => (
              <button key={r} onClick={() => { setRole(r); setError(""); setEmail(""); setPassword(""); }}
                style={{ padding: "0.75rem 1rem", textAlign: "center", background: role === r ? "var(--ink)" : "transparent", color: role === r ? "var(--cream)" : "#888", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", padding: "0.75rem 1rem", borderRadius: 4, fontSize: "0.78rem", color: "#665a2a", marginBottom: "1.4rem", lineHeight: 1.6 }}>
            {hints[role]}
          </div>

          {error && (
            <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)", color: "var(--error)", padding: "0.8rem 1rem", borderRadius: 2, fontSize: "0.85rem", marginBottom: "1.2rem", animation: "shake 0.4s ease" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: "1.4rem" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "0.5rem", color: "#444" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem", color: "#aaa" }}>✉</span>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" style={s.input} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            </div>
          </div>

          <div style={{ marginBottom: "0" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "0.5rem", color: "#444" }}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem", color: "#aaa" }}>🔒</span>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Enter your password" style={s.input} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem", marginBottom: "1.6rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--rust)", cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
          </div>

          <button onClick={handleLogin} style={{ width: "100%", padding: "1rem", background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 2, fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", fontWeight: 500, cursor: "pointer" }}>
            Sign In →
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.8rem 0", color: "#bbb", fontSize: "0.8rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(15,17,23,0.1)" }} />quick links<div style={{ flex: 1, height: 1, background: "rgba(15,17,23,0.1)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem", marginBottom: "1.4rem" }}>
            {[["🏠 Home", "home"], ["📝 Register", "register"], ["⚙ Admin", "admin"]].map(([label, page]) => (
              <span key={page} onClick={() => navigate(page)} style={{ padding: "0.6rem 0.5rem", textAlign: "center", borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(15,17,23,0.12)", color: "var(--ink)", cursor: "pointer", display: "block" }}>{label}</span>
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: "0.88rem", color: "#666" }}>
            Don't have an account? <span style={{ color: "var(--ink)", fontWeight: 600, cursor: "pointer", borderBottom: "1.5px solid var(--gold)", paddingBottom: 1 }} onClick={() => navigate("register")}>Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: REGISTER
═══════════════════════════════════════════════════════════════════════ */
const RegisterPage = ({ navigate }) => {
  const [regRole, setRegRole] = useState("volunteer");
  // Volunteer state
  const [vStep, setVStep] = useState(1);
  const [vData, setVData] = useState({ name: "", phone: "", email: "", dob: "", city: "", bio: "", timeSlot: "", experience: "", emailConfirm: "", password: "", password2: "", terms: false });
  const [vSkills, setVSkills] = useState([]);
  const [vDays, setVDays] = useState([]);
  const [vErrors, setVErrors] = useState({});
  const [vSuccess, setVSuccess] = useState(false);
  const [vStrength, setVStrength] = useState({ w: "0%", c: "#e74c3c", t: "Enter a password" });
  // Admin state
  const [aStep, setAStep] = useState(1);
  const [aData, setAData] = useState({ name: "", phone: "", email: "", designation: "", dob: "", bio: "", org: "", orgType: "", city: "", website: "", code: "", emailConfirm: "", password: "", password2: "", terms: false });
  const [aErrors, setAErrors] = useState({});
  const [aSuccess, setASuccess] = useState(false);
  const [aStrength, setAStrength] = useState({ w: "0%", c: "#e74c3c", t: "Enter a password" });

  const SKILLS = ["🎤 Public Speaking", "🏥 First Aid", "💻 Tech / IT", "🎨 Design", "📷 Photography", "🍳 Cooking", "🚗 Driving", "📚 Teaching", "🌐 Translation", "🎵 Music", "⚽ Sports", "🔧 Logistics"];
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const calcStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const lvls = [{ w: "0%", c: "#e74c3c", t: "Too short" }, { w: "25%", c: "#e67e22", t: "Weak" }, { w: "50%", c: "#f1c40f", t: "Fair" }, { w: "75%", c: "#3498db", t: "Good" }, { w: "100%", c: "#27ae60", t: "Strong ✓" }];
    return lvls[score];
  };

  // VOLUNTEER STEPS
  const goVStep = (n) => {
    if (n === 2 && !validateV1()) return;
    if (n === 3 && !validateV2()) return;
    if (n === 3) setVData((d) => ({ ...d, emailConfirm: d.email }));
    setVStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateV1 = () => {
    const e = {};
    if (!vData.name.trim()) e.name = "Please enter your full name.";
    if (!vData.phone.trim()) e.phone = "Please enter a valid phone number.";
    if (!vData.email.trim() || !vData.email.includes("@")) e.email = "Please enter a valid email address.";
    setVErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateV2 = () => {
    const e = {};
    if (vSkills.length === 0) e.skills = "Please select at least one skill.";
    setVErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitVol = () => {
    const e = {};
    if (vData.emailConfirm !== vData.email) e.emailConfirm = "Email does not match.";
    if (vData.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (vData.password !== vData.password2) e.password2 = "Passwords do not match.";
    if (!vData.terms) e.terms = "You must agree to the terms.";
    setVErrors(e);
    if (Object.keys(e).length > 0) return;
    setVSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ADMIN STEPS
  const goAStep = (n) => {
    if (n === 2 && !validateA1()) return;
    if (n === 3 && !validateA2()) return;
    if (n === 3) setAData((d) => ({ ...d, emailConfirm: d.email }));
    setAStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateA1 = () => {
    const e = {};
    if (!aData.name.trim()) e.name = "Please enter your full name.";
    if (!aData.phone.trim()) e.phone = "Please enter a valid phone number.";
    if (!aData.email.trim() || !aData.email.includes("@")) e.email = "Please enter a valid email address.";
    if (!aData.designation.trim()) e.designation = "Please enter your designation.";
    setAErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateA2 = () => {
    const e = {};
    if (!aData.org.trim()) e.org = "Please enter your organisation name.";
    if (!aData.orgType) e.orgType = "Please select organisation type.";
    if (!aData.city.trim()) e.city = "Please enter your city.";
    if (aData.code !== "ADMHUB2025") e.code = aData.code ? "Invalid access code." : "Please enter the admin access code.";
    setAErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitAdmin = () => {
    const e = {};
    if (aData.emailConfirm !== aData.email) e.emailConfirm = "Email does not match.";
    if (aData.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (aData.password !== aData.password2) e.password2 = "Passwords do not match.";
    if (!aData.terms) e.terms = "You must agree to the terms.";
    setAErrors(e);
    if (Object.keys(e).length > 0) return;
    setASuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputStyle = { width: "100%", padding: "0.82rem 1rem 0.82rem 2.6rem", border: "1.5px solid rgba(15,17,23,0.12)", background: "var(--cream)", color: "var(--ink)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.93rem", borderRadius: 2, outline: "none", WebkitAppearance: "none", appearance: "none" };
  const inputNoIcon = { ...inputStyle, paddingLeft: "1rem" };
  const labelStyle = { display: "block", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "0.5rem", color: "#555" };
  const errStyle = { fontSize: "0.75rem", color: "var(--error)", marginTop: "0.35rem" };
  const twoCol = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" };

  const StepIndicator = ({ steps, current, prefix = "" }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "3.5rem" }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const active = current === n;
        const done = current > n;
        return (
          <React.Fragment key={n}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase", color: done ? "var(--sage)" : active ? "var(--ink)" : "#aaa" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${done ? "var(--sage)" : active ? "var(--ink)" : "#aaa"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600, background: done ? "var(--sage)" : active ? "var(--ink)" : "transparent", color: done || active ? "var(--cream)" : "inherit" }}>{done ? "✓" : n}</div>
              <span>{label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 60, height: 1, background: "rgba(15,17,23,0.15)", margin: "0 0.5rem" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );

  const FormCard = ({ children, isAdmin }) => (
    <div style={{ background: "var(--white)", border: "1px solid rgba(15,17,23,0.1)", padding: "3.5rem 4rem", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: isAdmin ? "linear-gradient(90deg,var(--gold),#8b5cf6)" : "linear-gradient(90deg,var(--gold),var(--rust))" }} />
      {children}
    </div>
  );

  const InputWrap = ({ icon, children }) => (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", pointerEvents: "none", color: "#bbb" }}>{icon}</span>
      {children}
    </div>
  );

  const StrengthBar = ({ strength }) => (
    <>
      <div style={{ height: 3, borderRadius: 2, marginTop: "0.5rem", background: "rgba(15,17,23,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: strength.w, background: strength.c, borderRadius: 2, transition: "width 0.4s, background 0.4s" }} />
      </div>
      <div style={{ fontSize: "0.73rem", color: strength.c, marginTop: "0.3rem" }}>{strength.t}</div>
    </>
  );

  const BtnSubmit = ({ onClick, children }) => (
    <button onClick={onClick} style={{ padding: "0.9rem 2.5rem", background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 2, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 500 }}><span>{children}</span></button>
  );
  const BtnCancel = ({ onClick, children }) => (
    <button onClick={onClick} style={{ padding: "0.9rem 1.8rem", background: "transparent", color: "#666", border: "1.5px solid rgba(15,17,23,0.15)", borderRadius: 2, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem" }}>{children}</button>
  );

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "var(--cream)", color: "var(--ink)", minHeight: "100vh" }}>
      {/* TOPBAR */}
      <div style={{ background: "var(--ink)", padding: "1.1rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 900, color: "var(--cream)", cursor: "pointer" }} onClick={() => navigate("home")}>
          Volunteer<span style={{ color: "var(--gold)" }}>Hub</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "rgba(245,240,232,0.55)", cursor: "pointer" }} onClick={() => navigate("login")}>Already registered? Sign in →</span>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--gold)", border: "1px solid rgba(201,168,76,0.35)", padding: "0.35rem 0.9rem", borderRadius: 3, cursor: "pointer" }} onClick={() => navigate("admin")}>⚙ Admin Panel</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        {/* ROLE SELECTOR */}
        <div style={{ marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "block", fontWeight: 500 }}>Register as</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1.5px solid rgba(15,17,23,0.15)", borderRadius: 3, overflow: "hidden" }}>
            {[["volunteer", "🙋 Volunteer"], ["admin", "🛡 Admin / Coordinator"]].map(([r, label]) => (
              <button key={r} onClick={() => setRegRole(r)} style={{ padding: "0.85rem 1rem", textAlign: "center", background: regRole === r ? "var(--ink)" : "transparent", color: regRole === r ? "var(--cream)" : "#888", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer" }}>{label}</button>
            ))}
          </div>
        </div>

        {/* ── VOLUNTEER FORM ── */}
        {regRole === "volunteer" && (
          <>
            <StepIndicator steps={["Personal Info", "Skills & Availability", "Account Setup"]} current={vStep} />
            <FormCard>
              {vSuccess ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                  <span style={{ fontSize: "4rem", marginBottom: "1.5rem", display: "block" }}>🎉</span>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", fontWeight: 900, marginBottom: "1rem" }}>You're Registered!</div>
                  <p style={{ fontSize: "0.95rem", color: "#666", maxWidth: 380, margin: "0 auto 2rem", lineHeight: 1.7 }}>Welcome to VolunteerHub! Your volunteer account has been created. You can now log in and explore upcoming events.</p>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <BtnSubmit onClick={() => navigate("login")}>Go to Login →</BtnSubmit>
                    <BtnCancel onClick={() => navigate("home")}>← Home</BtnCancel>
                  </div>
                </div>
              ) : vStep === 1 ? (
                <>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem", fontWeight: 500 }}>Step 1 of 3</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: "2.2rem" }}>Personal Information</div>
                  <div style={twoCol}>
                    <div>
                      <label style={labelStyle}>Full Name <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="👤"><input type="text" value={vData.name} onChange={(e) => setVData((d) => ({ ...d, name: e.target.value }))} placeholder="John Doe" style={inputStyle} /></InputWrap>
                      {vErrors.name && <div style={errStyle}>{vErrors.name}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="📞"><input type="tel" value={vData.phone} onChange={(e) => setVData((d) => ({ ...d, phone: e.target.value }))} placeholder="+91 555 000 0000" style={inputStyle} /></InputWrap>
                      {vErrors.phone && <div style={errStyle}>{vErrors.phone}</div>}
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Email Address <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="✉"><input type="email" value={vData.email} onChange={(e) => setVData((d) => ({ ...d, email: e.target.value }))} placeholder="you@example.com" style={inputStyle} /></InputWrap>
                      {vErrors.email && <div style={errStyle}>{vErrors.email}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Date of Birth</label>
                      <InputWrap icon="📅"><input type="date" value={vData.dob} onChange={(e) => setVData((d) => ({ ...d, dob: e.target.value }))} style={{ ...inputStyle, WebkitAppearance: "none" }} /></InputWrap>
                    </div>
                    <div>
                      <label style={labelStyle}>City / Location</label>
                      <InputWrap icon="📍"><input type="text" value={vData.city} onChange={(e) => setVData((d) => ({ ...d, city: e.target.value }))} placeholder="Your city" style={inputStyle} /></InputWrap>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Brief Bio / Motivation</label>
                      <textarea value={vData.bio} onChange={(e) => setVData((d) => ({ ...d, bio: e.target.value }))} placeholder="Tell us why you want to volunteer..." style={{ ...inputNoIcon, resize: "vertical", minHeight: 90, lineHeight: 1.6 }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2.5rem" }}>
                    <BtnCancel onClick={() => navigate("home")}>← Home</BtnCancel>
                    <BtnSubmit onClick={() => goVStep(2)}>Next: Skills & Availability →</BtnSubmit>
                  </div>
                </>
              ) : vStep === 2 ? (
                <>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem", fontWeight: 500 }}>Step 2 of 3</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: "2.2rem" }}>Skills & Availability</div>
                  <div style={{ marginBottom: "1.8rem" }}>
                    <label style={labelStyle}>Select your Skills <span style={{ color: "var(--rust)" }}>*</span></label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.7rem", marginTop: "0.5rem" }}>
                      {SKILLS.map((sk) => (
                        <div key={sk} onClick={() => setVSkills((s) => s.includes(sk) ? s.filter((x) => x !== sk) : [...s, sk])}
                          style={{ padding: "0.55rem 0.9rem", border: `1.5px solid ${vSkills.includes(sk) ? "var(--ink)" : "rgba(15,17,23,0.12)"}`, borderRadius: 2, cursor: "pointer", fontSize: "0.8rem", fontWeight: 500, background: vSkills.includes(sk) ? "var(--ink)" : "var(--cream)", color: vSkills.includes(sk) ? "var(--cream)" : "inherit", textAlign: "center", userSelect: "none" }}>
                          {sk}
                        </div>
                      ))}
                    </div>
                    {vErrors.skills && <div style={errStyle}>{vErrors.skills}</div>}
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(15,17,23,0.08)", margin: "2.5rem 0" }} />
                  <div style={{ marginBottom: "1.8rem" }}>
                    <label style={labelStyle}>Days Available</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.6rem", marginTop: "0.5rem" }}>
                      {DAYS.map((d) => (
                        <div key={d} onClick={() => setVDays((days) => days.includes(d) ? days.filter((x) => x !== d) : [...days, d])}
                          style={{ padding: "0.65rem 0.3rem", border: `1.5px solid ${vDays.includes(d) ? "var(--sage)" : "rgba(15,17,23,0.12)"}`, borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, textAlign: "center", background: vDays.includes(d) ? "var(--sage)" : "var(--cream)", color: vDays.includes(d) ? "var(--cream)" : "inherit", userSelect: "none" }}>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={twoCol}>
                    <div>
                      <label style={labelStyle}>Preferred Time</label>
                      <select value={vData.timeSlot} onChange={(e) => setVData((d) => ({ ...d, timeSlot: e.target.value }))} style={inputNoIcon}>
                        <option value="">— Select —</option>
                        <option>Morning (6 AM – 12 PM)</option><option>Afternoon (12 PM – 5 PM)</option><option>Evening (5 PM – 9 PM)</option><option>Flexible</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Experience Level</label>
                      <select value={vData.experience} onChange={(e) => setVData((d) => ({ ...d, experience: e.target.value }))} style={inputNoIcon}>
                        <option value="">— Select —</option>
                        <option>First-time volunteer</option><option>Some experience (1–3 events)</option><option>Experienced (3+ events)</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2.5rem" }}>
                    <BtnCancel onClick={() => setVStep(1)}>← Back</BtnCancel>
                    <BtnSubmit onClick={() => goVStep(3)}>Next: Account Setup →</BtnSubmit>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem", fontWeight: 500 }}>Step 3 of 3</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: "2.2rem" }}>Create Your Account</div>
                  <div style={twoCol}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Email Address <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="✉"><input type="email" value={vData.emailConfirm} onChange={(e) => setVData((d) => ({ ...d, emailConfirm: e.target.value }))} placeholder="Confirm your email" style={inputStyle} /></InputWrap>
                      {vErrors.emailConfirm && <div style={errStyle}>{vErrors.emailConfirm}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Password <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="🔒"><input type="password" value={vData.password} onChange={(e) => { setVData((d) => ({ ...d, password: e.target.value })); setVStrength(calcStrength(e.target.value)); }} placeholder="Create a password" style={inputStyle} /></InputWrap>
                      <StrengthBar strength={vStrength} />
                      {vErrors.password && <div style={errStyle}>{vErrors.password}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Confirm Password <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="🔒"><input type="password" value={vData.password2} onChange={(e) => setVData((d) => ({ ...d, password2: e.target.value }))} placeholder="Repeat password" style={inputStyle} /></InputWrap>
                      {vErrors.password2 && <div style={errStyle}>{vErrors.password2}</div>}
                    </div>
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(15,17,23,0.08)", margin: "2.5rem 0" }} />
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input type="checkbox" checked={vData.terms} onChange={(e) => setVData((d) => ({ ...d, terms: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "var(--ink)" }} />
                      I agree to the <a href="#" style={{ color: "var(--gold)" }}>Terms of Service</a> and <a href="#" style={{ color: "var(--gold)" }}>Privacy Policy</a>
                    </label>
                    {vErrors.terms && <div style={errStyle}>{vErrors.terms}</div>}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2.5rem" }}>
                    <BtnCancel onClick={() => setVStep(2)}>← Back</BtnCancel>
                    <BtnSubmit onClick={submitVol}>Complete Registration →</BtnSubmit>
                  </div>
                </>
              )}
            </FormCard>
          </>
        )}

        {/* ── ADMIN FORM ── */}
        {regRole === "admin" && (
          <>
            <StepIndicator steps={["Admin Info", "Organisation", "Account Setup"]} current={aStep} />
            <FormCard isAdmin>
              {aSuccess ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                  <span style={{ fontSize: "4rem", marginBottom: "1.5rem", display: "block" }}>🛡</span>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", fontWeight: 900, marginBottom: "1rem" }}>Admin Account Created!</div>
                  <p style={{ fontSize: "0.95rem", color: "#666", maxWidth: 380, margin: "0 auto 2rem", lineHeight: 1.7 }}>Your admin account has been registered successfully. You can now log in to access the Admin Panel and manage events, volunteers, and more.</p>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <BtnSubmit onClick={() => navigate("login")}>Go to Login →</BtnSubmit>
                    <BtnCancel onClick={() => navigate("admin")}>⚙ Admin Panel</BtnCancel>
                    <BtnCancel onClick={() => navigate("home")}>← Home</BtnCancel>
                  </div>
                </div>
              ) : aStep === 1 ? (
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", color: "#7a5f10", fontSize: "0.78rem", fontWeight: 600, padding: "0.4rem 0.9rem", borderRadius: 3, marginBottom: "1.5rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>🛡 Admin / Coordinator Registration</div>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem", fontWeight: 500 }}>Step 1 of 3</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: "2.2rem" }}>Admin Information</div>
                  <div style={twoCol}>
                    <div>
                      <label style={labelStyle}>Full Name <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="👤"><input type="text" value={aData.name} onChange={(e) => setAData((d) => ({ ...d, name: e.target.value }))} placeholder="Jane Smith" style={inputStyle} /></InputWrap>
                      {aErrors.name && <div style={errStyle}>{aErrors.name}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="📞"><input type="tel" value={aData.phone} onChange={(e) => setAData((d) => ({ ...d, phone: e.target.value }))} placeholder="+91 555 000 0000" style={inputStyle} /></InputWrap>
                      {aErrors.phone && <div style={errStyle}>{aErrors.phone}</div>}
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Official Email Address <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="✉"><input type="email" value={aData.email} onChange={(e) => setAData((d) => ({ ...d, email: e.target.value }))} placeholder="admin@organisation.com" style={inputStyle} /></InputWrap>
                      {aErrors.email && <div style={errStyle}>{aErrors.email}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Designation / Role <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="🏷"><input type="text" value={aData.designation} onChange={(e) => setAData((d) => ({ ...d, designation: e.target.value }))} placeholder="e.g. Event Coordinator" style={inputStyle} /></InputWrap>
                      {aErrors.designation && <div style={errStyle}>{aErrors.designation}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Date of Birth</label>
                      <InputWrap icon="📅"><input type="date" value={aData.dob} onChange={(e) => setAData((d) => ({ ...d, dob: e.target.value }))} style={inputStyle} /></InputWrap>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Brief Introduction</label>
                      <textarea value={aData.bio} onChange={(e) => setAData((d) => ({ ...d, bio: e.target.value }))} placeholder="Tell us about your role and responsibilities..." style={{ ...inputNoIcon, resize: "vertical", minHeight: 90 }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2.5rem" }}>
                    <BtnCancel onClick={() => navigate("home")}>← Home</BtnCancel>
                    <BtnSubmit onClick={() => goAStep(2)}>Next: Organisation →</BtnSubmit>
                  </div>
                </>
              ) : aStep === 2 ? (
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", color: "#7a5f10", fontSize: "0.78rem", fontWeight: 600, padding: "0.4rem 0.9rem", borderRadius: 3, marginBottom: "1.5rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>🛡 Admin / Coordinator Registration</div>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem", fontWeight: 500 }}>Step 2 of 3</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: "2.2rem" }}>Organisation Details</div>
                  <div style={twoCol}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Organisation / Institution Name <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="🏢"><input type="text" value={aData.org} onChange={(e) => setAData((d) => ({ ...d, org: e.target.value }))} placeholder="e.g. City Volunteer Network" style={inputStyle} /></InputWrap>
                      {aErrors.org && <div style={errStyle}>{aErrors.org}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Organisation Type <span style={{ color: "var(--rust)" }}>*</span></label>
                      <select value={aData.orgType} onChange={(e) => setAData((d) => ({ ...d, orgType: e.target.value }))} style={inputNoIcon}>
                        <option value="">— Select —</option>
                        <option>NGO / Non-Profit</option><option>Government Body</option><option>Educational Institution</option><option>Corporate CSR</option><option>Community Group</option><option>Other</option>
                      </select>
                      {aErrors.orgType && <div style={errStyle}>{aErrors.orgType}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>City / Location <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="📍"><input type="text" value={aData.city} onChange={(e) => setAData((d) => ({ ...d, city: e.target.value }))} placeholder="Your city" style={inputStyle} /></InputWrap>
                      {aErrors.city && <div style={errStyle}>{aErrors.city}</div>}
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Organisation Website / Social Link</label>
                      <InputWrap icon="🌐"><input type="text" value={aData.website} onChange={(e) => setAData((d) => ({ ...d, website: e.target.value }))} placeholder="https://yourorganisation.com" style={inputStyle} /></InputWrap>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Admin Access Code <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="🔑"><input type="password" value={aData.code} onChange={(e) => setAData((d) => ({ ...d, code: e.target.value }))} placeholder="Enter the admin access code provided to you" style={inputStyle} /></InputWrap>
                      {aErrors.code && <div style={errStyle}>{aErrors.code}</div>}
                      <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.4rem" }}>Demo code: <strong>ADMHUB2025</strong></div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2.5rem" }}>
                    <BtnCancel onClick={() => setAStep(1)}>← Back</BtnCancel>
                    <BtnSubmit onClick={() => goAStep(3)}>Next: Account Setup →</BtnSubmit>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", color: "#7a5f10", fontSize: "0.78rem", fontWeight: 600, padding: "0.4rem 0.9rem", borderRadius: 3, marginBottom: "1.5rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>🛡 Admin / Coordinator Registration</div>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem", fontWeight: 500 }}>Step 3 of 3</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: "2.2rem" }}>Create Admin Account</div>
                  <div style={twoCol}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Email Address <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="✉"><input type="email" value={aData.emailConfirm} onChange={(e) => setAData((d) => ({ ...d, emailConfirm: e.target.value }))} placeholder="Confirm your email" style={inputStyle} /></InputWrap>
                      {aErrors.emailConfirm && <div style={errStyle}>{aErrors.emailConfirm}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Password <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="🔒"><input type="password" value={aData.password} onChange={(e) => { setAData((d) => ({ ...d, password: e.target.value })); setAStrength(calcStrength(e.target.value)); }} placeholder="Create a strong password" style={inputStyle} /></InputWrap>
                      <StrengthBar strength={aStrength} />
                      {aErrors.password && <div style={errStyle}>{aErrors.password}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Confirm Password <span style={{ color: "var(--rust)" }}>*</span></label>
                      <InputWrap icon="🔒"><input type="password" value={aData.password2} onChange={(e) => setAData((d) => ({ ...d, password2: e.target.value }))} placeholder="Repeat password" style={inputStyle} /></InputWrap>
                      {aErrors.password2 && <div style={errStyle}>{aErrors.password2}</div>}
                    </div>
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(15,17,23,0.08)", margin: "2.5rem 0" }} />
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input type="checkbox" checked={aData.terms} onChange={(e) => setAData((d) => ({ ...d, terms: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "var(--ink)" }} />
                      I agree to the <a href="#" style={{ color: "var(--gold)" }}>Terms of Service</a>, <a href="#" style={{ color: "var(--gold)" }}>Privacy Policy</a> and <a href="#" style={{ color: "var(--gold)" }}>Admin Code of Conduct</a>
                    </label>
                    {aErrors.terms && <div style={errStyle}>{aErrors.terms}</div>}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2.5rem" }}>
                    <BtnCancel onClick={() => setAStep(2)}>← Back</BtnCancel>
                    <BtnSubmit onClick={submitAdmin}>Complete Admin Registration →</BtnSubmit>
                  </div>
                </>
              )}
            </FormCard>
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   ADMIN PLACEHOLDER PAGE
═══════════════════════════════════════════════════════════════════════ */
const AdminPage = ({ navigate }) => (
  <div style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--cream)" }}>
    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "3rem", fontWeight: 900, marginBottom: "1rem" }}>⚙ Admin<span style={{ color: "var(--gold)" }}>Panel</span></div>
    <p style={{ fontSize: "1rem", color: "rgba(245,240,232,0.5)", marginBottom: "2rem" }}>This is the Admin Panel page (not part of this conversion scope).</p>
    <button onClick={() => navigate("home")} style={{ padding: "0.9rem 2.2rem", background: "transparent", color: "var(--gold)", border: "1.5px solid var(--gold)", borderRadius: 2, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 500 }}>← Back to Home</button>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   ROOT APP — client-side router
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <FontLoader />
      <GlobalStyle />
      {page === "home" && <HomePage navigate={navigate} />}
      {page === "login" && <LoginPage navigate={navigate} />}
      {page === "register" && <RegisterPage navigate={navigate} />}
      {page === "admin" && <AdminPage navigate={navigate} />}
    </>
  );
}
