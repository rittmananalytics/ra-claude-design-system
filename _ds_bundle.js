/* @ds-bundle: {"format":4,"namespace":"RittmanAnalyticsDesignSystem_019dcf","components":[{"name":"CaseStudies","sourcePath":"ui_kits/website/CaseStudies.jsx"},{"name":"ChallengeCards","sourcePath":"ui_kits/website/ChallengeCards.jsx"},{"name":"Footer","sourcePath":"ui_kits/website/Footer.jsx"},{"name":"Hero","sourcePath":"ui_kits/website/Hero.jsx"},{"name":"Methodology","sourcePath":"ui_kits/website/Methodology.jsx"},{"name":"Navigation","sourcePath":"ui_kits/website/Navigation.jsx"}],"sourceHashes":{"slides/deck-stage.js":"ad1c016a6256","ui_kits/website/CaseStudies.jsx":"aa0f674e12d2","ui_kits/website/ChallengeCards.jsx":"7f53f6a3586c","ui_kits/website/Footer.jsx":"9f436a256b51","ui_kits/website/Hero.jsx":"4ff639978fef","ui_kits/website/Methodology.jsx":"a7e44b64b9e4","ui_kits/website/Navigation.jsx":"3c820e70b7c6","wire/app.jsx":"566c86fe5722","wire/components.jsx":"cbee1ecc76f6","wire/data.js":"9382e54ebd9d","wire/screens-1.jsx":"bf04fcaeabef","wire/screens-2.jsx":"13bbe010fe46"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RittmanAnalyticsDesignSystem_019dcf = window.RittmanAnalyticsDesignSystem_019dcf || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// slides/deck-stage.js
try { (() => {
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const pad2 = n => String(n).padStart(2, '0');
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
    }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    /* Tap zones for mobile — back/forward thirds like Stories.
       Transparent, no visible UI, don't block the overlay. */
    .tapzones {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 2147482000;
      pointer-events: none;
    }
    .tapzone {
      flex: 1;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
    }
    /* Only activate tap zones on coarse pointers (touch devices). */
    @media (hover: hover) and (pointer: fine) {
      .tapzones { display: none; }
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      ::slotted(*:last-child) {
        break-after: auto;
        page-break-after: auto;
      }
      .overlay, .tapzones { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTapBack = this._onTapBack.bind(this);
      this._onTapForward = this._onTapForward.bind(this);
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      // Initial collection + layout happens via slotchange, which fires on mount.
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        this._fit();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Tap zones (mobile): left third = back, right third = forward.
      const tapzones = document.createElement('div');
      tapzones.className = 'tapzones export-hidden';
      tapzones.setAttribute('aria-hidden', 'true');
      tapzones.setAttribute('data-noncommentable', '');
      const tzBack = document.createElement('div');
      tzBack.className = 'tapzone tapzone--back';
      const tzMid = document.createElement('div');
      tzMid.className = 'tapzone tapzone--mid';
      tzMid.style.pointerEvents = 'none';
      const tzFwd = document.createElement('div');
      tzFwd.className = 'tapzone tapzone--fwd';
      tzBack.addEventListener('click', this._onTapBack);
      tzFwd.addEventListener('click', this._onTapForward);
      tapzones.append(tzBack, tzMid, tzFwd);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-noncommentable', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._go(this._index - 1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._go(this._index + 1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));
      this._root.append(style, stage, tapzones, overlay);
      this._canvas = canvas;
      this._slot = slot;
      this._overlay = overlay;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }
    _onSlotChange() {
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        // Determine a label for comment flow: prefer explicit data-label,
        // then an existing data-screen-label, then first heading, else "Slide".
        let label = slide.getAttribute('data-label');
        if (!label) {
          const existing = slide.getAttribute('data-screen-label');
          if (existing) {
            // Strip any leading number the author may have included.
            label = existing.replace(/^\s*\d+\s*/, '').trim() || existing;
          }
        }
        if (!label) {
          const h = slide.querySelector('h1, h2, h3, [data-title]');
          if (h) label = (h.textContent || '').trim().slice(0, 40);
        }
        if (!label) label = 'Slide';
        slide.setAttribute('data-screen-label', `${pad2(n)} ${label}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      if (!this._overlay) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _fit() {
      if (!this._canvas) return;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        return;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onTapBack(e) {
      e.preventDefault();
      this._go(this._index - 1, 'tap');
    }
    _onTapForward(e) {
      e.preventDefault();
      this._go(this._index + 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._go(this._index + 1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._go(this._index - 1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._go(this._index + 1, 'api');
    }
    prev() {
      this._go(this._index - 1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/deck-stage.js", error: String((e && e.message) || e) }); }

// ui_kits/website/CaseStudies.jsx
try { (() => {
// CaseStudies.jsx — three feature cards using real customer photography.
// Each photo arrives pre-composed: a real lifestyle/product image clipped to a
// brand-colored geometric shape (chevron, diamond, scallop). The card frames
// the photo cleanly, then states the metric, sector and outcome below.

function CaseCard({
  image,
  alt,
  accent,
  client,
  sector,
  metric,
  metricLabel,
  headline,
  blurb
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "ra-case"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-case-photo-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    className: "ra-case-photo",
    src: image,
    alt: alt
  })), /*#__PURE__*/React.createElement("div", {
    className: "ra-case-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-case-id"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-case-client"
  }, client), /*#__PURE__*/React.createElement("div", {
    className: "ra-case-sector"
  }, sector)), /*#__PURE__*/React.createElement("div", {
    className: "ra-case-metricwrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-case-metric",
    style: {
      color: accent
    }
  }, metric), /*#__PURE__*/React.createElement("div", {
    className: "ra-case-metric-label"
  }, metricLabel)), /*#__PURE__*/React.createElement("h3", null, headline), /*#__PURE__*/React.createElement("p", null, blurb), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ra-link",
    style: {
      color: accent
    }
  }, "Read the case study \u203A")));
}
function CaseStudies() {
  return /*#__PURE__*/React.createElement("section", {
    className: "ra-section ra-section-alt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-container"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ra-section-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-eyebrow"
  }, "Selected work"), /*#__PURE__*/React.createElement("h2", null, "Outcomes, not deliverables.")), /*#__PURE__*/React.createElement("div", {
    className: "ra-case-grid"
  }, /*#__PURE__*/React.createElement(CaseCard, {
    image: "case-images/pleo.png",
    alt: "Pleo card displayed on a phone",
    accent: "#E5829A",
    client: "Pleo",
    sector: "Spend management \xB7 Copenhagen",
    metric: "60%",
    metricLabel: "time-to-insight cut",
    headline: "A trusted semantic model for finance and growth",
    blurb: "Modern dbt + BigQuery foundation, embedded analyst training, and a metric layer the whole team can self-serve from."
  }), /*#__PURE__*/React.createElement(CaseCard, {
    image: "case-images/barkbox.png",
    alt: "BarkBox subscription box with toys",
    accent: "#4FC3D9",
    client: "BarkBox",
    sector: "Subscription pet retail \xB7 NYC",
    metric: "3\xD7",
    metricLabel: "reporting velocity",
    headline: "Replatformed onto Looker with dbt-led modelling",
    blurb: "Marketing and product self-serve the metrics that matter \u2014 funnel, retention, MRR \u2014 without a daily ticket queue."
  }), /*#__PURE__*/React.createElement(CaseCard, {
    image: "case-images/florence.png",
    alt: "Healthcare workers illustrated in 3D",
    accent: "#9C7BFF",
    client: "Florence",
    sector: "Healthcare workforce \xB7 London",
    metric: "14d",
    metricLabel: "kickoff to first dashboard",
    headline: "Two-week sprint on Cube + dbt, then trained the team",
    blurb: "Got Florence's leadership a real funnel view fast \u2014 then handed the keys over so they could iterate without us in the loop."
  }))));
}
window.CaseStudies = CaseStudies;
Object.assign(__ds_scope, { CaseStudies });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CaseStudies.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ChallengeCards.jsx
try { (() => {
// ChallengeCards.jsx — the 2x2 "What's your main data challenge?" grid
const {
  useState: useStateChallenge
} = React;
function ChallengeCard({
  tile,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ra-challenge " + (active ? "is-active" : ""),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-challenge-img"
  }, /*#__PURE__*/React.createElement("img", {
    src: tile.img,
    alt: tile.title
  })), /*#__PURE__*/React.createElement("div", {
    className: "ra-challenge-body"
  }, /*#__PURE__*/React.createElement("h3", null, tile.title), /*#__PURE__*/React.createElement("p", null, tile.desc), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ra-link",
    onClick: e => e.stopPropagation()
  }, "Read More \u203A")));
}
function ChallengeCards() {
  const [selected, setSelected] = useStateChallenge("build");
  const tiles = [{
    id: "build",
    title: "Building our Data Analytics Platform",
    desc: "We're growing fast and need to build a scalable data foundation and enable our data team.",
    img: "images/challenge-build.png"
  }, {
    id: "modernise",
    title: "Modernising our Data Team and Platform",
    desc: "We have a data team but we need to modernise our technology, skills and ways of working.",
    img: "images/challenge-modernise.png"
  }, {
    id: "embed",
    title: "Embedding Analytics in our Product",
    desc: "We're a SaaS vendor and want to build powerful, customer-facing analytics built on a rich semantic model into our application.",
    img: "images/challenge-embed.png"
  }, {
    id: "solve",
    title: "BI, DW & AI Expert Services",
    desc: "We're looking for help with Looker, dbt, Cube, BigQuery, event tracking or other modern data stack tools.",
    img: "images/challenge-solve.png"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "ra-section ra-section-alt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-container"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ra-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "What's your Main Data Challenge?"), /*#__PURE__*/React.createElement("p", {
    className: "ra-lede"
  }, "Every organisation's data journey is unique. Select the scenario that best describes your current needs to see how we can help.")), /*#__PURE__*/React.createElement("div", {
    className: "ra-challenge-grid"
  }, tiles.map(t => /*#__PURE__*/React.createElement(ChallengeCard, {
    key: t.id,
    tile: t,
    active: selected === t.id,
    onClick: () => setSelected(t.id)
  })))));
}
window.ChallengeCards = ChallengeCards;
Object.assign(__ds_scope, { ChallengeCards });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ChallengeCards.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// FinalCTA.jsx + Footer.jsx
function FinalCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "ra-finalcta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-container ra-finalcta-inner"
  }, /*#__PURE__*/React.createElement("h2", null, "Ready to confront the hard truths?"), /*#__PURE__*/React.createElement("p", null, "Book a 30-minute discovery call. We'll listen, ask the awkward questions, and tell you what we'd do."), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ra-btn ra-btn-primary ra-btn-lg"
  }, "Schedule a Discovery Call")));
}
function Footer() {
  const groups = [{
    h: "Services",
    items: ["Data Platform Development", "Data Team Enablement", "Embedded Analytics", "Expert Services"]
  }, {
    h: "Solutions",
    items: ["E-commerce & Retail", "FinTech", "EdTech", "Generative AI"]
  }, {
    h: "Partners",
    items: ["dbt Labs", "Looker", "Cube", "Fivetran", "Embeddable", "Dagster"]
  }, {
    h: "Resources",
    items: ["Blog", "Drill to Detail Podcast", "Case Studies", "Contact"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "ra-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-container ra-footer-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-footer-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-black-blue.svg",
    alt: "Rittman Analytics"
  }), /*#__PURE__*/React.createElement("p", null, "A boutique data analytics consultancy. Helping ambitious businesses scale and modernise their analytics capabilities since 2015.")), groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.h,
    className: "ra-footer-col"
  }, /*#__PURE__*/React.createElement("h4", null, g.h), /*#__PURE__*/React.createElement("ul", null, g.items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, i))))))), /*#__PURE__*/React.createElement("div", {
    className: "ra-footer-base"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Rittman Analytics Ltd"), /*#__PURE__*/React.createElement("span", null, "Registered in England"), /*#__PURE__*/React.createElement("span", null, "contact@rittmananalytics.com")));
}
window.FinalCTA = FinalCTA;
window.Footer = Footer;
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// Hero.jsx — centered headline, lede, CTA, partner logos strip
function Hero() {
  const partners = ["ROUVY", "Rixo", "Pleo", "Conversion", "Osprey", "Florence"];
  return /*#__PURE__*/React.createElement("section", {
    className: "ra-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-container"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "ra-display"
  }, "Your Company Scaled.", /*#__PURE__*/React.createElement("br", null), "Your Data Platform Didn't."), /*#__PURE__*/React.createElement("p", {
    className: "ra-lede"
  }, "You've built a successful business, but your data infrastructure is showing the strain. Your talented data team is bogged down in technical debt and firefighting, not innovation."), /*#__PURE__*/React.createElement("p", {
    className: "ra-supporting"
  }, "We are your long-term strategic partner in data transformation. We go beyond implementation to provide the architecture, processes and hands-on enablement that turns your data function into a strategic asset."), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ra-btn ra-btn-primary ra-btn-lg"
  }, "Schedule a Discovery Call"), /*#__PURE__*/React.createElement("div", {
    className: "ra-partners"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-partners-label"
  }, "Trusted by ambitious data teams at:"), /*#__PURE__*/React.createElement("div", {
    className: "ra-partners-row"
  }, partners.map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    className: "ra-partner-logo"
  }, p))))));
}
window.Hero = Hero;
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Methodology.jsx
try { (() => {
// Methodology.jsx — three indigo medallions with steps
function MedSearch() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "28",
    height: "28",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.6",
    y2: "16.6"
  }));
}
function MedBook() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "28",
    height: "28",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 4.5v15A2.5 2.5 0 0 1 6.5 22H20"
  }));
}
function MedUsers() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "28",
    height: "28",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 21v-2a4 4 0 0 0-3-3.87"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 3.13a4 4 0 0 1 0 7.75"
  }));
}
function MethodStep({
  Icon,
  n,
  title,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ra-method-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-method-medallion"
  }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("div", {
    className: "ra-eyebrow"
  }, "Step 0", n), /*#__PURE__*/React.createElement("h3", null, n, ". ", title), /*#__PURE__*/React.createElement("p", null, body));
}
function Methodology() {
  return /*#__PURE__*/React.createElement("section", {
    className: "ra-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-container"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ra-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "It's Never Just a Technical Problem."), /*#__PURE__*/React.createElement("p", {
    className: "ra-lede"
  }, "Traditional data consulting fails when it ignores the human element. Our proven three-step methodology ensures lasting success by addressing your technology, processes and people in tandem.")), /*#__PURE__*/React.createElement("div", {
    className: "ra-method-grid"
  }, /*#__PURE__*/React.createElement(MethodStep, {
    Icon: MedSearch,
    n: "1",
    title: "Confront the Hard Truths",
    body: "We start with a diagnostic deep dive to uncover the foundational, often uncomfortable, truths that are the real source of friction and inefficiency."
  }), /*#__PURE__*/React.createElement(MethodStep, {
    Icon: MedBook,
    n: "2",
    title: "Create the Change",
    body: "We architect and build a scalable, sustainable data foundation \u2014 from a modern data warehouse to a unified development workflow \u2014 that directly solves the core issues."
  }), /*#__PURE__*/React.createElement(MethodStep, {
    Icon: MedUsers,
    n: "3",
    title: "Manage the Change",
    body: "We embed with your team to foster new behaviours, overhaul rituals and cultivate a culture of ownership that ensures the transformation is permanent."
  })), /*#__PURE__*/React.createElement("div", {
    className: "ra-section-cta"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ra-btn ra-btn-secondary"
  }, "Learn More About Our Approach"))));
}
window.Methodology = Methodology;
Object.assign(__ds_scope, { Methodology });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Methodology.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Navigation.jsx
try { (() => {
// Navigation.jsx — sticky top nav with logo, menu, CTA
const {
  useState
} = React;
function NavLink({
  children,
  hasMenu
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "nav-link"
  }, children, hasMenu && /*#__PURE__*/React.createElement("span", {
    className: "nav-caret"
  }, "\u25BE"));
}
function Navigation() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "ra-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ra-nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ra-nav-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-black-blue.svg",
    alt: "Rittman Analytics"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ra-nav-menu"
  }, /*#__PURE__*/React.createElement(NavLink, {
    hasMenu: true
  }, "Services"), /*#__PURE__*/React.createElement(NavLink, {
    hasMenu: true
  }, "Solutions"), /*#__PURE__*/React.createElement(NavLink, {
    hasMenu: true
  }, "Partners"), /*#__PURE__*/React.createElement(NavLink, null, "Case Studies"), /*#__PURE__*/React.createElement(NavLink, {
    hasMenu: true
  }, "Resources"), /*#__PURE__*/React.createElement(NavLink, null, "About")), /*#__PURE__*/React.createElement("div", {
    className: "ra-nav-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ra-btn ra-btn-ghost"
  }, "Sign in"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "ra-btn ra-btn-primary"
  }, "Schedule a call"))));
}
window.Navigation = Navigation;
Object.assign(__ds_scope, { Navigation });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Navigation.jsx", error: String((e && e.message) || e) }); }

// wire/app.jsx
try { (() => {
// Wire — App shell + routing
const {
  useState: useStateApp,
  useEffect: useEffectApp
} = window.React;
function App() {
  const [route, setRoute] = useStateApp('home');
  const [cmd, setCmd] = useStateApp(false);
  const [assistant, setAssistant] = useStateApp(false);
  useEffectApp(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmd(c => !c);
      }
      if (e.key === 'Escape') {
        setCmd(false);
        setAssistant(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const fullBleedRoutes = {
    review: true,
    portal: true,
    wizard: true,
    editor: true
  };
  const hideSidebar = route === 'portal';
  const screen = route === 'home' ? /*#__PURE__*/React.createElement(HomeScreen, {
    onJump: setRoute
  }) : route === 'project' ? /*#__PURE__*/React.createElement(ProjectScreen, {
    onJump: setRoute
  }) : route === 'map' ? /*#__PURE__*/React.createElement(MapScreen, null) : route === 'review' ? /*#__PURE__*/React.createElement(ReviewScreen, null) : route === 'portal' ? /*#__PURE__*/React.createElement(PortalScreen, null) : route === 'wizard' ? /*#__PURE__*/React.createElement(WizardScreen, {
    onJump: setRoute
  }) : route === 'editor' ? /*#__PURE__*/React.createElement(EditorScreen, null) : /*#__PURE__*/React.createElement(HomeScreen, {
    onJump: setRoute
  });
  const crumbs = {
    home: ['Home'],
    project: ['Engagements', 'Carwow'],
    map: ['Engagements', 'Carwow', 'Map'],
    wizard: ['New project'],
    editor: [] // editor renders its own topbar
  };
  const topbarActions = {
    home: null,
    project: /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm"
    }, "Continue session \u2192"),
    map: null,
    wizard: null
  };
  if (hideSidebar) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, screen, cmd && /*#__PURE__*/React.createElement(CommandPalette, {
      onClose: () => setCmd(false),
      onJump: setRoute
    }));
  }

  // Editor + review render their own topbar inside the screen
  const screenHasOwnTopbar = route === 'editor' || route === 'review';
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    route: route,
    onNav: setRoute
  }), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, !screenHasOwnTopbar && /*#__PURE__*/React.createElement(TopBar, {
    crumb: crumbs[route] || ['Home'],
    action: topbarActions[route],
    onCmd: () => setCmd(true)
  }), screen), cmd && /*#__PURE__*/React.createElement(CommandPalette, {
    onClose: () => setCmd(false),
    onJump: setRoute
  }), !hideSidebar && route !== 'wizard' && route !== 'editor' && /*#__PURE__*/React.createElement(React.Fragment, null, !assistant && /*#__PURE__*/React.createElement(AssistantFAB, {
    onClick: () => setAssistant(true)
  }), /*#__PURE__*/React.createElement(AssistantOverlay, {
    open: assistant,
    onClose: () => setAssistant(false)
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "wire/app.jsx", error: String((e && e.message) || e) }); }

// wire/components.jsx
try { (() => {
// Wire — shared components
const {
  useState,
  useEffect,
  useRef
} = React;
const D = window.WireData;

// Lucide-style icons inline
function Icon({
  name,
  size = 16
}) {
  const paths = {
    home: 'M3 12l9-9 9 9M5 10v10h14V10',
    bolt: 'M13 2L3 14h9l-1 8 10-12h-9z',
    folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    map: 'M9 6l-6 2v14l6-2 6 2 6-2V6l-6 2zM9 6v14M15 8v14',
    review: 'M3 7h18M3 12h18M3 17h12',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    plus: 'M12 5v14M5 12h14',
    play: 'M5 3l14 9-14 9V3z',
    chev: 'M9 18l6-6-6-6',
    mic: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
    video: 'M23 7l-7 5 7 5V7zM1 5h15v14H1z',
    check: 'M20 6L9 17l-5-5',
    spark: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    split: 'M3 3l18 18M21 3v6h-6M3 21v-6h6',
    db: 'M12 4c-4.97 0-9 1.79-9 4v8c0 2.21 4.03 4 9 4s9-1.79 9-4V8c0-2.21-4.03-4-9-4zM3 8c0 2.21 4.03 4 9 4s9-1.79 9-4M3 12c0 2.21 4.03 4 9 4s9-1.79 9-4',
    chart: 'M3 3v18h18M7 14l4-4 4 4 5-5',
    code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
    send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
    bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    pen: 'M12 19l7-7 3 3-7 7H12v-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z',
    chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z',
    x: 'M18 6L6 18M6 6l12 12'
  };
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: paths[name]
  }));
}
function Avatar({
  id,
  size = 24
}) {
  const t = D.teamById(id);
  const cls = size === 32 ? 'avatar avatar-lg' : size === 20 ? 'avatar avatar-sm' : 'avatar';
  return /*#__PURE__*/React.createElement("span", {
    className: cls
  }, /*#__PURE__*/React.createElement("img", {
    src: t.img,
    alt: t.name
  }));
}
function Pill({
  status
}) {
  const label = D.STATUSES[status]?.label || status;
  return /*#__PURE__*/React.createElement("span", {
    className: `pill ${status}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `dot ${status}`
  }), label);
}
function Sidebar({
  route,
  onNav
}) {
  const items = [{
    key: 'home',
    label: 'Home',
    icon: 'home',
    count: '3'
  }, {
    key: 'project',
    label: 'Carwow',
    icon: 'folder'
  }, {
    key: 'map',
    label: 'Engagement map',
    icon: 'map'
  }, {
    key: 'review',
    label: 'Reviews',
    icon: 'review',
    count: '3'
  }, {
    key: 'editor',
    label: 'Release flow',
    icon: 'bolt'
  }];
  const second = [{
    key: 'wizard',
    label: 'New project',
    icon: 'plus'
  }, {
    key: 'portal',
    label: 'Portal preview',
    icon: 'send'
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-black-blue.svg",
    alt: "Rittman Analytics"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-section-label"
  }, "Workspace"), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.key,
    className: 'nav-item' + (route === it.key ? ' active' : ''),
    onClick: () => onNav(it.key)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon
  }), /*#__PURE__*/React.createElement("span", null, it.label), it.count && /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, it.count)))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-section-label"
  }, "Tools"), second.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.key,
    className: 'nav-item' + (route === it.key ? ' active' : ''),
    onClick: () => onNav(it.key)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon
  }), /*#__PURE__*/React.createElement("span", null, it.label)))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-foot"
  }, /*#__PURE__*/React.createElement(Avatar, {
    id: "mr",
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    className: "who"
  }, "Mark Rittman", /*#__PURE__*/React.createElement("small", null, "Rittman Analytics"))));
}
function TopBar({
  crumb,
  action,
  onCmd
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, crumb.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, "\u203A"), /*#__PURE__*/React.createElement("span", {
    className: i === crumb.length - 1 ? 'here' : ''
  }, c)))), /*#__PURE__*/React.createElement("div", {
    className: "cmd-trigger",
    onClick: onCmd
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, "Search or run a step\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2318K")), /*#__PURE__*/React.createElement("div", {
    className: "topbar-action"
  }, action));
}
function CommandPalette({
  onClose,
  onJump
}) {
  const [q, setQ] = useState('');
  const items = [{
    group: 'Jump to',
    nm: 'Carwow',
    dc: 'project',
    to: 'project'
  }, {
    group: 'Jump to',
    nm: 'Home',
    dc: 'route',
    to: 'home'
  }, {
    group: 'Jump to',
    nm: 'New project',
    dc: 'wizard',
    to: 'wizard'
  }, {
    group: 'Jump to',
    nm: 'Engagement map',
    dc: 'map',
    to: 'map'
  }, {
    group: 'Action',
    nm: 'Add release',
    dc: '⌘R'
  }, {
    group: 'Action',
    nm: 'Run autopilot · Carwow',
    dc: '⌘↵'
  }, {
    group: 'Action',
    nm: 'Open assistant',
    dc: '⌘.'
  }];
  const filtered = q ? items.filter(i => i.nm.toLowerCase().includes(q.toLowerCase())) : items;
  const groups = [...new Set(filtered.map(i => i.group))];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cmdk-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "cmdk"
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Type a command, or search\u2026",
    onKeyDown: e => e.key === 'Escape' && onClose()
  }), /*#__PURE__*/React.createElement("div", {
    className: "results"
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmdk-group"
  }, g), filtered.filter(i => i.group === g).map((i, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "cmdk-item",
    onClick: () => {
      if (i.to) onJump(i.to);
      onClose();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, i.nm), /*#__PURE__*/React.createElement("span", {
    className: "dc"
  }, i.dc))))))));
}
function AssistantOverlay({
  open,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "assistant-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "assistant-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "title"
  }, "Wire assistant"), /*#__PURE__*/React.createElement("button", {
    className: "assistant-close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "assistant-ctx"
  }, /*#__PURE__*/React.createElement("span", null, "Context:"), /*#__PURE__*/React.createElement("span", {
    className: "src-chip"
  }, "Carwow \xB7 Discovery brief"), /*#__PURE__*/React.createElement("span", {
    className: "src-chip"
  }, "Fathom \xB7 Workshop notes")), /*#__PURE__*/React.createElement("div", {
    className: "assistant-thread"
  }, /*#__PURE__*/React.createElement("div", {
    className: "assistant-msg user"
  }, "What's blocking the Hightouch inventory work?"), /*#__PURE__*/React.createElement("div", {
    className: "assistant-msg bot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "who"
  }, "Wire"), "Jairo Reyes (Hightouch owner) hasn't delivered the 544-sync inventory yet \u2014 it was a Day 1 ask. Lewis flagged this needs escalation to Becky by Wednesday AM if not received."), /*#__PURE__*/React.createElement("div", {
    className: "assistant-msg user"
  }, "Draft an escalation message I can send to Becky."), /*#__PURE__*/React.createElement("div", {
    className: "assistant-msg bot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "who"
  }, "Wire \xB7 draft"), "\"Becky \u2014 quick flag. We were expecting the Hightouch sync inventory from Jairo on Monday so we could classify the 544 syncs in parallel with the workshops. Without it OQ-12 stays open and we delay Phase 1 sequencing decisions. Can we get either the inventory by EOD tomorrow, or a sync between Jairo and Lewis to walk through it together?\"")), /*#__PURE__*/React.createElement("div", {
    className: "assistant-input"
  }, /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Ask Wire about this project\u2026"
  })));
}
function AssistantFAB({
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "assistant-fab",
    onClick: onClick,
    "aria-label": "Open assistant"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chat",
    size: 20
  }));
}
Object.assign(window, {
  Icon,
  Avatar,
  Pill,
  Sidebar,
  TopBar,
  CommandPalette,
  AssistantOverlay,
  AssistantFAB
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "wire/components.jsx", error: String((e && e.message) || e) }); }

