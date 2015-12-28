var torpedo = torpedo || {};
var clickTimer = null;
var countDownTimer = null;

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
	}, 400); 
};

torpedo.handler.mouseOverHref = function (event) 
{
	clearTimeout(torpedo.handler.MouseLeavetimer);
	
	var panel = document.getElementById("tooltippanel");
	var tempTarget = torpedo.functions.findParentTagTarget(event,'A');
	var tempTargetc = event.target || event.srcElement;
	
	torpedo.updateTooltip(tempTarget.href,tempTarget);
	panel.openPopup(tempTarget, "after_start", 0, 0, false, false);
	
	if(countDownTimer == null)
	{
		countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer"),'countdown');
		
		clickTimer = setTimeout(function()
		{
			
			if(clickTimer != null)
			{
				clearTimeout(clickTimer);
			}
			$(tempTarget).unbind('click', torpedo.handler.mouseClickHref);
			
		}, torpedo.prefs.getIntPref("blockingTimer")*1000);
	}
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
	}, 400); 
};

torpedo.handler.mouseClickHref = function (event) 
{
	event.preventDefault();
	var panel = document.getElementById("tooltippanel");
	var tempTarget = torpedo.functions.findParentTagTarget(event,'A');
	var tempTargetc = event.target || event.srcElement;
	
	torpedo.updateTooltip(tempTarget.href,tempTarget);
	panel.openPopup(tempTarget, "after_start", 0, 0, false, false);

	return false;		
};

torpedo.handler.mouseClickInfoButton = function (event) 
{
	torpedo.dialogmanager.createInstruction(800,460);
};
