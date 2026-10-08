/* Never Solutions — interactions */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  function store(get, val) {
    try {
      if (get) return sessionStorage.getItem("ns-curtain");
      if (val) sessionStorage.setItem("ns-curtain", "1");
      else sessionStorage.removeItem("ns-curtain");
    } catch (e) { return null; }
  }

  /* ---------- Page transition ---------- */
  var curtain = document.querySelector(".curtain");
  if (curtain && !reduce && store(true)) {
    curtain.classList.add("arrive");
    store(false, false);
    curtain.addEventListener("animationend", function () { curtain.classList.remove("arrive"); }, { once: true });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || !curtain || reduce) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || a.target === "_blank" || a.hasAttribute("download")) return;
    if (/^(mailto:|tel:|https?:)/.test(href)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    store(false, true);
    document.body.classList.remove("menu-open");
    curtain.classList.add("leave");
    setTimeout(function () { window.location.href = href; }, 520);
  });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted && curtain) curtain.classList.remove("leave", "arrive");
  });

  /* ---------- Header ---------- */
  var header = document.querySelector(".site-header");
  var lastY = 0;
  function onScrollHeader() {
    var y = window.scrollY;
    if (!header) return;
    header.classList.toggle("scrolled", y > 20);
    var hide = y > lastY && y > 400 && !document.body.classList.contains("menu-open");
    header.classList.toggle("hidden", hide);
    lastY = y;
  }

  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.querySelector("span").textContent = open ? "Close" : "Menu";
    });
  }

  /* ---------- Year, back to top ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  var top = document.querySelector(".to-top");
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- Split headings into words ---------- */
  document.querySelectorAll(".split").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="transition-delay:' + (i * 0.06) + 's">' + w + "</span></span>";
    }).join(" ");
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".split, .reveal, .offers li");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    revealEls.forEach(function (el, i) {
      if (el.matches(".offers li")) el.style.transitionDelay = (i % 6) * 0.08 + "s";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Hero wordmark: letters react to the cursor ---------- */
  var wordmark = document.querySelector(".wordmark");
  var chars = [];
  if (wordmark) {
    wordmark.querySelectorAll(".line").forEach(function (line) {
      var text = line.textContent;
      line.setAttribute("aria-hidden", "true");
      line.innerHTML = text.split("").map(function (c, i) {
        return '<span class="ch" style="transition-delay:' + (0.15 + i * 0.045) + 's">' + c + "</span>";
      }).join("");
    });
    chars = Array.prototype.slice.call(wordmark.querySelectorAll(".ch"));
    requestAnimationFrame(function () { setTimeout(function () { root.classList.add("loaded"); }, 60); });
  } else {
    root.classList.add("loaded");
  }

  var mouse = { x: -9999, y: -9999, active: false };
  var charState = chars.map(function () { return { w: 92, g: 300 }; });
  var t0 = performance.now();

  function animateChars(now) {
    if (!chars.length) return;
    var auto = !mouse.active;
    chars.forEach(function (ch, i) {
      var tw, tg;
      if (auto) {
        // gentle travelling wave when there is no cursor
        var wave = Math.sin((now - t0) / 900 - i * 0.55);
        tw = 96 + wave * 18;
        tg = 330 + wave * 120;
      } else {
        var r = ch.getBoundingClientRect();
        var dx = mouse.x - (r.left + r.width / 2);
        var dy = mouse.y - (r.top + r.height / 2);
        var d = Math.sqrt(dx * dx + dy * dy);
        var f = Math.max(0, 1 - d / 380);
        f = f * f * (3 - 2 * f);
        tw = 82 + f * 43;
        tg = 250 + f * 550;
      }
      var s = charState[i];
      s.w += (tw - s.w) * 0.12;
      s.g += (tg - s.g) * 0.12;
      ch.style.setProperty("--w", s.w.toFixed(1));
      ch.style.setProperty("--g", s.g.toFixed(0));
    });
  }

  /* ---------- Lamp position for grid spotlight ---------- */
  var lampEls = document.querySelectorAll(".hero, .page-hero");
  var lamp = { x: 0.62, y: 0.38, tx: 0.62, ty: 0.38 };

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    var el = lampEls[0];
    if (el) {
      var r = el.getBoundingClientRect();
      lamp.tx = (e.clientX - r.left) / r.width;
      lamp.ty = (e.clientY - r.top) / r.height;
    }
  }, { passive: true });
  document.addEventListener("pointerleave", function () { mouse.active = false; });

  /* ---------- Custom cursor ---------- */
  var cursor, dot;
  if (finePointer && !reduce) {
    root.classList.add("has-cursor");
    cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.innerHTML = "<span></span>";
    dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    document.addEventListener("pointerover", function (e) {
      var label = e.target.closest("[data-cursor]");
      var link = e.target.closest("a, button, label, .filters button");
      cursor.classList.toggle("is-label", !!label);
      cursor.querySelector("span").textContent = label ? label.getAttribute("data-cursor") : "";
      cursor.classList.toggle("is-link", !!link && !label);
      var text = e.target.closest("input, textarea");
      cursor.classList.toggle("is-hidden", !!text);
      dot.classList.toggle("is-hidden", !!text);
    });
  }
  var cur = { x: -100, y: -100 };

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduce) {
    document.querySelectorAll(".btn, .row-go, .nav-cta").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        b.style.transform = "translate(" + x * 0.25 + "px," + y * 0.35 + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- Rotating word ---------- */
  document.querySelectorAll(".rotator").forEach(function (rot) {
    var items = rot.querySelectorAll("span");
    if (items.length < 2 || reduce) { if (items[0]) items[0].classList.add("on"); return; }
    var i = 0;
    items[0].classList.add("on");
    function fit() { rot.style.width = items[i].offsetWidth + "px"; }
    fit();
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    setInterval(function () {
      var prev = items[i];
      i = (i + 1) % items.length;
      prev.classList.remove("on"); prev.classList.add("off");
      items[i].classList.remove("off"); items[i].classList.add("on");
      fit();
      setTimeout(function () { prev.classList.remove("off"); }, 800);
    }, 2400);
  });

  /* ---------- Statement: words light up while scrolling ---------- */
  var statement = document.querySelector(".statement");
  var litWords = [];
  if (statement) {
    var html = statement.innerHTML;
    statement.setAttribute("aria-label", statement.textContent.replace(/\s+/g, " ").trim());
    // keep <em> markers as highlight words
    var out = html.replace(/<em>(.*?)<\/em>|([^\s<]+)/g, function (m, em, word) {
      if (em) return em.split(/\s+/).map(function (w) { return '<span class="lw hl" aria-hidden="true">' + w + "</span>"; }).join(" ");
      return '<span class="lw" aria-hidden="true">' + word + "</span>";
    });
    statement.innerHTML = out;
    litWords = Array.prototype.slice.call(statement.querySelectorAll(".lw"));
  }
  function lightWords() {
    if (!litWords.length) return;
    if (reduce) { litWords.forEach(function (w) { w.classList.add("lit"); }); return; }
    var r = statement.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
    p = Math.max(0, Math.min(1, p));
    var n = Math.round(p * litWords.length);
    litWords.forEach(function (w, i) { w.classList.toggle("lit", i < n); });
  }

  /* ---------- Process line fills as you scroll ---------- */
  var process = document.querySelector(".process");
  var steps = process ? process.querySelectorAll("li") : [];
  steps.forEach(function (li) {
    var d = document.createElement("span");
    d.className = "dot";
    li.insertBefore(d, li.firstChild);
  });
  function fillProcess() {
    if (!process) return;
    var r = process.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = reduce ? 1 : (vh * 0.8 - r.top) / (vh * 0.5);
    p = Math.max(0, Math.min(1, p));
    process.style.setProperty("--p", p.toFixed(3));
    steps.forEach(function (li, i) { li.classList.toggle("on", p >= i / steps.length + 0.01 || p === 1); });
  }

  /* ---------- Main loop ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollHeader(); lightWords(); fillProcess();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  function loop(now) {
    if (!reduce) {
      animateChars(now);
      lamp.x += (lamp.tx - lamp.x) * 0.08;
      lamp.y += (lamp.ty - lamp.y) * 0.08;
      if (!mouse.active) {
        lamp.tx = 0.62 + Math.sin(now / 2600) * 0.18;
        lamp.ty = 0.38 + Math.cos(now / 3100) * 0.12;
      }
      lampEls.forEach(function (el) {
        el.style.setProperty("--mx", (lamp.x * 100).toFixed(2) + "%");
        el.style.setProperty("--my", (lamp.y * 100).toFixed(2) + "%");
      });
      if (cursor) {
        cur.x += (mouse.x - cur.x) * 0.18;
        cur.y += (mouse.y - cur.y) * 0.18;
        cursor.style.transform = "translate(" + cur.x + "px," + cur.y + "px)";
        dot.style.transform = "translate(" + mouse.x + "px," + mouse.y + "px)";
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---------- Portfolio filters ---------- */
  var filterButtons = document.querySelectorAll(".filters button");
  var cards = document.querySelectorAll(".work-grid .card");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterButtons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      cards.forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-category") === f;
        c.hidden = !show;
        if (show && !reduce && c.animate) {
          c.animate([{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], { duration: 600, easing: "cubic-bezier(.22,1,.36,1)" });
        }
      });
    });
  });

  /* ---------- Contact: preselect topic from ?topic= ---------- */
  var topic = new URLSearchParams(location.search).get("topic");
  if (topic) {
    var radio = document.querySelector('.topics input[value="' + topic + '"]');
    if (radio) radio.checked = true;
  }

  /* ---------- Contact form (Formspree) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        status.textContent = "The form isn't connected yet. Add your Formspree ID in contact.html.";
        status.className = "form-status";
        return;
      }
      status.textContent = "Sending…";
      status.className = "form-status";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          status.textContent = "Message sent. We'll reply within two working days.";
          status.className = "form-status ok";
        })
        .catch(function () {
          status.textContent = "The message didn't send. Check your connection and try again, or email us directly.";
          status.className = "form-status";
        });
    });
  }
})();
