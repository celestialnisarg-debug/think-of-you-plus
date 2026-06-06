# HRMS Pitch Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two web-based pitch deck deliverables for Phaze AI HRMS — a scrollable pitch website and a Reveal.js slide deck.

**Architecture:** Two standalone HTML files sharing a common design system (CSS variables, Inter font, Phaze AI brand colours). No build tools, no dependencies except CDN links. Both files open directly in any browser.

**Tech Stack:** HTML5, CSS3, vanilla JS, Google Fonts (Inter), Reveal.js v5 (CDN)

---

## Task 1: Project Scaffold

**Files:**
- Create: `C:\Users\nisup\Downloads\HRMS Pitch Deck\site\index.html` (empty placeholder)
- Create: `C:\Users\nisup\Downloads\HRMS Pitch Deck\deck\index.html` (empty placeholder)
- Create: `C:\Users\nisup\Downloads\HRMS Pitch Deck\README.md`

- [ ] **Step 1: Create folder structure**

```powershell
New-Item -ItemType Directory -Force -Path "C:\Users\nisup\Downloads\HRMS Pitch Deck\site"
New-Item -ItemType Directory -Force -Path "C:\Users\nisup\Downloads\HRMS Pitch Deck\deck"
```

Expected: two folders created with no error.

- [ ] **Step 2: Create README.md**

Write this content to `C:\Users\nisup\Downloads\HRMS Pitch Deck\README.md`:

```markdown
# Phaze AI HRMS — Pitch Deck

Two web-based deliverables. Open both directly in any browser — no server needed.

## Files

| File | What it is |
|---|---|
| `site/index.html` | Scrollable pitch website — share as a link or open locally |
| `deck/index.html` | Reveal.js slide deck — keyboard navigable, fullscreen (press F) |

## Deck Controls
- Arrow keys or spacebar: advance slides
- F: fullscreen
- ESC: slide overview
- S: speaker notes (none configured)

## Contact
Manthan Jethwani — manthanjethwani@phazeai.com — +91 7990700545
```

- [ ] **Step 3: Verify**

