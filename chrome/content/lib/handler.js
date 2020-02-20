var torpedo = torpedo || {};
var clickTimer = null, countDownTimer = null;
var alreadyClicked = "";

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);

Components.utils.import("resource://gre/modules/Services.jsm");

torpedo.handler = torpedo.handler || {};
torpedo.initialURL;
torpedo.handler.TempTarget;
torpedo.handler.MouseLeavetimer;
torpedo.handler.timeOut;
torpedo.numberGmxRedirects;
mouseon = false;
mouseout = [false, false];

torpedo.handler.mouseOverTooltipPane = function (event) {
	mouseon = true;
	mouseout[0] = true;
	clearTimeout(torpedo.handler.MouseLeavetimer);
	var panel = document.getElementById("tooltippanel");
	$(panel).contextmenu(function () {
		var menuwindow = document.getElementById("menuwindow");
		var urlbox = document.getElementById("url-box");
		if (torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") ||
			torpedo.db.inList(torpedo.baseDomain, "URLSecondList") ||
			torpedo.functions.matchReferrer(torpedo.functions.getHref()) ||
			torpedo.functions.isRedirect(torpedo.functions.getHref())) {
			document.getElementById("addtotrusted").disabled = true;
		}
		else document.getElementById("addtotrusted").disabled = false;
		menuwindow.openPopup(urlbox, "after_start", 0, 0, false, false);
	});
};

torpedo.handler.mouseDownTooltipPane = function (event) {
	var menuwindow = document.getElementById("menuwindow");
	var moreinfos = document.getElementById("moreinfos");
	if (!torpedo.redirectClicked && menuwindow.state != "open" && moreinfos.textContent == "" && !torpedo.redirectClicked) {
		mouseon = false;
		torpedo.handler.timeOut = 1500;
		if (torpedo.functions.loop >= 0) {
			torpedo.handler.timeOut = 3000;
		}
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
		}, torpedo.handler.timeOut);
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
	mouseout = mouseout[0] ? [false, true] : [false, false];
	if (elem == "href") {
		tempTarget = torpedo.functions.findParentTagTarget(event, 'A');
		var url = tempTarget.getAttribute("href");
		var tooltipURL = torpedo.functions.hasTooltip(event);
		if (tooltipURL != "<HAS_NO_TOOLTIP>") {
			torpedo.hasTooltip = torpedo.functions.isTooltipMismatch(url, tooltipURL);		
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
		torpedo.handler.clickEnabled = true;
		torpedo.state = 0;
		torpedo.functions.loopTimer = 2000;
		torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
		torpedo.initialURL = url;
		clearTimeout(torpedo.handler.MouseLeavetimer);
		$('#moreinfobox').hide();
		$('#moreadviceinfo').hide();
		alreadyClicked = "";
		var redirect = false;
		// check if url is a "redirectUrl=" url (gmxredirect)
		torpedo.gmxRedirect = false;
		if (torpedo.functions.matchReferrer(url)) {
			torpedo.gmxRedirect = true;
		}
		// check if url is a normal redirect (tinyurl)
		if (torpedo.functions.isRedirect(url) && torpedo.prefs.getBoolPref("redirection2")) {
			redirect = true;
		}
		torpedo.functions.traceUrl(url, redirect);
		// now open tooltip
		torpedo.numberGmxRedirects = 0;
		torpedo.updateTooltip(url);
	}
};

torpedo.handler.resetCountDownTimer = function () {
	if (countDownTimer != null) {
		clearInterval(countDownTimer);
		countDownTimer = null;
	}
	if (clickTimer != null) {
		clearTimeout(clickTimer);
	}
	if (countDownTimer == null) {
		if (torpedo.state != 6)
			countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer"), 'countdown', Url);
		else countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer") + 2, 'countdown', Url);
		clickTimer = setTimeout(function () {
			if (clickTimer != null) {
				clearTimeout(clickTimer);
			}
		}, torpedo.prefs.getIntPref("blockingTimer") * 1000);
	}
};

torpedo.handler.mouseDownHref = function (event) {
	torpedo.handler.MouseLeavetimer = setTimeout(function (e) {
		if (mouseout[1]) torpedo.handler.mouseDownTooltipPane(event);
		else if (!mouseon) {
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
	}, 100);
};

torpedo.handler.mouseClickHref = function (event) {
	//only do sth if left mouse button is clicked
	if (event.button == 0) {
		var url = torpedo.functions.getHref();
		if (alreadyClicked == "") {
			alreadyClicked = url;
			if (!torpedo.functions.isRedirect(url)) {
				torpedo.db.pushUrl(torpedo.currentDomain);
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
		panel.openPopup(torpedo.handler.TempTarget, "before_start", 0, 0, false, false);
		setTimeout(function (e) {
			panel.hidePopup();
		}, 2500);
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

torpedo.handler.clickEnabled = true;
torpedo.handler.mouseClickRedirectButton = function (event) {
	torpedo.redirectClicked = true;
	event.stopPropagation();
	if (torpedo.handler.clickEnabled) torpedo.functions.containsRedirect(torpedo.currentURL);
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
	document.getElementById('activateTimerOnLowRisk').textContent = torpedo.stringsBundle.GetStringFromName('activateTimerOnLowRisk');
	document.getElementById('activateTimerOnUserList').textContent = torpedo.stringsBundle.GetStringFromName('activateTimerOnUserList');
	document.getElementById('referrerDialogAdvHint').textContent = torpedo.stringsBundle.GetStringFromName('referrerDialogAdvHint');
	document.getElementById('redirectInfo').textContent = torpedo.stringsBundle.GetStringFromName('redirectInfo');
	torpedo.db.getReferrer();
	var element = document.getElementById("editor");
	element.style.fontSize = "" + torpedo.prefs.getIntPref("textsize") + "%";
}