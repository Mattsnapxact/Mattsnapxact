<?php
/**
 * Template Name: SnapXact Homepage V2
 * Description: SnapXact landing page — Infrastructure Intelligence
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

// Get CF7 form shortcode — user will replace with their actual form ID
$cf7_shortcode = '[contact-form-7 id="REPLACE_WITH_FORM_ID" title="Contact Form"]';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SnapXact &mdash; Infrastructure Intelligence</title>
<?php wp_head(); ?>
<style>
/* ── Reset & Base ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --brand:#0f766e;--brand-dark:#0d6560;--brand-light:#ccfbf1;--brand-50:#f0fdfa;
  --surface-50:#f8fafc;--surface-100:#f1f5f9;--surface-200:#e2e8f0;--surface-300:#cbd5e1;
  --surface-400:#94a3b8;--surface-500:#64748b;--surface-600:#475569;--surface-700:#334155;
  --surface-800:#1e293b;--surface-900:#0f172a;
  --red:#ef4444;--amber:#f59e0b;--green:#22c55e;
}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:var(--surface-800);line-height:1.6;background:#fff}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}

/* ── Layout ── */
.sx-container{max-width:1200px;margin:0 auto;padding:0 24px}

/* ── Header / Nav ── */
.sx-header{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.97);backdrop-filter:blur(8px);border-bottom:1px solid var(--surface-200)}
.sx-nav{display:flex;align-items:center;justify-content:space-between;height:64px}
.sx-logo{font-size:1.35rem;font-weight:700;color:var(--surface-900);display:flex;align-items:center;gap:8px}
.sx-logo-icon{width:32px;height:32px;background:var(--brand);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:.85rem}
.sx-nav-links{display:flex;align-items:center;gap:32px;list-style:none}
.sx-nav-links a{font-size:.9rem;font-weight:500;color:var(--surface-600);transition:color .2s}
.sx-nav-links a:hover{color:var(--brand)}
.sx-btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 22px;border-radius:8px;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .2s;border:none}
.sx-btn-primary{background:var(--brand);color:#fff}
.sx-btn-primary:hover{background:var(--brand-dark)}
.sx-btn-outline{border:1.5px solid var(--surface-300);color:var(--surface-700);background:transparent}
.sx-btn-outline:hover{border-color:var(--brand);color:var(--brand)}
.sx-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
.sx-hamburger span{display:block;width:24px;height:2px;background:var(--surface-700);border-radius:2px;transition:all .3s}
.sx-mobile-menu{display:none;position:absolute;top:64px;left:0;right:0;background:#fff;border-bottom:1px solid var(--surface-200);padding:16px 24px;box-shadow:0 4px 12px rgba(0,0,0,.08)}
.sx-mobile-menu.is-open{display:block}
.sx-mobile-menu a{display:block;padding:12px 0;font-size:.95rem;font-weight:500;color:var(--surface-700);border-bottom:1px solid var(--surface-100)}
.sx-mobile-menu a:last-child{border:none}
.sx-mobile-menu .sx-btn{width:100%;margin-top:8px;text-align:center}

/* ── Hero ── */
.sx-hero{padding:80px 0 60px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.sx-hero-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:var(--brand-50);border:1px solid var(--brand-light);border-radius:100px;font-size:.8rem;font-weight:600;color:var(--brand);margin-bottom:20px}
.sx-hero h1{font-size:3rem;font-weight:800;line-height:1.15;color:var(--surface-900);margin-bottom:20px}
.sx-hero p{font-size:1.1rem;color:var(--surface-500);line-height:1.7;margin-bottom:32px;max-width:520px}
.sx-hero-actions{display:flex;gap:12px;flex-wrap:wrap}

/* ── Sector Tabs ── */
.sx-sector-tabs{display:flex;gap:0;margin-bottom:0;border-radius:10px 10px 0 0;overflow:hidden;border:1px solid var(--surface-200);border-bottom:none}
.sx-sector-tab{flex:1;padding:10px 16px;text-align:center;font-size:.82rem;font-weight:600;cursor:pointer;background:var(--surface-50);color:var(--surface-500);border:none;transition:all .2s;border-right:1px solid var(--surface-200)}
.sx-sector-tab:last-child{border-right:none}
.sx-sector-tab.active{background:#fff;color:var(--brand);box-shadow:inset 0 2px 0 var(--brand)}

/* ── Report Card ── */
.sx-report-card{background:#fff;border-radius:0 0 16px 16px;border:1px solid var(--surface-200);border-top:none;padding:28px;box-shadow:0 8px 30px rgba(0,0,0,.06)}
.sx-report-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}
.sx-report-header h3{font-size:1.05rem;font-weight:700;color:var(--surface-900)}
.sx-report-header p{font-size:.78rem;color:var(--surface-400);margin-top:4px}
.sx-report-badge{font-size:.75rem;padding:4px 10px;border-radius:6px;background:var(--brand-50);color:var(--brand);font-weight:600}
.sx-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.sx-stat{text-align:center;padding:14px 8px;background:var(--surface-50);border-radius:10px}
.sx-stat-value{font-size:1.3rem;font-weight:800;color:var(--surface-900)}
.sx-stat-label{font-size:.7rem;color:var(--surface-500);margin-top:2px}
.sx-risk-section h4{font-size:.85rem;font-weight:700;color:var(--surface-800);margin-bottom:12px}
.sx-risk-bar{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:.78rem}
.sx-risk-bar span:first-child{min-width:140px;color:var(--surface-600)}
.sx-risk-track{flex:1;height:6px;background:var(--surface-100);border-radius:10px;overflow:hidden}
.sx-risk-fill{height:100%;border-radius:10px}
.sx-risk-fill.high{background:var(--red)}
.sx-risk-fill.med{background:var(--amber)}
.sx-risk-bar span:last-child{min-width:32px;text-align:right;font-weight:700;color:var(--surface-700)}

/* ── Table ── */
.sx-table-section{margin-top:20px}
.sx-table-section h4{font-size:.85rem;font-weight:700;color:var(--surface-800);margin-bottom:10px}
.sx-table{width:100%;border-collapse:collapse;font-size:.78rem}
.sx-table th{text-align:left;padding:8px 10px;background:var(--surface-50);color:var(--surface-500);font-weight:600;border-bottom:1px solid var(--surface-200)}
.sx-table td{padding:8px 10px;border-bottom:1px solid var(--surface-100);color:var(--surface-700)}
.sx-table tr.highlight td{font-weight:700;color:var(--brand)}
.sx-report-footer{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--surface-100);font-size:.75rem;color:var(--surface-400)}

/* ── Feature Bar ── */
.sx-features{padding:48px 0;border-top:1px solid var(--surface-200);border-bottom:1px solid var(--surface-200);background:var(--surface-50)}
.sx-features h2{text-align:center;font-size:1.15rem;font-weight:700;color:var(--surface-800);margin-bottom:32px}
.sx-feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.sx-feature{text-align:center;padding:20px 12px}
.sx-feature-icon{font-size:1.5rem;margin-bottom:8px}
.sx-feature-title{font-size:.82rem;font-weight:700;color:var(--surface-800);margin-bottom:4px}
.sx-feature-desc{font-size:.78rem;color:var(--surface-500)}
.sx-feature-value{font-size:1.6rem;font-weight:800;color:var(--brand)}

/* ── Section Styling ── */
.sx-section{padding:80px 0}
.sx-section-alt{background:var(--surface-50)}
.sx-section-header{text-align:center;max-width:680px;margin:0 auto 48px}
.sx-section-header h2{font-size:2.2rem;font-weight:800;color:var(--surface-900);margin-bottom:12px}
.sx-section-header p{font-size:1.05rem;color:var(--surface-500)}

/* ── Problem Cards ── */
.sx-problem-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.sx-problem-card{padding:28px;background:#fff;border:1px solid var(--surface-200);border-radius:12px;transition:box-shadow .2s}
.sx-problem-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.06)}
.sx-problem-card .icon{font-size:1.6rem;margin-bottom:12px}
.sx-problem-card h3{font-size:1rem;font-weight:700;color:var(--surface-800);margin-bottom:8px}
.sx-problem-card p{font-size:.88rem;color:var(--surface-500);line-height:1.6}

/* ── Two Ways ── */
.sx-ways-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}
.sx-way-card{padding:36px;border-radius:16px;border:1px solid var(--surface-200);background:#fff}
.sx-way-card h3{font-size:1.2rem;font-weight:700;color:var(--surface-900);margin:16px 0 8px}
.sx-way-card .subtitle{font-size:.9rem;color:var(--brand);font-weight:600;margin-bottom:16px}
.sx-way-card ul{list-style:none;margin:0 0 24px;padding:0}
.sx-way-card li{padding:6px 0;font-size:.88rem;color:var(--surface-600);display:flex;align-items:flex-start;gap:8px}
.sx-way-card li::before{content:'';display:inline-block;width:6px;height:6px;background:var(--brand);border-radius:50%;margin-top:8px;flex-shrink:0}
.sx-way-icon{font-size:2rem}

/* ── Steps ── */
.sx-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.sx-step{text-align:center;padding:24px 16px}
.sx-step-num{width:44px;height:44px;background:var(--brand);color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;margin-bottom:16px}
.sx-step h3{font-size:1.05rem;font-weight:700;margin-bottom:8px;color:var(--surface-900)}
.sx-step p{font-size:.88rem;color:var(--surface-500);line-height:1.6}

/* ── Sector Cards ── */
.sx-sector-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.sx-sector-card{padding:28px;background:#fff;border:1px solid var(--surface-200);border-radius:12px;transition:box-shadow .2s}
.sx-sector-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.06)}
.sx-sector-card .icon{font-size:1.8rem;margin-bottom:12px}
.sx-sector-card h3{font-size:1rem;font-weight:700;color:var(--surface-800);margin-bottom:8px}
.sx-sector-card p{font-size:.85rem;color:var(--surface-500);line-height:1.6}
.sx-sector-card.span-2{grid-column:span 2}

