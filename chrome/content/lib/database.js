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

torpedo.db.putInsideDefault = function(website){
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

	var defaultSites = torpedo.prefs.getComplexValue("URLDefaultList", Components.interfaces.nsISupportsString).data;
	str.data = defaultSites + website + ",";
	torpedo.prefs.setComplexValue("URLDefaultList", Components.interfaces.nsISupportsString, str);
};

torpedo.db.putInsideSecond = function(website){
	var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);

	if(website=="add") website = torpedo.baseDomain;
	
	// put website into user list
	var firstSites = torpedo.prefs.getComplexValue("URLFirstList", Components.interfaces.nsISupportsString).data;
	var secondSites = torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data;
	str.data = secondSites + website + ",";
	torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);
	
	// delete website out of first clicked links
	var myString = firstSites.substring(firstSites.indexOf(website), firstSites.indexOf(website)+website.length+1);
	if(myString.indexOf(",") >= 0) website = website + ",";
	str.data = firstSites.replace(website, "");		
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
	var theList = document.getElementById('theList');
	var selected = theList.selectedIndex;

	if(secondSites.length > 0){
		// cut selected element out of list of trustworthy domains
		var listElement = secondList[selected];
		var cutOut = secondSites.substring(secondSites.indexOf(listElement), secondSites.length);
		var comma = secondSites.indexOf(",");
		cutOut = cutOut.substring(0, comma+1);
		str.data = secondSites.replace(cutOut, "");
		torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);

		// remove entry from list
		theList.removeChild(theList.getItemAtIndex(selected));
		theList.selectedIndex = selected;
	}
	torpedo.prefs.setIntPref("selected", theList.selectedIndex);
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
    var theList = document.getElementById("theList");
	document.documentElement.getButton("extra1").disabled = true;
	var secondSites = torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data;
	var i = 0;
	secondList = [];
	while(secondSites.indexOf(",") >= 0){
		var split = secondSites.indexOf(",");
		secondList[i] = secondSites.substring(0,split);
		secondSites = secondSites.substring(split+1, secondSites.length);
		i++;
	}
	secondList.sort();
	for (i = 0; i < secondList.length; i++) {
		var row = document.createElement('listitem');
	    row.setAttribute('label', secondList[i]);
	    theList.appendChild(row);
	}
};

torpedo.db.getDefaults = function (){
	var defaultList = document.getElementById('defaultList');
	torpedo.db.fillDefault("URLDefaultList");
	firstList.sort();
	for (i = 0; i < firstList.length; i++) {
		var row = document.createElement('listitem');
	    if(firstList[i].length > 0) row.setAttribute('label', firstList[i]);
	    defaultList.appendChild(row);
	}
};

torpedo.db.fillDefault = function(list){
	var defaultSites = torpedo.prefs.getComplexValue(list, Components.interfaces.nsISupportsString).data;
	var i = 0;
	firstList = [];
	while(defaultSites.indexOf(",") > 0){
		var split = defaultSites.indexOf(",");
		firstList[i] = defaultSites.substring(0,split); 
		defaultSites = defaultSites.substring(split+1, defaultSites.length);
		i++;
	}
};

torpedo.db.restoreSettings = function(){
	var del = document.getElementById("defaultdelete").checked;
	if(del) {
		torpedo.db.deleteAllSecond();
	}
	torpedo.prefs.resetPrefs(false);
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
	var text = "";
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
					text = text+ " " + url + ",";
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
			message.openPopup(document.getElementById("addEntries"), "before_start",0,0, false, false);
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
	if(erase) document.getElementById("addEntries").value = "";
	var list = document.getElementById('theList');
	while (list.firstChild){
    	list.removeChild(list.firstChild);
	}
	torpedo.db.getSecond();
};
