var torpedo = torpedo || {};
var clickTimer = null, countDownTimer = null;
var tempTarget;
var Url;
var alreadyClicked = "";
torpedo.handler = torpedo.handler || {};

torpedo.handler.MouseLeavetimer;

torpedo.handler.mouseOverTooltipPane = function (event)
{
	clearTimeout(torpedo.handler.MouseLeavetimer);
};

torpedo.handler.mouseDownTooltipPane = function (event)
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
	}, 3000);
};

torpedo.handler.mouseOverHref = function (event)
{
	tempTarget = torpedo.functions.findParentTagTarget(event,'A');
	torpedo.functions.loop = 0;
	torpedo.functions.loopTimer = 2500;
	var url = tempTarget.href;
	var redirect = false;
	if(url != ""){
		clearTimeout(torpedo.handler.MouseLeavetimer);
		alreadyClicked = "";
		document.getElementById("redirectButton").hidden = true;
		if(torpedo.functions.isRedirect(url)){
			if(torpedo.prefs.getBoolPref("redirection2")){
				redirect = true;
			}
			else if(torpedo.prefs.getBoolPref("redirection1")){
				Url = url;
            	document.getElementById("redirectButton").hidden = false;
			}
		}
		torpedo.functions.traceUrl(url, redirect);
    	var panel = document.getElementById("tooltippanel");
   	 	panel.openPopup(tempTarget, "after_start", 0, 0, true, false);
	}
};

torpedo.handler.setCountDownTimer = function (url) {
	Url = url;
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
	}, 300);
};

torpedo.handler.mouseClickHref = function (event)
{
	var url = torpedo.functions.getHref();
	
	if(alreadyClicked == ""){
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

torpedo.handler.mouseClickRedirectButton = function (event){
	torpedo.functions.traceUrl(Url, true);
};