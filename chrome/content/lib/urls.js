var torpedo = torpedo || {};
torpedo.db = torpedo.db || {};

var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.db.pushUrl = function (website) 
{
	if (torpedo.db.inList(website, "URLDefaultList")){
		return 1;
	}
	else if (torpedo.db.inList(website, "URLSecondList")){
		return 2;
	}
	else if (torpedo.db.inList(website, "URLFirstList")){
		torpedo.db.putInsideSecond(website);

		return 3;
	}
	else {
		torpedo.db.putInsideFirst(website);
		return 4;
	}
};

torpedo.db.inList = function (website, list){
	if(list == "URLDefaultList" && (!torpedo.handler.isChecked("greenActivated"))){
		return false;
	}

	var sites = torpedo.prefs.getComplexValue(list, Components.interfaces.nsISupportsString).data;
	website = website.toLowerCase();
	return (sites.indexOf(website) > -1);
};

torpedo.db.putInsideSecond = function(website){
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

	var firstSites = torpedo.prefs.getComplexValue("URLFirstList", Components.interfaces.nsISupportsString).data;
	str.data = website + ",";
	torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);

	var myString = firstSites.substring(firstSites.indexOf(website), firstSites.indexOf(website)+website.length+1);
	if(myString.indexOf(",") >= 0) website = website + ",";
	str.data = firstSites.replace(website, "");		
	torpedo.prefs.setComplexValue("URLFirstList", Components.interfaces.nsISupportsString, str);
};

torpedo.db.putInsideFirst = function(website){
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

	var firstSites = torpedo.prefs.getComplexValue("URLFirstList", Components.interfaces.nsISupportsString).data;
	if(firstSites.length == 0) str.data = website;
	else str.data = "," +  website;
	torpedo.prefs.setComplexValue("URLFirstList", Components.interfaces.nsISupportsString, str);
};

var selected;

torpedo.db.deleteAllSecond = function () {
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

    str.data = "";
	torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);
	torpedo.prefs.setComplexValue("URLFirstList", Components.interfaces.nsISupportsString, str);

	torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");
	alert(torpedo.stringsBundle.getString('entries_gone'));
};

torpedo.db.deleteSomeSecond = function () {
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

	var secondSites = torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data;
	if(secondSites.length > 0){
		var cutOut = secondSites.substring(secondSites.indexOf(selected), secondSites.length);
		var comma = secondSites.indexOf(",");
		cutOut = cutOut.substring(0, comma+1);
		str.data = secondSites.replace(cutOut, "");

		torpedo.prefs.setComplexValue("URLSecondList", Components.interfaces.nsISupportsString, str);

		Application.console.log("really: " + torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data);

		var theList = document.getElementById('theList');
		theList.removeChild(theList.getItemAtIndex(selected));
	}
};

torpedo.db.getSecond = function () {
	var theList = document.getElementById('theList');
	var secondSites = torpedo.prefs.getComplexValue("URLSecondList", Components.interfaces.nsISupportsString).data;
	var cutOut = [];
	var i = 0;
	while(secondSites.indexOf(",") >= 0){
		var split = secondSites.indexOf(",");
		cutOut[i] = secondSites.substring(0,split);
		secondSites = secondSites.substring(split+1, secondSites.length);
		i++;
	}
	for (i = 0; i < cutOut.length; i++) {
		var row = document.createElement('listitem');
	    row.setAttribute('label', cutOut[i]);
	    theList.appendChild(row);
	}
};

torpedo.db.select = function(index){
	selected = index;
};

torpedo.db.getDefaults = function (){
	var defaultList = document.getElementById('defaultList');
	var defaultSites = torpedo.prefs.getComplexValue("URLDefaultList", Components.interfaces.nsISupportsString).data;
	var cutOut = [];
	var i = 0;
	while(defaultSites.indexOf(",") >= 0){
		var split = defaultSites.indexOf(",");
		cutOut[i] = defaultSites.substring(0,split); 
		defaultSites = defaultSites.substring(split+1, defaultSites.length);
		i++;
	}
	for (i = 0; i < cutOut.length; i++) {
		var row = document.createElement('listitem');
	    row.setAttribute('label', cutOut[i]);
	    defaultList.appendChild(row);
	}
}