// wire/data.js
try { (() => {
// Wire — shared data + helpers
window.WireData = function () {
  const STATUSES = {
    success: {
      label: 'Done',
      dot: 'success'
    },
    running: {
      label: 'Running',
      dot: 'running'
    },
    review: {
      label: 'Awaiting review',
      dot: 'review'
    },
    blocked: {
      label: 'Blocked',
      dot: 'blocked'
    },
    idle: {
      label: 'Idle',
      dot: 'idle'
    }
  };
  const TEAM = [{
    id: 'mr',
    name: 'Mark Rittman',
    role: 'CEO',
    img: '../assets/team/mark-rittman.png'
  }, {
    id: 'lb',
    name: 'Lewis Baker',
    role: 'COO/CRO',
    img: '../assets/team/lewis-baker.png'
  }, {
    id: 'ly',
    name: 'Lydia Blackley',
    role: 'Head of Delivery',
    img: '../assets/team/lydia-blackley.png'
  }, {
    id: 'ac',
    name: 'Alex Caldwell',
    role: 'Solutions',
    img: '../assets/team/alex-caldwell.png'
  }, {
    id: 'tg',
    name: 'Tim Griew',
    role: 'Senior Consultant',
    img: '../assets/team/tim-griew.png'
  }, {
    id: 'ss',
    name: 'Saverro Suseno',
    role: 'Senior Consultant',
    img: '../assets/team/saverro-suseno.png'
  }, {
    id: 'od',
    name: 'Olivier Dupuis',
    role: 'Senior Consultant',
    img: '../assets/team/olivier-dupuis.png'
  }, {
    id: 'ji',
    name: 'Jordan Ilyat',
    role: 'Senior Consultant',
    img: '../assets/team/jordan-ilyat.png'
  }];
  const ENGAGEMENTS = [{
    id: 'carwow',
    client: 'Carwow',
    project: 'BigQuery + Looker Migration',
    phase: 'Discovery',
    last: '2h ago',
    status: 'running',
    priority: 4
  }, {
    id: 'booksy',
    client: 'Booksy',
    project: 'Innovation Day · Looker rebuild',
    phase: 'Design',
    last: 'Yesterday',
    status: 'review',
    priority: 3
  }, {
    id: 'pleo',
    client: 'Pleo',
    project: 'Semantic layer v2',
    phase: 'Build',
    last: '3h ago',
    status: 'running',
    priority: 4
  }, {
    id: 'rouvy',
    client: 'ROUVY',
    project: 'Marketing attribution',
    phase: 'Review',
    last: '1h ago',
    status: 'review',
    priority: 3
  }, {
    id: 'florence',
    client: 'Florence',
    project: 'Recruitment funnel dashboard',
    phase: 'Build',
    last: 'Friday',
    status: 'blocked',
    priority: 5
  }];
  const ACTIVITY = [{
    time: '09:42',
    project: 'Carwow',
    event: 'Hightouch inventory not delivered — Day 2',
    status: 'blocked',
    action: 'Escalate'
  }, {
    time: '09:18',
    project: 'ROUVY',
    event: 'Attribution model v3 awaiting your review',
    status: 'review',
    action: 'Review'
  }, {
    time: '08:55',
    project: 'Booksy',
    event: 'LookML design draft awaiting your review',
    status: 'review',
    action: 'Review'
  }, {
    time: '08:30',
    project: 'Pleo',
    event: 'Discovery interview transcript awaiting review',
    status: 'review',
    action: 'Review'
  }, {
    time: '08:02',
    project: 'Carwow',
    event: 'Domain workshop · SMC Commercial scheduled 13:30',
    status: 'running',
    action: 'Open'
  }, {
    time: '07:48',
    project: 'Pleo',
    event: 'Run pleo_semantic_layer.deploy completed',
    status: 'success',
    action: 'View'
  }, {
    time: '07:30',
    project: 'Florence',
    event: 'Run florence_funnel.deploy started',
    status: 'running',
    action: 'View'
  }, {
    time: 'Yest',
    project: 'ROUVY',
    event: 'Stakeholder approved attribution v2',
    status: 'success',
    action: 'View'
  }];
  const DELIVERABLES = {
    requirements: [{
      name: 'Stakeholder map',
      type: 'Document',
      owner: 'lb',
      updated: 'Wed',
      status: 'success'
    }, {
      name: 'OQ register · 12 questions',
      type: 'Sheet',
      owner: 'mr',
      updated: 'Tue',
      status: 'success'
    }, {
      name: 'Discovery brief',
      type: 'Document',
      owner: 'ly',
      updated: 'Mon',
      status: 'success'
    }],
    design: [{
      name: '73-folder gold-layer triage',
      type: 'Document',
      owner: 'lb',
      updated: '2h ago',
      status: 'running'
    }, {
      name: 'Conformed dimensions',
      type: 'Document',
      owner: 'mr',
      updated: '3h ago',
      status: 'running'
    }, {
      name: 'Hightouch sync inventory',
      type: 'Sheet',
      owner: 'ly',
      updated: 'Day 1',
      status: 'blocked'
    }, {
      name: 'GYC entity-relationship doc',
      type: 'Document',
      owner: 'ac',
      updated: '—',
      status: 'idle'
    }],
    build: [{
      name: 'New gold layer · entity model spec',
      type: 'Document',
      owner: 'ac',
      updated: '—',
      status: 'idle'
    }, {
      name: 'BQ migration validation framework',
      type: 'Spec',
      owner: 'tg',
      updated: '—',
      status: 'idle'
    }],
    review: [{
      name: 'Plan review · Fri 29 May',
      type: 'Meeting',
      owner: 'mr',
      updated: 'Pending',
      status: 'idle'
    }, {
      name: 'Phase 2 SOW pack',
      type: 'Document',
      owner: 'lb',
      updated: 'Pending',
      status: 'idle'
    }]
  };
  const RELEASES = [{
    id: 'r1',
    name: 'Discovery sprint',
    steps: '8 steps · Discovery',
    status: 'running'
  }, {
    id: 'r2',
    name: 'Lift-and-shift v1',
    steps: '6 steps · Phase 1',
    status: 'review'
  }, {
    id: 'r3',
    name: 'Looker on as-is',
    steps: '5 steps · Phase 1',
    status: 'idle'
  }, {
    id: 'r4',
    name: 'New gold layer',
    steps: '14 steps · Phase 2',
    status: 'idle'
  }];
  const EDITOR_STEPS = {
    INPUT: [{
      name: 'SMC Commercial interview',
      cmd: '/wire:interview',
      status: 'success'
    }, {
      name: 'Gold-layer triage',
      cmd: '/wire:audit',
      status: 'success'
    }],
    ANALYSIS: [{
      name: 'Conformed dimensions',
      cmd: '/wire:analyse',
      status: 'running'
    }, {
      name: 'GYC entity model',
      cmd: '/wire:analyse',
      status: 'review'
    }],
    BUILD: [{
      name: 'BQ transfer plan',
      cmd: '/wire:plan',
      status: 'idle'
    }, {
      name: 'dbt syntax converter',
      cmd: '/wire:convert',
      status: 'idle'
    }],
    REVIEW: [{
      name: 'Plan review · 29 May',
      cmd: '/wire:review',
      status: 'idle'
    }]
  };
  const LIB = {
    INPUT: [{
      nm: 'Interview',
      ic: 'mic'
    }, {
      nm: 'Document',
      ic: 'file'
    }, {
      nm: 'Recording',
      ic: 'video'
    }, {
      nm: 'Ticket',
      ic: 'check'
    }],
    ANALYSIS: [{
      nm: 'Analyse',
      ic: 'spark'
    }, {
      nm: 'Summarise',
      ic: 'list'
    }, {
      nm: 'Compare',
      ic: 'split'
    }, {
      nm: 'Validate',
      ic: 'check'
    }],
    BUILD: [{
      nm: 'Data model',
      ic: 'db'
    }, {
      nm: 'Dashboard',
      ic: 'chart'
    }, {
      nm: 'LookML',
      ic: 'code'
    }, {
      nm: 'dbt model',
      ic: 'code'
    }],
    REVIEW: [{
      nm: 'Approve',
      ic: 'check'
    }, {
      nm: 'Publish',
      ic: 'send'
    }, {
      nm: 'Notify',
      ic: 'bell'
    }, {
      nm: 'Sign-off',
      ic: 'pen'
    }]
  };

  // Sort activity: blocked > review > running > success
  const order = {
    blocked: 0,
    review: 1,
    running: 2,
    success: 3,
    idle: 4
  };
  const ACTIVITY_SORTED = [...ACTIVITY].sort((a, b) => order[a.status] - order[b.status]);
  function teamById(id) {
    return TEAM.find(t => t.id === id) || TEAM[0];
  }
  return {
    STATUSES,
    TEAM,
    ENGAGEMENTS,
    ACTIVITY: ACTIVITY_SORTED,
    DELIVERABLES,
    RELEASES,
    EDITOR_STEPS,
    LIB,
    teamById
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "wire/data.js", error: String((e && e.message) || e) }); }

// wire/screens-1.jsx
try { (() => {
// Wire — screens (set A): Home, Project, Map
const D2 = window.WireData;
const React2 = window.React;
const {
  useState: useStateA
} = React2;

// ===== HOME =====
function HomeScreen({
  onJump
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Today"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Tuesday 26 May 2026 \xB7 five live engagements \xB7 three need your attention."), /*#__PURE__*/React.createElement("div", {
    className: "counters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "counter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "5"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Engagements active")), /*#__PURE__*/React.createElement("div", {
    className: "counter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "3"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Awaiting your review")), /*#__PURE__*/React.createElement("div", {
    className: "counter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "1"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Blocked")), /*#__PURE__*/React.createElement("div", {
    className: "counter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "12 ", /*#__PURE__*/React.createElement("span", {
    className: "alt"
  }, "/ 38")), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Steps running"))), /*#__PURE__*/React.createElement("div", {
    className: "caps"
  }, "Activity \xB7 ordered by urgency"), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 60
    }
  }, "Time"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 110
    }
  }, "Project"), /*#__PURE__*/React.createElement("th", null, "Event"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 160
    }
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 80
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, D2.ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "row-hover"
  }, /*#__PURE__*/React.createElement("td", {
    className: "tab muted"
  }, a.time), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, a.project)), /*#__PURE__*/React.createElement("td", null, a.event), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
    status: a.status
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "chip row-action"
  }, a.action)))))), /*#__PURE__*/React.createElement("div", {
    className: "caps"
  }, "Engagements"), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Client"), /*#__PURE__*/React.createElement("th", null, "Project"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 120
    }
  }, "Phase"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 120
    }
  }, "Last activity"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 160
    }
  }, "Status"))), /*#__PURE__*/React.createElement("tbody", null, D2.ENGAGEMENTS.map(e => /*#__PURE__*/React.createElement("tr", {
    key: e.id,
    className: "row-hover",
    onClick: () => onJump('project')
  }, /*#__PURE__*/React.createElement("td", {
    className: "name"
  }, e.client), /*#__PURE__*/React.createElement("td", null, e.project), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, e.phase), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, e.last), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
    status: e.status
  })))))));
}

