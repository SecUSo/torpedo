var torpedo = torpedo || {};
var Url = "";

var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].getService(Components.interfaces.nsIEffectiveTLDService);

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
  .getService(Components.interfaces.nsIConsoleService);

torpedo.functions = torpedo.functions || {};
torpedo.currentlyRunning = false;
torpedo.functions.manualRedirect = false;

torpedo.functions.calcWindowPosition = function (windowWidth, windowHeight) {
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

  width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  if (width < screen.width && height < screen.height) {
    width = screen.width;
    height = screen.height;
  }

  var left = ((width / 2) - (windowWidth / 2)) + dualScreenLeft;
  var top = ((height / 2) - (windowHeight / 2)) + dualScreenTop;

  return {
    top: top,
    left: left,
    width: width,
    height: height
  };
}

torpedo.functions.findParentTagTarget = function (event, aTag) {
  var tempTarget = event.target || event.srcElement;

  if (tempTarget.nodeName == aTag) {
    return tempTarget;
  }
  var children = event.target.childNodes;
  for (var i = 0; i < children.length; i++) {
    if (children[i].nodeName == aTag) {
      return children[i];
    }
  }
  var parent = event.target.parentNode;
  for (var j = 0; j < 5; j++) {
    if (parent.nodeName == aTag) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return undefined;
}


torpedo.functions.getHostname = function (url) {
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = "http://" + url;
  }
  const href = new URL(url);
  return href.hostname;
};


torpedo.functions.isURL = function (url) {
  if (url.startsWith("https://") || url.startsWith("http://") || url.startsWith("www")) {
    return true;
  }
  return false;
  /*try{
	
	if(!url.includes("https://") && !url.includes("http://")){
	  url = "http://" + url;
	}
	const href = new URL(url);
    if(href.hostname)
      return true;
    else return false;
    }catch(e){
    return false;
  }*/
};

torpedo.functions.getDomainWithFFSuffix = function (url) {
  if (!url.includes("https://") && !url.includes("http://")) {
    url = "http://" + url;
  }

  if (torpedo.functions.isURL(url) && !torpedo.functions.isIP(url)) {
    try {
      var tempURI = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(url, null, null);
      var baseDomain = eTLDService.getBaseDomain(tempURI);

      return baseDomain;
    }
    catch (err) { }
  } else { return url };
};

torpedo.functions.traceUrl = function (url, redirect) {
  // check if url is redirect and already in our list of saved entries
  var requestList = torpedo.prefs.getStringPref("URLRequestList");
  if (redirect && requestList.includes(torpedo.functions.getDomainWithFFSuffix(url) + ",")) {
    unknown = false;
    var requestArray = requestList.split(",");
    var i = 0;
    var urlPos = 0;
    for (i = 0; i < requestArray.length; i++) {
      if (requestArray[i] == url) {
        urlPos = i;
      }
    }
    var answerList = torpedo.prefs.getStringPref("URLAnswerList");
    var answerArray = answerList.split(",");
    torpedo.currentUrl = answerArray[urlPos];
  }
};

torpedo.functions.trace = function (url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      torpedo.functions.saveRedirection(url, xhr.responseURL);
      torpedo.updateShortUrlResolved(xhr.responseURL);
    }
  };
  xhr.send(null);
};

torpedo.functions.containsRedirect = function (url) {
  // torpedo.handler.clickEnabled = false;
  var redirect = document.getElementById("redirect");
  redirect.textContent = torpedo.stringsBundle.GetStringFromName('wait');
  document.getElementById("redirectButton").disabled = true;
  $("#clickbox").unbind("click", torpedo.handler.mouseClickHref);
  setTimeout(function (e) {
    $("#clickbox").bind("click", torpedo.handler.mouseClickHref);
    //torpedo.handler.Url = url;
    torpedo.functions.trace(url);
  }, 2000);
};


torpedo.functions.isIP = function (address) {
  var r = new RegExp('^http[s]?:\/\/((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])');
  return r.test(address);
};

torpedo.functions.saveRedirection = function (url, response) {
  // save redirection URL in user data
  var preVal1 = torpedo.prefs.getStringPref("URLRequestList");
  var preVal2 = torpedo.prefs.getStringPref("URLAnswerList");
  var request = preVal1 + url + ",";
  var answer = preVal2 + response + ",";
  var str1 = request;
  var str2 = answer;
  if (!preVal1.includes(url + ",")) {
    torpedo.prefs.setStringPref("URLRequestList", str1);
    torpedo.prefs.setStringPref("URLAnswerList", str2);
    var requestArray = request.split(",");

    // if list of saved redirections has more than 100 entries
    if (requestArray.length > 100) {
      var reqWithoutFirst = request.substr(request.indexOf(",") + 1, request.length);
      var ansWithoutFirst = answer.substr(answer.indexOf(",") + 1, answer.length);
      str1 = reqWithoutFirst;
      str2 = ansWithoutFirst;
      torpedo.prefs.setStringPref("URLRequestList", str1);
      torpedo.prefs.setStringPref("URLAnswerList", str2);
    }
  }
}

