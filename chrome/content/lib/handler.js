var torpedo = torpedo || {};
var clickTimer = null, countDownTimer = null;
var alreadyClicked = "";

torpedo.handler = torpedo.handler || {};
torpedo.handler.Url;
torpedo.initialURL;
torpedo.handler.TempTarget;
torpedo.handler.MouseLeavetimer;
torpedo.handler.timeOut;
mouseon = false;
mouseout = [false, false];

torpedo.handler.mouseOverTooltipPane = function (event){
	mouseon = true;
	mouseout[0] = true;
	clearTimeout(torpedo.handler.MouseLeavetimer);
	var panel = document.getElementById("tooltippanel");
	$(panel).contextmenu(function(){
		var menuwindow = document.getElementById("menuwindow");
		var urlbox = document.getElementById("url-box");
		if(torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") ||
		 	 torpedo.db.inList(torpedo.baseDomain, "URLSecondList") ||
	 		 torpedo.functions.isGmxRedirect(torpedo.functions.getHref()) ||
			 torpedo.functions.isRedirect(torpedo.functions.getHref())){
			document.getElementById("addtotrusted").disabled = true;
		}
		else document.getElementById("addtotrusted").disabled = false;
	  menuwindow.openPopup(urlbox, "after_start",0,0, false, false);
	});
};

torpedo.handler.mouseDownTooltipPane = function (event)
{
	var menuwindow = document.getElementById("menuwindow");
	var moreinfos = document.getElementById("moreinfos");
	if(!torpedo.redirectClicked && menuwindow.state != "open" && moreinfos.textContent == "" && !torpedo.redirectClicked){
		mouseon = false;
		torpedo.handler.timeOut = 1500;
		if(torpedo.functions.loop >= 0){
			torpedo.handler.timeOut = 3000;
		}
		torpedo.handler.MouseLeavetimer = setTimeout(function (e)
		{
			if(!mouseon) {
				document.getElementById("tooltippanel").hidePopup();
				torpedo.handler.TempTarget = undefined;
				if(countDownTimer != null)
				{
					clearInterval(countDownTimer);
					countDownTimer = null;
				}

				if(clickTimer != null)
				{
					clearTimeout(clickTimer);
				}
			}
		}, torpedo.handler.timeOut);
	}
};

torpedo.handler.title = "";
torpedo.handler.mouseOverHref = function (event,isTutorial,target)
{
	if(!isTutorial){
		var moreinfos = document.getElementById("moreinfos");
		var panel = document.getElementById("tooltippanel");
		// do nothing when user reads infotext or deduces target url
		if(panel.state == "open" && (torpedo.redirectClicked || $("#moreinfos").css("display") != "none"))
			return;
		torpedo.redirectClicked = false;
		mouseout = mouseout[0] ? [false,true] : [false,false];
		tempTarget = torpedo.functions.findParentTagTarget(event, 'A');
	}
	if(isTutorial) tempTarget = target;

	var url = tempTarget.getAttribute("href");
	// make sure that popup opens up even if popup from another URL is opened
	if(!isTutorial && torpedo.oldUrl != url) panel.hidePopup();
	if(isTutorial || panel.state == "closed"){
			// Initializaion of tooltip
			torpedo.handler.TempTarget = tempTarget;
			torpedo.handler.title = torpedo.handler.TempTarget.textContent.replace(" ","");
			torpedo.handler.clickEnabled = true;
			torpedo.state = 0;
			torpedo.functions.loopTimer = 2000;
			torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
			torpedo.handler.Url = url;
			torpedo.initialURL = url;
		  torpedo.oldUrl = torpedo.baseDomain;
			clearTimeout(torpedo.handler.MouseLeavetimer);
			$('#moreinfobox').hide(); $('#infocheck').hide();
			alreadyClicked = "";
			var redirect = false;
			// check if url is a "redirectUrl=" url (gmxredirect)
			torpedo.gmxRedirect = false;
			if(torpedo.functions.isGmxRedirect(url)){
				torpedo.gmxRedirect = true;
			}
			// check if url is a normal redirect (tinyurl)
			if(torpedo.functions.isRedirect(url) && torpedo.prefs.getBoolPref("redirection2")){
				redirect = true;
			}
		  torpedo.functions.traceUrl(url, redirect);
	    // now open tooltip
	    torpedo.updateTooltip(url);
	}
};

