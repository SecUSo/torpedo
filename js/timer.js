torpedo.timerInterval = null;

function preventClickEvent(eventTarget, eventTypes) {
  eventTypes.forEach(function (eventType) {
    $(eventTarget).unbind(eventType);
  });

  eventTypes.forEach(function (eventType) {
    $(eventTarget).on(eventType, function (event) {
      event.preventDefault();
      return false;
    });
  });
}

function reactivateLink(eventTarget, eventTypes) {
  eventTypes.forEach(function (eventType) {
    $(eventTarget).unbind(eventType);
  });

  $(torpedo.target).bind("click", function (event) {
    processClick();
  });
}

function reactivateTooltipURL(tooltipURL) {
  try {
    tooltipURL.unbind("click");
    tooltipURL.bind("click", function (event) {
      event.preventDefault();
      chrome.storage.sync.get(null, function (r) {
        if (r.privacyModeActivated) {
          chrome.runtime.sendMessage({
            name: "open",
            url: torpedo.oldUrl,
          });
        } else {
          chrome.runtime.sendMessage({ name: "open", url: torpedo.url });
        }
      });
      processClick();
      return false;
    });
  } catch (e) {
    console.log(e);
  }
}

function isTimerActivated(storage, securityStatus) {
  switch (securityStatus) {
    case "T1":
      return storage.trustedTimerActivated;
    case "T2":
      return storage.userTimerActivated;
    default:
      return true;
  }
}

/**
 * countdown function for the temporal deactivation of URLs
 */

function countdown(time, state, clickLinkEventTypes) {
  if (torpedo.target.classList.contains("torpedoTimerFinished")) time = 0;

  var tooltip = torpedo.tooltip;

  $(tooltip.find("#torpedoTimer")[0]).show();

  /**
   * assert time to tooltip text
   */
  function showTime() {
    try {
      tooltip.find("#torpedoTimer")[0].textContent = chrome.i18n.getMessage("verbleibendeZeit", "" + time);
    } catch (e) {}
  }

  $(torpedo.target).addClass("torpedoTimerShowing");

  const onWebsite = new URL(window.location.href);
  if (onWebsite.hostname === "owa.kit.edu") {
    $(
      "div._rp_U4.ms-font-weight-regular.ms-font-color-neutralDark.rpHighlightAllClass.rpHighlightBodyClass"
    ).unbind("click");
    // document.removeEventListener('click', getEventListeners(document).click[0].listener)
    /* 
      once script from owa can be used to remove eventlistener properly - insert here
    */
  }

  showTime();
  if (time > 0) time--;

  var timerInterval = setInterval(function timer() {
    showTime();
    if (time == 0) {
      clearInterval(timerInterval);
      if (!isRedirect(torpedo.domain) && state != "T4" && state != "T4a") {
        $(torpedo.target).addClass("torpedoTimerFinished");
      }

      reactivateLink(torpedo.target, clickLinkEventTypes);
      reactivateTooltipURL($(tooltip.find("#torpedoURL")[0]));
    } else {
      --time;
    }
  }, 1000);

  torpedo.timerInterval = timerInterval;
}