// Countdown functions

torpedo.functions.countdown = function (timee, id, url) {
  var startTime = timee;
  var noTimer = ((!torpedo.functions.isChecked("greenActivated") && torpedo.db.inList(torpedo.currentDomain, "URLDefaultList")) ||
    (!torpedo.functions.isChecked("orangeActivated") && torpedo.db.inList(torpedo.currentDomain, "URLSecondList")) ||
    (document.getElementById("redirect").textContent == torpedo.stringsBundle.GetStringFromName('wait')) ||
    (torpedo.prefs.getIntPref("blockingTimer") == 0));
  if (noTimer) {
    startTime = 0;
    $("#seconds-box").hide();
  }
  else $("#seconds-box").show();
  torpedo.currentlyRunning = true;

  function showTime() {
    var second = startTime % 60;
    var a = torpedo.handler.TempTarget;
    var alreadyVisited = !torpedo.currentlyRunning && a.classList.contains("torpedoVisited");

    strZeit = (second < 10) ? ((second == 0) ? second : "0" + second) : second;
    if (alreadyVisited) strZeit = 0;
    document.getElementById("countdown").textContent = torpedo.stringsBundle.GetStringFromName('VerbleibendeZeit');
    var remainingTimeText = document.getElementById("countdown").textContent.replace("$TIME$", strZeit);
    document.getElementById("countdown").textContent = remainingTimeText;

    if (strZeit == 0) {
      // make URL in tooltip clickable
      $("#clickbox").unbind("click");
      $("#clickbox").bind("click", torpedo.handler.mouseClickHref);
      $(torpedo.handler.TempTarget).unbind("click");
      $(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHref);
      $("#clickbox").css("cssText", "cursor:pointer !important");
      torpedo.currentlyRunning = false;

      // make sure countdown is not started all over again if we visit the same link again
      // by adding "torpedoVisited" to the class of the visited link tag
      a.classList ? a.classList.add('torpedoVisited') : a.className += ' torpedoVisited';
    }
    else {
      $("#clickbox").unbind("click");
      $("#clickbox").bind("click", torpedo.handler.mouseClickHrefError);
      $(torpedo.handler.TempTarget).unbind("click");
      $(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHrefError);
      $("#clickbox").css("cssText", "cursor:wait !important;");
      torpedo.currentlyRunning = true;
    }
  }

  showTime();
  if (startTime > 0) {
    --startTime;
  }

  var timerInterval = setInterval(function timer() {
    showTime();
    if (startTime == 0) {
      clearInterval(timerInterval);
    }
    else {
      --startTime;
    }

  }, 1000);

  return timerInterval;
}

torpedo.functions.setHref = function (url) {
  Url = url;
  torpedo.handler.resetCountDownTimer();
}
torpedo.functions.getHref = function () {
  return Url;
}



// text settings

var e = torpedo.prefs.getBoolPref("language");

torpedo.functions.changeLanguage = function () {
  e = !e;
  torpedo.prefs.setBoolPref("language", e);
  if (e) document.getElementById("changeLang").textContent = torpedo.stringsBundle.GetStringFromName('longtext');
  else document.getElementById("changeLang").textContent = torpedo.stringsBundle.GetStringFromName('shorttext');
}



torpedo.functions.openFinalURL = function () {
  var privacyMode = torpedo.prefs.getBoolPref("privacyMode");
  return privacyMode;
};


torpedo.functions.configExists = function () {
  var config = torpedo.prefs.getBoolPref("config");
  return config;
};

torpedo.functions.isChecked = function (color) {
  if (color == "green") return torpedo.prefs.getBoolPref("checkedGreenList");
  if (color == "greenActivated") return torpedo.prefs.getBoolPref("activatedGreenList");
  if (color == "orangeActivated") return torpedo.prefs.getBoolPref("activatedOrangeList");
};
torpedo.functions.changePrivacyMode = function () {
  var privacyMode = torpedo.prefs.getBoolPref("privacyMode");
  privacyMode = !privacyMode;
  torpedo.prefs.setBoolPref("privacyMode", privacyMode);
  torpedo.prefs.setBoolPref("securityMode", !privacyMode);
};

torpedo.functions.changeSecurityMode = function () {
  var securityMode = torpedo.prefs.getBoolPref("securityMode");
  securityMode = !securityMode;
  torpedo.prefs.setBoolPref("securityMode", securityMode);
  torpedo.prefs.setBoolPref("privacyMode", !securityMode);
};