/* ── Sample Reports ── */
.sx-samples{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
.sx-sample-card{display:flex;align-items:center;gap:16px;padding:24px;background:#fff;border:1px solid var(--surface-200);border-radius:12px;cursor:pointer;transition:all .2s;text-decoration:none;color:inherit}
.sx-sample-card:hover{border-color:var(--brand);box-shadow:0 4px 16px rgba(0,0,0,.06)}
.sx-sample-icon{font-size:2rem;flex-shrink:0}
.sx-sample-card h3{font-size:.95rem;font-weight:700;color:var(--surface-800)}
.sx-sample-card p{font-size:.8rem;color:var(--surface-500);margin-top:2px}
.sx-sample-arrow{margin-left:auto;font-size:1.2rem;color:var(--surface-400);flex-shrink:0}

/* ── Contact ── */
.sx-contact{padding:80px 0;background:var(--surface-900);color:#fff}
.sx-contact .sx-section-header h2{color:#fff}
.sx-contact .sx-section-header p{color:var(--surface-400)}
.sx-contact-form{max-width:560px;margin:0 auto}
/* CF7 form styling overrides */
.sx-contact-form .wpcf7-form p{margin-bottom:16px}
.sx-contact-form label{display:block;font-size:.85rem;font-weight:500;color:var(--surface-300);margin-bottom:6px}
.sx-contact-form input[type="text"],
.sx-contact-form input[type="email"],
.sx-contact-form textarea{width:100%;padding:12px 16px;border:1px solid var(--surface-600);border-radius:8px;background:var(--surface-800);color:#fff;font-size:.9rem;font-family:inherit;transition:border-color .2s}
.sx-contact-form input:focus,.sx-contact-form textarea:focus{outline:none;border-color:var(--brand)}
.sx-contact-form textarea{min-height:120px;resize:vertical}
.sx-contact-form input[type="submit"],.sx-contact-form .wpcf7-submit{width:100%;padding:14px;background:var(--brand);color:#fff;border:none;border-radius:8px;font-size:.95rem;font-weight:600;cursor:pointer;transition:background .2s}
.sx-contact-form input[type="submit"]:hover,.sx-contact-form .wpcf7-submit:hover{background:var(--brand-dark)}
.sx-contact-form .wpcf7-response-output{border-radius:8px;margin-top:16px;padding:12px;font-size:.85rem}
.sx-contact-note{text-align:center;margin-top:20px;font-size:.82rem;color:var(--surface-500)}

/* ── Footer ── */
.sx-footer{padding:40px 0;border-top:1px solid var(--surface-200);background:var(--surface-50)}
.sx-footer-inner{display:flex;align-items:center;justify-content:space-between}
.sx-footer-links{display:flex;gap:24px;list-style:none}
.sx-footer-links a{font-size:.85rem;color:var(--surface-500);transition:color .2s}
.sx-footer-links a:hover{color:var(--brand)}
.sx-footer-copy{font-size:.82rem;color:var(--surface-400)}

/* ── Responsive ── */
@media(max-width:1024px){
  .sx-hero{grid-template-columns:1fr;gap:40px}
  .sx-hero h1{font-size:2.4rem}
  .sx-sector-grid{grid-template-columns:repeat(2,1fr)}
  .sx-sector-card.span-2{grid-column:span 1}
}
@media(max-width:768px){
  .sx-nav-links{display:none}
  .sx-hamburger{display:flex}
  .sx-hero{padding:48px 0 32px}
  .sx-hero h1{font-size:2rem}
  .sx-stat-grid{grid-template-columns:repeat(2,1fr)}
  .sx-feature-grid{grid-template-columns:repeat(2,1fr)}
  .sx-problem-grid{grid-template-columns:1fr}
  .sx-ways-grid{grid-template-columns:1fr}
  .sx-steps{grid-template-columns:1fr;gap:16px}
  .sx-sector-grid{grid-template-columns:1fr}
  .sx-samples{grid-template-columns:1fr}
  .sx-section-header h2{font-size:1.7rem}
  .sx-footer-inner{flex-direction:column;gap:16px;text-align:center}
  .sx-risk-bar span:first-child{min-width:110px;font-size:.72rem}
  .sx-table{font-size:.7rem}
}
@media(max-width:480px){
  .sx-hero h1{font-size:1.6rem}
  .sx-hero-actions{flex-direction:column}
  .sx-hero-actions .sx-btn{width:100%}
  .sx-stat-grid{grid-template-columns:repeat(2,1fr);gap:8px}
  .sx-stat-value{font-size:1.1rem}
}
</style>
</head>
<body>

<!-- ══════════ HEADER ══════════ -->
<header class="sx-header">
  <div class="sx-container">
    <nav class="sx-nav">
      <a href="<?php echo home_url(); ?>" class="sx-logo">
        <div class="sx-logo-icon">SX</div>
        SnapXact
      </a>

      <ul class="sx-nav-links">
        <li><a href="<?php echo home_url('/services'); ?>">Services</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#sectors">Sectors</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#contact" class="sx-btn sx-btn-primary">Get In Touch</a></li>
      </ul>

      <button class="sx-hamburger" id="sx-hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <div class="sx-mobile-menu" id="sx-mobile-menu">
      <a href="<?php echo home_url('/services'); ?>">Services</a>
      <a href="#how-it-works" class="sx-mobile-nav-link">How It Works</a>
      <a href="#sectors" class="sx-mobile-nav-link">Sectors</a>
      <a href="#contact" class="sx-mobile-nav-link">Contact</a>
      <a href="#contact" class="sx-btn sx-btn-primary sx-mobile-nav-link">Get In Touch</a>
    </div>
  </div>
</header>

<!-- ══════════ HERO ══════════ -->
<section class="sx-section">
  <div class="sx-container">
    <div class="sx-hero">
      <div>
        <div class="sx-hero-badge">Infrastructure Intelligence</div>
        <h1>Your buildings. Your assets. Fully visible.</h1>
        <p>SnapXact gives schools, care homes and facility operators a continuously accurate picture of everything they own &mdash; without complex systems, spreadsheets, or guesswork.</p>
        <div class="sx-hero-actions">
          <a href="#reports" class="sx-btn sx-btn-primary">See a Sample Report &rarr;</a>
          <a href="<?php echo home_url('/services'); ?>" class="sx-btn sx-btn-outline">Explore Services</a>
        </div>
      </div>

      <div>
        <!-- Sector tabs -->
        <div class="sx-sector-tabs">
          <button class="sx-sector-tab active" data-sector="education">Schools &amp; MATs</button>
          <button class="sx-sector-tab" data-sector="care">Care Homes</button>
          <button class="sx-sector-tab" data-sector="fm">Facilities Management</button>
        </div>

        <!-- Report preview card -->
        <div class="sx-report-card">
          <div class="sx-report-header">
            <div>
              <h3>Asset Intelligence Report</h3>
              <p>Greenfield Academy Trust &middot; 6 Sites &middot; February 2026</p>
            </div>
            <span class="sx-report-badge">Example Report</span>
          </div>

          <div class="sx-stat-grid">
            <div class="sx-stat"><div class="sx-stat-value">1,247</div><div class="sx-stat-label">Total Assets</div></div>
            <div class="sx-stat"><div class="sx-stat-value">&pound;892k</div><div class="sx-stat-label">Estate Value</div></div>
            <div class="sx-stat"><div class="sx-stat-value">134</div><div class="sx-stat-label">High Risk Devices</div></div>
            <div class="sx-stat"><div class="sx-stat-value">6</div><div class="sx-stat-label">Sites Covered</div></div>
          </div>

          <div class="sx-risk-section">
            <h4>Risk Exposure Profile</h4>
            <div class="sx-risk-bar"><span>Legacy devices (5+ yrs)</span><div class="sx-risk-track"><div class="sx-risk-fill high" style="width:68%"></div></div><span>68%</span></div>
            <div class="sx-risk-bar"><span>EHCP / GDPR exposure</span><div class="sx-risk-track"><div class="sx-risk-fill high" style="width:74%"></div></div><span>74%</span></div>
            <div class="sx-risk-bar"><span>Untracked devices</span><div class="sx-risk-track"><div class="sx-risk-fill med" style="width:51%"></div></div><span>51%</span></div>
            <div class="sx-risk-bar"><span>No replacement plan</span><div class="sx-risk-track"><div class="sx-risk-fill high" style="width:83%"></div></div><span>83%</span></div>
          </div>

          <div class="sx-table-section">
            <h4>3-Year Financial Planning Horizon</h4>
            <table class="sx-table">
              <thead><tr><th>Scenario</th><th>Yr 1</th><th>Yr 2</th><th>Yr 3</th><th>Total</th></tr></thead>
              <tbody>
                <tr><td>Low</td><td>&pound;58,400</td><td>&pound;43,800</td><td>&pound;35,040</td><td>&pound;137,240</td></tr>
                <tr class="highlight"><td>Mid &#10003;</td><td>&pound;94,600</td><td>&pound;70,950</td><td>&pound;56,760</td><td>&pound;222,310</td></tr>
                <tr><td>High</td><td>&pound;148,200</td><td>&pound;111,150</td><td>&pound;88,920</td><td>&pound;348,270</td></tr>
              </tbody>
            </table>
          </div>

          <div class="sx-report-footer">
            <span>Governor &amp; Ofsted ready &middot; PDF export</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ FEATURE BAR ══════════ -->
<section class="sx-features">
  <div class="sx-container">
    <h2>SnapXact Intelligence</h2>
    <div class="sx-feature-grid">
      <div class="sx-feature">
        <div class="sx-feature-icon">&#128247;</div>
        <div class="sx-feature-title">Photo &rarr; data in seconds</div>
        <div class="sx-feature-value">Seconds</div>
        <div class="sx-feature-desc">Label to clean data</div>
      </div>
      <div class="sx-feature">
        <div class="sx-feature-icon">&#10003;</div>
        <div class="sx-feature-title">Report ready for your board</div>
        <div class="sx-feature-value">&pound;0</div>
        <div class="sx-feature-desc">Ongoing subscription</div>
      </div>
      <div class="sx-feature">
        <div class="sx-feature-icon">&#128196;</div>
        <div class="sx-feature-title">Governance reports</div>
        <div class="sx-feature-value">11+</div>
        <div class="sx-feature-desc">Page governance reports</div>
      </div>
      <div class="sx-feature">
        <div class="sx-feature-icon">&#128736;</div>
        <div class="sx-feature-title">Zero setup</div>
        <div class="sx-feature-value">Zero</div>
        <div class="sx-feature-desc">Systems to install or learn</div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ THE PROBLEM ══════════ -->
<section class="sx-section">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>Most organisations don&rsquo;t truly know what they own.</h2>
      <p>Asset registers are updated once a year &mdash; if at all. Equipment is lost, misattributed, or written off without evidence. Compliance checks rely on spreadsheets nobody trusts.</p>
      <p style="margin-top:12px">For schools facing Ofsted scrutiny and care homes under CQC oversight, this invisible gap is a real governance risk.</p>
    </div>
    <div class="sx-problem-grid">
      <div class="sx-problem-card"><div class="icon">&#128203;</div><h3>Stale asset registers</h3><p>Data that&rsquo;s months or years out of date, with no reliable way to reconcile what&rsquo;s recorded with what&rsquo;s actually there.</p></div>
      <div class="sx-problem-card"><div class="icon">&#9888;&#65039;</div><h3>Hidden compliance risk</h3><p>EHCP-linked devices, warranty-lapsed equipment, and untracked high-value assets sitting in blind spots.</p></div>
      <div class="sx-problem-card"><div class="icon">&#128184;</div><h3>Invisible cost leakage</h3><p>Organisations routinely over-order, under-utilise, and replace equipment that didn&rsquo;t need replacing.</p></div>
      <div class="sx-problem-card"><div class="icon">&#128269;</div><h3>Audit anxiety</h3><p>When inspectors arrive, teams scramble to produce evidence that should have been clean and current all along.</p></div>
    </div>
  </div>
</section>

<!-- ══════════ TWO WAYS IN ══════════ -->
<section class="sx-section sx-section-alt">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>Two Ways In</h2>
      <p>Different starting points. Same intelligence. Whether you need to capture assets yourself or want us to do it for you, SnapXact delivers the same outcome: a clean, accurate, governance-ready picture of your estate.</p>
    </div>
    <div class="sx-ways-grid">
      <div class="sx-way-card">
        <div class="sx-way-icon">&#128241;</div>
        <h3>Self-Serve &middot; The App</h3>
        <div class="subtitle">Scan it yourself</div>
        <p style="font-size:.9rem;color:var(--surface-500);margin-bottom:16px">Point your phone at any equipment label. SnapXact reads the make, model, serial number and identity data automatically &mdash; no training, no setup, nothing to install.</p>
        <ul>
          <li>Any label, any device, any room</li>
          <li>Data extracted in seconds</li>
          <li>Export clean CSV instantly</li>
          <li>Works offline, syncs automatically</li>
          <li>Duplicate detection built in</li>
        </ul>
        <a href="<?php echo home_url('/services'); ?>" class="sx-btn sx-btn-primary">Get started with the app &rarr;</a>
      </div>
      <div class="sx-way-card">
        <div class="sx-way-icon">&#127979;</div>
        <h3>Managed Service &middot; The Audit</h3>
        <div class="subtitle">We do it for you</div>
        <p style="font-size:.9rem;color:var(--surface-500);margin-bottom:16px">Our team visits your site, walks every room, photographs and verifies every asset, and returns a complete intelligence report. One visit. No disruption. No ongoing commitment.</p>
        <ul>
          <li>Full physical verification on-site</li>
          <li>Risk flagging &amp; lifecycle clustering</li>
          <li>11-page governance-ready report</li>
          <li>CFO and board-facing format</li>
          <li>MAT-wide trust reporting available</li>
        </ul>
        <a href="#contact" class="sx-btn sx-btn-primary sx-scroll-link">Book a discovery call &rarr;</a>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ HOW IT WORKS ══════════ -->
<section class="sx-section" id="how-it-works">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>How It Works</h2>
      <p>Simple by design. Powerful by intent. If you can use a camera app, you can use SnapXact. The intelligence lives beneath the surface.</p>
    </div>
    <div class="sx-steps">
      <div class="sx-step">
        <div class="sx-step-num">1</div>
        <h3>Photograph</h3>
        <p>Take a photo of any equipment label &mdash; laptops, monitors, medical devices, fire equipment, anything with a serial number or identifier.</p>
      </div>
      <div class="sx-step">
        <div class="sx-step-num">2</div>
        <h3>Analyse</h3>
        <p>SnapXact reads the label, extracts make, model, serial number and identity data, flags risks, and structures everything automatically.</p>
      </div>
      <div class="sx-step">
        <div class="sx-step-num">3</div>
        <h3>Intelligence</h3>
        <p>Download clean CSV data or a full governance report &mdash; ready for your MIS, finance system, insurer, or next board meeting.</p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ SECTORS ══════════ -->
<section class="sx-section sx-section-alt" id="sectors">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>Who It&rsquo;s For</h2>
      <p>Built for compliance-driven organisations. Any organisation that owns equipment and needs to account for it accurately &mdash; especially where governance matters.</p>
    </div>
    <div class="sx-sector-grid">
      <div class="sx-sector-card span-2">
        <div class="icon">&#127979;</div>
        <h3>Schools &amp; Multi-Academy Trusts</h3>
        <p>IT audits, EHCP compliance, governor readiness, Ofsted evidence, and trust-wide reporting across multiple sites.</p>
      </div>
      <div class="sx-sector-card">
        <div class="icon">&#127973;</div>
        <h3>Care Homes &amp; Healthcare</h3>
        <p>Medical devices, CQC compliance, consumable tracking, and condition evidence for inspections.</p>
      </div>
      <div class="sx-sector-card">
        <div class="icon">&#128421;</div>
        <h3>Corporate IT</h3>
        <p>Device onboarding, offboarding, refresh cycles, warranty tracking, and accurate asset registers at scale.</p>
      </div>
      <div class="sx-sector-card">
        <div class="icon">&#128295;</div>
        <h3>Facilities &amp; Operations</h3>
        <p>Tools, safety equipment, PAT testing compliance, and physical condition documentation across sites.</p>
      </div>
      <div class="sx-sector-card">
        <div class="icon">&#128737;</div>
        <h3>Insurance &amp; Risk</h3>
        <p>Evidence of condition, serial tracking, loss documentation, and asset schedules that insurers trust.</p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ SAMPLE REPORTS ══════════ -->
<section class="sx-section" id="reports">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>See It In Action</h2>
      <p>See what a SnapXact intelligence report actually looks like. Real governance reports &mdash; asset register, lifecycle analysis, risk flagging, and a CFO-ready financial summary. Choose your sector. No signup required.</p>
    </div>
    <div class="sx-samples">
      <a href="https://snapxact.com/wp-content/uploads/SnapXact-Preview-Education.pdf" target="_blank" rel="noopener" class="sx-sample-card">
        <div class="sx-sample-icon">&#127979;</div>
        <div><h3>Education</h3><p>Schools &amp; MATs</p></div>
        <div class="sx-sample-arrow">&rarr;</div>
      </a>
      <a href="https://snapxact.com/wp-content/uploads/SnapXact-Example-Care-Sector.pdf" target="_blank" rel="noopener" class="sx-sample-card">
        <div class="sx-sample-icon">&#127973;</div>
        <div><h3>Care</h3><p>Care Homes &amp; Healthcare</p></div>
        <div class="sx-sample-arrow">&rarr;</div>
      </a>
      <a href="https://snapxact.com/wp-content/uploads/SnapXact-Preview-Enterprise.pdf" target="_blank" rel="noopener" class="sx-sample-card">
        <div class="sx-sample-icon">&#127970;</div>
        <div><h3>Business / Enterprise</h3><p>Corporate &amp; Facilities</p></div>
        <div class="sx-sample-arrow">&rarr;</div>
      </a>
    </div>
    <p style="text-align:center;margin-top:24px"><a href="#contact" class="sx-btn sx-btn-outline sx-scroll-link">Or get in touch directly</a></p>
  </div>
</section>

<!-- ══════════ CONTACT ══════════ -->
<section class="sx-contact" id="contact">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>Ready to see what you actually own?</h2>
      <p>Whether you need the app, an on-site audit, or just want to ask a question &mdash; we&rsquo;d love to hear from you.</p>
    </div>
    <div class="sx-contact-form">
      <?php echo do_shortcode($cf7_shortcode); ?>
    </div>
    <p class="sx-contact-note">No obligation &middot; No sales pressure &middot; Just a conversation</p>
  </div>
</section>

<!-- ══════════ FOOTER ══════════ -->
<footer class="sx-footer">
  <div class="sx-container">
    <div class="sx-footer-inner">
      <a href="<?php echo home_url(); ?>" class="sx-logo">
        <div class="sx-logo-icon">SX</div>
        SnapXact
      </a>
      <ul class="sx-footer-links">
        <li><a href="<?php echo home_url('/services'); ?>">Services</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#sectors">Sectors</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <span class="sx-footer-copy">&copy; <?php echo date('Y'); ?> SnapXact. Asset Intelligence Services.</span>
    </div>
  </div>
</footer>

<script>
(function(){
  /* ── Mobile menu toggle ── */
  var hamburger = document.getElementById('sx-hamburger');
  var mobileMenu = document.getElementById('sx-mobile-menu');
  var spans = hamburger.querySelectorAll('span');

  hamburger.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('is-open');
    /* Animate hamburger to X */
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity = open ? '0' : '1';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });

  /* Close mobile menu on link click */
  var mobileLinks = document.querySelectorAll('.sx-mobile-nav-link');
  mobileLinks.forEach(function(link){
    link.addEventListener('click', function(){
      mobileMenu.classList.remove('is-open');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    });
  });

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        /* Update URL without jump */
        history.pushState(null, null, this.getAttribute('href'));
      }
    });
  });

  /* ── Sector tab switching (cosmetic) ── */
  var tabs = document.querySelectorAll('.sx-sector-tab');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });
})();
</script>

<?php wp_footer(); ?>
</body>
</html>
