var torpedo = torpedo || {};
var lastBrowserStatus;
torpedo.instructionSize = {width: 800,height: 460};
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);
 
torpedo.baseDomain;
torpedo.updateTooltip = function (url)
{
	// Initializaion
	var redirect = document.getElementById("redirect");
	var panel = document.getElementById("tooltippanel");
	var secondsbox = document.getElementById("seconds-box");
	var warningpic = document.getElementById("warning-pic");
	var redirectButton = document.getElementById("redirectButton");
	var redirectBox = document.getElementById("redirectBox");
	var urlBox = document.getElementById("url-box");
	var url1andbase = document.getElementById("url1andbase");
	var url2 = document.getElementById("url2");
	var nore = torpedo.prefs.getBoolPref("redirection0");
	var manure = torpedo.prefs.getBoolPref("redirection1");
	var autore = torpedo.prefs.getBoolPref("redirection2");
	var isRedirect = torpedo.functions.isRedirect(url);
	var shortenText = torpedo.prefs.getBoolPref("language");
	var gmxRedirect = false;
	var old = "";
	redirectButton.disabled = true;
	secondsbox.hidden = false;
	warningpic.hidden = true;

	// check if url is a "redirectUrl=" url
	var redirectUrl = torpedo.functions.resolveRedirect(url);
	if(redirectUrl != url){
		gmxRedirect = true;
		if(shortenText) redirect.textContent = torpedo.stringsBundle.getString('redirect');
		else redirect.textContent = torpedo.stringsBundle.getString('alert_redirect');
		old = url;
		url = redirectUrl;
		if(torpedo.functions.isRedirect(redirectUrl)) torpedo.functions.containsRedirect(url);
	}

	// assert url to tooltip
	torpedo.functions.setHref(url);
	torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	document.getElementById("baseDomain").textContent = torpedo.baseDomain;
	var split = url.indexOf(torpedo.baseDomain);
	var before = url.substring(0, split);
	var after = url.substring(split+torpedo.baseDomain.length, url.length);

	document.getElementById("url1").textContent = before;
	document.getElementById("url2").textContent = "";

	if(after.length > 200){
		after = after.substr(0,200) + "...";
	}
	//avoid unnessecary slash
	if (after.length > 1) document.getElementById("url2").textContent = after;

	// document.getElementById("linkDeactivate").textContent = torpedo.stringsBundle.getString('warn');
	
	// show or hide redirectButton 
    if(!(isRedirect && manure)) redirectButton.hidden = true;
    else{
    	redirectButton.hidden = false;
        redirectButton.disabled = false;
    }

    // settings for tooltip border colors & texts
	// trustworthy domains activated and url is in it
	if(torpedo.functions.isChecked("green") && torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") && !isRedirect){
		panel.style.borderColor = "green";
		if(shortenText) redirect.textContent = "";
		else redirect.textContent = torpedo.stringsBundle.getString('lowrisk');

		// if timer is off in trustworthy domains
		if(!torpedo.functions.isChecked("greenActivated")) {
			secondsbox.hidden = true;
		}
	}
	// domain is in < 2 times clicked links
	else if(torpedo.db.inList(torpedo.baseDomain, "URLSecondList") && !isRedirect){
		panel.style.borderColor = "#1a509d";
		if(shortenText) redirect.textContent = "";
		else redirect.textContent = torpedo.stringsBundle.getString('userrisk');

		// timer is off in clicked links
		if(!torpedo.functions.isChecked("orangeActivated")) {
			secondsbox.hidden = true;
		}
	}
	else{
		panel.style.borderColor = "black";
	}
	
	// settings for redirect case	
	if(isRedirect){
		if(torpedo.functions.loop < 0) {
			if(shortenText) redirect.textContent = torpedo.stringsBundle.getString('url');
			else redirect.textContent = torpedo.stringsBundle.getString('shorturl');
		}
	    else {
	        redirectButton.hidden = true;
	    }        
	    if(autore){
			secondsbox.hidden = true;
		}
	}

	// settings for phish case 
	var title = torpedo.handler.title;
	if(title != "" && title != undefined && torpedo.functions.isURL(title)){
		if(gmxRedirect) url = old;
		torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
		var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
		if(titleDomain != torpedo.baseDomain){
			if(shortenText) redirect.textContent = torpedo.stringsBundle.getString('warn_short');
			else redirect.textContent = torpedo.stringsBundle.getString('warn');
			warningpic.hidden = false;
			panel.style.borderColor = "red";
		}
	}

	// determine length of first text segment in tooltip
	panel.openPopup(tempTarget, "after_start",0,0, false, false);
	var width;
	width = ($(url2).width() > $(url1andbase).width())? $(url2).width() : $(url1andbase).width();
	redirect.style.width = ""+width+"px";
	Application.console.log(width);
	// now open
	panel.openPopup(tempTarget, "after_start",0,0, false, false);
};

torpedo.processDOM = function ()
{
	function init()
	{
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
							torpedo.handler.mouseOverHref(event);
						});
						$(aElement).bind("mouseleave", function(event){
							torpedo.handler.mouseDownHref(event);
						});
					}
				}
			}
		}
	}
	init();
};

window.addEventListener("load", function load(event){
	window.removeEventListener("load", load, false);
	torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");

	torpedo.prefs.addonUninstallingListener();
    torpedo.processDOM();

    if(torpedo.prefs.getBoolPref("firstrun")){
		torpedo.prefs.setBoolPref("firstrun",false);
		torpedo.dialogmanager.createWelcome();
	}
}, false);