torpedo.functions.changeConfig = function () {
  var config = torpedo.prefs.getBoolPref("config");
  config = !config;
  torpedo.prefs.setBoolPref("config", config);
};

torpedo.functions.changeChecked = function () {
  var a = torpedo.prefs.getBoolPref("checkedGreenList");
  a = !a;
  torpedo.prefs.setBoolPref("checkedGreenlist", a);
};

torpedo.functions.changeActivatedGreen = function () {
  var b = torpedo.prefs.getBoolPref("activatedGreenList");
  b = !b;
  torpedo.prefs.setBoolPref("activatedGreenlist", b);
  if (b) {
    document.getElementById("greenlistactivated").checked = b;
  }
};

torpedo.functions.changeActivatedOrange = function () {
  var c = torpedo.prefs.getBoolPref("activatedOrangeList");
  c = !c;
  torpedo.prefs.setBoolPref("activatedOrangelist", c);
  if (c) {
    document.getElementById("orangelistactivated").checked = c;
  }
};

// timer settings

torpedo.functions.changeCheckedTimer = function () {
  var d = torpedo.prefs.getBoolPref("checkedTimer");
  d = !d;
  torpedo.prefs.setBoolPref("checkedTimer", d);
  if (d == false) {
    torpedo.prefs.setIntPref("blockingTimer", 0);
    document.getElementById("greenlistactivated").disabled = true;
    document.getElementById("activateTimerOnLowRisk").setAttribute("style", "color:grey;width:330px; margin-top:10px");
    document.getElementById("orangelistactivated").disabled = true;
    document.getElementById("activateTimerOnUserList").setAttribute("style", "color:grey;width:330px; margin-top:15px");
  }
  else {
    torpedo.prefs.setIntPref("blockingTimer", 3);
    document.getElementById("greenlistactivated").disabled = false;
    document.getElementById("activateTimerOnLowRisk").removeAttribute("style");
    document.getElementById("activateTimerOnLowRisk").setAttribute("style", "width:330px; margin-top:10px");
    document.getElementById("orangelistactivated").disabled = false;
    document.getElementById("activateTimerOnUserList").removeAttribute("style");
    document.getElementById("activateTimerOnUserList").setAttribute("style", "width:330px; margin-top:15px");
  }
}

// redirection settings

torpedo.functions.redirect = function (id) {
  torpedo.prefs.setBoolPref("redirection" + id, true);
  var id1 = (id + 1) % 3;
  var id2 = (id + 2) % 3;
  torpedo.prefs.setBoolPref("redirection" + id1, false);
  torpedo.prefs.setBoolPref("redirection" + id2, false);

  // prevent user from selecting no option at all in settings
  if (document.getElementById("redirect" + id).checked == false) {
    document.getElementById("redirect" + id).checked = true;
  }
};

/*
* check if url
* contains "redirect" or contains domain from list of redirections
*/
torpedo.functions.isRedirect = function (url) {
  var sites = torpedo.prefs.getStringPref("RedirectionList");
  sites = sites.split(",")
  if (torpedo.functions.isURL(url)) {
    for (var i = 0; i < sites.length; i++) {
      if (torpedo.functions.getDomainWithFFSuffix(url) == sites[i]) {
        return true;
      }
    }
  }
  return false;
};

torpedo.functions.isMismatch = function (domain) {
  var title = torpedo.handler.title;
  if (title == "" || title == undefined) return false;
  if (!torpedo.functions.isURL(title)) return false;
  var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
  return (titleDomain != domain);
};

torpedo.functions.isMismatchAfterRedirect = function (baseDomain, currentDomain) {
  var title = torpedo.handler.title;
  if (title == "" || title == undefined) return false;
  if (!torpedo.functions.isURL(title)) return false;
  var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
  return (titleDomain != currentDomain);
};

/**
 * checks if url matches main referrer in settings
 * @param url
 * @return {boolean}
 */

torpedo.functions.matchesRedirect = function (url) {

  const href = new URL(url);
  hostnameURL = href.hostname;

  var referrer = torpedo.db.getReferrerSites(torpedo.message.folder.server);

  var referrerDomain = referrer.domain.split(",")[0];
  var referrerPath = referrer.path.split(",")[0];
  var referrerAttribute = referrer.attribute.split(",")[0];

  if (referrerDomain === null || referrerPath === null || referrerAttribute == null || !hostnameURL) {
    return false;
  }

  referrerDomain = referrerDomain.split("*").filter(String);
  referrerPath = referrerPath.split("[...]").filter(String);

  var containsDomain = referrerDomain.every(function (el) {
    return hostnameURL.includes(el);
  }, hostnameURL);
  if (containsDomain) {
    var containsPath = referrerPath.every(function (el) {
      return url.includes(el);
    }, url);
    if (containsPath && url.includes(referrerAttribute)) {
      return true;
    }
  }
  return false;

};

