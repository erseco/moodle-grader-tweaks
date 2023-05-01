console.log(`running moodle-grader-tweaks ${chrome.runtime.getManifest().version}`);

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

// Grading background color

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
      // select.classList.add("selectbox-rating");
      select.style.setProperty('border', '2px solid red', 'important');
      select.style.setProperty('background-color','lightpink');

      // Crea un nuevo elemento span para contener el texto
      const textElement = document.createElement('span');

      // Establece el contenido de texto del elemento span
      textElement.textContent = ` ${select[0].label}`;

      // Inserta el elemento de texto después del select box en el DOM
      select.insertAdjacentElement('afterend', textElement);

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