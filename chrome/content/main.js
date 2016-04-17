var torpedo = torpedo || {};
var lastBrowserStatus;
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.instructionSize = {width: 800,height: 460};	

torpedo.updateTooltip = function (url,element) 
{
	if(element.getAttribute('redirection_url') != null)
	{
		url = element.getAttribute('redirection_url');
		document.getElementById("tooltippanel").style.borderColor = "none";
	}
	
	var baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	var urlsplit = url.split(""+baseDomain);

	document.getElementById("url1").textContent = urlsplit[0];
	document.getElementById("baseDomain").textContent = baseDomain;
	document.getElementById("secs").textContent = torpedo.stringsBundle.getString('second_show');

	if(torpedo.db.inDefault(baseDomain)){
		document.getElementById("tooltippanel").style.borderColor = "green";
	}
	else if(torpedo.db.inSecondClick(baseDomain)){
		document.getElementById("tooltippanel").style.borderColor = "orange";
	}
	else{
		document.getElementById("tooltippanel").style.borderColor = "red";
	}

	torpedo.functions.setHref(url);
	if(torpedo.functions.getHref() != url){
		torpedo.handler.resetCountDownTimer();
	}
	if(urlsplit.length>1)
	{
		document.getElementById("url2").textContent = urlsplit[1];
	}
	
	if(element.getAttribute('tooltiptext') != null)
	{
		document.getElementById("description").textContent = element.getAttribute('tooltiptext');
	}
	else
	{
		document.getElementById("description").textContent = torpedo.stringsBundle.getString('check_message');
	}
}

torpedo.processDOM = function () 
{	
	function init()
	{
        var appcontent = document.getElementById("appcontent"); // browser app content
		var panel = document.getElementById("tooltippanel");

		torpedo.db.initDB();
		
		$(panel).bind("mouseenter",torpedo.handler.mouseOverTooltipPane);
		$(panel).bind("mouseleave",torpedo.handler.mouseDownTooltipPane);
		$(document.getElementById("info-pic")).bind("click",torpedo.handler.mouseClickInfoButton);
		$(document.getElementById("deleteSecond")).bind("click",torpedo.handler.mouseClickDeleteButton);
		$(document.getElementById("editSecond")).bind("click",torpedo.handler.mouseClickEditButton);

        if (appcontent) 
		{
			appcontent.addEventListener("OMContentLoaded", onPageLoad, true);
        }
		
        var messagepane = document.getElementById("messagepane"); // tunderbird message pane
        if(messagepane) 
		{
			messagepane.addEventListener("load", function(event) { onPageLoad(event); }, true);
        }	
	}
	
	function onPageLoad(event)
	{
		if(navigator.onLine)
		{
			if(gFolderDisplay.selectedCount>0)
			{	
				if(torpedo.prefs.getBoolPref("firstrun"))
				{
					torpedo.prefs.setBoolPref("firstrun",false);
					torpedo.dialogmanager.createInstruction(torpedo.instructionSize.width,torpedo.instructionSize.height);
				}
				
				var doc = event.originalTarget;  // doc is document that triggered "onload" event
				var linkElement = doc.getElementsByTagName("a");
				var linkNumber = linkElement.length;
				
				if(linkNumber > 0)
				{
					
					for(var i = 0; i<linkNumber;i++)
					{	
						var aElement = linkElement[i];
						var hrefValue = aElement.getAttribute("href");
						var titleValue = aElement.getAttribute("title");
						
						if(torpedo.functions.isURL(hrefValue))
						{	
							//$(aElement).bind("click",torpedo.handler.mouseClickHref);
							$(aElement).bind("mouseover",torpedo.handler.mouseOverHref);
							$(aElement).bind("mouseleave",torpedo.handler.mouseDownHref);
							
							if(titleValue != null || titleValue != "")
							{
								aElement.setAttribute("title","");
							}
						}	
					}		
				}
				
			}
		}
	}

	init();
};

window.addEventListener("load", function load(event) 
{
        window.removeEventListener("load", load, false);
		torpedo.stringsBundle = document.getElementById("string-bundle");
		
		torpedo.prefs.addonUninstallingListener();
        torpedo.processDOM();
}, false);