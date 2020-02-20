var torpedo = torpedo || {};
var lastBrowserStatus;
torpedo.instructionSize = { width: 800, height: 460 };

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);

var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
	.getService(Components.interfaces.nsIMsgAccountManager);



torpedo.baseDomain;
torpedo.textSize;
torpedo.gmxRedirect;
torpedo.redirectClicked;
torpedo.currentURL;
torpedo.redirectURL;
torpedo.currentDomain;
//torpedo.info;
//torpedo.currentMessage;
torpedo.progURL;
torpedo.hasTooltip;
torpedo.state;



torpedo.updateTooltip = function (url) {
	// Initializaion
	var panel = document.getElementById("tooltippanel");
	var redirectButton = document.getElementById("redirectButton");
	var redirect = document.getElementById("redirect");
	var secondsbox = document.getElementById("seconds-box");
	var warningpic = document.getElementById("warning-pic");
	var warningpic2 = document.getElementById("warning-pic2");
	var advicebox = document.getElementById("advicebox");
	var openTooltip = true;

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

	torpedo.currentURL = url;
	torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);

	var referrerURL = torpedo.functions.matchReferrer(torpedo.currentURL);

	while (referrerURL != "<NO_RESOLVED_REFERRER>") { 
		torpedo.redirectURL = torpedo.currentURL;
		torpedo.currentURL = referrerURL;
		referrerURL = torpedo.functions.matchReferrer(torpedo.currentURL);
		torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(torpedo.currentURL);
		torpedo.numberGmxRedirects = torpedo.numberGmxRedirects + 1;
	}


	if (torpedo.functions.isRedirect(torpedo.currentURL)) {
		if (torpedo.functions.openFinalURL()) {
			torpedo.state = "DetermineUrlButton";
			redirectButton.disabled = false;
			redirectButton.hidden = false;
			$("#redirectButton").css("cssText", "cursor:pointer !important;");
		} else {
			openTooltip = false;
			torpedo.functions.trace(torpedo.currentURL);
		}
	} else if (torpedo.db.inList(torpedo.currentDomain, "URLDefaultList")) {
		torpedo.state = "T1";
		panel.style.borderColor = "green";
	} else if (torpedo.db.inList(torpedo.currentDomain, "URLSecondList")) {
		torpedo.state = "T2";
		panel.style.borderColor = "#1a509d";
	} else if (torpedo.progURL || torpedo.functions.isIP(torpedo.currentURL) || torpedo.hasTooltip) {
		torpedo.state = "T32";
		warningpic.hidden = false;
	} else if (torpedo.numberGmxRedirects == 0) {

		if (torpedo.functions.isMismatch(torpedo.baseDomain) || torpedo.functions.isDomainExtension(url)) { // mismatch or domain extension
			torpedo.currentURL = url;
			torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);
			torpedo.state = "T32";
			warningpic2.hidden = false;
		} else {
			torpedo.state = "T31";
		}
	}
	else if (torpedo.numberGmxRedirects == 1 || torpedo.functions.configExists()) {
		if (torpedo.functions.matchesRedirect(torpedo.redirectURL)) {
			if ((torpedo.functions.isMismatch(torpedo.baseDomain) && torpedo.functions.isMismatch(torpedo.currentDomain)) || torpedo.functions.isDomainExtension(torpedo.currentURL)) { // mismatch  
				torpedo.state = "T32";
				warningpic2.hidden = false;
			} else {
				torpedo.state = "T31";
			}
		} else {
			torpedo.state = "T32";
			warningpic2.hidden = false;
		}
	} else {
		torpedo.state = "T32";
		warningpic2.hidden = false;
	}

	if (openTooltip) {
		torpedo.texts.assignTexts(torpedo.currentURL);
		if (torpedo.functions.openFinalURL()) {
			torpedo.functions.setHref(torpedo.currentURL);
		} else {
			torpedo.functions.setHref(torpedo.initialURL);
		}
		// now open
		panel.openPopup(tempTarget, "after_start", 0, 0, false, false);
	}
};



torpedo.updateShortUrlResolved = function (url) {
	var panel = document.getElementById("tooltippanel");
	var redirectButton = document.getElementById("redirectButton");
	redirectButton.hidden = true;
	panel.style.borderColor = "##bfb9b9";

	var domain = torpedo.functions.getDomainWithFFSuffix(url);

	torpedo.currentURL = url;
	torpedo.currentDomain = domain;

	if (torpedo.functions.openFinalURL()) {
		torpedo.functions.setHref(torpedo.currentURL);
	}
	torpedo.updateTooltip(torpedo.currentURL);
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
				var inputs = fElement.elements;

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
					if (torpedo.functions.isURL(hrefValue)) {

						$(aElement).bind({
							mouseenter: function (event) { torpedo.handler.mouseOverHref(event, "href"); }
						});
						$(aElement).bind("mouseleave", function (event) {
							torpedo.handler.mouseDownHref(event);
						});
					}
					else {
						if (torpedo.functions.isURL(decodeURIComponent(hrefValue))) {
							hrefValue = decodeURIComponent(hrefValue);

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