// ===== PROJECT VIEW =====
function ProjectScreen({
  onJump
}) {
  const [openPhase, setOpenPhase] = useStateA('design');
  const phases = [{
    key: 'requirements',
    label: 'Requirements',
    items: D2.DELIVERABLES.requirements
  }, {
    key: 'design',
    label: 'Design',
    items: D2.DELIVERABLES.design
  }, {
    key: 'build',
    label: 'Build',
    items: D2.DELIVERABLES.build
  }, {
    key: 'review',
    label: 'Review',
    items: D2.DELIVERABLES.review
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "content",
    style: {
      padding: '0 32px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "proj-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "caps",
    style: {
      margin: 0
    }
  }, "Engagements \u203A Carwow"), /*#__PURE__*/React.createElement("h1", null, "Carwow \xB7 BigQuery + Looker migration"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement(Pill, {
    status: "running"
  }), /*#__PURE__*/React.createElement("span", null, "\xB7 Last run 2h ago"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("div", {
    className: "avatar-stack"
  }, /*#__PURE__*/React.createElement(Avatar, {
    id: "mr",
    size: 20
  }), /*#__PURE__*/React.createElement(Avatar, {
    id: "lb",
    size: 20
  }), /*#__PURE__*/React.createElement(Avatar, {
    id: "ly",
    size: 20
  }), /*#__PURE__*/React.createElement(Avatar, {
    id: "ac",
    size: 20
  })))), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost"
  }, "Run autopilot"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, "Continue session \u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "metrics-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "3 ", /*#__PURE__*/React.createElement("span", {
    className: "alt"
  }, "/ 4")), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Phase progress")), /*#__PURE__*/React.createElement("div", {
    className: "metric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "5 ", /*#__PURE__*/React.createElement("span", {
    className: "alt"
  }, "/ 12")), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Deliverables")), /*#__PURE__*/React.createElement("div", {
    className: "metric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "3"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Open reviews")), /*#__PURE__*/React.createElement("div", {
    className: "metric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "2d ago"), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, "Last activity"))), /*#__PURE__*/React.createElement("div", {
    className: "next-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "indi"
  }), /*#__PURE__*/React.createElement("strong", null, "Next up"), /*#__PURE__*/React.createElement("span", {
    className: "what"
  }, "Close Hightouch inventory blocker \xB7 Lewis to escalate to Becky")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, "Continue \u2192")), phases.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.key,
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "caps",
    style: {
      margin: 0,
      padding: '12px 0',
      borderBottom: '1px solid var(--ra-line)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer'
    },
    onClick: () => setOpenPhase(openPhase === p.key ? null : p.key)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chev",
    size: 12
  }), /*#__PURE__*/React.createElement("span", null, p.label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: 'var(--ra-mute)',
      fontWeight: 400,
      textTransform: 'none',
      letterSpacing: 0
    }
  }, p.items.length, " deliverables")), openPhase === p.key && /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("tbody", null, p.items.map((d, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "row-hover",
    onClick: () => onJump && onJump('review')
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      width: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `dot ${d.status}`
  })), /*#__PURE__*/React.createElement("td", {
    className: "name"
  }, d.name), /*#__PURE__*/React.createElement("td", {
    className: "muted",
    style: {
      width: 120
    }
  }, d.type), /*#__PURE__*/React.createElement("td", {
    style: {
      width: 60
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    id: d.owner,
    size: 20
  })), /*#__PURE__*/React.createElement("td", {
    className: "muted tab",
    style: {
      width: 100
    }
  }, d.updated), /*#__PURE__*/React.createElement("td", {
    style: {
      width: 80
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "chip row-action"
  }, "Open")))))))));
}

