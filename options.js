document.addEventListener("DOMContentLoaded", () => {
  loadOptions();
  document.getElementById("save-options").addEventListener("click", saveOptions);
});

function loadOptions() {
  chrome.storage.sync.get(["privateReply", "highlightRating", "urlPattern"], (options) => {
    document.getElementById("private-reply").checked = options.privateReply;
    document.getElementById("highlight-rating").checked = options.highlightRating;
    document.getElementById("url-pattern").value = options.urlPattern;
  });
}

function saveOptions() {
  const privateReply = document.getElementById("private-reply").checked;
  const highlightRating = document.getElementById("highlight-rating").checked;
  const urlPattern = document.getElementById("url-pattern").value;

  chrome.storage.sync.set({ privateReply, highlightRating, urlPattern }, () => {
    alert("Opciones guardadas");
  });
}
