// Log the current version of the extension
console.log(`running moodle-grader-tweaks ${chrome.runtime.getManifest().version}`);


// Get options from local storage and apply tweaks based on the settings
chrome.storage.local.get({ privateReply: true, highlightRating: true, disableOnBeforeUnload: true }, (options) => {
  const { privateReply, highlightRating, disableOnBeforeUnload } = options;


  // Apply the tweaks based on the options
  if (privateReply) {
    // Check and enable the private reply option
    checkPrivateReply();
  }

  if (highlightRating) {
    // Highlight the selectbox rating
    highlightSelectboxRating();
    highlightGradeView();
  }

  if (disableOnBeforeUnload) {
    // Inject the unload.js script into the web page
    (function() {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('unload.js');
      document.documentElement.appendChild(script);

      script.onload = function() {
        this.remove();
      };
    })();

  }

});


// Function to check and enable the private reply option
function checkPrivateReply() {
  // document.querySelectorAll("input[name='privatereply']").forEach((element) => {
  //   element.checked = true;
  // });

  // Observe DOM changes and enable the private reply option when needed
  const observer = new MutationObserver(function(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        document.querySelectorAll("input[name='privatereply']").forEach((element) => {
          element.checked = true;
        });
      }
    }
  });

  const config = {
    childList: true,
    subtree: true
  };

  observer.observe(document.body, config);

}

function highlightGradeView() {

  // Set the background color of "No Apto" grades
  document.querySelectorAll('span.gradevalue').forEach(function (element) {
    if (element.textContent.trim() === 'No Apto') {
      const parentTd = element.closest('td');
      if (parentTd) {
        parentTd.style.backgroundColor = 'lightpink';
      }
    }
  });

  document.querySelectorAll('td.column-grade').forEach(function (element) {
    if (element.textContent.trim() === 'No Apto') {
      element.style.backgroundColor = 'lightpink';
    }
  });

}

// Function to highlight the selectbox rating
function highlightSelectboxRating() {
  var postToGrade = 0;
  document.querySelectorAll("select[name='rating']").forEach(function (select) {
    var selectedValue = select.value;
    if (selectedValue == '-999') {
      select.style.setProperty('border', '2px solid red', 'important');
      select.style.setProperty('background-color','lightpink');

      // Create a new span element to contain the text
      const textElement = document.createElement('span');

      // Set the text content of the span element
      textElement.textContent = ` ${select[0].label}`;

      // Insert the text element after the select box in the DOM
      select.insertAdjacentElement('afterend', textElement);

      postToGrade += 1;
    }
  });
  if (postToGrade > 0)
    console.log(`There are ${postToGrade} post(s) to grade`)
}
