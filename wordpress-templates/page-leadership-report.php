<?php
/**
 * Template Name: SnapXact Leadership Report
 * Description: Leadership Report landing page — outreach page for CFOs, COOs and CEOs
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

// CF7 form shortcode — replace with your actual form ID after creating the form in WP admin
$cf7_shortcode = '[contact-form-7 id="REPLACE_WITH_FORM_ID" title="Leadership Report Request"]';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SnapXact Leadership Report | Infrastructure Intelligence</title>
<meta name="description" content="Turn existing asset registers into governance-ready insight for audit, insurance and capital planning. Built for CFOs, COOs and CEOs.">
<meta property="og:title" content="SnapXact Leadership Report | Infrastructure Intelligence">
<meta property="og:description" content="Turn existing asset registers into governance-ready insight for audit, insurance and capital planning. Built for CFOs, COOs and CEOs.">
<meta property="og:url" content="https://snapxact.com/leadership-report">
<meta property="og:type" content="website">
<meta property="og:image" content="<?php echo home_url('/wp-content/uploads/snapxact-og.png'); ?>">
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

/* ── Sections ── */
.sx-section{padding:80px 0}
.sx-section-alt{background:var(--surface-50)}
.sx-section-header{text-align:center;max-width:680px;margin:0 auto 48px}
.sx-section-header h2{font-size:2.2rem;font-weight:800;color:var(--surface-900);margin-bottom:12px}
.sx-section-header p{font-size:1.05rem;color:var(--surface-500)}

/* ── Hero (centered variant for landing page) ── */
.sx-lp-hero{padding:80px 0 64px;text-align:center}
.sx-lp-hero .sx-hero-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:var(--brand-50);border:1px solid var(--brand-light);border-radius:100px;font-size:.8rem;font-weight:600;color:var(--brand);margin-bottom:24px}
.sx-lp-hero h1{font-size:2.6rem;font-weight:800;line-height:1.2;color:var(--surface-900);max-width:780px;margin:0 auto 20px}
.sx-lp-hero .sx-hero-sub{font-size:1.1rem;color:var(--surface-500);line-height:1.7;max-width:640px;margin:0 auto 32px}
.sx-hero-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.sx-hero-credibility{margin-top:20px;font-size:.82rem;color:var(--surface-400)}

/* ── Visibility Gap ── */
.sx-gap-content{max-width:680px;margin:0 auto}
.sx-gap-content p{font-size:1rem;color:var(--surface-600);line-height:1.7;margin-bottom:12px}

/* ── Reveals list ── */
.sx-reveals{max-width:720px;margin:0 auto}
.sx-reveals p{font-size:1rem;color:var(--surface-600);line-height:1.7;margin-bottom:20px}
.sx-reveals ul{list-style:none;padding:0;margin:0}
.sx-reveals li{padding:10px 0;font-size:.95rem;color:var(--surface-700);display:flex;align-items:flex-start;gap:10px;border-bottom:1px solid var(--surface-100)}
.sx-reveals li:last-child{border-bottom:none}
.sx-reveals li::before{content:'';display:inline-block;width:7px;height:7px;background:var(--brand);border-radius:50%;margin-top:8px;flex-shrink:0}

/* ── Steps ── */
.sx-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.sx-step{text-align:center;padding:24px 16px}
.sx-step-num{width:44px;height:44px;background:var(--brand);color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;margin-bottom:16px}
.sx-step h3{font-size:1.05rem;font-weight:700;margin-bottom:8px;color:var(--surface-900)}
.sx-step p{font-size:.88rem;color:var(--surface-500);line-height:1.6}
.sx-step-closing{text-align:center;margin-top:32px;font-size:1rem;font-weight:600;color:var(--surface-700);font-style:italic}

/* ── Who cards ── */
.sx-who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.sx-who-card{padding:28px;background:#fff;border:1px solid var(--surface-200);border-radius:12px;transition:box-shadow .2s}
.sx-who-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.06)}
.sx-who-card h3{font-size:1rem;font-weight:700;color:var(--surface-800);margin-bottom:8px}
.sx-who-card p{font-size:.88rem;color:var(--surface-500);line-height:1.6}

