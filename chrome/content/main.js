var torpedo = torpedo || {};
torpedo.instructionSize = { width: 800, height: 460 };

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);

var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
	.getService(Components.interfaces.nsIMsgAccountManager);



torpedo.baseDomain;
torpedo.textSize;

torpedo.redirectClicked;
torpedo.currentURL;
torpedo.redirectURL;
torpedo.currentDomain;
torpedo.progURL;
torpedo.hasTooltip;
torpedo.state;

torpedo.getSecurityStatus = function (url) {

	torpedo.currentURL = url;
	torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);

	var state = "0";
	var referrerURL = torpedo.functions.matchReferrer(torpedo.currentURL);

	while (referrerURL != "<NO_RESOLVED_REFERRER>") {
		torpedo.redirectURL = torpedo.currentURL;
		torpedo.currentURL = referrerURL;
		referrerURL = torpedo.functions.matchReferrer(torpedo.currentURL);
		torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(torpedo.currentURL);
		torpedo.numberGmxRedirects = torpedo.numberGmxRedirects + 1;
	}

	if (torpedo.functions.isRedirect(torpedo.currentURL)) {
		if (torpedo.prefs.getBoolPref("privacyMode")) {
			state = "DetermineUrlButton";
		} else {
			//openTooltip = false;
			torpedo.functions.trace(torpedo.currentURL);
			return state;
		}
	} else if (torpedoOptions.inList(torpedo.currentDomain, "URLDefaultList") && torpedo.functions.settingIsChecked("activatedGreenList")) {
		state = "T1";
	} else if (torpedoOptions.inList(torpedo.currentDomain, "URLSecondList")) {
		state = "T2";
	} else if (torpedo.progURL || torpedo.functions.isIP(torpedo.currentURL) || torpedo.hasTooltip) {
		state = "T33";
	} else if (torpedo.numberGmxRedirects == 0) {
		if (torpedo.functions.isMismatch(torpedo.baseDomain, torpedo.handler.title) || torpedo.functions.isDomainExtension(url)) { // mismatch or domain extension
			torpedo.currentURL = url;
			torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);
			state = "T32";
		} else {
			state = "T31";
		}
	}
	else if (torpedo.numberGmxRedirects == 1 || torpedo.prefs.getBoolPref("redirectMode")) {
		if (torpedo.functions.matchesMainReferrer(torpedo.redirectURL) && !(torpedo.functions.isMismatch(torpedo.baseDomain, torpedo.handler.title) && torpedo.functions.isMismatch(torpedo.currentDomain, torpedo.handler.title))
			&& !torpedo.functions.isDomainExtension(torpedo.currentURL)) {
			state = "T31"
		} else {
			state = "T32";
		}
	} else {
		state = "T32";
	}

	torpedo.texts.assignTexts(torpedo.currentURL, state);
	if (torpedo.prefs.getBoolPref("privacyMode")) {
		torpedo.functions.setHref(torpedo.currentURL);
	} else {
		torpedo.functions.setHref(torpedo.initialURL);
	}

	return state;
};

torpedo.updateTooltip = function (url) {

	var state = torpedoStatus.getSecurityStatus(url);
	// Initializaion
	var panel = document.getElementById("tooltippanel");
	var redirectButton = document.getElementById("redirectButton");
	var redirect = document.getElementById("redirect");
	var secondsbox = document.getElementById("seconds-box");
	var warningpic = document.getElementById("warning-pic");
	var warningpic2 = document.getElementById("warning-pic2");
	var advicebox = document.getElementById("advicebox");

	redirectButton.disabled = true;
	redirectButton.hidden = true;
	redirect.hidden = false;
	secondsbox.hidden = false;
	warningpic.hidden = true;
	warningpic2.hidden = true;
	advicebox.hidden = false;
	panel.style.backgroundColor = 'white';
	panel.style.borderColor = "#bfb9b9";

	$("#redirectButton").css("cssText", "cursor:wait !important;");

	switch (state) {
		case "T1":
			panel.style.borderColor = "green";
			break;
		case "T2":
			panel.style.borderColor = "#1a509d";
			break;
		case "T32":
			warningpic2.hidden = false;
			break;
		case "T33":
			warningpic.hidden = false;
			break;
		case "DetermineUrlButton":
			redirectButton.disabled = false;
			redirectButton.hidden = false;
			$("#redirectButton").css("cssText", "cursor:pointer !important;");
			break;
		default:
			break;
	}

	// now open
	if (state != "0") {
		panel.openPopup(tempTarget, "after_start", 0, 0, false, false);
	}
};

