var torpedo = torpedo || {};
var clickTimer = null, countDownTimer = null;
var alreadyClicked = false;

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);

Components.utils.import("resource://gre/modules/Services.jsm");

torpedo.handler = torpedo.handler || {};
torpedo.initialURL;
torpedo.handler.TempTarget;
torpedo.handler.MouseLeavetimer;
torpedo.numberGmxRedirects;
mouseon = false;


torpedo.handler.mouseOverTooltipPane = function (event) {
	mouseon = true;

	clearTimeout(torpedo.handler.MouseLeavetimer);
	var panel = document.getElementById("tooltippanel");
	$(panel).contextmenu(function () {
		var menuwindow = document.getElementById("menuwindow");
		var urlbox = document.getElementById("url-box");
		if (torpedoOptions.inList(torpedo.baseDomain, "URLDefaultList") ||
			torpedoOptions.inList(torpedo.baseDomain, "URLSecondList") ||
			torpedo.functions.isRedirect(torpedo.functions.getHref())) {
			document.getElementById("addtotrusted").disabled = true;
		}
		else {
			document.getElementById("addtotrusted").disabled = false;
		}
		menuwindow.openPopup(urlbox, "after_start", 0, 0, false, false);
	});
};

torpedo.handler.mouseDownTooltipPane = function (event) {
	var menuwindow = document.getElementById("menuwindow");
	if (!torpedo.redirectClicked && menuwindow.state != "open") {
		mouseon = false;
		torpedo.handler.MouseLeavetimer = setTimeout(function (e) {
			if (!mouseon) {
				document.getElementById("tooltippanel").hidePopup();
				torpedo.handler.TempTarget = undefined;
				if (countDownTimer != null) {
					clearInterval(countDownTimer);
					countDownTimer = null;
				}

				if (clickTimer != null) {
					clearTimeout(clickTimer);
				}
			}
		}, 1500);
	}
};

torpedo.handler.title = "";

torpedo.handler.mouseOverHref = function (event, elem) {
	var panel = document.getElementById("tooltippanel");
	torpedo.hasTooltip = false;
	// do nothing when user reads infotext or deduces target url
	if (panel.state == "open" && (torpedo.redirectClicked || $("#moreinfos").css("display") != "none"))
		return;
	torpedo.redirectClicked = false;

	if (elem == "href") {
		tempTarget = torpedo.functions.findParentTagTarget(event, 'A');
		var url = tempTarget.getAttribute("href");
		var tooltipURL = torpedo.functions.hasTooltip(event);
		if (tooltipURL != "<HAS_NO_TOOLTIP>") {
			var hrefDomain = torpedo.functions.getDomainWithFFSuffix(url);
			torpedo.hasTooltip = torpedo.functions.isMismatch(hrefDomain, tooltipURL);
		}
	} else if (elem == "form") {
		tempTarget = torpedo.functions.findParentTagTarget(event, 'FORM');
		var url = tempTarget.getAttribute("action");
	}


	// make sure that popup opens up even if popup from another URL is opened
	if (torpedo.baseDomain != url) {
		panel.hidePopup();
	}
	if (panel.state == "closed") {
		// Initializaion of tooltip
		torpedo.handler.TempTarget = tempTarget;
		torpedo.handler.title = torpedo.handler.TempTarget.textContent.replace(" ", "");
		//torpedo.handler.clickEnabled = true;
		torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
		torpedo.initialURL = url;
		clearTimeout(torpedo.handler.MouseLeavetimer);
		$('#moreinfobox').hide();
		$('#moreadviceinfo').hide();
		alreadyClicked = false;

		// now open tooltip
		torpedo.numberGmxRedirects = 0;
		torpedo.updateTooltip(url);
	}
};

torpedo.handler.resetCountDownTimer = function (state) {
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
		countDownTimer = null;
	}
	if (clickTimer != null) {
		clearTimeout(clickTimer);
	}
	if (countDownTimer == null) {

		countDownTimer = torpedoTimer.countdown(state);
		clickTimer = setTimeout(function () {
			if (clickTimer != null) {
				clearTimeout(clickTimer);
			}
		}, torpedo.prefs.getIntPref("blockingTimer") * 1000);
	}
};

