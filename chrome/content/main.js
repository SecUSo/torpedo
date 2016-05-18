var torpedo = torpedo || {};
var lastBrowserStatus;
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.instructionSize = {width: 800,height: 460};

torpedo.updateTooltip = function (url, isRedirect)
{
	var baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	var urlsplit = url.split(""+baseDomain);
	document.getElementById("url1").textContent = urlsplit[0];
	document.getElementById("baseDomain").textContent = baseDomain;
	if(urlsplit.length>1){
		document.getElementById("url2").textContent = urlsplit[1];
	}
	if(!isRedirect) document.getElementById("redirect").textContent = "";
	document.getElementById("description").textContent = torpedo.stringsBundle.getString('check_message');
	document.getElementById("secs").textContent = torpedo.stringsBundle.getString('second_show');

	// trustworthy domains activated and url is in it
	if(torpedo.functions.isChecked("green") && torpedo.db.inList(baseDomain, "URLDefaultList")){
		document.getElementById("tooltippanel").style.borderColor = "green";
		// if timer is on in trustworthy domains
		if(!torpedo.functions.isChecked("greenActivated")) {
			document.getElementById("description").textContent = torpedo.stringsBundle.getString('click_link');
		}
	}
	// domain is in <2 times clicked links
	else if(torpedo.db.inList(baseDomain, "URLSecondList")){
		document.getElementById("tooltippanel").style.borderColor = "orange";
		// timer is on in clicked links
		if(!torpedo.functions.isChecked("orangeActivated")) {
			document.getElementById("description").textContent = torpedo.stringsBundle.getString('click_link');
		}
	}
	else{
		document.getElementById("tooltippanel").style.borderColor = "red";
	}
	torpedo.functions.setHref(url);
};

torpedo.processDOM = function ()
{
	function init()
	{
        var appcontent = document.getElementById("appcontent"); // browser app content
		var panel = document.getElementById("tooltippanel");

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
								$(aElement).bind("mouseenter", function(event){
									torpedo.handler.mouseOverHref(event, aElement);
								})
								$(aElement).bind("mouseleave", function(event){
									torpedo.handler.mouseDownHref(event, aElement);
								})
								$(aElement).bind("click", function(){
									return false;
								})

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
		torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");

		torpedo.prefs.addonUninstallingListener();
        torpedo.processDOM();

       if(torpedo.prefs.getBoolPref("firstrun"))
       {
			torpedo.prefs.setBoolPref("firstrun",false);
			torpedo.dialogmanager.createWelcome(torpedo.instructionSize.width,torpedo.instructionSize.height);
			torpedo.dialogmanager.createInstruction(torpedo.instructionSize.width,torpedo.instructionSize.height);
		}
}, false);
