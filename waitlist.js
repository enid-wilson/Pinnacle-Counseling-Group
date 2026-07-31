/* ========================================================================
   Pinnacle Counseling Group — Consultation CTA Component
   Self-contained: injects popup + click handler for booking triggers.
   Usage:  <script src="waitlist.js" defer></script>
           The popup CTA is a SimplePractice widget trigger — clicking it
           opens the SP modal on the current page. Falls back to book.html
           if the SP widget script fails to load.
   ======================================================================== */
(function () {
  'use strict';

  if (window.__pcgWaitlistLoaded) return;
  window.__pcgWaitlistLoaded = true;

  // ---------- Config ----------
  // Fallback destination if the SimplePractice widget script fails to load.
  // The primary flow is: SP script auto-binds → click opens modal on page.
  var BOOKING_FALLBACK_URL = 'book.html';
  var POPUP_DELAY_MS = 5500;                     // wait a beat before showing
  var POPUP_COOLDOWN_MS = 24 * 60 * 60 * 1000;   // 1 day between showings
  var STORAGE_LAST_SHOWN = 'pcg-waitlist-popup-shown';
  var STORAGE_DISMISSED  = 'pcg-waitlist-popup-dismissed';

  // ---------- Styles ----------
  var styles = [
    /* Popup — bottom-right unobtrusive card */
    '.wl-popup{position:fixed;bottom:1.6rem;right:1.6rem;z-index:900;width:340px;max-width:calc(100vw - 2rem);background:#ddd5c3;border:1px solid rgba(47,53,53,.08);border-radius:18px;padding:1.5rem 1.6rem 1.4rem;box-shadow:0 18px 50px -16px rgba(20,25,28,.28);opacity:0;visibility:hidden;transform:translateY(14px);transition:opacity .6s cubic-bezier(.2,.7,.2,1),visibility .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}',
    '.wl-popup.is-visible{opacity:1;visibility:visible;transform:translateY(0)}',
    '@media (max-width:480px){.wl-popup{bottom:1rem;right:1rem;left:1rem;width:auto}}',
    '.wl-popup__close{position:absolute;top:.6rem;right:.6rem;background:transparent;border:0;font-size:1.05rem;line-height:1;color:rgba(47,53,53,.45);cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .35s cubic-bezier(.2,.7,.2,1),color .35s cubic-bezier(.2,.7,.2,1)}',
    '.wl-popup__close:hover{background:rgba(47,53,53,.08);color:#2f3535}',
    '.wl-popup__eyebrow{display:block;font-family:"Inter",sans-serif;font-weight:400;font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;color:#4f6361;margin-bottom:.6rem}',
    '.wl-popup__title{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;font-size:1.35rem;color:#2f3535;line-height:1.25;margin:0 0 .35rem;letter-spacing:-.005em}',
    '.wl-popup__title em{color:#a36345;font-style:italic;font-weight:300}',
    '.wl-popup__sub{font-family:"Inter",sans-serif;font-weight:300;font-size:.88rem;line-height:1.5;color:rgba(47,53,53,.78);margin:0 0 1.1rem}',
    '.wl-popup__cta{display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.3rem;border:1px solid #2f3535;background:transparent;color:#2f3535;border-radius:999px;font-family:"Inter",sans-serif;font-weight:400;font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;text-decoration:none;transition:background .45s cubic-bezier(.2,.7,.2,1),color .45s cubic-bezier(.2,.7,.2,1),border-color .45s cubic-bezier(.2,.7,.2,1)}',
    '.wl-popup__cta:hover{background:#2f3535;color:#ddd5c3;border-color:#2f3535}',
    '.wl-popup__cta-arrow{display:inline-block;width:12px;height:1px;background:currentColor;position:relative}',
    '.wl-popup__cta-arrow::after{content:"";position:absolute;right:0;top:-3px;width:6px;height:6px;border-top:1px solid currentColor;border-right:1px solid currentColor;transform:rotate(45deg)}',

    /* Section CTA — kept for backwards compatibility with existing markup */
    '.wl-section-cta{margin:3.5rem auto 0;padding-top:2.4rem;border-top:1px solid rgba(47,53,53,.1);text-align:center;max-width:520px}',
    '.wl-section-cta__eyebrow{display:block;font-family:"Inter",sans-serif;font-weight:400;font-size:.72rem;letter-spacing:.26em;text-transform:uppercase;color:#4f6361;margin-bottom:1.2rem}'
  ].join('');

  // ---------- Markup ----------
  // The CTA below is a SimplePractice widget trigger. The SP widget script
  // (loaded separately on every page) auto-binds to [data-spwidget-autobind]
  // elements and intercepts clicks to open the booking modal. If SP script
  // fails to load, the href takes the user to the branded /book.html page.
  var popupHTML = [
    '<aside class="wl-popup" id="wl-popup" aria-label="Book a consultation" role="complementary">',
    '  <button class="wl-popup__close" type="button" data-wl-popup-close aria-label="Dismiss">&#10005;</button>',
    '  <span class="wl-popup__eyebrow">Now Booking</span>',
    '  <h4 class="wl-popup__title">A free 15-minute <em>consultation</em>.</h4>',
    '  <p class="wl-popup__sub">Meet with our practice manager to find the right therapist and starting point.</p>',
    '  <a class="wl-popup__cta" href="' + BOOKING_FALLBACK_URL + '"',
    '     data-spwidget-scope-id="6d676cc9-ad0b-46d9-b9a0-f5058ea590f1"',
    '     data-spwidget-scope-uri="pinnacle"',
    '     data-spwidget-application-id="7c72cb9f9a9b913654bb89d6c7b4e71a77911b30192051da35384b4d0c6d505b"',
    '     data-spwidget-type="OAR"',
    '     data-spwidget-scope-global',
    '     data-spwidget-autobind',
    '     data-waitlist-open>Book a Consultation <span class="wl-popup__cta-arrow" aria-hidden="true"></span></a>',
    '</aside>'
  ].join('\n');

  // ---------- Inject ----------
  function inject() {
    var style = document.createElement('style');
    style.id = 'wl-styles';
    style.textContent = styles;
    document.head.appendChild(style);

    var holder = document.createElement('div');
    holder.innerHTML = popupHTML;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);

    bind();
    schedulePopup();
    rebindSpWidget();
  }

  // ---------- SP widget re-bind ----------
  // The popup is JS-injected AFTER SimplePractice's widget script does its
  // one-and-done DOM scan. Without a manual re-bind, the popup CTA has all the
  // right data-spwidget-* attributes but no click handler — clicking it just
  // navigates to book.html instead of opening the modal.
  // We poll for window.spWidgetAutoBind (SP script may still be loading when
  // waitlist.js runs) and call it up to 5s. Once bound, the popup CTA opens
  // the modal like every other trigger on the page.
  function rebindSpWidget() {
    var tries = 0;
    var poll = setInterval(function () {
      tries++;
      if (typeof window.spWidgetAutoBind === 'function') {
        try { window.spWidgetAutoBind(); } catch (e) {}
        clearInterval(poll);
      } else if (tries > 25) {
        clearInterval(poll);
      }
    }, 200);
  }

  // ---------- Bindings ----------
  function bind() {
    // Delegated handler: [data-waitlist-open] is the popup CTA. We don't
    // interfere with its click — SimplePractice's widget script handles the
    // navigation (opens modal on page). We just mark that the user engaged
    // and hide the popup so it doesn't linger.
    // If SP script fails to load, the anchor's href="book.html" carries the
    // user to the branded landing page as a graceful fallback.
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-waitlist-open]');
      if (opener) {
        try { localStorage.setItem(STORAGE_DISMISSED, '1'); } catch (err) {}
        hidePopup();
        return;
      }
      var popupCloser = e.target.closest('[data-wl-popup-close]');
      if (popupCloser) {
        e.preventDefault();
        hidePopup();
      }
    });
  }

  // ---------- Popup logic ----------
  function schedulePopup() {
    var dismissed = false;
    var lastShown = 0;
    try {
      dismissed = localStorage.getItem(STORAGE_DISMISSED) === '1';
      var raw = localStorage.getItem(STORAGE_LAST_SHOWN);
      lastShown = raw ? parseInt(raw, 10) : 0;
    } catch (e) {}

    if (dismissed) return;  // user already clicked through — don't re-prompt
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
