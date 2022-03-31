let activePageContent = 0;
let lang = "en";
let overviewVisible = true;
/* 
  FOR EASY PLUG AND PLAY OF PAGES:
  * numbers start from 0
  * numbers are indicating the placement (order)
  * if you want an overview bubble you need to edit the tutorial html
    at the specified position to match the order (page 0 --> first overview) in the
    section "overview"
  * the page you insert needs to be implemented in the html in the section "tut-content"
    and will be flipped on and off as soon as it is called upon (through navigation)
  * If you want to add more than one page of a specific type
    than add "_case" and a specific term behind it (see below).
    This will allow to have different pictures within one general 
    category of cases. F.e. simple-grey_case is one category with the
    sub-pages _no-phish and _phish.
  * Naming-convention for all before green_case is
    same name as css class; "-" in css, "_" in js
*/
const pages = {
  0: "beta_notice",
  1: "welcome",
  2: "explanation",
  3: "green_case",
  4: "blue_case",
  5: "simple-grey_case_phish",
  6: "simple-grey_case_no-phish",
  7: "warning-grey_case_phish",
  8: "warning-grey_case_no-phish",
  9: "configurations",
};
const lastPage = Object.keys(pages).reduce((a, b) =>
  parseInt(a) > parseInt(b) ? parseInt(a) : parseInt(b)
);
let overviewCircles;

// TESTING STUFF
nrInCategory("warning-grey_case_no-phish", pages);

// STARTING WHEN CONTENT IS LOADED ON PAGE
$(document).ready(function () {
  // get language details
  lang = chrome.i18n.getUILanguage().substr(0, 2);

  overviewCircles = document.querySelectorAll(".overview-case");

  // add eventlisteners
  // to overview for interactive clicking (since css and JS names differ there might be some adaptations)
  overviewCircles.forEach((circle) => {
    circle.addEventListener("click", (e) => {
      activePageContent = Object.entries(pages)
        .sort((a, b) => {
          a[0] - b[0];
        })
        .find((page) => {
          return circle.classList.contains(page[1].replace(/_/g, "-"))
            ? page
            : null;
        })[0];
      show();
    });
  });
  // to nav-buttons
  $("#prev").on("click", function (e) {
    if (activePageContent > 0) show(--activePageContent);
  });
  $("#next").on("click", function (e) {
    if (activePageContent < lastPage) show(++activePageContent);
  });
  $("#finish").on("click", function (e) {
    e.target.classList.contains("disabled")
      ? false
      : chrome.runtime.sendMessage({ name: "close" });
  });

  init();
  show(activePageContent);
});

function show() {
  //console.log(`We are currently on page: ${activePageContent}`);
  activateCurrentPageElements();
  showPageContent();
}

function activateCurrentPageElements() {
  // possibility to adapt the visibility of overview-bubbles
  if (overviewVisible) {
    document.querySelector(".overview").style.display = "flex";
    // remove selected from all and then assign selected to the active circle
    overviewCircles.forEach((circle) => {
      circle.classList.remove("selected");
      circle.classList.contains(pages[activePageContent].replace(/_/g, "-"))
        ? circle.classList.add("selected")
        : null;
    });
  } else {
    document.querySelector(".overview").style.display = "none";
  }

  // logic for buttons (which are active/deactivated)
  activePageContent == Object.keys(pages).length - 1
    ? document.querySelector("#finish").classList.remove("disabled")
    : document.querySelector("#finish").classList.add("disabled");
}

function showPageContent() {
  // not displaying anything
  $(".tut-content > div").addClass("off");

  pages[activePageContent].includes("_case")
    ? // if it's an example
      prepExample()
    : // if it's a different page
      prepNoExamplePage();
}
/**
 * Initialize the entire tutorial with correct lang
 */
