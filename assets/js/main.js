// The Glenrothes — concept site behaviour
(function () {
  "use strict";

  // Mobile nav toggle
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Age gate
  var gate = document.getElementById("age-gate");
  if (gate) {
    var STORAGE_KEY = "glenrothes-age-confirmed";
    var alreadyConfirmed = false;
    try {
      alreadyConfirmed = sessionStorage.getItem(STORAGE_KEY) === "yes";
    } catch (e) { /* storage unavailable */ }

    if (alreadyConfirmed) {
      gate.hidden = true;
    } else {
      document.body.style.overflow = "hidden";
    }

    var enterBtn = gate.querySelector("[data-age='enter']");
    var leaveBtn = gate.querySelector("[data-age='leave']");

    if (enterBtn) {
      enterBtn.addEventListener("click", function () {
        gate.hidden = true;
        document.body.style.overflow = "";
        try { sessionStorage.setItem(STORAGE_KEY, "yes"); } catch (e) {}
      });
    }
    if (leaveBtn) {
      leaveBtn.addEventListener("click", function () {
        window.location.href = "https://www.responsibledrinking.org/";
      });
    }
  }

  // Newsletter + contact form: friendly client-side only feedback (no backend wired up)
  document.querySelectorAll("form[data-static-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent = form.dataset.successMessage || "Thank you — we've received your message.";
        status.classList.add("show", "ok");
      }
      form.reset();
    });
  });
})();
