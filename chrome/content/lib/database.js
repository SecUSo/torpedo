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
	return (sites.indexOf(website) > -1);
};

torpedo.db.putInsideSecond = function(website){
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

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

var selected;
var secondList = [];
var firstList = [];

torpedo.db.deleteAllSecond = function () {
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

    str.data = "";
	torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);
	torpedo.prefs.setComplexValue("URLFirstList", Components.interfaces.nsISupportsString, str);
};

torpedo.db.deleteSomeSecond = function () {
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

	var secondSites = torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data;
	if(secondSites.length > 0){
		var listElement = secondList[selected];
		var cutOut = secondSites.substring(secondSites.indexOf(listElement), secondSites.length);
		var comma = secondSites.indexOf(",");
		cutOut = cutOut.substring(0, comma+1);
		str.data = secondSites.replace(cutOut, "");

		torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);

		var theList = document.getElementById('theList');
		theList.removeChild(theList.getItemAtIndex(selected));
	}
};

torpedo.db.getSecond = function () {
	var theList = document.getElementById('theList');
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

torpedo.db.select = function(index){
	selected = index;
};

torpedo.db.getDefaults = function (){
	var defaultList = document.getElementById('defaultList');
	var defaultSites = torpedo.prefs.getComplexValue("URLDefaultList", Components.interfaces.nsISupportsString).data;
	var i = 0;
	firstList = [];
	while(defaultSites.indexOf(",") >= 0){
		var split = defaultSites.indexOf(",");
		firstList[i] = defaultSites.substring(0,split); 
		defaultSites = defaultSites.substring(split+1, defaultSites.length);
		i++;
	}
	firstList.sort();
	for (i = 0; i < firstList.length; i++) {
		var row = document.createElement('listitem');
	    row.setAttribute('label', firstList[i]);
	    defaultList.appendChild(row);
	}
}

torpedo.db.restoreSettings = function(){
	var del = document.getElementById("defaultdelete").checked;
	if(del) {
		torpedo.db.deleteAllSecond();
	}
	torpedo.prefs.resetPrefs(false);
	return true;
}