torpedo.updateShortUrlResolved = function (url) {
	torpedo.updateTooltip(url);
};


torpedo.doc = null;

torpedo.processDOM = function () {
	function init() {
		$("#tooltippanel").bind("mouseenter", torpedo.handler.mouseOverTooltipPane);
		$("#tooltippanel").bind("mouseleave", torpedo.handler.mouseDownTooltipPane);
		$("#deleteSecond").bind("click", torpedo.handler.mouseClickDeleteButton);
		$("#editSecond").bind("click", torpedo.handler.mouseClickEditButton);
		$("#redirectButton").click(function (event) { torpedo.handler.mouseClickRedirectButton(event) });

		var messagepane = document.getElementById("messagepane");
		if (messagepane) {
			messagepane.addEventListener("load", function (event) { onPageLoad(event); }, true);

			if (torpedo.prefs.getBoolPref("firstrun")) {
				torpedo.prefs.setBoolPref("firstrun", false);
				torpedo.prefs.resetReferrer();
				torpedo.dialogmanager.openTutorial();
			}
		}
	}

	function onPageLoad(event) {

		torpedo.doc = event.originalTarget;  // doc is document that triggered "onload" event
		torpedo.progURL = false;
		var linkElement = torpedo.doc.getElementsByTagName("a");
		var formElement = torpedo.doc.getElementsByTagName("form");
		var iframeElement = torpedo.doc.getElementsByTagName("iframe");
		var linkNumber = linkElement.length;
		var formNumber = formElement.length;

		torpedo.message = gFolderDisplay.selectedMessage;

		if (iframeElement.length > 0) torpedo.progURL = true;

		if (formNumber > 0) {
			for (var i = 0; i < formNumber; i++) {

				var fElement = formElement[i];
				var actionValue = fElement.getAttribute("action");


				if (actionValue != null && actionValue != "" && actionValue != undefined) {

					if (torpedo.functions.isURL(actionValue)) {
						$(fElement).bind({
							mouseenter: function (event) {
								torpedo.progURL = true;
								torpedo.handler.mouseOverHref(event, "form");
							}
						});
						$(fElement).bind("mouseleave", function (event) {
							torpedo.progURL = false;
							torpedo.handler.mouseDownHref(event);
						});
					}
				}
			}
		}

		if (linkNumber > 0) {
			for (var i = 0; i < linkNumber; i++) {
				var aElement = linkElement[i];
				var hrefValue = aElement.getAttribute("href");

				if (hrefValue != null && hrefValue != "" && hrefValue != undefined) {
					if (!torpedo.functions.isURL(hrefValue) && torpedo.functions.isURL(decodeURIComponent(hrefValue))) {
						hrefValue = hrefValue = decodeURIComponent(hrefValue);
					}

					$(aElement).bind({
						mouseenter: function (event) { torpedo.handler.mouseOverHref(event, "href"); }
					});
					$(aElement).bind("mouseleave", function (event) {
						torpedo.handler.mouseDownHref(event);
					});

				}
			}
		}
	}
	init();
};

window.addEventListener("load", function load(event) {
	window.removeEventListener("load", load, false);
	torpedo.stringsBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties");

	torpedo.prefs.addonUninstallingListener();
	torpedo.prefs.addonInstallingListener();
	torpedo.processDOM();
}, false);