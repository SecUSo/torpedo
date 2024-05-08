var torpedo = torpedo || {};
torpedo.tooltip;
torpedo.countRedirect = 0;
torpedo.countShortURL;
torpedo.oldDomain = "";
torpedo.oldUrl = "";

/**
 * fill tooltip with html structure
 */
function tooltipText() {
  var text =
    "<div id='torpedoWarning' class='loader-active'> \
                <img id='torpedoWarningImage' src='" +
    chrome.runtime.getURL("img/warning.png") +
    "'> \
				        <img id='torpedoWarningImage2' src='" +
    chrome.runtime.getURL("img/warning2.png") +
    "'> \
                <p id='torpedoWarningText'></p>\
              </div>\
              <div class='loader-active'><a href='" +
    torpedo.url +
    "' id='torpedoURL''></a></div> \
              <div style='display:none' class='loader-active' id='torpedoContextMenu'>\
                  <ul>\
                      <li id='torpedoMarkTrusted'></li>\
                      <li id='torpedoGoogle'></li>\
                      <li id='torpedoOpenSettings'></li>\
                      <li id='torpedoOpenTutorial'></li>\
                  </ul>\
              </div>\
              <div class='loader-active'><p id='torpedoSecurityStatus'></p></div> \
              <div class='loader-active' id='torpedoAdvice'> \
                <img id='torpedoAdviceImage' src='" +
    chrome.runtime.getURL("img/advice.png") +
    "'> \
                <p id='torpedoAdviceText'></p> \
              </div> \
			        <div class='loader-active' id='torpedoAdviceDiv'><p id='torpedoMoreAdvice'></p></div> \
              <div class='loader-active' id='torpedoInfo'>  \
                <img id='torpedoInfoImage' src='" +
    chrome.runtime.getURL("img/info.png") +
    `'> \
                <p id='torpedoInfoText'></p> \
              </div>\
              <div class='loader-active' id='torpedoInfoDiv'><p id='torpedoMoreInfo'></p></div> \
              <div class='loader-active'><button id='torpedoMoreInfoButton' type='button'></button></div> \
              <div class='loader-active'><button id='torpedoRedirectButton' type='button''></button></div> \
              <div class='loader-active'><button id='torpedoActivateLinkButton' type='button''></button></div>
              <div class='loader-active'><p id='torpedoLinkDelay'></p></div>
              <p class='loader-active' id='torpedoTimer'></p>
              ` +
    `<div class="loader-bg"> \
    <div class="loader-card"> \
    <div class="loader loader-active"> \
          <div class="dots"> \
            <div class="dot dot-0"></div> \
            <div class="dot dot-1"></div> \
            <div class="dot dot-2"></div> \
            <div class="dot dot-3"></div> \
            <div class="dot dot-4"></div> \
            <div class="dot dot-5"></div> \
            <div class="dot dot-6"></div> \
            <div class="dot dot-7"></div> \
            <div class="dot dot-8"></div> \
            <div class="dot dot-9"></div> \
          </div> \
          <div class="lens"> \
            <img src="${chrome.runtime.getURL(
      "./img/TORPEDO_Icon.svg"
    )}" alt="loading..." /> \
          </div> \
          <div class="load-text"> \
            <p>Loading...</p> \
          </div> \
        </div> \
      </div> \
    </div> \
              `;
  return text;
}

function initTooltip() {
  var tooltip = torpedo.tooltip;
  onlyShowLoader();
  torpedo.countRedirect = 0;
  torpedo.countShortURL = 0;
  torpedo.oldDomain = torpedo.domain;
  torpedo.oldUrl = torpedo.url;

  // context menu
  $(tooltip).contextmenu(function (event) {
    $(tooltip.find("#torpedoContextMenu")[0]).toggle(); // .toggle() switches between displaying and hiding items
    $(tooltip.find("#torpedoContextMenu")[0]).css({ position: "absolute" });
    event.preventDefault();
  });
  $(tooltip).on("click", "div:not(.torpedoContextMenu)", function (e) {
    if (!$(tooltip.find("#torpedoContextMenu")[0]).is(":hidden")) {
      $(tooltip.find("#torpedoContextMenu")[0]).toggle();
    }
  });

  $(tooltip.find("#torpedoMarkTrusted")[0]).click(function (event) {
    chrome.storage.sync.get(null, function (r) {
      var arr = r.userDefinedDomains;
      arr.push(torpedo.domain);
      chrome.storage.sync.set({ userDefinedDomains: arr }, function () {
        updateTooltip();
      });
    });
  });
  $(tooltip.find("#torpedoGoogle")[0]).click(function (event) {
    chrome.runtime.sendMessage({ name: "google", url: torpedo.domain });
  });
  $(tooltip.find("#torpedoOpenSettings")[0]).click(function (event) {
    chrome.runtime.sendMessage({ name: "settings" });
  });
  $(tooltip.find("#torpedoOpenTutorial")[0]).click(function (event) {
    chrome.runtime.sendMessage({ name: "tutorial" });
  });

  $(tooltip.find("#torpedoInfoText")[0]).click(function (event) {
    $(tooltip.find("#torpedoInfoDiv")[0]).toggle();
  });
  $(tooltip.find("#torpedoAdviceText")[0]).click(function (event) {
    $(tooltip.find("#torpedoAdviceDiv")[0]).toggle();
  });
  $(tooltip.find("#torpedoMoreInfoButton")[0]).click(function (event) {
    openInfoImage(event);
  });
  $(tooltip.find("#torpedoRedirectButton")[0]).click(function (event) {
    resolveRedirect(event);
    torpedo.api.get("hide.event", "onfocus");
  });

  $(tooltip.find("#torpedoActivateLinkButton")[0]).prop("disabled", true);
}

