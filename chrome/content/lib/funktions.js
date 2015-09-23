var torpedo = torpedo || {};

torpedo.functions = torpedo.functions || {};

torpedo.functions.calcWindowPosition = function (windowWidth,windowHeight) 
{
	var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
	var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

	width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	if(width < screen.width && height < screen.height)
	{
		width = screen.width;
		height = screen.height;
	}

	var left = ((width / 2) - (windowWidth / 2)) + dualScreenLeft;
	var top = ((height / 2) - (windowHeight / 2)) + dualScreenTop;

	return{
		top: top,
		left: left
	};	
}

torpedo.functions.findParentTagTarget = function (event,tagName)
{
	var tempTarget = event.target || event.srcElement;
	
	if(tempTarget.nodeName == tagName)
	{
		return tempTarget;
	}

	return event.target.parentNode;		
}

torpedo.functions.isURL = function (url)
{
	if (url.match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i))			
	{
		return true;
	}
	return false;	
};

torpedo.functions.getDomainWithFFSuffix = function (url)
{
	var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].getService(Components.interfaces.nsIEffectiveTLDService);
	var tempURI = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(""+url, null, null);
	
	try 
	{
		return eTLDService.getBaseDomain(tempURI);
	}
	catch(err) 
	{
		return "";
	}
}

torpedo.functions.countdown = function (timee,id)
{
	var startTime = timee;
	
	function showTime()
	{
		day = Math.floor(startTime/(60*60*24)) % 24; 
		hour = Math.floor(startTime/(60*60)) % 24;
		minute = Math.floor(startTime/60) %60;
		second = startTime %60;

		day = (day >  0) ? day+"day ":"";
		hour = (hour < 10) ? "0"+hour : hour;
		minute = (minute < 10) ? "0"+minute : minute;
		second = (second < 10) ? "0"+second : second;

		strZeit =" "+day + hour + ":" + minute + ":" + second;

		
		$("#"+id).html(strZeit);		
	}
	showTime();
	--startTime;
	
	var timerInterval = setInterval(function timer()
	{ 
		showTime();
		if(startTime == 0)
		{
			clearInterval(timerInterval);
		}
		else
		{
			--startTime;
		}
	
	},1000);
	
	return timerInterval;
}
	