// Log the current version of the extension
console.log(`running moodle-grader-tweaks ${chrome.runtime.getManifest().version}`);


// Get options from local storage and apply tweaks based on the settings
chrome.storage.local.get({ privateReply: true, highlightRating: true, disableOnBeforeUnload: true, collapseNoFiles: true, alertNoGrading: true }, (options) => {
  const { privateReply, highlightRating, disableOnBeforeUnload, collapseNoFiles, alertNoGrading } = options;


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

  if (alertNoGrading) {
    // Alert when saving without a grading selected
    alertOnSaveWithoutGrading();
  }

  if (collapseNoFiles) {
    // Collapse the review panel when no files are attached
    collapseReviewPanelOnNoFiles();
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

// Function to collapse the review panel when no files are attached to the submission
function collapseReviewPanelOnNoFiles() {
  const submissionSummary = document.querySelector('.submissionstatustable .assignsubmission_file');

  if (!submissionSummary || submissionSummary.textContent.trim() === 'No files') {
    console.log("No file attached, collapsing review panel");

    const event = new CustomEvent('grading:collapse-review-panel');
    document.dispatchEvent(event);

    const buttonCollapseReviewPanel = document.querySelector('.collapse-review-panel');
    const buttonCollapseNone = document.querySelector('.collapse-none');

    if (buttonCollapseReviewPanel) {
      buttonCollapseReviewPanel.classList.add('active');
    }

    if (buttonCollapseNone) {
      buttonCollapseNone.classList.remove('active');
    }
  }
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

// Function to alert when the save button is clicked without a grading selected
function alertOnSaveWithoutGrading() {
  document.addEventListener('click', function(event) {
    const saveButton = event.target.closest('input[type="submit"][name="submitbutton"], button[type="submit"][name="submitbutton"]');
    if (!saveButton) return;

    const gradeElement = document.querySelector('#id_grade');
    if (gradeElement && (gradeElement.value == '-1' || gradeElement.value.trim() === '')) {
      event.preventDefault();
      alert('Please select a grade before saving.');
    }
  });
}
