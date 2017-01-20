var torpedo = torpedo || {};
var lastBrowserStatus;
torpedo.instructionSize = {width: 800,height: 460};
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.baseDomain;
torpedo.installVersion;
torpedo.textSize;
torpedo.gmxRedirect;
torpedo.redirectClicked;
torpedo.oldUrl;
torpedo.info;
torpedo.state; // 0 is unknown, 1 is green, 2 is blue, 3 is grey, 4 is redirect, 5 is gmxredirect, 6 is phish

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
	var urlBox = document.getElementById("url-box");
	var linkDeactivate = document.getElementById("linkDeactivate");
	var baseDomain = document.getElementById("baseDomain");
	var url1 = document.getElementById("url1");
	var url2 = document.getElementById("url2");
	var advice = document.getElementById("advice");
	var advicebox = document.getElementById("advicebox");
	var infotext = document.getElementById("infotext");
	var infopic = document.getElementById("info-pic");
	var infobox = document.getElementById("infobox");
	var infos = document.getElementById("infos");
	var nore = torpedo.prefs.getBoolPref("redirection0");
	var manure = torpedo.prefs.getBoolPref("redirection1");
	var autore = torpedo.prefs.getBoolPref("redirection2");
	var isRedirect = torpedo.functions.isRedirect(url);
	var shortenText = torpedo.prefs.getBoolPref("language");
	var old = "";
	redirectButton.disabled = true;
	redirect.hidden = false;
	secondsbox.hidden = false;
	warningpic.hidden = true;
	linkDeactivate.hidden = shortenText;
	phish.hidden = true;
	advice.textContent = torpedo.stringsBundle.getString('knownadvice');
	infotext.textContent = torpedo.stringsBundle.getString('moreinfolowrisk');
	advicebox.hidden = false;
	// assert url to tooltip
	baseDomain.textContent = torpedo.baseDomain;
	var split = url.indexOf(torpedo.baseDomain);
	var beginning = url.substring(0, split);
	var end = url.substring(split+torpedo.baseDomain.length, url.length);
	infos.style.marginBottom = "0px";
	phish.style.marginBottom = "10px";
	infobox.style.marginTop = "7px";
	if(navigator.language.indexOf("de") > -1){
		infotext.style.margin = "4px 0px 20px 6px"
		infopic.style.marginTop = "6px"
	}
	else{
		infotext.style.margin = "4px 0px 0px 6px";
		infopic.style.marginTop = "0px";
	}

	if(torpedo.prefs.getIntPref("blockingTimer")==0) secondsbox.hidden = true;
	url1.textContent = beginning;
	url2.textContent = "";
	if(end.length > 75) end = end.substring(0,75) +  "...";
	//avoid unnessecary slash
	if(end.length > 1) url2.textContent = end;

	// show or hide redirectButton
  if((!isRedirect || torpedo.gmxRedirect) && torpedo.functions.loop == -1) redirectButton.hidden = true;
  else{
  	redirectButton.hidden = false;
    if(isRedirect) redirectButton.disabled = false;
  }
	if(redirectButton.disabled) $("#redirectButton").css("cssText", "cursor:wait !important;");
	else $("#redirectButton").css("cssText", "cursor:pointer !important;");

  // settings for tooltip border colors & texts
	// trustworthy domains activated and url is in it
	if(torpedo.functions.isChecked("green") && torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") && !isRedirect){
		panel.style.borderColor = "green";
		torpedo.state = 1;
		if(!torpedo.functions.isRedirect(torpedo.oldUrl)) torpedo.info = torpedo.stringsBundle.getString('infosongreen');
		//if(shortenText) redirect.textContent = "";
		//else
		redirect.textContent = torpedo.stringsBundle.getString('lowrisk');
		advicebox.hidden = true;
		redirectButton.hidden = true;
		if(torpedo.functions.isRedirect(torpedo.oldUrl)){
			if(navigator.language.indexOf("de") > -1)
				infos.style.marginBottom = "190px";
			else infos.style.marginBottom = "200px";
		}
		// if timer is off in trustworthy domains
		if(!torpedo.functions.isChecked("greenActivated")) {
			secondsbox.hidden = true;
		}
	}
	// domain is in < 2 times clicked links
	else if(torpedo.db.inList(torpedo.baseDomain, "URLSecondList") && !isRedirect){
		panel.style.borderColor = "#1a509d";
		torpedo.state = 2;
		if(!torpedo.functions.isRedirect(torpedo.oldUrl)) torpedo.info = torpedo.stringsBundle.getString('infosonblue');
		if(shortenText) redirect.textContent = "";
		else redirect.textContent = torpedo.stringsBundle.getString('userrisk');
		advicebox.hidden = true;
		redirectButton.hidden = true;
		// timer is off in clicked links
		if(!torpedo.functions.isChecked("orangeActivated")) {
			secondsbox.hidden = true;
		}
		if(torpedo.functions.isRedirect(torpedo.oldUrl)){
			if(navigator.language.indexOf("de") > -1)
				infos.style.marginBottom = "150px";
			else infos.style.marginBottom = "200px";
		}
	}
	else{
		torpedo.state = 3;
		if(navigator.language.indexOf("de") > -1)
			infobox.style.marginTop = "23px";
		else infobox.style.marginTop = "10px";
		advice.textContent = torpedo.stringsBundle.getString('unknownadvice');
		infotext.textContent = torpedo.stringsBundle.getString('moreinfogrey');
		if(!torpedo.functions.isRedirect(torpedo.oldUrl)){
			torpedo.info = "";
		}
		else if(!isRedirect){
			if(navigator.language.indexOf("de") > -1)
				infos.style.marginBottom = "20px";
			else infos.style.marginBottom = "100px";

		}
		if(!isRedirect) redirectButton.hidden = true;

		if(shortenText) redirect.textContent = torpedo.stringsBundle.getString('highrisk_short');
		else redirect.textContent = torpedo.stringsBundle.getString('highrisk');
		panel.style.borderColor = " #bfb9b9";
	}
	if(torpedo.gmxRedirect){
		torpedo.state = 5;
		phish.hidden = false;
		advice.hidden = false;
		phish.textContent = shortenText ? torpedo.stringsBundle.getString('redirect') : torpedo.stringsBundle.getString('alert_redirect');
		infotext.textContent = torpedo.stringsBundle.getString('moreinfogmxredirect');
		torpedo.info = torpedo.stringsBundle.getString('infosongmxredirect');
		if(navigator.language.indexOf("de") > -1){
			phish.style.marginBottom = "5px";
		}
		else{
			phish.style.marginBottom = "5px";
		}
		infotext.style.margin = "4px 0px 20px 6px"
		infopic.style.marginTop = "6px"
	}
	// settings for redirect case
	if(isRedirect){
		if(torpedo.functions.loop < 0) {
			torpedo.state = 4;
			if(shortenText) redirect.textContent = torpedo.stringsBundle.getString('shorturl_short');
			else redirect.textContent = torpedo.stringsBundle.getString('shorturl');
			torpedo.info = torpedo.stringsBundle.getString('infosonredirect');
			advice.textContent = torpedo.stringsBundle.getString('redirectadvice');
			infotext.textContent = torpedo.stringsBundle.getString('moreinforedirect');
			if(navigator.language.indexOf("de") > -1){
				infobox.style.marginTop = "25px";
			}
			else{
				infobox.style.marginTop = "25px";
			}
			infotext.style.margin = "4px 0px 20px 6px"
			infopic.style.marginTop = "6px"
		}
	  else{
	    redirectButton.hidden = true;
	  }
	}

	var requestList = torpedo.prefs.getComplexValue("URLRequestList", Components.interfaces.nsISupportsString).data;
	// settings for phish case
	var title = torpedo.handler.title;
	if(title != "" && title != undefined && !torpedo.gmxRedirect && !isRedirect && !requestList.includes(torpedo.functions.getDomainWithFFSuffix(torpedo.oldUrl)+",")){
		if(torpedo.functions.isURL(title)){
			var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
			var a = titleDomain.split(".");
			var b = torpedo.baseDomain.split(".");
			if(titleDomain != torpedo.baseDomain && !(a.length != b.length && a[a.length-2] == b[b.length-2] &&  a[a.length-1] == b[b.length-1])){
				if(shortenText) phish.textContent = torpedo.stringsBundle.getString('warn_short');
				else phish.textContent = torpedo.stringsBundle.getString('warn');
				torpedo.state = 6;
				if(torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") || torpedo.db.inList(torpedo.baseDomain, "URLSecondList")){
					if(navigator.language.indexOf("de") > -1){
						phish.style.marginBottom = "0px";
						infobox.style.marginTop = "2px";
					}
					else{
						phish.style.marginBottom = "0px";
						infobox.style.marginTop = "2px";
					}
					phish.textContent = torpedo.stringsBundle.getString('actual');
				}
				else{
					panel.style.backgroundColor = "#feffcc";
					panel.style.borderColor = "red";
					redirect.textContent = "";
					if(navigator.language.indexOf("de") > -1){
						phish.style.marginBottom = "47px";
						infobox.style.marginTop = "22px";
					}
					else{
						phish.style.marginBottom = "15px";
						infobox.style.marginTop = "25px";
					}
					warningpic.hidden = false;
				}
				phish.hidden = false;
				advice.textContent = torpedo.stringsBundle.getString('phishadvice');
				infotext.textContent = torpedo.stringsBundle.getString('moreinfophish');
				infotext.style.margin = "4px 0px 20px 6px"
				infopic.style.marginTop = "6px"
				torpedo.info = torpedo.stringsBundle.getString('infosonred');
			}
		}
	}
	// set text size of tooltip
  var content = document.getElementById("tooltippanel");
	torpedo.textSize = torpedo.prefs.getIntPref("textsize");
  content.style.fontSize=""+torpedo.textSize+"%";

	/*if(torpedo.textSize == "115"){
		if(navigator.language.indexOf("de") > -1){
			infobox.style.marginTop = "48px";
		}
		else{
			infobox.style.marginTop = "32px";
		}
	}*/
	torpedo.functions.setHref(url);
	// now open
	panel.openPopup(tempTarget, "after_start",0,0, false, false);
};
torpedo.doc = null;