torpedo.gmxRedirect;

/**
 * checks if the current url is a referrer 
 * @param url
 * @return resolved referrer or <NO_RESOLVED_REFERRER> if the current url is no referrer or there was an error 
 */

torpedo.functions.matchReferrer = function (url) {

  //var domainURL = torpedo.functions.getDomainWithFFSuffix(url);
  const href = new URL(url);
  var hostnameURL = href.hostname;

  var referrer = torpedo.db.getReferrerSites(torpedo.message.folder.server);
  if (referrer.domain === null || referrer.path === null || !hostnameURL) {
    torpedo.gmxRedirect = false;
    return "<NO_RESOLVED_REFERRER>";
  }

  var referrerDomainArr = referrer.domain.split(",").filter(String);
  var referrerPathArr = referrer.path.split(",").filter(String);
  var referrerAttributeArr = referrer.attribute.split(",").filter(String);

  var indices = referrerDomainArr.map(function (element, i) {
    var domainParts = element.split("*").filter(String);
    return domainParts.every(function (el) {
      return hostnameURL.includes(el);
    }, hostnameURL) ? i : '';
  }, hostnameURL).filter(String);

  for (var i = indices.length - 1; i >= 0; i--) {
    var ind = indices[i];
    var pathParts = referrerPathArr[ind].split("[...]").filter(String);
    for (path of pathParts) {
      if (!url.includes(path)) {
        indices = indices.splice(i, 1);
        break;
      }
    }
  }

  for (index of indices) {
    var cut = referrerAttributeArr[index];
    var urlAttrIndex = url.indexOf(cut);
    var temp = url.substring(urlAttrIndex + cut.length, url.length);
    temp = decodeURIComponent(temp);
    if (torpedo.functions.isURL(temp)) {
      url = temp;
      torpedo.gmxRedirect = true;
      return url;
    }
  }
  torpedo.gmxRedirect = false;
  return "<NO_RESOLVED_REFERRER>";
};

/**
 * checks if the domain of the url is similar to a domain name in the green or blue list
 * @param url
 * @return {boolean}
 */

torpedo.functions.isDomainExtension = function (url) {
  var domain = torpedo.functions.getDomainWithFFSuffix(url);
  var domainWithoutTLD = domain.split(".")[0];
  var similarOkDomainList = torpedo.db.getSimilarOkDomainList();

  var okDomains = torpedo.prefs.getStringPref("URLDefaultList") + torpedo.prefs.getStringPref("URLSecondList");
  var okDomainList = okDomains.split(",");
  okDomainList = okDomainList.concat(similarOkDomainList);

  for (var j = 0; j < okDomainList.length; j++) {
    var okDomain = okDomainList[j];
    var okDomainSplit = okDomainList[j].split(".");
    var okDomainWithoutTLD = okDomainSplit[0];

    //check if a domain from the green, blue, or ok domain similar list was shortened and used in the link, e.g. immobilienscout.co.uk -> immobilienscout24.de
    if (okDomain.includes(domainWithoutTLD)) {
      var domainTLD = eTLDService.getPublicSuffixFromHost(domain);
      var domain2TLD = eTLDService.getPublicSuffixFromHost(okDomain);

      if (domainTLD != domain2TLD && domainTLD != "de" && domainTLD != "com") {
        return true;
      }
    };
    // does the link domain include a domain name from the green/blue list or from the ok domain similar list, e.g google-shop includes google
    if (domain.includes(okDomainWithoutTLD) && okDomainWithoutTLD != "" && domainWithoutTLD != okDomainWithoutTLD) {
      return true;
    }
  }
  return false;
};

torpedo.functions.getFQDN = function (url) {
  var tempURLArr = url.split("://");
  var urlWithoutProtocol = tempURLArr[tempURLArr.length - 1];
  var urlWithoutPath = urlWithoutProtocol.split("/")[0];
  // ignoring IPv6 addresses 
  var fqdn = urlWithoutPath.split(":")[0];

  return fqdn;

};

torpedo.functions.isCloudDomain = function (url) {
  var cloudDomainList = torpedo.prefs.getStringPref("CloudDomainList").split(",");
  cloudDomainList.pop();

  const href = new URL(url);

  if (href.hostname) {

    var domain = href.hostname;
    for (dom of cloudDomainList) {
      if (domain.endsWith(dom)) {
        return true;
      }
    }
  }
  return false;
};