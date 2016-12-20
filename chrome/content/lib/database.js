var torpedo = torpedo || {};
torpedo.db = torpedo.db || {};

var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.db.pushUrl = function (website)
{
	var isRedirect = torpedo.functions.isRedirect(website);
	if (torpedo.db.inList(website, "URLDefaultList") && !isRedirect){
		return 1;
	}
	else if (torpedo.db.inList(website, "URLSecondList") && !isRedirect){
		return 2;
	}
	else if (torpedo.db.inList(website, "URLFirstList") && !isRedirect){
		torpedo.db.putInsideSecond(website);
		return 3;
	}
	else {
		torpedo.db.putInsideFirst(website);
		return 4;
	}
};

torpedo.db.inList = function (website, list){
	if(torpedo.functions.isRedirect(website) || (list == "URLDefaultList" && (!torpedo.functions.isChecked("green")))){
		return false;
	}
	var sites = torpedo.prefs.getComplexValue(list, Components.interfaces.nsISupportsString).data;
	website = website.toLowerCase();
	if(sites.indexOf(website) != 0 && sites.charAt(sites.indexOf(website)-1) != ','){
		return false;
	}
	return (sites.indexOf(website) > -1);
};

torpedo.db.unknown = function(website){
	if(!torpedo.db.inList(website, "URLDefaultList") && !torpedo.db.inList(website, "URLSecondList")){
		return true;
	}
	return false;
}

torpedo.db.putInsideDefault = function(website){
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

	var defaultSites = torpedo.prefs.getComplexValue("URLDefaultList", Components.interfaces.nsISupportsString).data;
	str.data = defaultSites + website + ",";
	torpedo.prefs.setComplexValue("URLDefaultList", Components.interfaces.nsISupportsString, str);
};

torpedo.db.putInsideSecond = function(url){
	var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	if(url=="add"){
		url = torpedo.baseDomain;
	}
	// put website into user list
	var secondSites = torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data;
	str.data = secondSites + url + ",";
	torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);

	// delete website out of first clicked links
	var firstSites = torpedo.prefs.getComplexValue("URLFirstList", Components.interfaces.nsISupportsString).data;
	var website = firstSites.substring(firstSites.indexOf(url), firstSites.indexOf(url)+url.length+1);
	if(website.indexOf(",") >= 0) url = url + ",";

	str.data = firstSites.replace(url, "");
	torpedo.prefs.setComplexValue("URLFirstList", Components.interfaces.nsISupportsString, str);
};

torpedo.db.putInsideFirst = function(website){
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

	var firstSites = torpedo.prefs.getComplexValue("URLFirstList", Components.interfaces.nsISupportsString).data;
	str.data = firstSites + "," +  website;
	torpedo.prefs.setComplexValue("URLFirstList", Components.interfaces.nsISupportsString, str);
};

secondList = [];
firstList = [];
newList = [];

torpedo.db.deleteSomeSecond = function () {
	var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	var secondSites = torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data;
	var selected = document.getElementById('theList').selectedItem.label + ",";

	if(selected != null && secondSites.length > 0){
		// cut selected element out of list of trustworthy domains
		str.data = secondSites.replace(selected, "");
		torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);
		torpedo.db.getSecond();
	}
};

torpedo.db.deleteAllSecond = function () {
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

    str.data = "";
	torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);
	torpedo.prefs.setComplexValue("URLFirstList", Components.interfaces.nsISupportsString, str);
};

torpedo.db.getSecond = function () {
	torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");
  document.getElementById('addEntryDialog').textContent = torpedo.stringsBundle.getString('addentries');
	var secondSites = torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data;
	var theList = document.getElementById("theList");

	// remove all elements first
  while (theList.firstChild) theList.removeChild(theList.firstChild);

	// disable buttons
	document.documentElement.getButton("extra1").disabled = true;
	document.documentElement.getButton("accept").disabled = true;

	secondList = secondSites.split(",");
	secondList.sort();
	var i = 0;
	for (i = 0; i < secondList.length; i++) {
		var row = document.createElement('listitem');
	  if(secondList[i].length > 0) {
			row.setAttribute('label', secondList[i]);
	  	theList.appendChild(row);
		}
	}
};

torpedo.db.getDefaults = function (){
	var defaultList = document.getElementById('defaultList');
	var defaultSites = torpedo.prefs.getComplexValue("URLDefaultList", Components.interfaces.nsISupportsString).data;
	firstList = defaultSites.split(",");
	firstList.sort();
	for (i = 0; i < firstList.length; i++) {
		var row = document.createElement('listitem');
	  if(firstList[i].length > 0) {
			row.setAttribute('label', firstList[i]);
	  	defaultList.appendChild(row);
		}
	}
};

torpedo.db.restoreSettings = function(){
	var del = document.getElementById("defaultdelete").checked;
	torpedo.prefs.resetPrefs(del);
	return true;
};

addList=[];
torpedo.db.addEntries = function(){
	var addSites = document.getElementById("addEntries").value;
	var message = document.getElementById("errormessage");
	var error = document.getElementById("error");
	var panel = document.getElementById("addEntries");
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
		if(url.length > 500){
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
				if(torpedo.db.inList(url, "URLDefaultList")){
					erase = false;
					error.textContent = torpedo.stringsBundle.getString('alreadyinside');
					openpopup = true;
				}
				else if(torpedo.db.inList(url,"URLSecondList")){
					erase = false;
					error.textContent = torpedo.stringsBundle.getString('alreadyinlist');
					openpopup = true;
				}
				else{
					addList[i] = url;
					i++;
				}
			}
			else{
				erase = false;
				error.textContent = torpedo.stringsBundle.getString('wrongurl');
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
		    torpedo.db.putInsideSecond(addList[i]);
	    }
	}
	if(erase) panel.value = "";
	torpedo.db.getSecond();
};
