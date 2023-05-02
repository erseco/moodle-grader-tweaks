document.addEventListener('DOMContentLoaded', () => {
  // Load options from storage or set to true if they don't exist
  chrome.storage.local.get(['privateReply', 'highlightRating', 'disableOnBeforeUnload'], (options) => {
    document.getElementById('privateReply').checked = options.privateReply !== undefined ? options.privateReply : true;
    document.getElementById('highlightRating').checked = options.highlightRating !== undefined ? options.highlightRating : true;
    document.getElementById('disableOnBeforeUnload').checked = options.disableOnBeforeUnload !== undefined ? options.disableOnBeforeUnload : true;
  });

  // Save options to storage when a checkbox is changed
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const privateReply = document.getElementById('privateReply').checked;
      const highlightRating = document.getElementById('highlightRating').checked;
      const disableOnBeforeUnload = document.getElementById('disableOnBeforeUnload').checked;

      chrome.storage.local.set({ privateReply, highlightRating, disableOnBeforeUnload }, () => {
        console.log('Options saved!');
      });
    });
  });
});
