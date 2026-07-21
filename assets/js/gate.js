// The Distillery — password gate
(function () {
  "use strict";

  // Client-side gate only — a light-touch teaser lock, not real access control.
  // Change the password by editing this constant.
  var PASSWORD = "glenrothes";
  var REDIRECT_TO = "index.html";

  var stage = document.getElementById("gate-stage");
  var form = document.getElementById("gate-form");
  var input = document.getElementById("gate-password");
  var error = document.getElementById("gate-error");
  var field = document.getElementById("password-field");
  var toggle = document.getElementById("toggle-visibility");
  var enterBtn = document.getElementById("btn-enter");
  var successBadge = document.getElementById("gate-success-badge");

  function unlock() {
    enterBtn.disabled = true;
    enterBtn.textContent = "Welcome";
    if (successBadge) successBadge.classList.add("show");
    stage.classList.add("is-unlocked");
    window.setTimeout(function () {
      window.location.href = REDIRECT_TO;
    }, 650);
  }

  if (toggle && input) {
    toggle.addEventListener("click", function () {
      var isPassword = input.getAttribute("type") === "password";
      input.setAttribute("type", isPassword ? "text" : "password");
      toggle.classList.toggle("is-visible", isPassword);
      toggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      input.focus();
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = (input.value || "").trim().toLowerCase();

      if (value.length && value === PASSWORD) {
        error.classList.remove("show");
        unlock();
      } else {
        error.classList.add("show");
        field.classList.remove("shake");
        // restart animation
        void field.offsetWidth;
        field.classList.add("shake");
        input.focus();
        input.select();
      }
    });

    input.addEventListener("input", function () {
      if (error.classList.contains("show")) error.classList.remove("show");
    });
  }
})();
