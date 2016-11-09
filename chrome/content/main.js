var torpedo = torpedo || {};
var lastBrowserStatus;
torpedo.instructionSize = {width: 800,height: 460};
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);
 
torpedo.baseDomain;
torpedo.textSize;
torpedo.gmxRedirect;

torpedo.updateTooltip = function (url)
{
	// Initializaion
	torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	var panel = document.getElementById("tooltippanel");
	var redirect = document.getElementById("redirect");
	var phish = document.getElementById("phish");
	var secondsbox = document.getElementById("seconds-box");
	var warningpic = document.getElementById("warning-pic");
	var redirectButton = document.getElementById("redirectButton");
	var redirectBox = document.getElementById("redirectBox");
	var urlBox = document.getElementById("url-box");
	var linkDeactivate = document.getElementById("linkDeactivate");
	var baseDomain = document.getElementById("baseDomain");
	var url1 = document.getElementById("url1");
	var url2 = document.getElementById("url2");
	var nore = torpedo.prefs.getBoolPref("redirection0");
	var manure = torpedo.prefs.getBoolPref("redirection1");
	var autore = torpedo.prefs.getBoolPref("redirection2");
	var isRedirect = torpedo.functions.isRedirect(url);
	var shortenText = torpedo.prefs.getBoolPref("language");
	var old = "";
	redirectButton.disabled = true;
	redirectBox.hidden = false;
	secondsbox.hidden = false;
	warningpic.hidden = true;
	linkDeactivate.hidden = shortenText;
	phish.hidden = true;

	if(torpedo.gmxRedirect){
		phish.hidden = false;
		phish.textContent = shortenText ? torpedo.stringsBundle.getString('redirect') : torpedo.stringsBundle.getString('alert_redirect');
	}

	// assert url to tooltip
	torpedo.functions.setHref(url);
	baseDomain.textContent = torpedo.baseDomain;
	var split = url.indexOf(torpedo.baseDomain);
	var before = url.substring(0, split);
	var after = url.substring(split+torpedo.baseDomain.length, url.length);

	url1.textContent = before;
	url2.textContent = "";

	if(after.length > 200){
		after = after.substr(0,200) + "...";
	}
	//avoid unnessecary slash
	if (after.length > 1) url2.textContent = after;
	
	// show or hide redirectButton 
    if(((!isRedirect && manure) || torpedo.gmxRedirect) && torpedo.functions.loop == -1) redirectButton.hidden = true;
    else{
    	redirectButton.hidden = false;
        if(isRedirect && manure) redirectButton.disabled = false;
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
		if(shortenText) redirect.textContent = torpedo.stringsBundle.getString('highrisk_short');
		else redirect.textContent = torpedo.stringsBundle.getString('highrisk');
		panel.style.borderColor = "black";
	}
	// settings for redirect case	
	if(isRedirect){
		if(torpedo.functions.loop < 0) {
			if(shortenText) redirect.textContent = torpedo.stringsBundle.getString('shorturl_short');
			else redirect.textContent = torpedo.stringsBundle.getString('shorturl');
		}
	    else{
	        redirectButton.hidden = true;
	    }
	    if(autore){
			secondsbox.hidden = true;
		}
	}
	// settings for phish case
	var title = torpedo.handler.title;
	if(title != "" && title != undefined && !torpedo.gmxRedirect && !torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") && 
			!torpedo.db.inList(torpedo.baseDomain, "URLSecondList") && !isRedirect){
		if(torpedo.functions.isURL(title)){
			if(torpedo.gmxRedirect) url = old;
			var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
			if(titleDomain != torpedo.baseDomain){
				if(shortenText) phish.textContent = torpedo.stringsBundle.getString('warn_short');
				else phish.textContent = torpedo.stringsBundle.getString('warn');
				warningpic.hidden = false;
				panel.style.borderColor = "red";
				redirectBox.hidden = true;
				Application.console.log("hidden");
				phish.hidden = false;
			}
		}
	}

	// set text size of tooltip
    var content = document.getElementById("tooltipcontent");
	torpedo.textSize = torpedo.prefs.getIntPref("textsize");
    content.style.fontSize=""+torpedo.textSize+"%";

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

        var messagepane = document.getElementById("messagepane");
        if(messagepane)
		{
			messagepane.addEventListener("load", function(event) { onPageLoad(event); }, true);
        }
    }

	function onPageLoad(event){
		var doc = event.originalTarget;  // doc is document that triggered "onload" event
		var linkElement = doc.getElementsByTagName("a");
		var linkNumber = linkElement.length;
		//Application.console.log(doc.body.innerHTML);
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