torpedo.handler.resetCountDownTimer = function (){
	if(countDownTimer != null){
		clearInterval(countDownTimer);
		countDownTimer = null;
	}
	if(clickTimer != null){
		clearTimeout(clickTimer);
	}
	if(countDownTimer == null){
		if(torpedo.state!=6)
			countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer"),'countdown', Url);
		else countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer")+2,'countdown', Url);
		clickTimer = setTimeout(function(){
			if(clickTimer != null){
				clearTimeout(clickTimer);
			}
		}, torpedo.prefs.getIntPref("blockingTimer")*1000);
	}
};

torpedo.handler.mouseDownHref = function (event)
{
	torpedo.handler.MouseLeavetimer = setTimeout(function (e)
	{
		if(mouseout[1]) torpedo.handler.mouseDownTooltipPane(event);
		else if(!mouseon){
			document.getElementById("tooltippanel").hidePopup();
			torpedo.handler.TempTarget = undefined;
			if(countDownTimer != null)
			{
				clearInterval(countDownTimer);
				countDownTimer = null;
			}

			if(clickTimer != null)
			{
				clearTimeout(clickTimer);
			}
		}
	}, 100);
};

torpedo.handler.mouseClickHref = function (event)
{
	//only do sth if left mouse button is clicked
	if(event.button == 0){
		var url = torpedo.functions.getHref();
		if(alreadyClicked == ""){
			alreadyClicked = url;
		 	if(!torpedo.functions.isRedirect(url)) torpedo.db.pushUrl(torpedo.baseDomain);
		 	torpedo.handler.open(url);
		}
		return false;
	}
};

torpedo.handler.open = function(url){
	var ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	var uriToOpen = ioservice.newURI(url, null, null);
	var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
	extps.loadURI(uriToOpen, null);
}
torpedo.handler.mouseClickHrefError = function(event){
	if(event.button ==0){
		var panel = document.getElementById("errorpanel");
		panel.openPopup(torpedo.handler.TempTarget, "before_start",0,0, false, false);
		setTimeout(function (e)
		{
			panel.hidePopup();
		}, 2500);
		return false;
	}
};

torpedo.handler.mouseClickDeleteButton = function(event){
	torpedo.dialogmanager.createDelete();
};
torpedo.handler.mouseClickDefaultsEditButton = function(event){
	torpedo.dialogmanager.createEditDefaults();
}
torpedo.handler.mouseClickEditButton = function(event){
	torpedo.dialogmanager.createEdit();
};
torpedo.handler.mouseClickDefaultsButton = function (event) {
	torpedo.dialogmanager.showDefaults();
};

torpedo.handler.clickEnabled = true;
torpedo.handler.mouseClickRedirectButton = function (event){
	torpedo.redirectClicked = true;
	event.stopPropagation();
	if(torpedo.handler.clickEnabled) torpedo.functions.containsRedirect(torpedo.currentURL);
};

torpedo.handler.mouseClickRedirectShow = function (event) {
	torpedo.dialogmanager.showRedirects();
};
torpedo.handler.mouseClickAddButton = function(event){
	torpedo.dialogmanager.showAdd();
}
torpedo.handler.loadOptions = function (){
	torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");
	// TODO document.getElementById('countdown').disabled = !torpedo.prefs.getBoolPref('checkedTimer');
  document.getElementById('lowRiskDomains').textContent = torpedo.stringsBundle.getString('lowRiskDomains');
  document.getElementById('activateTimerOnLowRisk').textContent = torpedo.stringsBundle.getString('activateTimerOnLowRisk');
  document.getElementById('activateTimerOnUserList').textContent = torpedo.stringsBundle.getString('activateTimerOnUserList');
  document.getElementById('referrerDialog').textContent = torpedo.stringsBundle.getString('referrerInfo1');
  document.getElementById('referrerInfo').textContent = torpedo.stringsBundle.getString('referrerInfo2');
	torpedo.db.getReferrer();
  var element = document.getElementById("editor");
  element.style.fontSize=""+torpedo.prefs.getIntPref("textsize")+"%";
}
