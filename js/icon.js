document.addEventListener("click", (e) => {
  switch ($(e.target).attr("id")) {
    case "torpedoPage":
      chrome.tabs.create({ url: "https://secuso.aifb.kit.edu/TORPEDO.php" });
      break;
    case "options":
      chrome.runtime.openOptionsPage();
      break;
    case "error":
      if (e.target.classList == "error") {
        chrome.extension.getBackgroundPage().sendEmail();
      }
      break;
  }
});

function init() {
  console.log("loading-icon.js");
  console.log($("#torpedoPage"));
  $("#torpedoPage").text(chrome.i18n.getMessage("extensionName"));
  $("#options").text(chrome.i18n.getMessage("options"));
  let loc = chrome.extension.getBackgroundPage().getStatus();
  if (loc.works) {
    $("#error").attr("class", "working");
    $("#error").text(chrome.i18n.getMessage("OK"));
  } else {
    $("#error").attr("class", "error");
    $("#error").text(chrome.i18n.getMessage("error"));
  }
}

document.addEventListener("DOMContentLoaded", init);