Open `C:\Users\nisup\Downloads\HRMS Pitch Deck\` in File Explorer.
Expected: `site\` folder, `deck\` folder, `README.md` all present.

---

## Task 2: Scrollable Pitch Website

**Files:**
- Create: `C:\Users\nisup\Downloads\HRMS Pitch Deck\site\index.html`

- [ ] **Step 1: Write the complete file**

Write the following to `C:\Users\nisup\Downloads\HRMS Pitch Deck\site\index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phaze AI HRMS — HR that runs itself.</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #06191E;
      --primary: #13768D;
      --secondary: #64919F;
      --muted: #8FA2A4;
      --surface: #0D2A33;
      --light: #F7F7F7;
      --border: rgba(100,145,159,0.25);
      --glow: rgba(19,118,141,0.15);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--light); font-family: 'Inter', sans-serif; }

    /* NAV */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 60px;
      background: rgba(6,25,30,0.92); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .nav-logo { font-size: 17px; font-weight: 800; letter-spacing: 1.5px; color: var(--light); }
    .nav-logo span { color: var(--primary); }
    .nav-links { display: flex; gap: 32px; }
    .nav-links a { color: var(--muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: var(--light); }
    .nav-cta {
      background: var(--primary); color: var(--light); padding: 9px 20px;
      border-radius: 7px; font-size: 13px; font-weight: 600; text-decoration: none;
      transition: background 0.2s;
    }
    .nav-cta:hover { background: #0f6070; }

    /* LAYOUT */
    .section-wrap { max-width: 1160px; margin: 0 auto; padding: 100px 60px; }
    .label { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--primary); margin-bottom: 14px; display: block; }
    h2 { font-size: 38px; font-weight: 800; line-height: 1.15; margin-bottom: 14px; }
    .sub { font-size: 16px; color: var(--muted); line-height: 1.75; max-width: 580px; margin-bottom: 48px; }

    /* FADE-IN */
    .fi { opacity: 0; transform: translateY(22px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .fi.on { opacity: 1; transform: translateY(0); }

    /* HERO */
    #hero {
      min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
      max-width: 1160px; margin: 0 auto; padding: 100px 60px 60px;
      position: relative;
    }
    body::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background: radial-gradient(ellipse 60% 60% at 15% 55%, rgba(19,118,141,0.18) 0%, transparent 70%);
    }
    .hero-pill {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(19,118,141,0.1); border: 1px solid var(--border);
      border-radius: 100px; padding: 6px 16px; font-size: 12.5px; color: var(--secondary);
      margin-bottom: 30px; width: fit-content; position: relative; z-index: 1;
    }
    .hero-pill::before {
      content: ''; width: 6px; height: 6px; background: var(--primary);
      border-radius: 50%; animation: blink 2s infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
    h1 {
      font-size: 66px; font-weight: 800; line-height: 1.08;
      margin-bottom: 22px; position: relative; z-index: 1;
    }
    h1 em { font-style: normal; color: var(--primary); }
    .hero-sub { font-size: 18px; color: var(--muted); max-width: 540px; line-height: 1.75; margin-bottom: 38px; position: relative; z-index: 1; }
    .btn-row { display: flex; gap: 14px; position: relative; z-index: 1; flex-wrap: wrap; }
    .btn-p {
      background: var(--primary); color: var(--light); padding: 14px 28px; border-radius: 8px;
      font-size: 15px; font-weight: 600; text-decoration: none; border: none; cursor: pointer;
      transition: background 0.2s, transform 0.18s;
    }
    .btn-p:hover { background: #0f6070; transform: scale(1.03); }
    .btn-o {
      background: transparent; color: var(--light); padding: 14px 28px; border-radius: 8px;
      font-size: 15px; font-weight: 600; text-decoration: none; border: 1px solid var(--border);
      transition: border-color 0.2s, transform 0.18s;
    }
    .btn-o:hover { border-color: var(--secondary); transform: scale(1.03); }

    /* PROBLEM */
    .pain-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .pain-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 28px;
      transition: box-shadow 0.3s;
    }
    .pain-card:hover { box-shadow: 0 0 24px var(--glow); }
    .pain-icon { font-size: 28px; margin-bottom: 12px; display: block; }
    .pain-title { font-size: 15.5px; font-weight: 700; margin-bottom: 7px; }
    .pain-desc { font-size: 13.5px; color: var(--muted); line-height: 1.65; }

    /* SOLUTION */
    .sol-wrap {
      display: grid; grid-template-columns: 1fr 1px 1fr;
      background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
    }
    .sol-panel { padding: 40px; }
    .sol-div { background: var(--border); }
    .sol-badge {
      display: inline-block; background: rgba(19,118,141,0.1); border: 1px solid var(--border);
      border-radius: 5px; padding: 3px 11px; font-size: 11px; font-weight: 700;
      color: var(--primary); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 18px;
    }
    .sol-title { font-size: 21px; font-weight: 700; margin-bottom: 11px; }
    .sol-desc { font-size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 22px; }
    .sol-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }
    .sol-list li { font-size: 13.5px; color: var(--secondary); display: flex; gap: 10px; align-items: flex-start; }
    .sol-list li::before { content: '→'; color: var(--primary); font-weight: 700; flex-shrink: 0; }

    /* FEATURES */
    .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
    .feat-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 28px;
      transition: box-shadow 0.3s, border-color 0.3s;
    }
    .feat-card:hover { box-shadow: 0 0 28px var(--glow); border-color: rgba(100,145,159,0.5); }
    .feat-icon { font-size: 30px; margin-bottom: 14px; display: block; }
    .feat-title { font-size: 15.5px; font-weight: 700; margin-bottom: 7px; }
    .feat-desc { font-size: 13px; color: var(--muted); line-height: 1.65; }

    /* HOW IT WORKS */
    .steps-row { display: grid; grid-template-columns: 1fr 36px 1fr 36px 1fr; align-items: center; gap: 0; }
    .step-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 30px 26px; text-align: center; }
    .step-num {
      width: 38px; height: 38px; background: var(--primary); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; font-weight: 700; margin: 0 auto 14px;
    }
    .step-title { font-size: 17px; font-weight: 700; margin-bottom: 9px; }
    .step-desc { font-size: 13px; color: var(--muted); line-height: 1.65; }
    .step-arrow { text-align: center; font-size: 22px; color: var(--primary); }

    /* PRICING */
    .price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; max-width: 640px; }
    .price-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 36px;
      position: relative; transition: box-shadow 0.3s;
    }
    .price-card.hi { border-color: var(--primary); box-shadow: 0 0 32px rgba(19,118,141,0.22); }
    .price-badge {
      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
      background: var(--primary); color: var(--light); font-size: 10.5px; font-weight: 700;
      letter-spacing: 1px; text-transform: uppercase; padding: 4px 14px; border-radius: 100px; white-space: nowrap;
    }
    .price-plan { font-size: 12px; font-weight: 600; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
    .price-amt { font-size: 42px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .price-per { font-size: 13.5px; color: var(--muted); margin-bottom: 7px; }
    .price-save { font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 22px; min-height: 19px; }
    .price-note { font-size: 13px; color: var(--muted); line-height: 1.6; }
    .price-footer { margin-top: 22px; font-size: 13.5px; color: var(--muted); max-width: 640px; }

    /* DEMO */
    #demo-section { max-width: 540px; margin: 0 auto; padding: 100px 60px; text-align: center; }
    #demo-section h2 { font-size: 38px; }
    #demo-section .sub { margin: 0 auto 0; text-align: center; }
    .demo-form { display: flex; flex-direction: column; gap: 13px; margin-top: 36px; text-align: left; }
    .fi-input {
      background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
      padding: 13px 15px; color: var(--light); font-size: 14.5px; font-family: 'Inter',sans-serif;
      outline: none; transition: border-color 0.2s; width: 100%;
    }
    .fi-input:focus { border-color: var(--primary); }
    .fi-input::placeholder { color: var(--muted); }
    .demo-contact { margin-top: 20px; font-size: 13.5px; color: var(--muted); }
    .demo-contact a { color: var(--secondary); text-decoration: none; }

    /* FOOTER */
    footer {
      border-top: 1px solid var(--border); padding: 36px 60px;
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;
    }
    .f-logo { font-size: 16px; font-weight: 800; letter-spacing: 1.5px; margin-bottom: 3px; }
    .f-tag { font-size: 11px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; }
    .f-right { text-align: right; display: flex; flex-direction: column; gap: 4px; }
    .f-right a { color: var(--secondary); text-decoration: none; font-size: 13.5px; }
    .f-copy { text-align: center; padding: 14px 60px; font-size: 12px; color: var(--muted); border-top: 1px solid var(--border); }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      h1 { font-size: 50px; }
      .feat-grid { grid-template-columns: repeat(2,1fr); }
      .steps-row { grid-template-columns: 1fr; gap: 18px; }
      .step-arrow { transform: rotate(90deg); }
    }
    @media (max-width: 768px) {
      nav { padding: 15px 20px; }
      .nav-links { display: none; }
      .section-wrap { padding: 70px 22px; }
      #hero { padding: 80px 22px 50px; }
      #demo-section { padding: 70px 22px; }
      h1 { font-size: 36px; }
      h2 { font-size: 28px; }
      .pain-grid { grid-template-columns: 1fr; }
      .sol-wrap { grid-template-columns: 1fr; }
      .sol-div { display: none; }
      .feat-grid { grid-template-columns: 1fr; }
      .price-grid { grid-template-columns: 1fr; max-width: 100%; }
      footer { padding: 28px 22px; flex-direction: column; align-items: flex-start; }
      .f-right { text-align: left; }
      .f-copy { padding: 14px 22px; }
    }
  </style>
</head>
<body>

  <nav>
    <div class="nav-logo">PHAZE <span>AI</span></div>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#demo-section">Book a Demo</a>
    </div>
    <a href="#demo-section" class="nav-cta">Book a Demo</a>
  </nav>

  <!-- HERO -->
  <section id="hero">
    <div class="hero-pill">HR Admin Dashboard + WhatsApp Bot</div>
    <h1>HR that<br><em>runs itself.</em></h1>
    <p class="hero-sub">GPS attendance, AI expense scanning, leave management — all from WhatsApp. Zero new apps for your team.</p>
    <div class="btn-row">
      <a href="#demo-section" class="btn-p">Book a Demo</a>
      <a href="#demo-section" class="btn-o">Contact Us</a>
    </div>
  </section>

  <!-- PROBLEM -->
  <div class="section-wrap" id="problem">
    <span class="label fi">The Problem</span>
    <h2 class="fi">HR admin is eating your day.</h2>
    <p class="sub fi">Every growing company hits the same wall — manual processes, missing records, a team that's hard to manage.</p>
    <div class="pain-grid">
      <div class="pain-card fi">
        <span class="pain-icon">📍</span>
        <div class="pain-title">Attendance you can't trust</div>
        <div class="pain-desc">Field staff mark in from anywhere. No GPS, no proof. You pay for time nobody tracks.</div>
      </div>
      <div class="pain-card fi">
        <span class="pain-icon">🧾</span>
        <div class="pain-title">Paper receipts, delayed reimbursements</div>
        <div class="pain-desc">Expense claims pile up. Finance chases employees for weeks. Nobody's happy.</div>
      </div>
      <div class="pain-card fi">
        <span class="pain-icon">📧</span>
        <div class="pain-title">Leave requests lost in email</div>
        <div class="pain-desc">Applications, approvals, rejections buried in inboxes. No audit trail. No clarity.</div>
      </div>
      <div class="pain-card fi">
        <span class="pain-icon">❓</span>
        <div class="pain-title">Policy questions clog HR's day</div>
        <div class="pain-desc">Same questions, every week. HR answers manually instead of doing real work.</div>
      </div>
    </div>
  </div>

  <!-- SOLUTION -->
  <div class="section-wrap" id="solution">
    <span class="label fi">The Solution</span>
    <h2 class="fi">One system. Two interfaces.</h2>
    <p class="sub fi">Your HR team gets a powerful admin dashboard. Your employees get WhatsApp — the app they already have.</p>
    <div class="sol-wrap fi">
      <div class="sol-panel">
        <span class="sol-badge">Admin Dashboard</span>
        <div class="sol-title">Full visibility for HR managers</div>
        <div class="sol-desc">A web portal that shows you everything — who checked in, who's on leave, which expenses are pending, and what your field team is doing right now.</div>
        <ul class="sol-list">
          <li>Real-time attendance monitor</li>
          <li>One-click leave approvals</li>
          <li>Expense review and sign-off</li>
          <li>Field visit GPS trail</li>
        </ul>
      </div>
      <div class="sol-div"></div>
      <div class="sol-panel">
        <span class="sol-badge">WhatsApp Bot</span>
        <div class="sol-title">Zero friction for employees</div>
        <div class="sol-desc">Employees check in, apply leave, submit expenses, and log field visits — all from WhatsApp. No new app. No training needed. Works on any phone.</div>
        <ul class="sol-list">
          <li>GPS check-in in one message</li>
          <li>Photo receipt → instant claim</li>
          <li>Natural language leave request</li>
          <li>Policy Q&amp;A answered instantly</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- FEATURES -->
  <div class="section-wrap" id="features">
    <span class="label fi">Features</span>
    <h2 class="fi">Everything HR. Nothing extra.</h2>
    <p class="sub fi">Built for the way Indian SMBs actually work — field teams, blue-collar staff, and everything in between.</p>
    <div class="feat-grid">
      <div class="feat-card fi">
        <span class="feat-icon">📍</span>
        <div class="feat-title">GPS Attendance</div>
        <div class="feat-desc">Check-in and check-out are GPS-verified. Employees can only mark attendance within the configured branch radius. Fake entries blocked automatically.</div>
      </div>
      <div class="feat-card fi">
        <span class="feat-icon">🤖</span>
        <div class="feat-title">AI Receipt Scanning</div>
        <div class="feat-desc">Employees photograph a receipt. The bot reads the vendor, amount, date, and purpose — and submits the expense claim automatically.</div>
      </div>
      <div class="feat-card fi">
        <span class="feat-icon">🏖️</span>
        <div class="feat-title">Leave Management</div>
        <div class="feat-desc">Employees apply via WhatsApp in plain English. Managers approve in the dashboard with one click. Leave balances update in real time.</div>
      </div>
      <div class="feat-card fi">
        <span class="feat-icon">🗺️</span>
        <div class="feat-title">Field Visit Tracker</div>
        <div class="feat-desc">Sales and field staff log meeting in/out with GPS coordinates, client name, and a visit summary — all from WhatsApp, in seconds.</div>
      </div>
      <div class="feat-card fi">
        <span class="feat-icon">📋</span>
        <div class="feat-title">Policy Q&amp;A Bot</div>
        <div class="feat-desc">Upload your HR policy documents. The bot reads them and answers employee questions instantly — 24/7, without any HR intervention.</div>
      </div>
      <div class="feat-card fi">
        <span class="feat-icon">✅</span>
        <div class="feat-title">Task Management</div>
        <div class="feat-desc">Assign tasks to employees, track completion status, and maintain a full activity log. Nothing falls through the cracks.</div>
      </div>
    </div>
  </div>

  <!-- HOW IT WORKS -->
  <div class="section-wrap" id="how">
    <span class="label fi">How It Works</span>
    <h2 class="fi">Set up in a day. Running by tomorrow.</h2>
    <p class="sub fi">Three steps from zero to a fully operational HR system.</p>
    <div class="steps-row fi">
      <div class="step-card">
        <div class="step-num">1</div>
        <div class="step-title">Onboard</div>
        <div class="step-desc">Add your team, configure branches and leave policies, and upload your HR documents. Takes under an hour.</div>
      </div>
      <div class="step-arrow">→</div>
      <div class="step-card">
        <div class="step-num">2</div>
        <div class="step-title">Connect</div>
        <div class="step-desc">Each employee sends one message to the WhatsApp bot. They're active in 60 seconds — no downloads, no logins.</div>
      </div>
      <div class="step-arrow">→</div>
      <div class="step-card">
        <div class="step-num">3</div>
        <div class="step-title">Track</div>
        <div class="step-desc">Every check-in, leave, expense, and visit flows into your admin dashboard live. You always know what's happening.</div>
      </div>
    </div>
  </div>

  <!-- PRICING -->
  <div class="section-wrap" id="pricing">
    <span class="label fi">Pricing</span>
    <h2 class="fi">Simple pricing. No surprises.</h2>
    <p class="sub fi">One flat price. All features included. Unlimited employees.</p>
    <div class="price-grid fi">
      <div class="price-card">
        <div class="price-plan">Monthly</div>
        <div class="price-amt">₹5,000</div>
        <div class="price-per">per month</div>
        <div class="price-save">&nbsp;</div>
        <div class="price-note">All features included.<br>Cancel anytime.</div>
      </div>
      <div class="price-card hi">
        <div class="price-badge">Best Value</div>
        <div class="price-plan">Annual</div>
        <div class="price-amt">₹50,000</div>
        <div class="price-per">per year</div>
        <div class="price-save">Save ₹10,000 vs monthly</div>
        <div class="price-note">All features included.<br>Priority support.</div>
      </div>
    </div>
    <p class="price-footer fi">Includes GPS attendance, AI expense scanning, leave management, field visit tracker, policy bot, task management, and unlimited employees.</p>
  </div>

  <!-- DEMO -->
  <section id="demo-section">
    <span class="label fi">Get Started</span>
    <h2 class="fi">See it live in 20 minutes.</h2>
    <p class="sub fi">We'll walk you through the full product with your own team's context. No commitment needed.</p>
    <form class="demo-form fi" action="mailto:manthanjethwani@phazeai.com" method="GET" enctype="text/plain">
      <input class="fi-input" type="text" name="name" placeholder="Your Name" required>
      <input class="fi-input" type="text" name="company" placeholder="Company Name" required>
      <input class="fi-input" type="tel" name="phone" placeholder="Phone Number" required>
      <button type="submit" class="btn-p" style="width:100%;font-size:15.5px;padding:15px 28px;">Book a Demo →</button>
    </form>
    <div class="demo-contact fi">
      Or reach us directly:
      <a href="mailto:manthanjethwani@phazeai.com">manthanjethwani@phazeai.com</a>
      &nbsp;·&nbsp;
      <a href="tel:+917990700545">+91 7990700545</a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div>
      <div class="f-logo">PHAZE AI</div>
      <div class="f-tag">Automating What Drains Your Time</div>
    </div>
    <div class="f-right">
      <a href="https://www.phazeai.com" target="_blank">www.phazeai.com</a>
      <a href="mailto:subscriptions@phazeai.com" style="color:var(--muted);font-size:12.5px;">subscriptions@phazeai.com</a>
    </div>
  </footer>
  <div class="f-copy">© 2026 Phaze AI. All rights reserved.</div>

  <script>
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fi').forEach(el => obs.observe(el));
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `C:\Users\nisup\Downloads\HRMS Pitch Deck\site\index.html` in Chrome.

Check each of the following:
- [ ] Nav is fixed at top with logo, links, and "Book a Demo" button
- [ ] Hero shows "HR that runs itself." with teal "runs itself." and two CTA buttons
- [ ] Scrolling down shows Problem (4 cards), Solution (2-panel), Features (6 cards), How It Works (3 steps), Pricing (2 cards), Demo form, Footer
- [ ] Cards have subtle hover glow effect
- [ ] Annual pricing card has "Best Value" badge and teal border
- [ ] Scroll to mobile width (< 768px) — grids collapse to single column, nav links hide

---

## Task 3: Reveal.js Slide Deck

**Files:**
- Create: `C:\Users\nisup\Downloads\HRMS Pitch Deck\deck\index.html`

- [ ] **Step 1: Write the complete file**

Write the following to `C:\Users\nisup\Downloads\HRMS Pitch Deck\deck\index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phaze AI HRMS — Pitch Deck</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #06191E; --primary: #13768D; --secondary: #64919F;
      --muted: #8FA2A4; --surface: #0D2A33; --light: #F7F7F7;
      --border: rgba(100,145,159,0.25); --glow: rgba(19,118,141,0.2);
    }
    .reveal-viewport { background: var(--bg); }
    .reveal {
      font-family: 'Inter', sans-serif;
      color: var(--light);
      background: var(--bg);
    }
    .reveal .slides { text-align: left; }
    .reveal .progress { color: var(--primary); height: 3px; }
    .reveal .slide-number {
      background: transparent; color: var(--muted);
      font-family: 'Inter', sans-serif; font-size: 13px;
    }
    .reveal h1 {
      font-family: 'Inter', sans-serif; font-weight: 800;
      font-size: 3em; line-height: 1.1; text-transform: none;
      color: var(--light); margin-bottom: 0.3em;
    }
    .reveal h2 {
      font-family: 'Inter', sans-serif; font-weight: 800;
      font-size: 2em; line-height: 1.15; text-transform: none;
      color: var(--light); margin-bottom: 0.3em;
    }
    .reveal p { color: var(--muted); font-size: 0.85em; line-height: 1.7; margin: 0; }
    .reveal ul { list-style: none; padding: 0; margin: 0; }
    .reveal section { padding: 0 !important; }

    /* Shared */
    .lbl {
      font-size: 0.5em; font-weight: 700; letter-spacing: 2.5px;
      text-transform: uppercase; color: var(--primary);
      display: block; margin-bottom: 10px;
    }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 11px; padding: 22px;
    }
    .accent { color: var(--primary); }
    .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .slide-inner { padding: 48px 60px; height: 100%; display: flex; flex-direction: column; justify-content: center; }

    /* Pill tag */
    .pill {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(19,118,141,0.1); border: 1px solid var(--border);
      border-radius: 100px; padding: 5px 14px; font-size: 0.55em;
      color: var(--secondary); margin-bottom: 20px;
    }
    .pill::before { content:''; width:6px; height:6px; background:var(--primary); border-radius:50%; animation:blink 2s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

    /* Pain cards */
    .pi { font-size: 1.3em; margin-bottom: 8px; display: block; }
    .pt { font-size: 0.72em; font-weight: 700; color: var(--light); margin-bottom: 5px; }
    .pd { font-size: 0.6em; color: var(--muted); line-height: 1.5; }

    /* Solution */
    .sb {
      display: inline-block; background: rgba(19,118,141,0.1); border: 1px solid var(--border);
      border-radius: 4px; padding: 2px 9px; font-size: 0.5em; font-weight: 700;
      color: var(--primary); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;
    }
    .st { font-size: 0.82em; font-weight: 700; color: var(--light); margin-bottom: 8px; }
    .sd { font-size: 0.6em; color: var(--muted); line-height: 1.5; margin-bottom: 12px; }
    .sl li { font-size: 0.6em; color: var(--secondary); padding: 3px 0; }
    .sl li::before { content: '→ '; color: var(--primary); font-weight: 700; }

    /* Features */
    .fi { font-size: 1.5em; margin-bottom: 8px; display: block; }
    .ftt { font-size: 0.7em; font-weight: 700; color: var(--light); margin-bottom: 5px; }
    .fd { font-size: 0.57em; color: var(--muted); line-height: 1.5; }

    /* Steps */
    .sn {
      width: 34px; height: 34px; background: var(--primary); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.7em; font-weight: 700; margin-bottom: 12px;
    }
    .stt { font-size: 0.8em; font-weight: 700; color: var(--light); margin-bottom: 7px; }
    .sdd { font-size: 0.6em; color: var(--muted); line-height: 1.5; }

    /* Pricing */
    .pp { font-size: 0.55em; font-weight: 600; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
    .pa { font-size: 1.9em; font-weight: 800; line-height: 1; margin-bottom: 3px; }
    .pper { font-size: 0.6em; color: var(--muted); margin-bottom: 6px; }
    .psave { font-size: 0.6em; color: var(--primary); font-weight: 600; margin-bottom: 16px; min-height: 17px; }
    .pnote { font-size: 0.57em; color: var(--muted); line-height: 1.5; }
    .pbadge {
      display: inline-block; background: var(--primary); color: var(--light);
      font-size: 0.5em; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
      padding: 3px 10px; border-radius: 100px; margin-bottom: 10px;
    }

    /* CTA slide */
    .cta-btn {
      display: inline-block; background: var(--primary); color: var(--light);
      padding: 13px 26px; border-radius: 8px; font-size: 0.75em; font-weight: 600;
      text-decoration: none; margin-top: 10px;
    }

    /* Thank you */
    .cr { display: flex; flex-direction: column; gap: 10px; margin-top: 22px; }
    .ci { font-size: 0.75em; color: var(--secondary); }
    .ci a { color: var(--secondary); text-decoration: none; }
  </style>
</head>
<body>
<div class="reveal">
  <div class="slides">

    <!-- SLIDE 1: COVER -->
    <section data-background-color="#06191E">
      <div class="slide-inner">
        <span class="lbl">Phaze AI</span>
        <div class="pill">HR Admin Dashboard + WhatsApp Bot</div>
        <h1>HR that<br><span class="accent">runs itself.</span></h1>
        <p style="max-width:460px; margin-top:12px;">GPS attendance, AI expense scanning, leave management — all from WhatsApp. Zero new apps for your team.</p>
      </div>
    </section>

    <!-- SLIDE 2: THE PROBLEM -->
    <section data-background-color="#06191E">
      <div class="slide-inner">
        <span class="lbl">The Problem</span>
        <h2>HR admin is<br>eating your day.</h2>
        <div class="g2" style="margin-top:24px;">
          <div class="card">
            <span class="pi">📍</span>
            <div class="pt">Attendance you can't trust</div>
            <div class="pd">Field staff mark in from anywhere. No GPS, no proof.</div>
          </div>
          <div class="card">
            <span class="pi">🧾</span>
            <div class="pt">Paper receipts, delayed reimbursements</div>
            <div class="pd">Expense claims pile up. Finance chases employees for weeks.</div>
          </div>
          <div class="card">
            <span class="pi">📧</span>
            <div class="pt">Leave requests lost in email</div>
            <div class="pd">Applications buried in inboxes. No audit trail. No clarity.</div>
          </div>
          <div class="card">
            <span class="pi">❓</span>
            <div class="pt">Policy questions clog HR's day</div>
            <div class="pd">Same questions, every week. HR answers manually.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 3: THE SOLUTION -->
    <section data-background-color="#06191E">
      <div class="slide-inner">
        <span class="lbl">The Solution</span>
        <h2>One system.<br>Two interfaces.</h2>
        <div class="g2" style="margin-top:24px;">
          <div class="card">
            <span class="sb">Admin Dashboard</span>
            <div class="st">Full visibility for HR managers</div>
            <div class="sd">A web portal showing attendance, leaves, expenses, and field activity in real time.</div>
            <ul class="sl">
              <li>Real-time attendance monitor</li>
              <li>One-click leave approvals</li>
              <li>Expense review and sign-off</li>
              <li>Field visit GPS trail</li>
            </ul>
          </div>
          <div class="card">
            <span class="sb">WhatsApp Bot</span>
            <div class="st">Zero friction for employees</div>
            <div class="sd">Employees use the WhatsApp they already have. No new app. No training. Any phone.</div>
            <ul class="sl">
              <li>GPS check-in in one message</li>
              <li>Photo receipt → instant claim</li>
              <li>Natural language leave request</li>
              <li>Policy Q&amp;A answered instantly</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 4: FEATURES -->
    <section data-background-color="#06191E">
      <div class="slide-inner">
        <span class="lbl">Features</span>
        <h2>Everything HR.<br>Nothing extra.</h2>
        <div class="g3" style="margin-top:22px;">
          <div class="card">
            <span class="fi">📍</span>
            <div class="ftt">GPS Attendance</div>
            <div class="fd">Check-in verified by location. Fake entries blocked automatically.</div>
          </div>
          <div class="card">
            <span class="fi">🤖</span>
            <div class="ftt">AI Receipt Scanning</div>
            <div class="fd">Photograph a receipt. Bot reads and submits the claim.</div>
          </div>
          <div class="card">
            <span class="fi">🏖️</span>
            <div class="ftt">Leave Management</div>
            <div class="fd">Apply via WhatsApp. Approve in dashboard. Balances update live.</div>
          </div>
          <div class="card">
            <span class="fi">🗺️</span>
            <div class="ftt">Field Visit Tracker</div>
            <div class="fd">Log visits with GPS, client name, and summary from WhatsApp.</div>
          </div>
          <div class="card">
            <span class="fi">📋</span>
            <div class="ftt">Policy Q&amp;A Bot</div>
            <div class="fd">Upload HR docs. Bot answers employee questions 24/7.</div>
          </div>
          <div class="card">
            <span class="fi">✅</span>
            <div class="ftt">Task Management</div>
            <div class="fd">Assign tasks, track completion, maintain full activity log.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 5: HOW IT WORKS -->
    <section data-background-color="#06191E">
      <div class="slide-inner">
        <span class="lbl">How It Works</span>
        <h2>Set up in a day.<br>Running by tomorrow.</h2>
        <div class="g3" style="margin-top:28px;">
          <div class="card" style="text-align:center;">
            <div class="sn" style="margin:0 auto 12px;">1</div>
            <div class="stt">Onboard</div>
            <div class="sdd">Add your team, configure branches and leave policies, upload HR documents. Under one hour.</div>
          </div>
          <div class="card" style="text-align:center;">
            <div class="sn" style="margin:0 auto 12px;">2</div>
            <div class="stt">Connect</div>
            <div class="sdd">Each employee sends one message to the WhatsApp bot. Active in 60 seconds — no downloads needed.</div>
          </div>
          <div class="card" style="text-align:center;">
            <div class="sn" style="margin:0 auto 12px;">3</div>
            <div class="stt">Track</div>
            <div class="sdd">Every check-in, leave, expense, and visit flows into your admin dashboard live.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 6: PRICING -->
    <section data-background-color="#06191E">
      <div class="slide-inner">
        <span class="lbl">Pricing</span>
        <h2>Simple pricing.<br>No surprises.</h2>
        <p style="margin-bottom:24px;">One flat price. All features. Unlimited employees.</p>
        <div class="g2" style="max-width:580px;">
          <div class="card">
            <div class="pp">Monthly</div>
            <div class="pa">₹5,000</div>
            <div class="pper">per month</div>
            <div class="psave">&nbsp;</div>
            <div class="pnote">All features included.<br>Cancel anytime.</div>
          </div>
          <div class="card" style="border-color:var(--primary); box-shadow:0 0 28px var(--glow); position:relative; padding-top:32px;">
            <div class="pbadge" style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);white-space:nowrap;">Best Value</div>
            <div class="pp">Annual</div>
            <div class="pa">₹50,000</div>
            <div class="pper">per year</div>
            <div class="psave">Save ₹10,000</div>
            <div class="pnote">All features included.<br>Priority support.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 7: BOOK A DEMO -->
    <section data-background-color="#06191E">
      <div class="slide-inner" style="text-align:center; align-items:center;">
        <span class="lbl" style="text-align:center;">Get Started</span>
        <h2 style="text-align:center;">See it live in<br>20 minutes.</h2>
        <p style="text-align:center; max-width:440px; margin:12px auto 24px;">We'll walk you through the full product. No commitment. No sales pressure.</p>
        <a href="mailto:manthanjethwani@phazeai.com" class="cta-btn">Book a Demo →</a>
        <p style="margin-top:20px; font-size:0.65em;">
          <span style="color:var(--secondary);">manthanjethwani@phazeai.com</span>
          &nbsp;·&nbsp;
          <span style="color:var(--secondary);">+91 7990700545</span>
        </p>
      </div>
    </section>

    <!-- SLIDE 8: THANK YOU -->
    <section data-background-color="#06191E">
      <div class="slide-inner">
        <span class="lbl">Phaze AI</span>
        <h1>Thank you.</h1>
        <p style="margin-top:8px; font-size:0.9em; color:var(--light); font-weight:600;">Manthan Jethwani — Founder</p>
        <div class="cr">
          <div class="ci">✉&nbsp; <a href="mailto:manthanjethwani@phazeai.com">manthanjethwani@phazeai.com</a></div>
          <div class="ci">📞&nbsp; <a href="tel:+917990700545">+91 7990700545</a></div>
          <div class="ci">🌐&nbsp; <a href="https://www.phazeai.com" target="_blank">www.phazeai.com</a></div>
        </div>
        <p style="margin-top:28px; font-size:0.6em; font-style:italic; color:var(--muted);">"Automating What Drains Your Time"</p>
      </div>
    </section>

  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
<script>
  Reveal.initialize({
    hash: true,
    transition: 'fade',
    transitionSpeed: 'fast',
    progress: true,
    slideNumber: 'c/t',
    controls: true,
    center: false,
    margin: 0.06,
  });
</script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `C:\Users\nisup\Downloads\HRMS Pitch Deck\deck\index.html` in Chrome.

Check each of the following:
- [ ] Slide 1 (Cover): "HR that runs itself." with teal accent, pill tag visible, dark background
- [ ] Arrow keys / spacebar advance slides
- [ ] Slide progress bar visible at top in teal
- [ ] Slide counter shown bottom-right (e.g. "1 / 8")
- [ ] Slide 6 (Pricing): Annual card has "Best Value" badge and teal border glow
- [ ] Slide 7 (CTA): "Book a Demo →" button links to mailto
- [ ] Slide 8 (Thank You): all three contact lines visible
- [ ] Press F for fullscreen — slides fill the screen cleanly
- [ ] Press ESC — slide overview grid appears

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Scrollable website with 8 sections
- ✅ Reveal.js deck with 8 slides
- ✅ Phaze AI brand colours (#06191E, #13768D, #64919F, #8FA2A4, #F7F7F7)
- ✅ Inter font via Google Fonts CDN
- ✅ Pricing: ₹5,000/mo, ₹50,000/yr, Save ₹10,000
- ✅ CTA: Book a Demo + Contact Us (mailto links)
- ✅ Contact: Manthan Jethwani, manthanjethwani@phazeai.com, +91 7990700545
- ✅ All 6 features documented
- ✅ Scroll animations on website (Intersection Observer)
- ✅ Responsive breakpoints on website
- ✅ Reveal.js keyboard nav, progress, slide numbers, fullscreen
- ✅ No backend required — static HTML only
- ✅ README with instructions

**No placeholders found.** All code is complete and executable.