torpedo.handler.mouseDownHref = function (event) {
	torpedo.handler.MouseLeavetimer = setTimeout(function (e) {
		//if (!mouseon) {
		document.getElementById("tooltippanel").hidePopup();
		torpedo.handler.TempTarget = undefined;
		if (countDownTimer != null) {
			clearInterval(countDownTimer);
			countDownTimer = null;
		}

		if (clickTimer != null) {
			clearTimeout(clickTimer);
		}
		//}
	}, 100);
};

torpedo.handler.mouseClickHref = function (event) {
	//only do sth if left mouse button is clicked
	if (event.button == 0) {
		var url = torpedo.functions.getHref();
		if (!alreadyClicked) {
			alreadyClicked = true;
			if (!torpedo.functions.isRedirect(url)) {
				torpedoOptions.addToClickedList(torpedo.currentDomain);
			}
			torpedo.handler.open(url);
		}
		return false;
	}
};

torpedo.handler.open = function (url) {
	var ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	var uriToOpen = ioservice.newURI(url, null, null);
	var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
	extps.loadURI(uriToOpen, null);
}

torpedo.handler.mouseClickHrefError = function (event) {
	if (event.button == 0) {
		var panel = document.getElementById("errorpanel");
		torpedoOptions.displayPopup(panel, torpedo.handler.TempTarget, 2500);
		return false;
	}
};

torpedo.handler.mouseClickDeleteButton = function (event) {
	torpedo.dialogmanager.createDelete();
};
torpedo.handler.mouseClickDefaultsEditButton = function (event) {
	torpedo.dialogmanager.createEditDefaults();
}
torpedo.handler.mouseClickEditButton = function (event) {
	torpedo.dialogmanager.createEdit();
};
//
torpedo.handler.mouseClickEditButtonCloudDomains = function (event) {
	torpedo.dialogmanager.createEditCloudDomains();
};

torpedo.handler.mouseClickEditButtonRedirect = function (event) {
	torpedo.dialogmanager.createEditRedirect();
};

torpedo.handler.mouseClickDefaultsButton = function (event) {
	torpedo.dialogmanager.showDefaults();
};

//torpedo.handler.clickEnabled = true;

torpedo.handler.mouseClickRedirectButton = function (event) {
	torpedo.redirectClicked = true;
	event.stopPropagation();
	//if (torpedo.handler.clickEnabled) 
	torpedo.functions.containsRedirect(torpedo.currentURL);
};

torpedo.handler.mouseClickActivateLinkButton = function (state) {
	var url = torpedo.functions.getHref();
	torpedo.handler.resetCountDownTimer(state);
	torpedo.texts.assignTexts(url, state);
	$("#torpedoActivateLinkButton").hide();
};

torpedo.handler.mouseClickRedirectShow = function (event) {
	torpedo.dialogmanager.showRedirects();
};
torpedo.handler.mouseClickAddButton = function (event) {
	torpedo.dialogmanager.showAdd();
}
torpedo.handler.loadOptions = function () {
	torpedo.stringsBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties");
	document.getElementById('lowRiskDomains').textContent = torpedo.stringsBundle.GetStringFromName('lowRiskDomains');
	document.getElementById('blacklistDomains').textContent = torpedo.stringsBundle.GetStringFromName('blacklistDomains');
	document.getElementById('activateTimerOnLowRisk').textContent = torpedo.stringsBundle.GetStringFromName('activateTimerOnLowRisk');
	document.getElementById('activateTimerOnUserList').textContent = torpedo.stringsBundle.GetStringFromName('activateTimerOnUserList');
	document.getElementById('referrerDialogAdvHint').textContent = torpedo.stringsBundle.GetStringFromName('referrerDialogAdvHint');
	document.getElementById('redirectInfo').textContent = torpedo.stringsBundle.GetStringFromName('redirectInfo');
	var element = document.getElementById("editor");
	element.style.fontSize = "" + torpedo.prefs.getIntPref("textsize") + "%";
}