function init() {
  // see if we want overview or not
  activateCurrentPageElements();
  // at beginning for language´
  // page 'beta'
  $("#beta-title").html(getMsg("beta_title"));
  $("#beta-introduction-txt").html(getMsg("beta_introduction_txt"));
  $("#beta-key-point-1").html(getMsg("beta_key_point_1"));
  $("#beta-key-point-2").html(getMsg("beta_key_point_2"));
  $("#beta-feedback-hint").html(getMsg("beta_feedback_hint"));
  $("#beta-txt").html(getMsg("beta_txt"));

  // page 'welcome'
  $("#welcome-title").html(getMsg("welcome_title"));
  $("#introduction-txt").html(getMsg("introduction_txt"));
  $("#technical-bg-title").html(getMsg("technical_background_title"));
  $("#technical-bg-txt").html(getMsg("technical_background_txt"));
  $("#functionality-title").html(getMsg("functionality_title"));
  $("#functionality-txt").html(getMsg("functionality_txt"));
  $(".welcome").removeClass("off");

  // page 'explanation'
  $("#functionality-explanation-title").text(
    getMsg("functionality_explanation_title")
  );
  for (let i = 1; i < 8; i++) {
    $(`#functionality-explanation-txt-${i}`).html(
      getMsg(`functionality_explanation_txt_${i}`)
    );
  }
  $(`#domain-explain`).text(getMsg(`domain_translation`));
  // pages of the cases and their explanations
  $("#green-case-showcase-title").text(getMsg("green_case_title"));
  $("#blue-case-showcase-title").text(getMsg("blue_case_title"));
  $("#simple-grey-case-showcase-title").text(getMsg("simple_grey_case_title"));
  $("#warning-grey-case-showcase-title").text(
    getMsg("warning_grey_case_title")
  );
  $("#red-case-showcase-title").text(getMsg("red_case_title"));
  $("#green-case-showcase-img").attr(
    "src",
    `/img/examples/${lang}/green_case_${lang}.svg`
  );
  $("#blue-case-showcase-img").attr(
    "src",
    `/img/examples/${lang}/blue_case_${lang}.svg`
  );
  $("#simple-grey-case-showcase-img").attr(
    "src",
    `/img/examples/${lang}/simple-grey_case_no-phish_${lang}.svg`
  );
  $("#warning-grey-case-showcase-img").attr(
    "src",
    `/img/examples/${lang}/warning-grey_case_no-phish_${lang}.svg`
  );
  $("#red-case-showcase-img").attr(
    "src",
    `/img/examples/${lang}/red_case_${lang}.svg`
  );
  // making examples clickable by binding them to pages depending on first word of css selector
  let showcases = Array.from(document.querySelectorAll(".show-case-card.card"));
  showcases.forEach((showcase) => {
    showcase.addEventListener("click", (e) => {
      let keyword = showcase.classList[0].split("-")[0];
      activePageContent = findFirstByIndex(pages, keyword);
      show();
    });
  });

  // page configurations
  $("#contextmenu-img").attr(
    "src",
    `/img/examples/${lang}/simple-grey_case_contextmenu_${lang}.svg`
  );
  $("#special-cases-title").text(getMsg("special_cases_title"));
  $("#special-cases-txt").text(getMsg("special_cases_txt"));

  $("#settings-title").text(getMsg("settings_title"));
  $("#settings-subtitle").text(getMsg("settings_subtitle"));
  $("#settings-img").attr("src", `/img/examples/${lang}/settings_${lang}.png`);
  Array.from(document.querySelectorAll(".settings-option")).forEach(
    (option, index) => {
      $(`#settings-option-${index + 1}`).html(
        getMsg(`settings_option_${index}`)
      );
    }
  );
}

// HELPER FUNCTIONS

// ANALYZING PAGES
/**
 *
 * @param {*} object object containing all pages
 *
 *  reads out all the names of pages and concatenating those to selector to
 *  easily display none all pages and activate the appropriate one.
 */
function readOutCSSClassesConcatenatedNotExamples(object) {
  let results = Object.values(object).filter((entry) => {
    return !entry.match(/_case/g) ? entry : null;
  });
  return results;
}
/**
 *
 * @param {*} obj object to go through
 * @param {*} firstExampleValue RegEx to look for, if none is specified first value containing the RegEx "_case" is chosen
 *
 *  @returns first match containing firstExampleValue, if none matches returns null
 */
function findFirstByIndex(obj, firstExampleValue = null) {
  let result = firstExampleValue
    ? Object.entries(obj)
        .sort((a, b) => a[0] - b[0])
        .filter((entry) => entry[1].match(firstExampleValue))
    : Object.entries(obj)
        .sort((a, b) => a[0] - b[0])
        .filter((entry) => entry[1].match(/_case/g));
  return result.length ? result[0][0] : null;
}
/**
 *
 * @param {*} obj object to go through
 * @param {*} firstExampleValue RegEx to look for, if none is specified first value containing the RegEx "_case" is used
 *
 *  @returns first match containing lastExampleValue, if none matches returns null
 */