torpedo.processDOM = function (){
	function init(){
		$("#tooltippanel").bind("mouseenter",torpedo.handler.mouseOverTooltipPane);
		$("#tooltippanel").bind("mouseleave",torpedo.handler.mouseDownTooltipPane);
		$("#deleteSecond").bind("click",torpedo.handler.mouseClickDeleteButton);
		$("#editSecond").bind("click",torpedo.handler.mouseClickEditButton);
		$("#redirectButton").click(function(event){torpedo.handler.mouseClickRedirectButton(event)});
		$("#infos").bind("click",torpedo.handler.mouseClickInfoButton);
		//document.getElementById("changeSize").textContent = torpedo.stringsBundle.getString('bigtext');
		///document.getElementById("changeLang").textContent = torpedo.stringsBundle.getString('shorttext');

    var messagepane = document.getElementById("messagepane");
    if(messagepane){
			messagepane.addEventListener("load", function(event) { onPageLoad(event); }, true);
		}
	}

	function onPageLoad(event){
		torpedo.doc = event.originalTarget;  // doc is document that triggered "onload" event
		var linkElement = torpedo.doc.getElementsByTagName("a");
		var linkNumber = linkElement.length;

		//Application.console.log(doc.body.innerHTML);
		if(linkNumber > 0)
		{
			for(var i = 0; i<linkNumber;i++)
			{
				var aElement = linkElement[i];
				var hrefValue = aElement.getAttribute("href");
				//Application.console.log(hrefValue)
				if(hrefValue != null && hrefValue != "" && hrefValue != undefined){
					if(torpedo.functions.isURL(hrefValue)){
					//Application.console.log(hrefValue + " is url")
						$(aElement).bind({
  						mouseenter: function(event) {torpedo.handler.mouseOverHref(event);}
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
	torpedo.prefs.addonInstallingListener();
  torpedo.processDOM();
	//torpedo.prefs.setBoolPref("firstrun",true);
  if(torpedo.prefs.getBoolPref("firstrun")){
		torpedo.prefs.setBoolPref("firstrun",false);
<<<<<<< HEAD
		var str = Components.classes["@mozilla.org/supports-string;1"]
						.createInstance(Components.interfaces.nsISupportsString);
		try{
			torpedo.prefs.getComplexValue("version", Components.interfaces.nsISupportsString).data;
		}catch(e){
				torpedo.dialogmanager.createWelcome();
				str.data = "2.0.2"
				torpedo.prefs.setComplexValue("version", Components.interfaces.nsISupportsString, str);
		}
		if(torpedo.installVersion == "2.0.1"){
				torpedo.dialogmanager.createWelcome();
		}
	}
}, false);
