
// Disable the window.onbeforeunload event on the initial page load and on any DOM change
(function () {
  function disableOnBeforeUnload() {
    window.onbeforeunload = null;
  }

  disableOnBeforeUnload();

  const observer = new MutationObserver(disableOnBeforeUnload);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
