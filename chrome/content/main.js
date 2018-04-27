var torpedo = torpedo || {};
var lastBrowserStatus;
torpedo.instructionSize = {width: 800,height: 460};

torpedo.baseDomain;
torpedo.textSize;
torpedo.gmxRedirect;
torpedo.redirectClicked;
torpedo.oldUrl;
torpedo.currentURL;
torpedo.currentDomain;
torpedo.info;
torpedo.state; // 0:T1, 1:T2 ,2:T3, 3:T1PH, 4:T2PH, 5:T3PH, 6:URLnachErmittelnButton,
// 7:T1Stern, 8:T2Stern, 9:T3Stern, 10:URLnachErmittelnButton2, 11:T1TH, 12:T2TH, 13:T3TH,
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
	redirectButton.disabled = true;
	redirectButton.hidden = true;
	redirect.hidden = false;
	secondsbox.hidden = false;
	warningpic.hidden = true;
	advicebox.hidden = false;
	panel.style.backgroundColor = 'white';
	panel.style.borderColor = "#bfb9b9";
  $("#redirectButton").css("cssText", "cursor:wait !important;");

	if(torpedo.functions.isGmxRedirect(url)){ // redirect
 		torpedo.currentURL = torpedo.functions.resolveRedirect(url);
		torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(torpedo.currentURL);

		if(torpedo.functions.isGmxRedirect(torpedo.currentURL)){// redirect + redirect
			torpedo.state = "WarnungPhish";
			panel.style.backgroundColor = '#feffcc';
			panel.style.borderColor = "red";
			warningpic.hidden = false;
		}
		else if(torpedo.functions.isRedirect(torpedo.currentURL)){ // redirect + short url
			torpedo.state = "URLnachErmittelnButton2";
			redirectButton.disabled = false;
			redirectButton.hidden = false;
			$("#redirectButton").css("cssText", "cursor:pointer !important;");
		}
		else if(torpedo.functions.isMismatch(torpedo.baseDomain)){ // redirect + mismatch
			 if(torpedo.db.inList(torpedo.currentDomain, "URLDefaultList")){
				 torpedo.state = "T2PHTH";
		 		 panel.style.borderColor = "green";
			 }
			 else if(torpedo.db.inList(torpedo.currentDomain, "URLSecondList")){
				 torpedo.state = "T3PHTH";
		 		 panel.style.borderColor = "#1a509d";
			 }
			 else{
				 torpedo.state = "T1PHTH";
				 warningpic.hidden = false;
				 panel.style.backgroundColor = '#feffcc';
	 			 panel.style.borderColor = "red";
			 }
		}
		else { // simple redirect
			if(torpedo.db.inList(torpedo.currentDomain, "URLDefaultList")){
				torpedo.state = "T2PH";
				panel.style.borderColor = "green";
			}
			else if(torpedo.db.inList(torpedo.currentDomain, "URLSecondList")){
				torpedo.state = "T3PH";
				panel.style.borderColor = "#1a509d";
			}
			else{
				torpedo.state = "T1PH";
			}
		}
	}

	else if(torpedo.functions.isRedirect(url)){ // short url
		torpedo.currentURL = url;
	 	torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);
		if(torpedo.functions.isMismatch(torpedo.baseDomain)){
			torpedo.state = "WarnungPhish";
			panel.style.backgroundColor = '#feffcc';
			panel.style.borderColor = "red";
			warningpic.hidden = false;
		}
		else{
			torpedo.state = "ShortURL";
			redirectButton.disabled = false;
			redirectButton.hidden = false;
			$("#redirectButton").css("cssText", "cursor:pointer !important;");
		}
	}
	else if(torpedo.functions.isMismatch(torpedo.baseDomain)){ // mismatch
		torpedo.currentURL = url;
	 	torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);
		if(torpedo.db.inList(torpedo.currentDomain, "URLDefaultList")){
	 	 torpedo.state = "T2TH";
 			panel.style.borderColor = "green";
	  }
	  else if(torpedo.db.inList(torpedo.currentDomain, "URLSecondList")){
	 	 torpedo.state = "T3TH";
 			panel.style.borderColor = "#1a509d";
	  }
	  else{
	 	 torpedo.state = "T1TH";
		 panel.style.backgroundColor = '#feffcc';
		 panel.style.borderColor = "red";
	 	 warningpic.hidden = false;
	  }
	}
	else{
		torpedo.currentURL = url;
	 	torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);
		if(torpedo.db.inList(torpedo.currentDomain, "URLDefaultList")){
			torpedo.state = "T2";
				panel.style.borderColor = "green";
		}
		else if(torpedo.db.inList(torpedo.currentDomain, "URLSecondList")){
			torpedo.state = "T3";
			panel.style.borderColor = "#1a509d";
		}
		else{
			torpedo.state = "T1";
		}
	}
	torpedo.texts.assignTexts(torpedo.currentURL);
	torpedo.functions.setHref(torpedo.currentURL);

	// now open
	panel.openPopup(tempTarget, "after_start",0,0, false, false);
};

torpedo.updateShortUrlResolved = function(url){
	var panel = document.getElementById("tooltippanel");
	var warningpic = document.getElementById("warning-pic");
	var redirectButton = document.getElementById("redirectButton");
	redirectButton.hidden = true;
	var domain = torpedo.functions.getDomainWithFFSuffix(url);
	panel.style.borderColor = "##bfb9b9";

	if( (torpedo.functions.isMismatch(torpedo.currentDomain)
	 && torpedo.functions.isMismatch(torpedo.oldUrl)
 	 && torpedo.functions.isMismatch(domain) )
 	 ||
	 (torpedo.functions.isRedirect(url) || torpedo.functions.isGmxRedirect(url))){
		 torpedo.state = "WarnungPhish";
		 panel.style.backgroundColor = '#feffcc';
		 panel.style.borderColor = "red";
		 warningpic.hidden = false;
	}
	else{
		if(torpedo.db.inList(domain, "URLDefaultList")){
	 	 torpedo.state = "T2Stern";
 		 panel.style.borderColor = "green";
	  }
	  else if(torpedo.db.inList(domain, "URLSecondList")){
	 	 torpedo.state = "T3Stern";
 		 panel.style.borderColor = "#1a509d";
	  }
	  else{
	 	 torpedo.state = "T1Stern";
	  }
	}

	torpedo.currentURL = url;
	torpedo.currentDomain = domain;
	torpedo.texts.assignTexts(torpedo.currentURL);
	torpedo.functions.setHref(torpedo.currentURL);
};


torpedo.doc = null;

torpedo.processDOM = function (){
	function init(){
		$("#tooltippanel").bind("mouseenter",torpedo.handler.mouseOverTooltipPane);
		$("#tooltippanel").bind("mouseleave",torpedo.handler.mouseDownTooltipPane);
		$("#deleteSecond").bind("click",torpedo.handler.mouseClickDeleteButton);
		$("#editSecond").bind("click",torpedo.handler.mouseClickEditButton);
		$("#redirectButton").click(function(event){torpedo.handler.mouseClickRedirectButton(event)});

    var messagepane = document.getElementById("messagepane");
    if(messagepane){
			messagepane.addEventListener("load", function(event) { onPageLoad(event); }, true);

		  if(torpedo.prefs.getBoolPref("firstrun")){
				torpedo.prefs.setBoolPref("firstrun",false);
				torpedo.dialogmanager.openTutorial();
			}
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
}, false);