/* ── Form section ── */
.sx-form-section{padding:80px 0;background:var(--surface-900);color:#fff}
.sx-form-section .sx-section-header h2{color:#fff}
.sx-form-section .sx-section-header p{color:var(--surface-400)}
.sx-form-wrap{max-width:560px;margin:0 auto}
/* CF7 overrides */
.sx-form-wrap .wpcf7-form p{margin-bottom:16px}
.sx-form-wrap label{display:block;font-size:.85rem;font-weight:500;color:var(--surface-300);margin-bottom:6px}
.sx-form-wrap input[type="text"],
.sx-form-wrap input[type="email"],
.sx-form-wrap textarea{width:100%;padding:12px 16px;border:1px solid var(--surface-600);border-radius:8px;background:var(--surface-800);color:#fff;font-size:.9rem;font-family:inherit;transition:border-color .2s}
.sx-form-wrap input:focus,.sx-form-wrap textarea:focus{outline:none;border-color:var(--brand)}
.sx-form-wrap textarea{min-height:100px;resize:vertical}
.sx-form-wrap input[type="submit"],.sx-form-wrap .wpcf7-submit{width:100%;padding:14px;background:var(--brand);color:#fff;border:none;border-radius:8px;font-size:.95rem;font-weight:600;cursor:pointer;transition:background .2s}
.sx-form-wrap input[type="submit"]:hover,.sx-form-wrap .wpcf7-submit:hover{background:var(--brand-dark)}
.sx-form-wrap .wpcf7-response-output{border-radius:8px;margin-top:16px;padding:12px;font-size:.85rem}

/* ── FAQ ── */
.sx-faq{max-width:720px;margin:0 auto}
.sx-faq-item{border-bottom:1px solid var(--surface-200)}
.sx-faq-item:first-child{border-top:1px solid var(--surface-200)}
.sx-faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;padding:18px 0;background:none;border:none;cursor:pointer;text-align:left;font-size:.95rem;font-weight:600;color:var(--surface-800);font-family:inherit}
.sx-faq-q:hover{color:var(--brand)}
.sx-faq-icon{font-size:1.2rem;color:var(--surface-400);transition:transform .2s;flex-shrink:0;margin-left:16px}
.sx-faq-item.open .sx-faq-icon{transform:rotate(45deg)}
.sx-faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease}
.sx-faq-item.open .sx-faq-a{max-height:300px}
.sx-faq-a p{padding:0 0 18px;font-size:.9rem;color:var(--surface-500);line-height:1.7}

/* ── Final CTA ── */
.sx-final-cta{text-align:center}

/* ── Footer ── */
.sx-footer{padding:40px 0;border-top:1px solid var(--surface-200);background:var(--surface-50)}
.sx-footer-inner{display:flex;align-items:center;justify-content:space-between}
.sx-footer-links{display:flex;gap:24px;list-style:none}
.sx-footer-links a{font-size:.85rem;color:var(--surface-500);transition:color .2s}
.sx-footer-links a:hover{color:var(--brand)}
.sx-footer-copy{font-size:.82rem;color:var(--surface-400)}

/* ── Responsive ── */
@media(max-width:1024px){
  .sx-who-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:768px){
  .sx-nav-links{display:none}
  .sx-hamburger{display:flex}
  .sx-lp-hero{padding:48px 0 40px}
  .sx-lp-hero h1{font-size:2rem}
  .sx-section{padding:56px 0}
  .sx-section-header h2{font-size:1.7rem}
  .sx-steps{grid-template-columns:1fr;gap:16px}
  .sx-who-grid{grid-template-columns:1fr}
  .sx-footer-inner{flex-direction:column;gap:16px;text-align:center}
}
@media(max-width:480px){
  .sx-lp-hero h1{font-size:1.6rem}
  .sx-hero-actions{flex-direction:column}
  .sx-hero-actions .sx-btn{width:100%}
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
        <li><a href="<?php echo home_url('/#how-it-works'); ?>">How It Works</a></li>
        <li><a href="<?php echo home_url('/#sectors'); ?>">Sectors</a></li>
        <li><a href="<?php echo home_url('/leadership-report'); ?>" style="color:var(--brand)">Leadership Report</a></li>
        <li><a href="#request-report" class="sx-btn sx-btn-primary">Request Report</a></li>
      </ul>

      <button class="sx-hamburger" id="sx-hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <div class="sx-mobile-menu" id="sx-mobile-menu">
      <a href="<?php echo home_url('/services'); ?>">Services</a>
      <a href="<?php echo home_url('/#how-it-works'); ?>" class="sx-mobile-nav-link">How It Works</a>
      <a href="<?php echo home_url('/#sectors'); ?>" class="sx-mobile-nav-link">Sectors</a>
      <a href="<?php echo home_url('/leadership-report'); ?>" class="sx-mobile-nav-link" style="color:var(--brand)">Leadership Report</a>
      <a href="#request-report" class="sx-btn sx-btn-primary sx-mobile-nav-link">Request Report</a>
    </div>
  </div>
</header>

<!-- ══════════ SECTION A: HERO ══════════ -->
<section class="sx-lp-hero">
  <div class="sx-container">
    <div class="sx-hero-badge">Infrastructure Intelligence</div>
    <h1>Leadership Report: Infrastructure intelligence from the asset data you already hold</h1>
    <p class="sx-hero-sub">Most organisations maintain asset registers. Few leadership teams can see what those assets mean for risk, insurance, and capital planning under funding pressure.</p>
    <div class="sx-hero-actions">
      <a href="#request-report" class="sx-btn sx-btn-primary">Request an example report</a>
      <a href="mailto:my@snapxact.com?subject=Leadership%20Report%20%E2%80%93%2015-minute%20overview" class="sx-btn sx-btn-outline">Book a 15-minute overview</a>
    </div>
    <p class="sx-hero-credibility">No new systems. No subscription. Works with the data you already hold.</p>
  </div>
</section>

<!-- ══════════ SECTION B: VISIBILITY GAP ══════════ -->
<section class="sx-section sx-section-alt">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>The visibility gap</h2>
    </div>
    <div class="sx-gap-content">
      <p>Registers exist, often at site level. Data is maintained operationally. But leadership insight is rarely produced consistently.</p>
      <p>Without visibility, refresh pressure and risk often appear suddenly rather than predictably.</p>
    </div>
  </div>
</section>

<!-- ══════════ SECTION C: WHAT THE REPORT REVEALS ══════════ -->
<section class="sx-section">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>What the Leadership Report reveals</h2>
    </div>
    <div class="sx-reveals">
      <p>The SnapXact Leadership Report analyses existing asset data &mdash; registers, inventory lists, procurement records &mdash; and produces governance-ready insight for leadership teams.</p>
      <ul>
        <li>Replacement cost exposure across sites</li>
        <li>Age profile and refresh pressure by category</li>
        <li>Risk scoring and audit readiness indicators</li>
        <li>Insurance visibility and valuation gaps</li>
        <li>3-year capital pressure view for board planning</li>
      </ul>
    </div>
  </div>
</section>

<!-- ══════════ SECTION D: HOW IT WORKS ══════════ -->
<section class="sx-section sx-section-alt">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>How it works</h2>
    </div>
    <div class="sx-steps">
      <div class="sx-step">
        <div class="sx-step-num">1</div>
        <h3>Review</h3>
        <p>We review the asset data you already hold &mdash; spreadsheets, registers, procurement records, in any common format.</p>
      </div>
      <div class="sx-step">
        <div class="sx-step-num">2</div>
        <h3>Verify</h3>
        <p>On-site verification where required to reconcile data to reality. Optional, and scheduled around your operations.</p>
      </div>
      <div class="sx-step">
        <div class="sx-step-num">3</div>
        <h3>Report</h3>
        <p>We produce a concise PDF designed for CFOs, CEOs, trustees and finance committees. Clear, structured, governance-ready.</p>
      </div>
    </div>
    <p class="sx-step-closing">This is not asset management software. It&rsquo;s leadership visibility.</p>
  </div>
</section>

<!-- ══════════ SECTION E: WHO IT'S FOR ══════════ -->
<section class="sx-section">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>Who it&rsquo;s for</h2>
    </div>
    <div class="sx-who-grid">
      <div class="sx-who-card">
        <h3>Multi Academy Trusts and schools</h3>
        <p>For CFOs and trustees managing capital across multiple sites under DfE funding pressure. Understand refresh exposure before it becomes urgent.</p>
      </div>
      <div class="sx-who-card">
        <h3>Care providers and healthcare organisations</h3>
        <p>For care home groups and health facilities tracking compliance obligations. Know your asset position for CQC readiness and capital planning.</p>
      </div>
      <div class="sx-who-card">
        <h3>Multi-site businesses</h3>
        <p>For operations and finance teams managing equipment across locations. See risk and refresh pressure clearly for board planning.</p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ SECTION F: REQUEST FORM ══════════ -->
<section class="sx-form-section" id="request-report">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>See an example</h2>
      <p>Request an example Leadership Report. No obligation, no follow-up calls unless you want them.</p>
    </div>
    <div class="sx-form-wrap">
      <?php echo do_shortcode($cf7_shortcode); ?>
    </div>
  </div>
</section>

<!-- ══════════ SECTION G: FAQ ══════════ -->
<section class="sx-section sx-section-alt">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>Frequently asked questions</h2>
    </div>
    <div class="sx-faq">

      <div class="sx-faq-item">
        <button class="sx-faq-q" aria-expanded="false">
          Do we need to replace our existing system?
          <span class="sx-faq-icon">+</span>
        </button>
        <div class="sx-faq-a" role="region">
          <p>No. The Leadership Report works with whatever you already use &mdash; spreadsheets, asset management software, or procurement records. We don&rsquo;t replace systems; we provide insight from the data you hold.</p>
        </div>
      </div>

      <div class="sx-faq-item">
        <button class="sx-faq-q" aria-expanded="false">
          What data do you need from us?
          <span class="sx-faq-icon">+</span>
        </button>
        <div class="sx-faq-a" role="region">
          <p>Asset registers, inventory lists, or procurement records in any common format (Excel, CSV, PDF). We&rsquo;ll guide you through what&rsquo;s needed during the initial conversation.</p>
        </div>
      </div>

      <div class="sx-faq-item">
        <button class="sx-faq-q" aria-expanded="false">
          Is this suitable for governance and audit?
          <span class="sx-faq-icon">+</span>
        </button>
        <div class="sx-faq-a" role="region">
          <p>Yes. The report is designed for trustee packs, audit committees, and board presentations. It&rsquo;s structured to support financial planning, insurance reviews, and risk management discussions.</p>
        </div>
      </div>

      <div class="sx-faq-item">
        <button class="sx-faq-q" aria-expanded="false">
          How long does it take?
          <span class="sx-faq-icon">+</span>
        </button>
        <div class="sx-faq-a" role="region">
          <p>Typically 5&ndash;10 working days from data provision to report delivery, depending on the number of sites and data complexity.</p>
        </div>
      </div>

      <div class="sx-faq-item">
        <button class="sx-faq-q" aria-expanded="false">
          Is our data secure?
          <span class="sx-faq-icon">+</span>
        </button>
        <div class="sx-faq-a" role="region">
          <p>All data is held confidentially and processed securely. We can work under NDA if required. Data is used solely for your report and is not shared or retained beyond the project.</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ══════════ SECTION H: FINAL CTA ══════════ -->
<section class="sx-section sx-final-cta">
  <div class="sx-container">
    <div class="sx-section-header">
      <h2>Want to see what your asset data is really saying?</h2>
    </div>
    <div class="sx-hero-actions">
      <a href="#request-report" class="sx-btn sx-btn-primary">Request an example report</a>
      <a href="mailto:my@snapxact.com?subject=Leadership%20Report%20%E2%80%93%2015-minute%20overview" class="sx-btn sx-btn-outline">Book a 15-minute overview</a>
    </div>
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
        <li><a href="<?php echo home_url('/#how-it-works'); ?>">How It Works</a></li>
        <li><a href="<?php echo home_url('/#sectors'); ?>">Sectors</a></li>
        <li><a href="<?php echo home_url('/leadership-report'); ?>">Leadership Report</a></li>
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
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity = open ? '0' : '1';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });

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
        history.pushState(null, null, this.getAttribute('href'));
      }
    });
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.sx-faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = this.parentElement;
      var isOpen = item.classList.contains('open');
      /* Close all */
      document.querySelectorAll('.sx-faq-item').forEach(function(i){ i.classList.remove('open'); });
      document.querySelectorAll('.sx-faq-q').forEach(function(b){ b.setAttribute('aria-expanded','false'); });
      /* Open clicked if it was closed */
      if(!isOpen){
        item.classList.add('open');
        this.setAttribute('aria-expanded','true');
      }
    });
  });
})();
</script>

<?php wp_footer(); ?>
</body>
</html>
