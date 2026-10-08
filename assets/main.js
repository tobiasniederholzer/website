// Mobile navigation
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // Current year in footer
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Portfolio filters
  var filterButtons = document.querySelectorAll(".filters button");
  var projects = document.querySelectorAll(".project");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      projects.forEach(function (p) {
        p.hidden = !(f === "all" || p.getAttribute("data-category") === f);
      });
    });
  });

  // Preselect the contact topic from ?topic=… links
  var topic = new URLSearchParams(location.search).get("topic");
  var select = document.getElementById("topic");
  if (topic && select) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === topic) select.selectedIndex = i;
    }
  }

  // Contact form (Formspree) — sends without leaving the page
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
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            status.textContent = "Message sent. I'll reply within two working days.";
            status.className = "form-status ok";
          } else {
            throw new Error();
          }
        })
        .catch(function () {
          status.textContent = "The message didn't send. Check your connection and try again, or email me directly.";
          status.className = "form-status";
        });
    });
  }
})();
