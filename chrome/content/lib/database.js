var torpedo = torpedo || {};
torpedo.db = torpedo.db || {};


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
	var sites = torpedo.prefs.getStringPref(list);
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

	var defaultSites = torpedo.prefs.getStringPref("URLDefaultList");
	str.data = defaultSites + website + ",";
	torpedo.prefs.setStringPref("URLDefaultList", str);
};

torpedo.db.putInsideSecond = function(url){
	var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	if(url=="add"){
		url = torpedo.baseDomain;
	}
	// put website into user list
	var secondSites = torpedo.prefs.getStringPref("URLSecondList");
	str.data = secondSites + url + ",";
	torpedo.prefs.setStringPref("URLSecondList", str);
	
	// delete website out of first clicked links
	var firstSites = torpedo.prefs.getStringPref("URLFirstList");
	var website = firstSites.substring(firstSites.indexOf(url), firstSites.indexOf(url)+url.length+1);
	if(website.indexOf(",") >= 0) url = url + ",";

	str.data = firstSites.replace(url, "");
	torpedo.prefs.setStringPref("URLFirstList", str);
};

torpedo.db.putInsideFirst = function(website){
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

	var firstSites = torpedo.prefs.getStringPref("URLFirstList");
	str.data = firstSites + "," +  website;
	torpedo.prefs.setStringPref("URLFirstList", str);
};

secondList = [];
firstList = [];
newList = [];

torpedo.db.deleteSomeSecond = function () {
	var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	var secondSites = torpedo.prefs.getStringPref("URLSecondList");
	var selected = document.getElementById('theList').selectedItem.label + ",";

	if(selected != null && secondSites.length > 0){
		// cut selected element out of list of trustworthy domains
		str.data = secondSites.replace(selected, "");
		torpedo.prefs.setStringPref("URLSecondList", str);
		torpedo.db.getSecond();
	}
};

torpedo.db.deleteAllSecond = function () {
	var str = Components.classes["@mozilla.org/supports-string;1"]
		      .createInstance(Components.interfaces.nsISupportsString);

    str.data = "";
	torpedo.prefs.setStringPref("URLSecondList", str);
	torpedo.prefs.setStringPref("URLFirstList", str);
};

torpedo.db.getSecond = function () {
	torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");
  document.getElementById('addEntryDialog').textContent = torpedo.stringsBundle.getString('addentries');
	var secondSites = torpedo.prefs.getStringPref("URLSecondList");
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
 	document.getElementById("deleteSecond").disabled = 	(document.getElementById("theList").itemCount == 0)? true:false;
};

torpedo.db.getDefaults = function (){
	var defaultList = document.getElementById('defaultList');
	var defaultSites = torpedo.prefs.getStringPref("URLDefaultList");
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

torpedo.db.getReferrer = function (){
	var referrerList = document.getElementById('referrerList');
	var referrerList2 = document.getElementById('referrerList2');
	var sites = torpedo.prefs.getStringPref("redirectUrls");
	var sites2 = torpedo.prefs.getStringPref("redirectUrls2");

	// remove all elements first
	while (referrerList.firstChild) referrerList.removeChild(referrerList.firstChild);
	while (referrerList2.firstChild) referrerList2.removeChild(referrerList2.firstChild);

	// disable buttons
	document.getElementById("editReferrer").disabled = true;
	document.getElementById("addPart2").disabled = true;

	sites = sites.split(",");
	sites2 = sites2.split(",");


	for (i = 0; i < sites.length-1; i++) {
		var row = document.createElement('richlistitem');
    var cell = document.createElement('label');
    cell.setAttribute('value', sites[i]);
    row.appendChild(cell);
		referrerList.appendChild(row);

		row = document.createElement('richlistitem');
    cell = document.createElement('label');
    cell.setAttribute('value', sites2[i]);
    row.appendChild(cell);
		referrerList2.appendChild(row);
	}
};

torpedo.db.addReferrer = function (){
	var add1 = document.getElementById("addPart1").value;
	var add2 = document.getElementById("addPart2").value;
	if(add1){
		add1.toLowerCase();	add2.toLowerCase();
		add1 = add1.replace(/\s+/g, ''); add2 = add2.replace(/\s+/g, '');
		add1 = add1 + ",";
		add2 = add2 + ",";

		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var str2 = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var sites = torpedo.prefs.getStringPref("redirectUrls");
		var sites2 = torpedo.prefs.getStringPref("redirectUrls2");
		str.data = sites+add1;
		torpedo.prefs.setStringPref("redirectUrls", str);
		str2.data = sites2+add2;;
		torpedo.prefs.setStringPref("redirectUrls2", str2);

		document.getElementById("addPart1").value = "";
		document.getElementById("addPart2").value = "";
		torpedo.db.getReferrer();
	}
};

torpedo.db.deleteReferrer = function (){
	var referrerList = document.getElementById('referrerList');
	var referrerList2 = document.getElementById('referrerList2');
	var del = referrerList.selectedIndex > -1 ? referrerList.selectedIndex : referrerList2.selectedIndex;

	if(del > -1){
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var str2 = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var sites = torpedo.prefs.getStringPref("redirectUrls");
		var sites2 = torpedo.prefs.getStringPref("redirectUrls2");
		sites = sites.split(",");
		sites.splice(del,1);
		str.data = sites.toString();
		sites2 = sites2.split(",");
		sites2.splice(del,1);
		str2.data = sites2.toString();
		torpedo.prefs.setStringPref("redirectUrls", str);
		torpedo.prefs.setStringPref("redirectUrls2", str2);
		torpedo.db.getReferrer();
	}
};

torpedo.db.deleteAllReferrer = function (){
	var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	var str2 = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	str.data = "";
	str2.data = "";
	torpedo.prefs.setStringPref("redirectUrls", str);
	torpedo.prefs.setStringPref("redirectUrls2", str2);

	torpedo.db.getReferrer();
};

torpedo.db.restoreSettings = function(){
	var del = document.getElementById("defaultdelete").checked;
	torpedo.prefs.resetPrefs(del);
	return true;
};

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
				url = torpedo.functions.getDomainWithFFSuffix(url);
				if(torpedo.db.inList(url, "URLDefaultList")){
					erase = false;
					error.textContent = torpedo.stringsBundle.getString('alreadyInTrustedUrls');
					openpopup = true;
				}
				else if(torpedo.db.inList(url,"URLSecondList")){
					erase = false;
					error.textContent = torpedo.stringsBundle.getString('alreadyInUserDefinedDomains');
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
		    torpedo.db.putInsideSecond(addList[i]);
	    }
	}
	if(erase) panel.value = "";
	torpedo.db.getSecond();
};
