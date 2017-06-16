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
torpedo.state; // 0:T1, 1:T2 ,2:T3, 3:T1PH, 4:T2PH, 5:T3PH, 6:URLnachErmittelnButton,
// 7:T1*, 8:T2*, 9:T3*, 10:URLnachErmittelnButton2, 11:T1TH, 12:T2TH, 13:T3TH,
// 14:T1PHTH, 15:T2PHTH, 16:T3PHTH, 17:WarnungPhish

torpedo.updateTooltip = function (url)
{
	// Initializaion
	var panel = document.getElementById("tooltippanel");
	var redirect = document.getElementById("redirect");
	var phish = document.getElementById("phish");
	var secondsbox = document.getElementById("seconds-box");
	var warningpic = document.getElementById("warning-pic");
	var redirectButton = document.getElementById("redirectButton");
	var urlBox = document.getElementById("url-box");
	var linkDeactivate = document.getElementById("linkDeactivate");
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
	var title = torpedo.handler.title;
	redirectButton.disabled = true;
	redirect.hidden = false;
	secondsbox.hidden = false;
	warningpic.hidden = true;
	phish.hidden = true;
	advicebox.hidden = false;

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

	// show or hide redirectButton
  if((!isRedirect) && torpedo.functions.loop == -1) redirectButton.hidden = true;
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
		torpedo.state = "T2";
		if(torpedo.functions.isRedirect(torpedo.oldUrl)) torpedo.state = "T2PH";
		advicebox.hidden = true;
		redirectButton.hidden = true;
		// if timer is off in trustworthy domains
		if(!torpedo.functions.isChecked("greenActivated")) {
			secondsbox.hidden = true;
		}
	}
	// domain is in < 2 times clicked links
	else if(torpedo.db.inList(torpedo.baseDomain, "URLSecondList") && !isRedirect){
		panel.style.borderColor = "#1a509d";
		torpedo.state = "T3";
		if(torpedo.functions.isRedirect(torpedo.oldUrl)) torpedo.state = "T3PH";
		advicebox.hidden = true;
		redirectButton.hidden = true;
		// timer is off in clicked links
		if(!torpedo.functions.isChecked("orangeActivated")) {
			secondsbox.hidden = true;
		}
	}
	else{
		torpedo.state = "T1";
		if(navigator.language.indexOf("de") > -1)
			infobox.style.marginTop = "23px";
		else infobox.style.marginTop = "10px";
		if(torpedo.functions.isRedirect(torpedo.oldUrl)) torpedo.state = "T1PH";
		if(!isRedirect) redirectButton.hidden = true;
		panel.style.borderColor = " #bfb9b9";
	}
	if(torpedo.gmxRedirect){
		if(title != "" && title != undefined){
			var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
			var a = titleDomain.split(".");
			var b = torpedo.baseDomain.split(".");
			if(titleDomain != torpedo.baseDomain && !(a.length != b.length && a[a.length-2] == b[b.length-2] &&  a[a.length-1] == b[b.length-1])){
				if(torpedo.db.inList(torpedo.baseDomain, "URLDefaultList")) torpedo.state = "T2PHTH";
				else if(torpedo.db.inList(torpedo.baseDomain, "URLSecondList")) torpedo.state = "T3PHTH";
				else torpedo.state = "T1PHTH";
			}
		}
		torpedo.state = "URLnachErmittelnButton2";
		phish.hidden = false;
		advice.hidden = false;
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
			torpedo.state = "URLnachErmittelnButton";
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
	if(title != "" && title != undefined && !torpedo.gmxRedirect && !isRedirect && !requestList.includes(torpedo.functions.getDomainWithFFSuffix(torpedo.oldUrl)+",")){
		if(torpedo.functions.isURL(title)){
			var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
			var a = titleDomain.split(".");
			var b = torpedo.baseDomain.split(".");
			if(titleDomain != torpedo.baseDomain && !(a.length != b.length && a[a.length-2] == b[b.length-2] &&  a[a.length-1] == b[b.length-1])){
				if(torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") || torpedo.db.inList(torpedo.baseDomain, "URLSecondList")){
					if(torpedo.db.inList(torpedo.baseDomain, "URLDefaultList")) torpedo.state = "T2TH";
					else torpedo.state = "T3TH";
					if(navigator.language.indexOf("de") > -1){
						phish.style.marginBottom = "0px";
						infobox.style.marginTop = "2px";
					}
					else{
						phish.style.marginBottom = "0px";
						infobox.style.marginTop = "2px";
					}
				}
				else{
					torpedo.state = "T1TH";
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
				infotext.style.margin = "4px 0px 20px 6px";
				infopic.style.marginTop = "6px";
			}
		}
	}

	torpedo.texts.assignTexts(url);
	torpedo.functions.setHref(url);
	Application.console.log(panel.innerHTML);
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
		//$("#infos").bind("click",torpedo.handler.mouseClickInfoButton);
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
					else {
						if(torpedo.functions.isURL(decodeURIComponent(hrefValue))){
							hrefValue = decodeURIComponent(hrefValue);
							//Application.console.log(hrefValue + " is decode url")
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
		var str = Components.classes["@mozilla.org/supports-string;1"]
						.createInstance(Components.interfaces.nsISupportsString);
		str.data = "2.0.4"
		torpedo.prefs.setComplexValue("version", Components.interfaces.nsISupportsString, str);
		if(torpedo.installVersion == "2.0.4"){
				torpedo.dialogmanager.createWelcome();
		}
	}
}, false);
