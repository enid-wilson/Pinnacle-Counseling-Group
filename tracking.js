/* Pinnacle Counseling Group — sitewide event tracking (GA4)
   Delegated click handler on document so it covers dynamically-added links too.
   Fires alongside navigation without delaying it. */
(function () {
  if (typeof window === 'undefined') return;

  function nearestLocation(el) {
    var cur = el;
    while (cur && cur !== document.body && cur.nodeType === 1) {
      if (cur.id) return cur.id;
      cur = cur.parentElement;
    }
    if (el.closest) {
      if (el.closest('footer')) return 'footer';
      if (el.closest('nav, header, .nav')) return 'header';
    }
    return 'body';
  }

  function send(name, params) {
    if (typeof window.gtag === 'function') {
      try { window.gtag('event', name, params); } catch (_) { /* no-op */ }
    }
  }

  function classify(a) {
    var raw = a.getAttribute('href') || '';
    var href = raw.toLowerCase();
    if (href.indexOf('tel:') === 0) return 'phone_click';
    if (href.indexOf('mailto:') === 0) return 'email_click';
    if (
      href.indexOf('book.html') !== -1 ||
      href.indexOf('clientsecure.me') !== -1 ||
      href.indexOf('simplepractice.com') !== -1 ||
      a.hasAttribute('data-spwidget-scope-id') ||
      a.hasAttribute('data-spwidget-autobind')
    ) return 'booking_click';
    return null;
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('a, button');
    if (!a) return;
    // Only track anchors (and buttons that carry spwidget attributes)
    if (a.tagName !== 'A' && !a.hasAttribute('data-spwidget-scope-id')) return;
    var evtName = classify(a);
    if (!evtName) return;
    send(evtName, {
      link_location: nearestLocation(a),
      page: window.location.pathname
    });
  }, true); // capture phase so it fires even if a downstream handler stops propagation
})();
