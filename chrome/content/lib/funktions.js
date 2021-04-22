var torpedo = torpedo || {};
torpedo.functions = torpedo.functions || {};
var Url = "";

var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].getService(Components.interfaces.nsIEffectiveTLDService);

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
  .getService(Components.interfaces.nsIConsoleService);


//torpedo.currentlyRunning = false; 
//torpedo.functions.manualRedirect = false;


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
};


torpedo.functions.isIP = function (address) {
  var r = new RegExp('^http[s]?:\/\/((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])');
  return r.test(address);
};


torpedo.functions.isURL = function (url) {
  if (url.startsWith("https://") || url.startsWith("http://") || url.startsWith("www")) {
    return true;
  }
  return false;
};

/*
* check if url
* contains "redirect" or contains domain from list of redirections
*/
torpedo.functions.isRedirect = function (url) {
  var sites = torpedo.prefs.getStringPref("RedirectionList");
  sites = sites.split(",")
  if (torpedo.functions.isURL(url)) {
    var domain = torpedo.functions.getDomainWithFFSuffix(url);
    return sites.indexOf(domain) > -1;
  }
  return false;
};

/**
 * checks if link contains a tooltip
 * @param event
 * @return url from tooltip or <HAS_NO_TOOLTIP> if there is no tooltip
 */

torpedo.functions.hasTooltip = function (event) {
  if (event.target.hasAttribute("title")) {
    tooltipURL = event.target.getAttribute("title");
    return tooltipURL;
  }
  return "<HAS_NO_TOOLTIP>"
};

torpedo.functions.isMismatch = function (domain, linkTitle) {
  if (linkTitle == "" || linkTitle == undefined) {
    return false;
  }
  if (!torpedo.functions.isURL(linkTitle)) {
    return false;
  }
  var titleDomain = torpedo.functions.getDomainWithFFSuffix(linkTitle);
  return (titleDomain != domain);
};

torpedo.functions.isCloudDomain = function (url) {
  var cloudDomainList = torpedo.prefs.getStringPref("CloudDomainList").split(",");

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


torpedo.functions.getDomainWithFFSuffix = function (url) {
  if (!url.includes("https://") && !url.includes("http://")) {
    url = "http://" + url;
  }

  if (!torpedo.functions.isIP(url)) {
    try {
      var tempURI = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(url, null, null);
      var baseDomain = eTLDService.getBaseDomain(tempURI);

      return baseDomain;
    }
    catch (err) { }
  } else {
    return url
  };
};

torpedo.functions.getHostname = function (url) {
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = "http://" + url;
  }
  const href = new URL(url);
  return href.hostname;
};


torpedo.functions.getFQDN = function (url) {
  var tempURLArr = url.split("://");
  var urlWithoutProtocol = tempURLArr[tempURLArr.length - 1];
  var urlWithoutPath = urlWithoutProtocol.split("/")[0];
  // ignoring IPv6 addresses 
  var fqdn = urlWithoutPath.split(":")[0];

  return fqdn;
};

torpedo.functions.traceUrl = function (url, redirect) {
  // check if url is redirect and already in our list of saved entries
  var requestList = torpedo.prefs.getStringPref("URLRequestList");
  var requestArray = requestList.split(",").filter(String);

  for (var i = 0; i < requestArray.length; i++) {
    if (requestArray[i].indexOf(url) > -1) {
      var answerArray = answerList.split(",");
      return answerArray[i];
    }
  }
  return url;
};

torpedo.functions.trace = function (url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      torpedo.functions.saveRedirection(url, xhr.responseURL);
      //torpedo.updateShortUrlResolved(xhr.responseURL);
      torpedo.updateTooltip(xhr.responseURL);
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
    torpedo.functions.trace(url);
  }, 2000);
};

torpedo.functions.saveRedirection = function (url, response) {
  // save redirection URL in user data
  var preRequestListStr = torpedo.prefs.getStringPref("URLRequestList");
  var preAnswerListStr = torpedo.prefs.getStringPref("URLAnswerList");
  var request = preRequestListStr + url + ",";
  var answer = preAnswerListStr + response + ",";

  if (!preRequestListStr.includes(url + ",")) {
    var requestArray = request.split(",");

    // if list of saved redirections has more than 100 entries
    if (requestArray.length > 100) {
      request = request.substr(request.indexOf(",") + 1, request.length);
      answer = answer.substr(answer.indexOf(",") + 1, answer.length);
    }
    torpedo.prefs.setStringPref("URLRequestList", request);
    torpedo.prefs.setStringPref("URLAnswerList", answer);
  }
};



torpedo.functions.setHref = function (url, state) {
  Url = url;
  torpedo.handler.resetCountDownTimer(state);
}
torpedo.functions.getHref = function () {
  return Url;
}

torpedo.functions.settingIsChecked = function (pref) {
  return torpedo.prefs.getBoolPref(pref);
};

torpedo.functions.changeMode = function (selectedMode, oppositeMode) {
  var mode = torpedo.prefs.getBoolPref(selectedMode);
  torpedo.prefs.setBoolPref(selectedMode, !mode);
  torpedo.prefs.setBoolPref(oppositeMode, mode);
}


torpedo.functions.changeBoolPref = function (optionString) {
  var boolPref = torpedo.prefs.getBoolPref(optionString);
  torpedo.prefs.setBoolPref(optionString, !boolPref);
};

torpedo.functions.changeActivatedList = function (optionString, optionToChange) {
  var boolPref = torpedo.prefs.getBoolPref(optionString);
  boolPref = !boolPref;
  torpedo.prefs.setBoolPref(optionString, boolPref);
  if (boolPref) {
    document.getElementById(optionToChange).checked = boolPref;
  }
};