function findLastByIndex(obj, lastExampleValue = null) {
  let result = lastExampleValue
    ? Object.entries(obj)
        .sort((b, a) => a[0] - b[0])
        .filter((entry) => entry[1].match(lastExampleValue))
    : Object.entries(obj)
        .sort((b, a) => a[0] - b[0])
        .filter((entry) => entry[1].match(/_case/g));
  return result.length ? result[0][0] : null;
}
/**
 *
 * @param {*} string word that shall be cut off at stopper
 * @param {*} stopper last part in word
 */
function wordStopper(string, stopper) {
  return string.includes(stopper)
    ? string.substring(0, string.indexOf(stopper)).concat(stopper)
    : string;
}
/**
 *
 * @param {*} string word where the last part shall be "_case"
 *
 *  special case of wordStopper, stopper is "_case"
 */
function caseStopper(string) {
  return wordStopper(string, "_case");
}

/**
 *
 * @param {*} object object/array from which to id the key/index
 * @param {*} value value of the object of which the key ought to be found
 * @param {*} first determines whether to output first or last instance of matches. Defaults to first.
 */
function keyByValue(object, value, first = true) {
  if (first) return Object.keys(object).find((key) => object[key] === value);
  else {
    let result = Object.keys(object)
      .filter((key) => object[key] === value)
      .sort((b, a) => a[0] - b[0])[0];
    return result;
  }
}
/**
 *
 * @param {*} category category that is searched for (naming convention, _case as indicator of a category)
 * @param {*} obj obj to go through
 */
function findAmountOfExamplesOfCategory(category, obj) {
  let amount = 0;
  amount = Object.values(obj).filter((page) => {
    return page.includes(caseStopper(category));
  }).length;
  return amount;
}
/**
 *
 * @param {*} category page to be analyzed
 * @param {*} obj object to go through
 *
 *  Because objects do not grant order, the index has to be analyzed to tell which nr it takes
 */
function nrInCategory(category, obj) {
  let sortedCats = Object.entries(obj).filter((page) => {
    return page[1].includes(caseStopper(category));
  });
  let nrOfCat = 0;
  for (el of sortedCats) keyByValue(pages, category) > el[0] ? nrOfCat++ : null;
  return nrOfCat;
}

// PAGE PREPARATION
/**
 *
 * @param {*} msg msg to be caught in ling
 *
 *  This function is shorter but works like chrome.i18n.getMessage(msg);
 */
function getMsg(msg) {
  return chrome.i18n.getMessage(msg.replace(/-/g, "_"));
}

function prepExample() {
  // showing image
  $(".svg-in-img").attr(
    "src",
    `./img/examples/${lang}/${pages[activePageContent]}_${lang}.svg`
  );

  // filling card
  // starting with content each example has
  $("#example-title").html(
    getMsg(`${caseStopper(pages[activePageContent])}_title`)
  );
  $("#category-explanation").html(
    getMsg(`${caseStopper(pages[activePageContent])}_category`)
  );
  $("#explanation-of-specific-link").html(
    getMsg(`${pages[activePageContent]}_specific_link_explanation`)
  );
  // THIS SECTION IS ONLY NECESSARY IF A CATEGORY HAS ADDITIONAL INFO OR MORE THAN ONE CASE
  let amountActiveCat = findAmountOfExamplesOfCategory(
    pages[activePageContent],
    pages
  );
  let context = getMsg(`${pages[activePageContent]}_context`);
  context
    ? ($("#example-context").html(
        `<span class="underlined">${getMsg("example")}${
          amountActiveCat > 1
            ? ` ${nrInCategory(pages[activePageContent], pages) + 1}`
            : ""
        }:</span> ` + context
      ),
      $("#additional-info").removeClass("off"))
    : $("#additional-info").addClass("off");

  if (amountActiveCat > 1) {
    $("#more-than-one-example").html(
      getMsg(`${caseStopper(pages[activePageContent])}_more_than_one`)
    );
    $("#more-than-one").removeClass("off");
  } else {
    $("#more-than-one").addClass("off");
  }
  // making it visible again
  $(".example-wrapper").removeClass("off");
}

function prepNoExamplePage() {
  $(`.${pages[activePageContent].replace(/_/g, "-")}`).removeClass("off");
}
