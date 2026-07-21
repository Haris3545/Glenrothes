// Seamless background video loop using two alternating <video> elements.
//
// A single <video loop> restarts by seeking back to time 0 while still
// playing. On many browsers/devices that forces the decoder to stop and
// re-sync, which shows up as a visible freeze-then-resume right at the loop
// point. Instead we keep two copies of the same clip: one plays while the
// other sits primed and ready, and shortly before the playing one ends we
// start the standby one from 0 and cross-fade the opacity between them.
// Neither video is ever looped or seeked mid-playback, so there's nothing
// for the decoder to stall on.
//
// The cross-fade is a reveal, not a mutual fade: only the exiting video's
// opacity ever animates. The incoming one is always fully opaque underneath,
// just hidden behind it (see .is-current / .is-exiting in gate.css). If both
// videos faded toward 50% at the same time instead, their darkness would
// multiply together and the transition would visibly dip toward black.
(function () {
  "use strict";

  var videoA = document.getElementById("bg-video-a");
  var videoB = document.getElementById("bg-video-b");
  if (!videoA || !videoB) return;

  var OVERLAP = 1; // seconds; must match the CSS opacity transition duration
  var FALLBACK_DURATION = 13.766;

  var active = videoA;
  var standby = videoB;
  var swapping = false;

  function getDuration(video) {
    return isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  }

  function safePlay(video) {
    var p = video.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }

  function triggerSwap() {
    if (swapping) return;
    swapping = true;

    standby.currentTime = 0;
    safePlay(standby);
    standby.classList.add("is-current");
    active.classList.remove("is-current");
    active.classList.add("is-exiting");

    var justFinished = active;
    var newActive = standby;
    active = newActive;
    standby = justFinished;

    window.setTimeout(function () {
      standby.pause();
      standby.currentTime = 0;
      standby.classList.remove("is-exiting");
      swapping = false;
    }, OVERLAP * 1000);
  }

  function tick() {
    if (!swapping && active.currentTime >= getDuration(active) - OVERLAP) {
      triggerSwap();
    }
    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);

  // Safety net in case a frame is somehow missed near the very end.
  videoA.addEventListener("ended", triggerSwap);
  videoB.addEventListener("ended", triggerSwap);
})();