// ===== MAP =====
function MapScreen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "content",
    style: {
      padding: '0 32px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "proj-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "caps",
    style: {
      margin: 0
    }
  }, "Engagements \u203A Carwow"), /*#__PURE__*/React.createElement("h1", null, "Engagement map"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement(Pill, {
    status: "running"
  }), /*#__PURE__*/React.createElement("span", null, "\xB7 4 releases \xB7 33 steps total"))), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chip"
  }, "List"), /*#__PURE__*/React.createElement("div", {
    className: "chip",
    style: {
      background: 'var(--ra-ink)',
      color: '#fff'
    }
  }, "Map")))), /*#__PURE__*/React.createElement("div", {
    className: "dag-canvas",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dag-row"
  }, D2.RELEASES.map((r, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: r.id
  }, /*#__PURE__*/React.createElement("div", {
    className: `dag-node ${r.status}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, r.name, " ", /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, "\u203A")), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, r.steps)), i < D2.RELEASES.length - 1 && /*#__PURE__*/React.createElement("div", {
    className: "dag-edge"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "dag-foot"
  }, /*#__PURE__*/React.createElement("span", null, "4 releases"), /*#__PURE__*/React.createElement("span", null, "\xB7 33 steps"), /*#__PURE__*/React.createElement("span", null, "\xB7 5 completed"))));
}
Object.assign(window, {
  HomeScreen,
  ProjectScreen,
  MapScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "wire/screens-1.jsx", error: String((e && e.message) || e) }); }

// wire/screens-2.jsx
try { (() => {
// Wire — screens (set B): Review, Portal, Wizard, Editor
const D3 = window.WireData;
const {
  useState: useStateB
} = window.React;

// ===== REVIEW =====
function ReviewScreen() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement("span", null, "Carwow"), /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, "\u203A"), /*#__PURE__*/React.createElement("span", null, "Deliverables"), /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, "\u203A"), /*#__PURE__*/React.createElement("span", {
    className: "here"
  }, "Conformed dimensions ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--ra-mute)',
      fontStyle: 'normal',
      marginLeft: 6
    }
  }, "v2 \u2304"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Pill, {
    status: "review"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Request changes"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, "Approve")), /*#__PURE__*/React.createElement("div", {
    className: "review-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "review-doc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "doc-meta"
  }, "v2 \xB7 Updated by Mark Rittman \xB7 26 May, 09:14"), /*#__PURE__*/React.createElement("h1", null, "Conformed dimensions"), /*#__PURE__*/React.createElement("p", null, "Discovery sprint deliverable defining the canonical, cross-domain dimensions that every gold-layer fact will join to in the rebuilt warehouse."), /*#__PURE__*/React.createElement("h2", null, "1 \xB7 Dimensions in scope"), /*#__PURE__*/React.createElement("p", null, "Six conformed dimensions, agreed in the SMC and GYC workshops on 19 May. Each dimension has one canonical definition; domain-specific extensions are permitted but live in domain schemas, not the conformed layer."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "comment-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "commented"
  }, "User \xB7 email and HubSpot ID; deduplicated via a Looker block on the application user table.")), /*#__PURE__*/React.createElement("p", null, "Vehicle \xB7 standardised on the manufacturer SKU and trim string. Stub records permitted for pre-config enquiries."), /*#__PURE__*/React.createElement("p", null, "Dealer \xB7 dealer ID plus the parent group rollup. Date \xB7 UTC, calendar + fiscal. Country \xB7 ISO-3166. Channel \xB7 the 7-tag taxonomy Roman's team agreed."), /*#__PURE__*/React.createElement("h2", null, "2 \xB7 Resolution rules"), /*#__PURE__*/React.createElement("p", null, "Where the same logical entity appears under different surrogate keys across source systems, resolution rules live in the conformed layer \u2014 not in fact tables. Documented per dimension in the appendix."), /*#__PURE__*/React.createElement("h2", null, "3 \xB7 Open items"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "comment-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "commented"
  }, "GYC join key \u2014 see the GYC entity-relationship document. Not solvable in Phase 1; Phase 2 design problem."))), /*#__PURE__*/React.createElement("div", {
    className: "review-conv"
  }, /*#__PURE__*/React.createElement("div", {
    className: "conv-label"
  }, "Conversation \xB7 4 comments"), /*#__PURE__*/React.createElement("div", {
    className: "thread"
  }, /*#__PURE__*/React.createElement("div", {
    className: "comment"
  }, /*#__PURE__*/React.createElement(Avatar, {
    id: "lb",
    size: 24
  }), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Lewis Baker"), /*#__PURE__*/React.createElement("span", {
    className: "time"
  }, "3h ago")), /*#__PURE__*/React.createElement("div", {
    className: "text"
  }, "For the User dimension \u2014 should we capture the cross-domain identity resolution rules here, or defer to the conformed layer doc?"))), /*#__PURE__*/React.createElement("div", {
    className: "comment indented"
  }, /*#__PURE__*/React.createElement(Avatar, {
    id: "mr",
    size: 24
  }), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Mark Rittman"), /*#__PURE__*/React.createElement("span", {
    className: "time"
  }, "2h ago")), /*#__PURE__*/React.createElement("div", {
    className: "quoted"
  }, "\"cross-domain identity resolution rules\""), /*#__PURE__*/React.createElement("div", {
    className: "text"
  }, "Defer. This doc is the surface; the resolution rules live in the conformed schema definition with the surrogate-key mapping. Will add a forward link."))), /*#__PURE__*/React.createElement("div", {
    className: "comment"
  }, /*#__PURE__*/React.createElement(Avatar, {
    id: "ac",
    size: 24
  }), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Alex Caldwell"), /*#__PURE__*/React.createElement("span", {
    className: "time"
  }, "1h ago")), /*#__PURE__*/React.createElement("div", {
    className: "text"
  }, "GYC item flagged \u2014 agreed Phase 2. Linking the entity-relationship doc once Olivier's draft is in."))), /*#__PURE__*/React.createElement("div", {
    className: "comment"
  }, /*#__PURE__*/React.createElement(Avatar, {
    id: "ly",
    size: 24
  }), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "Lydia Blackley"), /*#__PURE__*/React.createElement("span", {
    className: "time"
  }, "38m ago")), /*#__PURE__*/React.createElement("div", {
    className: "text"
  }, "Ready for Becky's review once these two threads close.")))), /*#__PURE__*/React.createElement("div", {
    className: "conv-input"
  }, "Comment ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ra-mute)'
    }
  }, "\xB7 \u2318\u21B5")))));
}

// ===== PORTAL =====
function PortalScreen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "portal",
    style: {
      background: 'var(--ra-paper)',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "portal-head"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-black-blue.svg",
    alt: "Rittman Analytics"
  }), /*#__PURE__*/React.createElement("div", {
    className: "who"
  }, "Prepared for Becky Allsop, Carwow", /*#__PURE__*/React.createElement("br", null), "26 May 2026 \xB7 v2")), /*#__PURE__*/React.createElement("div", {
    className: "portal-doc"
  }, /*#__PURE__*/React.createElement("h1", null, "Discovery sprint review \xB7 Carwow"), /*#__PURE__*/React.createElement("div", {
    className: "doc-meta"
  }, "A walk-through of what the team designed in week one, the open questions still to close, and the recommended path into Phase 2."), /*#__PURE__*/React.createElement("h2", null, "What we designed"), /*#__PURE__*/React.createElement("p", null, "The new gold layer is structured around seventeen business domains, with six conformed dimensions binding them together. Each domain owns its own facts; conformed dimensions are owned centrally so the same Looker model can answer questions across SMC, GYC and OEM without dimension drift."), /*#__PURE__*/React.createElement("h2", null, "Where we landed"), /*#__PURE__*/React.createElement("p", null, "Five domains have been audited in depth this sprint: SMC Commercial, SMC Operations, GYC, Marketing and OEM. The remaining twelve will be audited in priority order in the first six weeks of Phase 2."), /*#__PURE__*/React.createElement("p", null, "The single hardest design problem \u2014 GetYourCar's configuration-to-enquiry join \u2014 has been articulated, investigated, and documented as a Phase 2 model proposal. We do not believe it is solvable inside the existing source data, and we have laid out the source-system change that would resolve it."), /*#__PURE__*/React.createElement("h2", null, "Recommended next step"), /*#__PURE__*/React.createElement("p", null, "Sign the Phase 2 SOW on Friday 29 May and start the build engagement Monday 1 June. The Tableau switch-off in August is the binding constraint; everything in this plan is scheduled backwards from that date.")), /*#__PURE__*/React.createElement("div", {
    className: "portal-foot"
  }, "Prepared by Rittman Analytics \xB7 Questions to mark.rittman@rittmananalytics.com"), /*#__PURE__*/React.createElement("div", {
    className: "portal-bar"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Your name"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm"
  }, "Add comment"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, "Approve")));
}

// ===== WIZARD =====
function WizardScreen({
  onJump
}) {
  const [type, setType] = useStateB('Full platform');
  const types = [{
    name: 'Discovery',
    dc: '2–4 week scoping engagement'
  }, {
    name: 'Full platform',
    dc: 'Build the modern data stack end-to-end'
  }, {
    name: 'Dashboards',
    dc: 'Looker / Power BI build only'
  }, {
    name: 'Data model',
    dc: 'dbt / semantic-layer engagement'
  }, {
    name: 'SoP discovery',
    dc: 'Standard ops process audit'
  }, {
    name: 'Custom',
    dc: 'Define the scope manually'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "wizard"
  }, /*#__PURE__*/React.createElement("h1", null, "New project"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Wire creates the engagement, configures sources, and seeds the first release."), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Client"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search HubSpot\u2026",
    defaultValue: "Carwow"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Project name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    defaultValue: "Carwow \xB7 BigQuery + Looker migration"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "Auto-suggested from the client name and project type. Press Tab to accept.")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Project type"), /*#__PURE__*/React.createElement("div", {
    className: "opt-list"
  }, types.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    className: 'opt-row' + (type === t.name ? ' selected' : ''),
    onClick: () => setType(t.name)
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, t.name), /*#__PURE__*/React.createElement("div", {
    className: "dc"
  }, t.dc)), /*#__PURE__*/React.createElement("div", {
    className: "radio"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Sources"), /*#__PURE__*/React.createElement("div", {
    className: "collapse-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, "+ Add source"), /*#__PURE__*/React.createElement("span", {
    className: "dc",
    style: {
      color: 'var(--ra-mute)'
    }
  }, "Fathom \xB7 Drive \xB7 Jira \xB7 BigQuery \xB7 Looker"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Team"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    id: "mr",
    size: 24
  }), /*#__PURE__*/React.createElement(Avatar, {
    id: "lb",
    size: 24
  }), /*#__PURE__*/React.createElement(Avatar, {
    id: "ly",
    size: 24
  }), /*#__PURE__*/React.createElement(Avatar, {
    id: "ac",
    size: 24
  }), /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      marginLeft: 8
    }
  }, "+ Add"))), /*#__PURE__*/React.createElement("div", {
    className: "wizard-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-text",
    onClick: () => onJump('home')
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => onJump('project')
  }, "Create project \u2192")));
}

// ===== EDITOR =====
function EditorScreen() {
  const [selected, setSelected] = useStateB('Conformed dimensions');
  const phases = Object.entries(D3.EDITOR_STEPS);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement("span", null, "Carwow"), /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, "\u203A"), /*#__PURE__*/React.createElement("span", null, "Releases"), /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, "\u203A"), /*#__PURE__*/React.createElement("span", {
    className: "here"
  }, "Discovery sprint")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "chip"
  }, "Flow"), /*#__PURE__*/React.createElement("div", {
    className: "chip",
    style: {
      background: 'var(--ra-paper-3)',
      color: 'var(--ra-mute-strong)'
    }
  }, "List"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, "Run release")), /*#__PURE__*/React.createElement("div", {
    className: "editor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "editor-lib"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Search steps\u2026"
  }), Object.entries(D3.LIB).map(([section, items]) => /*#__PURE__*/React.createElement("div", {
    key: section
  }, /*#__PURE__*/React.createElement("div", {
    className: "lib-section"
  }, section), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.nm,
    className: "lib-item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.ic,
    size: 14
  }), it.nm))))), /*#__PURE__*/React.createElement("div", {
    className: "editor-canvas"
  }, phases.map(([phase, steps]) => /*#__PURE__*/React.createElement("div", {
    key: phase,
    className: "editor-phase"
  }, /*#__PURE__*/React.createElement("div", {
    className: "caps-label"
  }, phase), /*#__PURE__*/React.createElement("div", {
    className: "step-row"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: `step ${s.status}` + (s.name === selected ? ' selected' : ''),
    onClick: () => setSelected(s.name)
  }, s.status === 'running' && /*#__PURE__*/React.createElement("span", {
    className: "pill running pill-above"
  }, "Running"), s.status === 'review' && /*#__PURE__*/React.createElement("span", {
    className: "pill review pill-above"
  }, "Review"), /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, s.name), /*#__PURE__*/React.createElement("div", {
    className: "cmd"
  }, s.cmd)), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
    className: "step-conn"
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "editor-inspector"
  }, /*#__PURE__*/React.createElement("h3", null, selected), /*#__PURE__*/React.createElement("div", {
    className: "cmd"
  }, "/wire:analyse"), /*#__PURE__*/React.createElement("div", {
    className: "inspector-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Inputs"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "SMC Commercial transcript \xB7 Domain audit notes (Day 1)")), /*#__PURE__*/React.createElement("div", {
    className: "inspector-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Last run"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "26 May, 09:18 \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "2m 14s"))), /*#__PURE__*/React.createElement("div", {
    className: "inspector-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Downstream"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "GYC entity model \xB7 BQ transfer plan")), /*#__PURE__*/React.createElement("div", {
    className: "inspector-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Logs"), /*#__PURE__*/React.createElement("a", null, "Open in panel \u2193")))), /*#__PURE__*/React.createElement("div", {
    className: "editor-statusbar"
  }, /*#__PURE__*/React.createElement("span", null, "6 steps"), /*#__PURE__*/React.createElement("span", null, "2 done"), /*#__PURE__*/React.createElement("span", null, "1 review"), /*#__PURE__*/React.createElement("span", null, "3 idle"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, "Last run 09:18")));
}
Object.assign(window, {
  ReviewScreen,
  PortalScreen,
  WizardScreen,
  EditorScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "wire/screens-2.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CaseStudies = __ds_scope.CaseStudies;

__ds_ns.ChallengeCards = __ds_scope.ChallengeCards;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.Methodology = __ds_scope.Methodology;

__ds_ns.Navigation = __ds_scope.Navigation;

})();