function assignText(state, url, tooltip) {
  // get texts from textfile
  var button = chrome.i18n.getMessage("ButtonWeiterleitung");
  var activateLinkButton = chrome.i18n.getMessage("LinkAktivierung");
  var ueberschrift = chrome.i18n.getMessage(state + "Ueberschrift");
  var erklaerung = chrome.i18n.getMessage(state + "Erklaerung");
  var mehrInfo = chrome.i18n.getMessage("MehrInfo");
  var infotext = chrome.i18n
    .getMessage(state + "Infotext")
    .replace("<URL>", url);
  var infoCheck = chrome.i18n.getMessage("Info");
  var gluehbirneText = chrome.i18n.getMessage(state + "GluehbirneText");
  var gluehbirneInfo = chrome.i18n.getMessage("mehrInfoGluehbirne");
  var linkDeaktivierung = chrome.i18n.getMessage(state + "LinkDeaktivierung");

  // assign texts
  $(tooltip.find("#torpedoWarningText")[0]).html(ueberschrift);
  $(tooltip.find("#torpedoSecurityStatus")[0]).html(erklaerung);
  $(tooltip.find("#torpedoAdviceText")[0]).html(gluehbirneInfo);
  $(tooltip.find("#torpedoMoreAdvice")[0]).html(gluehbirneText);
  $(tooltip.find("#torpedoInfoText")[0]).html(mehrInfo);
  $(tooltip.find("#torpedoMoreInfo")[0]).html(infotext);
  $(tooltip.find("#torpedoRedirectButton")[0]).html(button);
  $(tooltip.find("#torpedoActivateLinkButton")[0]).html(activateLinkButton);
  $(tooltip.find("#torpedoLinkDelay")[0]).html(linkDeaktivierung);
  $(tooltip.find("#torpedoMoreInfoButton")[0]).html(infoCheck);

  // hide certain elements
  $(tooltip.find("#torpedoWarningImage")[0]).hide();
  $(tooltip.find("#torpedoWarningImage2")[0]).hide();
  $(tooltip.find("#torpedoTimer")[0]).hide();
  $(tooltip.find("#torpedoInfoDiv")[0]).hide();
  $(tooltip.find("#torpedoLinkDelay")[0]).hide();
  $(tooltip.find("#torpedoAdvice")[0]).hide();
  $(tooltip.find("#torpedoAdviceDiv")[0]).hide();
  $(tooltip.find("#torpedoMoreInfoButton")[0]).hide();
  $(tooltip.find("#torpedoRedirectButton")[0]).hide();
  $(tooltip.find("#torpedoActivateLinkButton")[0]).hide();

  // hide light bulb if no text is there
  if (gluehbirneText) $(tooltip.find("#torpedoAdvice")[0]).show();
  if (linkDeaktivierung) $(tooltip.find("#torpedoLinkDelay")[0]).show();
  else {
    $(tooltip.find("#torpedoInfo")[0]).css("margin-bottom", "0");
    $(tooltip.find("#torpedoInfo")[0]).css("padding-bottom", "0");
  }
}

/**
 * fill the basic tooltip structure with corresponding texts
 */
