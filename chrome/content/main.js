var torpedo = torpedo || {};
var lastBrowserStatus;
torpedo.instructionSize = {width: 800,height: 460};
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.updateTooltip = function (url)
{
	var baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	var urlsplit = url.split(""+baseDomain);
	document.getElementById("url1").textContent = urlsplit[0];
	document.getElementById("baseDomain").textContent = baseDomain;
	if(urlsplit.length>1){
		if(urlsplit[1].length > 500){
			urlsplit[1] = urlsplit[1].substr(0,500) + "...";
		}
		document.getElementById("url2").textContent = urlsplit[1];
	}
	document.getElementById("redirect").textContent = "";
	var title = torpedo.handler.title;
	if(title != "" && torpedo.functions.isURL(title)){
		var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
		if(titleDomain != baseDomain){
			document.getElementById("tooltippanel").style.borderWidth = "5px";
			document.getElementById("redirect").textContent = torpedo.stringsBundle.getString('warn');
			document.getElementById("warning-pic").hidden = false;
		} 
		else {
			document.getElementById("tooltippanel").style.borderWidth = "2px";
			document.getElementById("warning-pic").hidden = true;
		}
	}
	document.getElementById("description").textContent = torpedo.stringsBundle.getString('check_message');
	document.getElementById("description").hidden = false;
	document.getElementById("seconds-box").hidden = false;
	var redirect = torpedo.functions.isRedirect(url);
	var nore = torpedo.prefs.getBoolPref("redirection0");
	var manure = torpedo.prefs.getBoolPref("redirection1");
	var autore = torpedo.prefs.getBoolPref("redirection2");

	if(redirect){
        document.getElementById("redirect").textContent = torpedo.stringsBundle.getString('attention');
    	if(autore){
			document.getElementById("description").hidden = true;
			document.getElementById("seconds-box").hidden = true;
		}
		else if(manure){
            document.getElementById("redirectButton").hidden = false;
    	}
	}
	// trustworthy domains activated and url is in it
	if(torpedo.functions.isChecked("green") && torpedo.db.inList(baseDomain, "URLDefaultList") && !redirect){
		document.getElementById("tooltippanel").style.borderColor = "green";
		// if timer is on in trustworthy domains
		if(!torpedo.functions.isChecked("greenActivated")) {
			document.getElementById("description").textContent = torpedo.stringsBundle.getString('click_link');
		}
	}
	// domain is in <2 times clicked links
	else if(torpedo.db.inList(baseDomain, "URLSecondList") && !redirect){
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

        var messagepane = document.getElementById("messagepane"); // tunderbird message pane
        if(messagepane)
		{
			messagepane.addEventListener("load", function(event) { onPageLoad(event); }, true);
        }
	}

	function onPageLoad(event){
		var doc = event.originalTarget;  // doc is document that triggered "onload" event
		var linkElement = doc.getElementsByTagName("a");
		var linkNumber = linkElement.length;

		if(linkNumber > 0)
		{
			for(var i = 0; i<linkNumber;i++)
			{
				var aElement = linkElement[i];
				var hrefValue = aElement.getAttribute("href");
				
				if(hrefValue != null && hrefValue != "" && hrefValue != undefined){
					if(torpedo.functions.isURL(hrefValue)){
						$(aElement).bind("mouseenter", function(event){
							torpedo.handler.mouseOverHref(event, aElement);
						})
						$(aElement).bind("mouseleave", function(event){
							torpedo.handler.mouseDownHref(event, aElement);
						})
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
			torpedo.dialogmanager.createWelcome();
			torpedo.dialogmanager.createInstruction();
		}
}, false);
