var torpedo = torpedo || {};
torpedo.redirect = torpedo.redirect || {};

torpedo.redirect.getRedirects = function(){
  var reList = document.getElementById('redirectsList');
  var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	var redirects = torpedo.prefs.getStringPref("RedirectionList");

  // remove all elements first
  while (reList.firstChild) reList.removeChild(reList.firstChild);

  document.documentElement.getButton("extra1").disabled = true;
  document.documentElement.getButton("accept").disabled = true;
  var redirectList = redirects.split(",");
  redirectList = redirectList.sort();
  var i;
  for (i = 0; i < redirectList.length; i++) {
    var row = document.createElement('listitem');
    if(redirectList[i].length > 0) {
      row.setAttribute('label',redirectList[i]);
      row.setAttribute('style',"height:100%;width:300px");
      reList.appendChild(row);
    }
  }
};

addList=[];
torpedo.redirect.add = function(){
  var panel = document.getElementById("add");
  var addSites = panel.value;
  var message = document.getElementById("errormessage");
  var error = document.getElementById("error");
	torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");

  addSites.toLowerCase();
  addSites = addSites.replace(/\s+/g, '');
  addSites = addSites + ",";
  addList = [];
  var i = 0;
  var erase = true;
  var openpopup = false;
  while(addSites.indexOf(",") > 0){
  	var split = addSites.indexOf(",");
  	var url = addSites.substring(0,split);
  	addSites = addSites.substring(split+1, addSites.length);
  	if(url.length >= 500){
  		erase = false;
  		error.textContent = torpedo.stringsBundle.getString('toolong');
  		openpopup = true;
  	}
  	else {
  		if (!url.startsWith("http")) url = "http://" + url;
  		if(torpedo.functions.isURL(url)){
  			var split = url.indexOf("://");
  			url = url.substring(split+3,url.length);
  		  url = torpedo.functions.getDomainWithFFSuffix(url);
  			if(torpedo.redirect.inList(url)){
          erase = false;
  				error.textContent = torpedo.stringsBundle.getString('alreadyInReferrerList');
  				openpopup = true;
  			}
        else{
          addList[i] = url;
  				i++;
  			}
  		}
  		else{
  			erase = false;
  			error.textContent = torpedo.stringsBundle.getString('nonValidUrl');
  			openpopup = true;
  		}
  	}
  	if(openpopup){
  		message.openPopup(panel, "before_start",0,0, false, false);
  		setTimeout(function (e){
  			message.hidePopup();
  		}, 4500);
  		panel.select();
  	}
  }
  for (i = 0; i < addList.length; i++) {
    if(addList[i].length > 0){
  	  torpedo.redirect.append(addList[i]);
    }
  }
  if(erase) panel.value = "";
  torpedo.redirect.getRedirects();
};

torpedo.redirect.inList = function(url){
  var redirects = torpedo.prefs.getStringPref("RedirectionList");
  var split = redirects.split(",");
  var i;
  for(i=0; i<split.length; i++){
    if(url == split[i]) return true;
  }
  return false;
};

torpedo.redirect.append = function(url){
  var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
  var redirects = torpedo.prefs.getStringPref("RedirectionList");
  str.data = redirects + url + ",";
  torpedo.prefs.setStringPref("RedirectionList", str);
  };

torpedo.redirect.delete = function(){
  var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
  var redirects = torpedo.prefs.getStringPref("RedirectionList");
  var selected = document.getElementById('redirectsList').selectedItem.label + ",";
	if(selected != null && redirects.length > 0){
		// cut selected element out of list of redirect domains
		str.data = redirects.replace(selected, "");
    torpedo.prefs.setStringPref("RedirectionList",str);
	torpedo.redirect.getRedirects();
	}
};
