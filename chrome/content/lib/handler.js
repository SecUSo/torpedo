var torpedo = torpedo || {};
var clickTimer = null, countDownTimer = null;
var alreadyClicked = "";
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.handler = torpedo.handler || {};
torpedo.handler.Url;

torpedo.handler.TempTarget;
torpedo.handler.MouseLeavetimer;
torpedo.handler.timeOut;
torpedo.handler.release = false;

torpedo.handler.mouseOverTooltipPane = function (event)
{
	clearTimeout(torpedo.handler.MouseLeavetimer);
};

torpedo.handler.mouseDownTooltipPane = function (event)
{
	torpedo.handler.timeOut = 100;
	if(torpedo.functions.loop >= 0){
		torpedo.handler.timeOut = 3000;
		while(!releaseTooltip){
			
		}
		releaseTooltip = false;
	}
	torpedo.handler.MouseLeavetimer = setTimeout(function (e)
	{
		document.getElementById("tooltippanel").hidePopup();
		if(countDownTimer != null)
		{
			clearInterval(countDownTimer);
			countDownTimer = null;
		}

		if(clickTimer != null)
		{
			clearTimeout(clickTimer);
		}
		
	}, torpedo.handler.timeOut);
};

torpedo.handler.releaseTooltip = function (){
	torpedo.handler.release = true;
};

torpedo.handler.title = "";

torpedo.handler.mouseOverHref = function (event, aElement)
{
	tempTarget = torpedo.functions.findParentTagTarget(event, 'A');
	var panel = document.getElementById("tooltippanel");
	if(tempTarget != torpedo.handler.TempTarget){
		panel.hidePopup();
	}
	torpedo.handler.TempTarget = tempTarget;
	torpedo.handler.title = torpedo.handler.TempTarget.innerHTML;
    torpedo.handler.clickEnabled = true;
    if(!(panel.state == "showing" && torpedo.handler.Url == url)){
	    torpedo.functions.loop = -1;
		torpedo.functions.loopTimer = 2500;
		var url = torpedo.handler.TempTarget.getAttribute("href");
		if(url != "" && url != undefined ){
			torpedo.handler.Url = url;
			var redirect = false;
		    torpedo.hideButton = false;  
			$(torpedo.handler.TempTarget).unbind("click");
			$(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHrefError);

			clearTimeout(torpedo.handler.MouseLeavetimer);
			alreadyClicked = "";

			if(torpedo.functions.isRedirect(url)){
				if(torpedo.prefs.getBoolPref("redirection2")){
					redirect = true;
				}
			}
	    	torpedo.functions.traceUrl(url, redirect);
	    }
	}
};

torpedo.handler.setCountDownTimer = function (url) {
	if(countDownTimer == null){
		countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer"),'countdown', url);
		clickTimer = setTimeout(function()
		{
			if(clickTimer != null)
			{
				clearTimeout(clickTimer);
			}
		}, torpedo.prefs.getIntPref("blockingTimer")*1000);
	}
};

torpedo.handler.resetCountDownTimer = function (){
	if(countDownTimer != null)
		{
			clearInterval(countDownTimer);
			countDownTimer = null;
		}

		if(clickTimer != null)
		{
			clearTimeout(clickTimer);
		}
	torpedo.handler.setCountDownTimer(Url);
};

torpedo.handler.mouseDownHref = function (event)
{
	torpedo.handler.MouseLeavetimer = setTimeout(function (e)
	{
		document.getElementById("tooltippanel").hidePopup();

		if(countDownTimer != null)
		{
			clearInterval(countDownTimer);
			countDownTimer = null;
		}

		if(clickTimer != null)
		{
			clearTimeout(clickTimer);
		}
	}, 100);
};

torpedo.handler.mouseClickHref = function (event)
{
	var url = torpedo.functions.getHref();
	Application.console.log("href clicked");
	if(alreadyClicked == ""){
		Application.console.log(alreadyClicked + " is alreadyClicked");
		alreadyClicked = url;

		var baseDomain = torpedo.functions.getDomainWithFFSuffix(url);

	 	if(!torpedo.functions.isRedirect(url)) torpedo.db.pushUrl(baseDomain);

		var ioservice = Components.classes["@mozilla.org/network/io-service;1"]
	                          .getService(Components.interfaces.nsIIOService);

		var uriToOpen = ioservice.newURI(url, null, null);

		var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
		                      .getService(Components.interfaces.nsIExternalProtocolService);

		// now, open it!
		extps.loadURI(uriToOpen, null);
	}
	return false;
};

torpedo.handler.mouseClickHrefError = function(event){
	var panel = document.getElementById("errorpanel");
	panel.openPopup(torpedo.handler.TempTarget, "before_start",0,0, false, false);
	setTimeout(function (e)
	{
		panel.hidePopup();
	}, 2500);
	return false;
};

torpedo.handler.mouseClickInfoButton = function (event)
{
	torpedo.dialogmanager.createInstruction(1080,607.5);
};

torpedo.handler.mouseClickDeleteButton = function(event){
	torpedo.dialogmanager.createDelete(440,117);
};

torpedo.handler.mouseClickEditButton = function(event){
	torpedo.dialogmanager.createEdit();
};

torpedo.handler.mouseClickDefaultsButton = function (event) {
	torpedo.dialogmanager.showDefaults();
};

torpedo.handler.clickEnabled = true;
torpedo.handler.mouseClickRedirectButton = function (event){
	if(torpedo.handler.clickEnabled) torpedo.functions.traceUrl(torpedo.handler.Url, true);
};

torpedo.handler.mouseClickRedirectShow = function (event) {
	torpedo.dialogmanager.showRedirects();
};