function updateTooltip() {
  // Values of sync storage (r) and local storage (re) are relevant for further processing
  chrome.storage.sync.get(null, function (r) {
    const secStatus = new Promise((resolve) => {
      // check for security level
      var state = getSecurityStatus(r);
      resolve(state);
    });
    secStatus.then(function (state) {
      var t = torpedo.tooltip;
      var url = torpedo.url;
      var pathname = torpedo.pathname;

      if (pathname.length > 100) {
        var replace = pathname.substring(0, 100) + "...";
        url = url.replace(pathname, replace);
      }
      $(t.find("#torpedoURL")[0]).html(
        url.replace(
          torpedo.domain,
          '<span id="torpedoDomain">' + torpedo.domain + "</span>"
        )
      );

      assignText(state, url, t);

      if (
        r.referrerPart1.indexOf(torpedo.domain) > -1 ||
        r.userDefinedDomains.indexOf(torpedo.domain) > -1 ||
        r.trustedDomains.indexOf(torpedo.domain) > -1 ||
        r.redirectDomains.indexOf(torpedo.domain) > -1
      ) {
        $(t.find("#torpedoMarkTrusted")[0]).hide();
      } else $(t.find("#torpedoMarkTrusted")[0]).show();

      if (isRedirect(torpedo.domain) && r.privacyModeActivated) {
        $(torpedo.tooltip.find("#torpedoRedirectButton")[0]).show();
      }

      if (state == "T4") {
        $(torpedo.tooltip.find("#torpedoActivateLinkButton")[0]).show();
      }

      $(t.find("#torpedoMarkTrusted")[0]).html(
        chrome.i18n.getMessage("markAsTrusted")
      );
      $(t.find("#torpedoGoogle")[0]).html(chrome.i18n.getMessage("googleCheck"));
      $(t.find("#torpedoOpenSettings")[0]).html(
        chrome.i18n.getMessage("openSettings")
      );
      $(t.find("#torpedoOpenTutorial")[0]).html(
        chrome.i18n.getMessage("openTutorial")
      );

      $(".torpedoTooltip").removeClass(
        "torpedoUserDefined torpedoTrusted torpedoPhish"
      );
      const eventTypes = ["click", "contextmenu", "mouseup", "mousedown"];

      if (isTimerActivated(r, state)) {
        countdown(r.timer, state, eventTypes);
      } else {
        reactivateLink(torpedo.target, eventTypes);
      }

      switch (state) {
        case "T2":
          $(".torpedoTooltip").addClass("torpedoUserDefined");
          break;
        case "T1":
          $(".torpedoTooltip").addClass("torpedoTrusted");
          $(t.find("#torpedoMarkTrusted")[0]).show();
          break;
        case "T32":
          $(t.find("#torpedoMarkTrusted")[0]).show();
          $(t.find("#torpedoWarningImage2")[0]).show();
          $(t.find("#torpedoWarningText")[0]).show();
          break;
        default:
          break;
      }
      deactivateLoader();
    });
  });
}

/**
 * opens an image containing information on URL checking
 */
function openInfoImage(event) {
  var t = torpedo.tooltip;
  $(t.find("#torpedoInfoImage")[0]).qtip({
    overwrite: false,
    content: {
      text:
        "<img id='torpedoPopupImage' src='" +
        chrome.runtime.getURL(chrome.i18n.getMessage("infoImage")) +
        "'> ",
      button: true,
    },
    show: {
      event: event.type,
      ready: true,
    },
    hide: {
      event: "unfocus",
    },
    position: {
      at: "center",
      my: "center",
      target: jQuery(window),
    },
    style: {
      classes: "torpedoPopup",
    },
  });
}

function extractTLDfromDomain(domain) {
  var domainTLD = torpedo.publicSuffixList.getPublicSuffix(domain);
  return domainTLD;
}

/**
 * get domain out of hostname
 */
function extractDomain(url) {
  if (isIP(url)) {
    return url;
  } else {
    var psl = torpedo.publicSuffixList.getDomain(url);
    // psl empty -> url is already a valid domain
    return psl != "" ? psl : url;
  }
}

/**
 * set given url as new global torpedo url
 */
function setNewUrl(uri) {
  if (uri.hostname.slice(-1) === ".")
    uri = new URL(
      `${uri.href.replace(uri.hostname, uri.hostname.slice(0, -1))}`
    );
  torpedo.uri = uri;
  torpedo.url = uri.href;
  torpedo.domain = extractDomain(uri.hostname);
  var index = torpedo.url.indexOf(torpedo.domain);
  torpedo.pathname = torpedo.url.substring(
    index + torpedo.domain.length,
    torpedo.url.length
  );
}

/**
 * user has clicked on a link via the tooltip
 */
function processClick() {
  chrome.storage.sync.get(null, function (r) {
    // check if not already in user defined or trusted domain lists
    if (r.userDefinedDomains.indexOf(torpedo.domain) == -1 && r.trustedDomains.indexOf(torpedo.domain) == -1) {
      var domains = r.onceClickedDomains;
      // was domain clicked before ?
      if (domains.indexOf(torpedo.domain) > -1) {
        // remove domain from once clicked domains
        var index = domains.indexOf(torpedo.domain);
        domains.splice(index, 1);
        chrome.storage.sync.set({ onceClickedDomains: domains });
        // add domain to user defined domains
        domains = r.userDefinedDomains;
        domains[domains.length] = torpedo.domain;
        chrome.storage.sync.set({ userDefinedDomains: domains });
      }
      // add domain to once clicked domains
      else {
        domains[domains.length] = torpedo.domain;
        chrome.storage.sync.set({ onceClickedDomains: domains });
      }
    }
  });
}

function onlyShowLoader() {
  const tooltip = torpedo.tooltip[0];

  $(".torpedoTooltip>div>*").addClass("loader-active");
  $(".torpedoTooltip>div>.loader-bg").addClass("transparent-bg");
  $(".loader").addClass("loader-active");
}

function showLoaderWithOverlay() {
  $(".loader-bg").addClass("loader-active");
}

function deactivateLoader() {
  const tooltip = torpedo.tooltip[0];

  $(".torpedoTooltip>div>*").removeClass("loader-active");
  $(".torpedoTooltip>div>.loader-bg").removeClass("transparent-bg");
}
