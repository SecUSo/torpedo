var torpedo = torpedo || {};
var lastBrowserStatus;
torpedo.instructionSize = {width: 800,height: 460};
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.hideButton = true;  
torpedo.baseDomain;
torpedo.updateTooltip = function (url)
{
	torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	var urlsplit = url.split(""+torpedo.baseDomain);
	document.getElementById("url1").textContent = urlsplit[0];
	document.getElementById("baseDomain").textContent = torpedo.baseDomain;

	if(urlsplit.length>1){
		if(urlsplit[1].length > 380){
			urlsplit[1] = urlsplit[1].substr(0,380) + "...";
		}
		document.getElementById("url2").textContent = urlsplit[1];
	}

	var redirect = document.getElementById("redirect");
	var description = document.getElementById("description");
	var panel = document.getElementById("tooltippanel");
	var secondsbox = document.getElementById("seconds-box");
	var warningpic = document.getElementById("warning-pic");
	var redirectButton = document.getElementById("redirectButton");

	description.textContent = torpedo.stringsBundle.getString('check_message');
	description.hidden = false;
	secondsbox.hidden = false;
	warningpic.hidden = true;
    redirectButton.hidden = true;
    
	var title = torpedo.handler.title;
	if(title != "" && title != undefined){
		if(torpedo.functions.isURL(title)) {
			var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
			if(titleDomain != torpedo.baseDomain){
				redirect.textContent = torpedo.stringsBundle.getString('warn');
				warningpic.hidden = false;
			} 
		}
		else {
			if(title != url){
				redirect.textContent = torpedo.stringsBundle.getString('warn');
				warningpic.hidden = false;
			}
		}
	}

	if(redirect.textContent != torpedo.stringsBundle.getString('alert_redirect')) redirect.textContent = "";
	var nore = torpedo.prefs.getBoolPref("redirection0");
	var manure = torpedo.prefs.getBoolPref("redirection1");
	var autore = torpedo.prefs.getBoolPref("redirection2");
	var isRedirect = torpedo.functions.isRedirect(url);

	if(isRedirect){
        redirect.textContent = torpedo.stringsBundle.getString('attention');
    	if(autore){
			description.hidden = true;
			secondsbox.hidden = true;
		}
		else if(manure && !torpedo.hideButton){
            redirectButton.hidden = false;
    	}
	}
	// trustworthy domains activated and url is in it
	if(torpedo.functions.isChecked("green") && torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") && !isRedirect){
		panel.style.borderColor = "green";
		// if timer is on in trustworthy domains
		if(!torpedo.functions.isChecked("greenActivated")) {
			description.textContent = torpedo.stringsBundle.getString('click_link');
		}
	}
	// domain is in < 2 times clicked links
	else if(torpedo.db.inList(torpedo.baseDomain, "URLSecondList") && !isRedirect){
		panel.style.borderColor = "orange";
		// timer is on in clicked links
		if(!torpedo.functions.isChecked("orangeActivated")) {
			description.textContent = torpedo.stringsBundle.getString('click_link');
		}
	}
	else{
		panel.style.borderColor = "red";
	}
	torpedo.functions.setHref(url);
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
						Application.console.log(hrefValue + " erkannt");
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
