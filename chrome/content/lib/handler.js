var torpedo = torpedo || {};
var clickTimer = null, countDownTimer = null;
var tempTarget;
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

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
	}, 200); 
};

torpedo.handler.mouseOverHref = function (event) 
{
	clearTimeout(torpedo.handler.MouseLeavetimer);

	var panel = document.getElementById("tooltippanel");
	tempTarget = torpedo.functions.findParentTagTarget(event,'A');
	var tempTargetc = event.target || event.srcElement;

	if(countDownTimer == null)
	{
		countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer"),'countdown');
		
		clickTimer = setTimeout(function()
		{
			
			if(clickTimer != null)
			{
				clearTimeout(clickTimer);
			}
		}, torpedo.prefs.getIntPref("blockingTimer")*1000);
	}
	torpedo.updateTooltip(tempTarget.href,tempTarget);
	panel.openPopup(tempTarget, "topcenter", 0, -40, false, false);
	
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
	}, 10); 
};

torpedo.handler.mouseClickHref = function (event) 
{
	var url = tempTarget.href;
	if(tempTarget.getAttribute('redirection_url') != null)
	{
		url = tempTarget.getAttribute('redirection_url');
	}
	var baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	torpedo.db.pushUrl(baseDomain);
};

torpedo.handler.mouseClickInfoButton = function (event) 
{
	torpedo.dialogmanager.createInstruction(450,260);
};

torpedo.handler.mouseClickDeleteButton = function(event){
	Application.console.log("delete clicked");
	var dimension = torpedo.functions.calcWindowPosition(300,80);
	torpedo.dialogmanager.createDelete(300,80, dimension);
};

torpedo.handler.mouseClickEditButton = function(event){
	torpedo.dialogmanager.createEdit();
};