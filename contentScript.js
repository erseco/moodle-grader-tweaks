console.log("running moodle-grader-tweaks");


document.addEventListener('DOMContentLoaded', function() {
  if (typeof GradingPanel === 'undefined') {
    return;
  }

  const originalHandleFormSubmissionResponse = GradingPanel.prototype._handleFormSubmissionResponse;

  GradingPanel.prototype._handleFormSubmissionResponse = function(formdata, nextUserId, nextUser, response) {
    if (typeof nextUserId === 'undefined') {
      nextUserId = this._lastUserId;
    }

    if (response.length) {
      $(document).trigger('reset', [this._lastUserId, formdata]);
    } else {
      // Comenta la siguiente línea para evitar la alerta:
      // notification.alert(strs[0], strs[1]);

      str.get_strings([
        { key: 'changessaved', component: 'core' },
        { key: 'gradechangessaveddetail', component: 'mod_assign' },
      ]).fail(notification.exception);

      Y.use('moodle-core-formchangechecker', function() {
        M.core_formchangechecker.reset_form_dirty_state();
      });

      if (nextUserId === this._lastUserId) {
        $(document).trigger('reset', nextUserId);
      } else if (nextUser) {
        $(document).trigger('done-saving-show-next', true);
      } else {
        $(document).trigger('user-changed', nextUserId);
      }

      $('[data-region="overlay"]').hide();
    }
  };
});



chrome.storage.local.get(["privateReply", "highlightRating", "urlPattern"], (options) => {
  const { privateReply, highlightRating, urlPattern } = options;

    // if (privateReply) {
      checkPrivateReply();
    // }
    
    // if (highlightRating) {
      highlightSelectboxRating();
    // }

  // $(document).on('DOMNodeInserted', function (event) {

  //   document.querySelectorAll("input[name='privatereply']").forEach((element) => {
  //     element.checked = true;
  //     console.log('Private reply checkbox enabled');    
  //   });

  // });
  const observer = new MutationObserver(function(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        document.querySelectorAll("input[name='privatereply']").forEach((element) => {
          element.checked = true;
          // console.log('Private reply checkbox enabled');
        });
      }
    }
  });

  const config = {
    childList: true,
    subtree: true
  };

  observer.observe(document.body, config);

});

function checkPrivateReply() {
  document.querySelectorAll("input[name='privatereply']").forEach((element) => {
    element.checked = true;
  });
}

function highlightSelectboxRating() {

  // jQuery version
  // $("select[name='rating']").each(function () {
  //   var selectedValue = $(this).val();
  //   if (selectedValue == '-999') {
  //     $(this).addClass("selectbox-rating");
  //   }
  // });

  // plain js version
  var postToGrade = 0;
  document.querySelectorAll("select[name='rating']").forEach(function (select) {
    var selectedValue = select.value;
    if (selectedValue == '-999') {
      select.classList.add("selectbox-rating");
      postToGrade += 1;
    }
  });
  if (postToGrade > 0)
    console.log(`There are ${postToGrade} post(s) to grade`)


}



// https://moodle.org/mod/forum/discuss.php?d=387768

// <script type="text/javascript">
//     $(document).ready(function () {
//         $('div.p-t-1.p-b-1 a').click(function () {
//             $('#id_advancedadddiscussion').click();
//         });
//         $('div[data-region="post-actions-container"] a[data-action="collapsible-link"]').click(function (e) {
//             window.location.replace($(e.target).attr('href'));
//         });
//     });
// </script>