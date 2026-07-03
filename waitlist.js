/* ========================================================================
   Pinnacle Counseling Group — Waitlist Component
   Self-contained: injects styles, lightbox, popup, and bindings.
   Usage:  <script src="waitlist.js" defer></script>
           Any element with [data-waitlist-open] opens the lightbox.
   ======================================================================== */
(function () {
  'use strict';

  if (window.__pcgWaitlistLoaded) return;
  window.__pcgWaitlistLoaded = true;

  // ---------- Config ----------
  var FORMSPREE_URL = 'https://formspree.io/f/xaqzjkbo';
  var POPUP_DELAY_MS = 5500;             // wait a beat before showing popup
  var POPUP_COOLDOWN_MS = 24 * 60 * 60 * 1000;  // 1 day
  var STORAGE_LAST_SHOWN = 'pcg-waitlist-popup-shown';
  var STORAGE_SUBMITTED = 'pcg-waitlist-submitted';

  // ---------- Styles ----------
  var styles = [
    /* Lightbox shell — matches existing site lightbox patterns */
    '.wl-lightbox{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;visibility:hidden;transition:opacity .5s cubic-bezier(.2,.7,.2,1),visibility .5s cubic-bezier(.2,.7,.2,1)}',
    '.wl-lightbox.is-open{opacity:1;visibility:visible}',
    '.wl-lightbox__overlay{position:absolute;inset:0;background:rgba(20,25,28,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);cursor:pointer}',
    '.wl-lightbox__inner{position:relative;background:#fff;border-radius:24px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:2.2rem 2.2rem 2rem;box-shadow:0 30px 80px -20px rgba(20,25,28,.4);transform:scale(.97) translateY(8px);transition:transform .55s cubic-bezier(.2,.7,.2,1)}',
    '.wl-lightbox.is-open .wl-lightbox__inner{transform:scale(1) translateY(0)}',
    '.wl-lightbox__close{position:absolute;top:1.1rem;right:1.1rem;background:transparent;border:0;font-size:1.3rem;line-height:1;color:rgba(47,53,53,.6);cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .35s cubic-bezier(.2,.7,.2,1),color .35s cubic-bezier(.2,.7,.2,1)}',
    '.wl-lightbox__close:hover{background:rgba(47,53,53,.07);color:#2f3535}',

    /* Form header */
    '.wl-form__head{margin-bottom:1.4rem;text-align:center}',
    '.wl-form__head h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;font-size:1.95rem;color:#2f3535;line-height:1.15;margin:0 0 .55rem;letter-spacing:-.005em}',
    '.wl-form__head h3 em{color:#a36345;font-style:italic;font-weight:300}',
    '.wl-form__head p{font-family:"Inter",sans-serif;font-weight:300;font-size:.92rem;color:rgba(47,53,53,.72);line-height:1.45;margin:0}',

    /* Form fields */
    '.wl-form__row{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-bottom:.75rem}',
    '@media (max-width:480px){.wl-form__row{grid-template-columns:1fr}}',
    '.wl-form__field{display:flex;flex-direction:column;margin-bottom:.75rem}',
    '.wl-form__field label{font-family:"Inter",sans-serif;font-weight:400;font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:#4f6361;margin-bottom:.45rem}',
    '.wl-form__field label span{text-transform:none;letter-spacing:.02em;color:rgba(47,53,53,.5);font-weight:300}',
    '.wl-form__field input,.wl-form__field textarea{font-family:"Inter",sans-serif;font-weight:300;font-size:.98rem;color:#2f3535;background:transparent;border:0;border-bottom:1px solid rgba(47,53,53,.18);padding:.55rem 0;transition:border-color .35s cubic-bezier(.2,.7,.2,1);outline:none;width:100%}',
    '.wl-form__field input:focus,.wl-form__field textarea:focus{border-bottom-color:#a36345}',
    '.wl-form__field textarea{resize:vertical;min-height:62px;line-height:1.5}',

    /* Submit + privacy + error */
    '.wl-form__submit{display:block;width:100%;margin-top:1.1rem;padding:.95rem 1.9rem;border:1px solid #a36345;background:#a36345;color:#fff;border-radius:999px;font-family:"Inter",sans-serif;font-weight:400;font-size:.76rem;letter-spacing:.24em;text-transform:uppercase;cursor:pointer;transition:background .45s cubic-bezier(.2,.7,.2,1),border-color .45s cubic-bezier(.2,.7,.2,1)}',
    '.wl-form__submit:hover{background:#9a5a3d;border-color:#9a5a3d}',
    '.wl-form__submit:disabled{opacity:.65;cursor:wait}',
    '.wl-form__privacy{margin-top:1.1rem;font-family:"Inter",sans-serif;font-weight:300;font-size:.78rem;line-height:1.5;color:rgba(47,53,53,.6);text-align:center}',
    '.wl-form__privacy a{color:#a36345;border-bottom:1px solid rgba(163,99,69,.4);transition:border-color .3s cubic-bezier(.2,.7,.2,1)}',
    '.wl-form__privacy a:hover{border-bottom-color:#a36345}',
    '.wl-form__error{display:none;margin-top:1rem;font-family:"Inter",sans-serif;font-weight:400;font-size:.85rem;color:#b34a3a;text-align:center}',
    '.wl-form__error.is-visible{display:block}',
    '.wl-form__error a{color:#a36345;text-decoration:underline}',

    /* Success state */
    '.wl-form__success{display:none;text-align:center;padding:1rem 0}',
    '.wl-form__success.is-visible{display:block}',
    '.wl-form__success .wl-eyebrow{display:block;font-family:"Inter",sans-serif;font-weight:400;font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:#4f6361;margin-bottom:.9rem}',
    '.wl-form__success h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;font-size:2rem;color:#2f3535;margin:0 0 1rem}',
    '.wl-form__success h3 em{color:#a36345;font-style:italic;font-weight:300}',
    '.wl-form__success p{font-family:"Inter",sans-serif;font-weight:300;font-size:.96rem;color:rgba(47,53,53,.78);line-height:1.55;margin:0 0 1.5rem;max-width:38ch;margin-left:auto;margin-right:auto}',
    '.wl-form__success .wl-form__submit{margin-top:.5rem;display:inline-block;width:auto;padding:.85rem 1.7rem;background:transparent;color:#2f3535;border-color:#2f3535}',
    '.wl-form__success .wl-form__submit:hover{background:#2f3535;color:#fff}',

    /* Popup */
    '.wl-popup{position:fixed;bottom:1.6rem;right:1.6rem;z-index:900;width:340px;max-width:calc(100vw - 2rem);background:#ddd5c3;border:1px solid rgba(47,53,53,.08);border-radius:18px;padding:1.5rem 1.6rem 1.4rem;box-shadow:0 18px 50px -16px rgba(20,25,28,.28);opacity:0;visibility:hidden;transform:translateY(14px);transition:opacity .6s cubic-bezier(.2,.7,.2,1),visibility .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}',
    '.wl-popup.is-visible{opacity:1;visibility:visible;transform:translateY(0)}',
    '@media (max-width:480px){.wl-popup{bottom:1rem;right:1rem;left:1rem;width:auto}}',
    '.wl-popup__close{position:absolute;top:.6rem;right:.6rem;background:transparent;border:0;font-size:1.05rem;line-height:1;color:rgba(47,53,53,.45);cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .35s cubic-bezier(.2,.7,.2,1),color .35s cubic-bezier(.2,.7,.2,1)}',
    '.wl-popup__close:hover{background:rgba(47,53,53,.08);color:#2f3535}',
    '.wl-popup__eyebrow{display:block;font-family:"Inter",sans-serif;font-weight:400;font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;color:#4f6361;margin-bottom:.6rem}',
    '.wl-popup__title{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;font-size:1.35rem;color:#2f3535;line-height:1.25;margin:0 0 .35rem;letter-spacing:-.005em}',
    '.wl-popup__title em{color:#a36345;font-style:italic;font-weight:300}',
    '.wl-popup__sub{font-family:"Inter",sans-serif;font-weight:300;font-size:.88rem;line-height:1.5;color:rgba(47,53,53,.78);margin:0 0 1.1rem}',
    '.wl-popup__cta{display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.3rem;border:1px solid #2f3535;background:transparent;color:#2f3535;border-radius:999px;font-family:"Inter",sans-serif;font-weight:400;font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;transition:background .45s cubic-bezier(.2,.7,.2,1),color .45s cubic-bezier(.2,.7,.2,1),border-color .45s cubic-bezier(.2,.7,.2,1)}',
    '.wl-popup__cta:hover{background:#2f3535;color:#ddd5c3;border-color:#2f3535}',
    '.wl-popup__cta-arrow{display:inline-block;width:12px;height:1px;background:currentColor;position:relative}',
    '.wl-popup__cta-arrow::after{content:"";position:absolute;right:0;top:-3px;width:6px;height:6px;border-top:1px solid currentColor;border-right:1px solid currentColor;transform:rotate(45deg)}',

    /* Section CTA — used on service pages under the Support With cards */
    '.wl-section-cta{margin:3.5rem auto 0;padding-top:2.4rem;border-top:1px solid rgba(47,53,53,.1);text-align:center;max-width:520px}',
    '.wl-section-cta__eyebrow{display:block;font-family:"Inter",sans-serif;font-weight:400;font-size:.72rem;letter-spacing:.26em;text-transform:uppercase;color:#4f6361;margin-bottom:1.2rem}'
  ].join('');

  // ---------- Markup ----------
  var lightboxHTML = [
    '<div class="wl-lightbox" id="wl-lightbox" aria-hidden="true" role="dialog" aria-labelledby="wl-form-title">',
    '  <div class="wl-lightbox__overlay" data-wl-close></div>',
    '  <div class="wl-lightbox__inner" data-lenis-prevent>',
    '    <button class="wl-lightbox__close" type="button" data-wl-close aria-label="Close">&#10005;</button>',
    '    <div class="wl-form-wrap">',
    '      <header class="wl-form__head">',
    '        <h3 id="wl-form-title">Join the <em>Waitlist</em>.</h3>',
    '        <p>Now taking new clients for summer 2026.</p>',
    '      </header>',
    '      <form class="wl-form" id="wl-form" action="' + FORMSPREE_URL + '" method="POST" novalidate>',
    '        <input type="hidden" name="_subject" value="New Waitlist Request — Pinnacle Counseling Group" />',
    '        <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" />',
    '        <div class="wl-form__row">',
    '          <div class="wl-form__field"><label for="wl-first">First name</label><input id="wl-first" name="first_name" type="text" required autocomplete="given-name" /></div>',
    '          <div class="wl-form__field"><label for="wl-last">Last name</label><input id="wl-last" name="last_name" type="text" required autocomplete="family-name" /></div>',
    '        </div>',
    '        <div class="wl-form__field"><label for="wl-email">Email</label><input id="wl-email" name="email" type="email" required autocomplete="email" /></div>',
    '        <div class="wl-form__field"><label for="wl-phone">Phone <span>(optional)</span></label><input id="wl-phone" name="phone" type="tel" autocomplete="tel" /></div>',
    '        <div class="wl-form__field"><label for="wl-notes">Anything you&rsquo;d like us to know? <span>(optional)</span></label><textarea id="wl-notes" name="notes" rows="2"></textarea></div>',
    '        <div class="wl-form__error" id="wl-form-error">Something went wrong. Please try again or email <a href="mailto:Info@PinnacleCounselingGroup.com">Info@PinnacleCounselingGroup.com</a>.</div>',
    '        <button type="submit" class="wl-form__submit">Join the Waitlist</button>',
    '        <p class="wl-form__privacy">By submitting your information, you agree to our <a href="privacy.html">Privacy Policy</a>.</p>',
    '      </form>',
    '      <div class="wl-form__success" id="wl-form-success">',
    '        <span class="wl-eyebrow">Received</span>',
    '        <h3>Thank <em>you</em>.</h3>',
    '        <p>You&rsquo;re on the waitlist. We&rsquo;ll be in touch as soon as a clinical fit opens up.</p>',
    '        <button type="button" class="wl-form__submit" data-wl-close>Close</button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  var popupHTML = [
    '<aside class="wl-popup" id="wl-popup" aria-label="Join the waitlist" role="complementary">',
    '  <button class="wl-popup__close" type="button" data-wl-popup-close aria-label="Dismiss">&#10005;</button>',
    '  <span class="wl-popup__eyebrow">Currently Waitlist-Only</span>',
    '  <h4 class="wl-popup__title">Reserve your <em>place</em>.</h4>',
    '  <p class="wl-popup__sub">Be among the first to know when sessions become available.</p>',
    '  <button class="wl-popup__cta" type="button" data-waitlist-open>Join the Waitlist <span class="wl-popup__cta-arrow" aria-hidden="true"></span></button>',
    '</aside>'
  ].join('\n');

  // ---------- Inject ----------
  function inject() {
    var style = document.createElement('style');
    style.id = 'wl-styles';
    style.textContent = styles;
    document.head.appendChild(style);

    var holder = document.createElement('div');
    holder.innerHTML = lightboxHTML + popupHTML;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);

    bind();
    schedulePopup();
  }

  // ---------- Bindings ----------
  function bind() {
    var lightbox = document.getElementById('wl-lightbox');
    var form = document.getElementById('wl-form');
    var formError = document.getElementById('wl-form-error');
    var formSuccess = document.getElementById('wl-form-success');
    var popup = document.getElementById('wl-popup');

    // Open triggers — use event delegation so dynamically added triggers also work
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-waitlist-open]');
      if (opener) {
        e.preventDefault();
        openLightbox();
        return;
      }
      var closer = e.target.closest('[data-wl-close]');
      if (closer) {
        e.preventDefault();
        closeLightbox();
        return;
      }
      var popupCloser = e.target.closest('[data-wl-popup-close]');
      if (popupCloser) {
        e.preventDefault();
        hidePopup();
      }
    });

    // ESC closes lightbox
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });

    // Form submit — AJAX to Formspree
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      formError.classList.remove('is-visible');
      var submitBtn = form.querySelector('.wl-form__submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.style.display = 'none';
          document.querySelector('.wl-form__head').style.display = 'none';
          formSuccess.classList.add('is-visible');
          try { localStorage.setItem(STORAGE_SUBMITTED, '1'); } catch (e) {}
          hidePopup();
        } else {
          throw new Error('Submission failed');
        }
      }).catch(function () {
        formError.classList.add('is-visible');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join the Waitlist';
      });
    });
  }

  // ---------- Lightbox open/close ----------
  function openLightbox() {
    var lightbox = document.getElementById('wl-lightbox');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first field for accessibility
    setTimeout(function () {
      var first = document.getElementById('wl-first');
      if (first) first.focus();
    }, 350);
    hidePopup();  // dismiss popup if lightbox opens
  }

  function closeLightbox() {
    var lightbox = document.getElementById('wl-lightbox');
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ---------- Popup logic ----------
  function schedulePopup() {
    var submitted = false;
    var lastShown = 0;
    try {
      submitted = localStorage.getItem(STORAGE_SUBMITTED) === '1';
      var raw = localStorage.getItem(STORAGE_LAST_SHOWN);
      lastShown = raw ? parseInt(raw, 10) : 0;
    } catch (e) {}

    if (submitted) return;  // never show again if they've signed up
    var now = Date.now();
    if (lastShown && (now - lastShown) < POPUP_COOLDOWN_MS) return;

    setTimeout(showPopup, POPUP_DELAY_MS);
  }

  function showPopup() {
    var popup = document.getElementById('wl-popup');
    if (!popup) return;
    popup.classList.add('is-visible');
    try { localStorage.setItem(STORAGE_LAST_SHOWN, String(Date.now())); } catch (e) {}
  }

  function hidePopup() {
    var popup = document.getElementById('wl-popup');
    if (!popup) return;
    popup.classList.remove('is-visible');
  }

  // ---------- Boot ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
