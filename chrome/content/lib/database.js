var torpedo = torpedo || {};
torpedo.db = torpedo.db || {};

torpedo.server = torpedo.server;

Components.utils.import("resource://gre/modules/Services.jsm");


torpedo.db.pushUrl = function (website) {
	var isRedirect = torpedo.functions.isRedirect(website);
	if (torpedo.db.inList(website, "URLDefaultList") && !isRedirect) {
		return 1;
	}
	else if (torpedo.db.inList(website, "URLSecondList") && !isRedirect) {
		return 2;
	}
	else if (torpedo.db.inList(website, "URLFirstList") && !isRedirect) {
		torpedo.db.putInsideSecond(website);
		return 3;
	}
	else {// if (!torpedo.db.inList(website, "CloudDomainList")) {
		torpedo.db.putInsideFirst(website);
		return 4;
	}
};

torpedo.db.inList = function (website, list) {
	if (torpedo.functions.isRedirect(website) || (list == "URLDefaultList" && (!torpedo.functions.isChecked("green")))) {
		return false;
	}
	var sites = torpedo.prefs.getStringPref(list);
	website = website.toLowerCase();
	if (sites.indexOf(website) != 0 && sites.charAt(sites.indexOf(website) - 1) != ',') {
		return false;
	}
	return (sites.indexOf(website) > -1);
};

torpedo.db.unknown = function (website) {
	if (!torpedo.db.inList(website, "URLDefaultList") && !torpedo.db.inList(website, "URLSecondList")) {
		return true;
	}
	return false;
};


torpedo.db.appendStringPref = function (appendStr, listName) {
	var listStr = torpedo.prefs.getStringPref(listName);
	var newListStr = listStr + appendStr + ",";
	torpedo.prefs.setStringPref(listName, newListStr);
};


torpedo.db.putInsideDefault = function (website) {
	torpedo.db.appendStringPref(website, "URLDefaultList");
};

torpedo.db.putInsideCloudDomains = function (website) {
	torpedo.db.appendStringPref(website, "CloudDomainList");
};

torpedo.db.putInsideSecond = function (url) {
	if (url == "add") {
		url = torpedo.currentDomain;
	}
	// put website into user list
	torpedo.db.appendStringPref(url, "URLSecondList");

	// delete website out of first clicked links
	var firstSites = torpedo.prefs.getStringPref("URLFirstList");
	var website = firstSites.substring(firstSites.indexOf(url), firstSites.indexOf(url) + url.length + 1);
	if (website.indexOf(",") >= 0) url = url + ",";

	str = firstSites.replace(url, "");
	torpedo.prefs.setStringPref("URLFirstList", str);
};

torpedo.db.putInsideFirst = function (website) {
	torpedo.db.appendStringPref(website, "URLFirstList");
};

torpedo.db.setReferrerSites = function (referrerDomain, referrerPath, referrerAttribute) {
	torpedo.server.setCharValue("torpedo.adv_redirectUrls", referrerDomain);
	torpedo.server.setCharValue("torpedo.adv_redirectUrls2", referrerPath);
	torpedo.server.setCharValue("torpedo.adv_redirectUrls3", referrerAttribute);
};


torpedo.db.getReferrerSites = function (server) {
	var referrer = {};
	referrer.domain = server.getCharValue("torpedo.adv_redirectUrls");
	referrer.path = server.getCharValue("torpedo.adv_redirectUrls2");
	referrer.attribute = server.getCharValue("torpedo.adv_redirectUrls3");
	return referrer;
};


secondList = [];
firstList = [];
newList = [];

torpedo.db.deleteSomeSecond = function () {
	var secondSites = torpedo.prefs.getStringPref("URLSecondList");
	var selected = document.getElementById('theList').selectedItem.label + ",";

	if (selected != null && secondSites.length > 0) {
		// cut selected element out of list of trustworthy domains
		var str = secondSites.replace(selected, "");
		torpedo.prefs.setStringPref("URLSecondList", str);
		torpedo.db.getSecond();
	}
};

torpedo.db.deleteCloudDomain = function () {
	var cloudDomains = torpedo.prefs.getStringPref("CloudDomainList");
	var selected = document.getElementById('cloudDomainList').selectedItem.label + ",";

	if (selected != null && cloudDomains.length > 0) {
		var str = cloudDomains.replace(selected, "");
		torpedo.prefs.setStringPref("CloudDomainList", str);
		torpedo.db.getCloudDomains();
	}
};

torpedo.db.deleteAllSecond = function () {
	var str = "";

	torpedo.prefs.setStringPref("URLSecondList", str);
	torpedo.prefs.setStringPref("URLFirstList", str);
};

torpedo.db.createRichList = function (listStr, docList) {
	list = listStr.split(",");
	list.sort();
	var i = 0;
	for (i = 0; i < list.length; i++) {
		var row = document.createElement('richlistitem');
		if (list[i].length > 0) {
			let newLabel = document.createElement("label");
			newLabel.value = list[i];

			row.appendChild(newLabel);
			docList.appendChild(row);
		}
	}
};

torpedo.db.getSecond = function () {
	torpedo.stringsBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties");
	document.getElementById('addEntryDialog').textContent = torpedo.stringsBundle.GetStringFromName('addentries');
	var secondSites = torpedo.prefs.getStringPref("URLSecondList");
	var theList = document.getElementById("theList");

	// remove all elements first
	while (theList.firstChild) theList.removeChild(theList.firstChild);

	// disable buttons
	document.documentElement.getButton("extra1").disabled = true;
	document.documentElement.getButton("accept").disabled = true;

	torpedo.db.createRichList(secondSites, theList);
	
	document.getElementById("deleteSecond").disabled = (document.getElementById("theList").itemCount == 0) ? true : false;
};

torpedo.db.getCloudDomains = function () {
	var cloudList = document.getElementById('cloudDomainList');
	var cloudDomains = torpedo.prefs.getStringPref("CloudDomainList");

	// remove all elements first
	while (cloudList.firstChild) cloudList.removeChild(cloudList.firstChild);

	document.documentElement.getButton("extra1").disabled = true;
	document.documentElement.getButton("accept").disabled = true;

	torpedo.db.createRichList(cloudDomains, cloudList);	
};


torpedo.db.getDefaults = function () {
	var defaultList = document.getElementById('defaultList');
	var defaultSites = torpedo.prefs.getStringPref("URLDefaultList");

	torpedo.db.createRichList(defaultSites, defaultList);
};


torpedo.db.restoreSettings = function () {
	var del = document.getElementById("defaultdelete").checked;
	torpedo.prefs.resetPrefs(del);
	return true;
};


torpedo.db.addEntries = function (type) {
	var addSites = document.getElementById("addEntries").value;
	var message = document.getElementById("errormessage");
	var error = document.getElementById("error");
	var panel = document.getElementById("addEntries");
	torpedo.stringsBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties");

	addSites.toLowerCase();
	addSites = addSites.replace(/\s+/g, '');
	addSites = addSites + ",";
	addList = [];
	var i = 0;
	var erase = true;
	var openpopup = false;
	while (addSites.indexOf(",") > 0) {
		var split = addSites.indexOf(",");
		var url = addSites.substring(0, split);
		addSites = addSites.substring(split + 1, addSites.length);
		if (url.length > 500) {
			erase = false;
			error.textContent = torpedo.stringsBundle.GetStringFromName('toolong');
			openpopup = true;
		}
		else {
			if (!url.startsWith("http")) url = "http://" + url;
			if (torpedo.functions.isURL(url)) {
				var split = url.indexOf("://");
				url = torpedo.functions.getDomainWithFFSuffix(url);
				if (torpedo.db.inList(url, "URLDefaultList")) {
					erase = false;
					error.textContent = torpedo.stringsBundle.GetStringFromName('alreadyInTrustedUrls');
					openpopup = true;
				}
				else if (torpedo.db.inList(url, "URLSecondList")) {
					erase = false;
					error.textContent = torpedo.stringsBundle.GetStringFromName('alreadyInUserDefinedDomains');
					openpopup = true;
				}
				else {
					addList[i] = url;
					i++;
				}
			}
			else {
				erase = false;
				error.textContent = torpedo.stringsBundle.GetStringFromName('nonValidUrl');
				openpopup = true;
			}
		}
		if (openpopup) {
			message.openPopup(panel, "before_start", 0, 0, false, false);
			setTimeout(function (e) {
				message.hidePopup();
			}, 4500);
			panel.select();
		}
	}
	for (i = 0; i < addList.length; i++) {
		if (addList[i].length > 0) {
			if (type == 'second') {
				torpedo.db.putInsideSecond(addList[i]);
			} else { torpedo.db.putInsideCloudDomains(addList[i]); }
		}
	}
	if (erase) panel.value = "";
	if (type == 'second') {
		torpedo.db.getSecond();
	} else {
		torpedo.db.getCloudDomains();
	}
};

torpedo.db.getSimilarOkDomainList = function () {
	var urlSecondSites = torpedo.prefs.getStringPref("URLSecondList");
	var urlSimilarDefaultSites = torpedo.prefs.getStringPref("URLSimilarDefaultList");
	var urlSimilarDefaultList = urlSimilarDefaultSites.split(",");

	var urlSecondListSitesSplit = urlSecondSites.split(",");

	for (var i = 0; i < urlSecondListSitesSplit.length; i++) {
		var domain = urlSecondListSitesSplit[i];
		var similarDomain = domain.replace("-", "");
		var regEx = /^[0-9]+$/;
		similarDomain = similarDomain.replace(regEx, "");

		if (similarDomain.length >= 4) urlSimilarDefaultList.push(similarDomain);
	}

	return urlSimilarDefaultList;
};

torpedo.db.getReferrer = function () {
	var referrerList = document.getElementById('referrerList');
	var sites = torpedo.server.getCharValue("torpedo.adv_redirectUrls");
	var sites2 = torpedo.server.getCharValue("torpedo.adv_redirectUrls2");
	var sites3 = torpedo.server.getCharValue("torpedo.adv_redirectUrls3");

	// remove all elements first
	while (referrerList.firstChild) referrerList.removeChild(referrerList.firstChild);

	// disable buttons
	document.getElementById("editReferrer").disabled = true;
	document.getElementById("addPart2").disabled = true;
	if ((sites !== "" && sites2 !== "" && sites3 !== "") && (sites !== null && sites2 !== null && sites3 !== null)) {
		sites = sites.split(",");
		sites2 = sites2.split(",");
		sites3 = sites3.split(",");

		//add main redirect
		var row = document.createElement('richlistitem');
		var cell = document.createElement('label');
		cell.setAttribute('value', sites[0] + sites2[0] + sites3[0]);
		cell.setAttribute('style', "color:blue");
		row.appendChild(cell);
		referrerList.appendChild(row);

		//add other redirects
		for (i = 1; i < sites.length - 1; i++) {
			var row = document.createElement('richlistitem');
			var cell = document.createElement('label');
			cell.setAttribute('value', sites[i] + sites2[i] + sites3[i]);
			row.appendChild(cell);
			referrerList.appendChild(row);

		}
	}
};

torpedo.db.addReferrer = function () {
	var add1 = document.getElementById("addPart1").value;
	var add2 = document.getElementById("addPart2").value;
	var add3 = document.getElementById("addPart3").value;

	var panel = document.getElementById("addPart3");
	var message = document.getElementById("errormessage");
	var error = document.getElementById("error");
	var openpopup = false;
	torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");

	if (add1 && add2 && add3) {
		var sites = torpedo.server.getCharValue("torpedo.adv_redirectUrls");
		var sites2 = torpedo.server.getCharValue("torpedo.adv_redirectUrls2");
		var sites3 = torpedo.server.getCharValue("torpedo.adv_redirectUrls3");

		add1.toLowerCase(); add2.toLowerCase(); add3.toLowerCase();
		add1 = add1.replace(/\s+/g, ''); add2 = add2.replace(/\s+/g, ''); add3 = add3.replace(/\s+/g, '');

		var alreadyInReferrerList = false;

		//check if list already contains redirect
		if (sites !== null && sites2 !== null && sites3 !== null) {
			var i = 0
			var alreadyInPart1Index = sites.split(",").indexOf(add1, i)
			while (alreadyInPart1Index !== -1) {
				alreadyInPart1Index = sites.split(",").indexOf(add1, i);
				if (sites2.split(",")[alreadyInPart1Index] == add2 && sites3.split(",")[alreadyInPart1Index] == add3) {
					alreadyInReferrerList = true;
					break;
				}
				i++;
			}
		} else {
			sites = " ";
			sites2 = " ";
			sites3 = " ";
		}
		if (!alreadyInReferrerList) {
			add1 = add1 + ",";
			add2 = add2 + ",";
			add3 = add3 + ",";

			var str = sites + add1;
			var str2 = sites2 + add2;
			var str3 = sites3 + add3;

			torpedo.db.setReferrerSites(str.replace(/\s+/g, ''), str2.replace(/\s+/g, ''), str3.replace(/\s+/g, ''));

			document.getElementById("addPart1").value = "";
			document.getElementById("addPart2").value = "";
			document.getElementById("addPart3").value = "";
			torpedo.db.getReferrer();
		} else {
			error.textContent = torpedo.stringsBundle.GetStringFromName('alreadyInReferrerList');
			openpopup = true;
		}

	} else {
		if (!add2) panel = document.getElementById("addPart2");
		if (!add1) panel = document.getElementById("addPart1");
		error.textContent = torpedo.stringsBundle.GetStringFromName('nonValidInput');
		openpopup = true;
	}
	if (openpopup) {
		message.openPopup(panel, "before_start", 0, 0, false, false);
		setTimeout(function (e) {
			message.hidePopup();
		}, 4500);
		panel.select();
	}
};

torpedo.db.deleteReferrer = function () {
	var referrerList = document.getElementById('referrerList');
	var del = referrerList.selectedIndex;

	if (del > -1) {
		var sites = torpedo.server.getCharValue("torpedo.adv_redirectUrls");
		var sites2 = torpedo.server.getCharValue("torpedo.adv_redirectUrls2");
		var sites3 = torpedo.server.getCharValue("torpedo.adv_redirectUrls3");
		sites = sites.split(",");
		sites.splice(del, 1);
		var str = sites.toString();
		sites2 = sites2.split(",");
		sites2.splice(del, 1);
		var str2 = sites2.toString();
		sites3 = sites3.split(",");
		sites3.splice(del, 1);
		var str3 = sites3.toString();

		torpedo.db.setReferrerSites(str, str2, str3);
		torpedo.db.getReferrer();
	}
};

torpedo.db.deleteAllReferrer = function () {

	var str = "";
	var str2 = "";
	var str3 = "";

	torpedo.db.setReferrerSites(str, str2, str3);

	torpedo.db.getReferrer();

};

torpedo.db.getDefaultReferrer = function () {
	var referrerDomain = "deref-gmx.net,deref-web-02.de,google.*,google.*,";
	var referrerPath = "/mail/client/[...]/dereferrer/?,/mail/client/[...]/dereferrer/?,/url?,/url?,";
	var referrerAttribute = "redirectUrl=,redirectUrl=,q=,url=,";
	torpedo.db.setReferrerSites(referrerDomain, referrerPath, referrerAttribute);
	torpedo.db.getReferrer();
};

torpedo.db.addMainRedirect = function () {
	var referrerList = document.getElementById('referrerList');
	var selectedReferrerIndex = referrerList.selectedIndex;

	if (selectedReferrerIndex > -1) {

		var referrer = torpedo.db.getReferrerSites(torpedo.server);

		var referrerDomainArr = referrer.domain.split(",");
		var referrerPathArr = referrer.path.split(",");
		var referrerAttributeArr = referrer.attribute.split(",");

		var referrerDomain = referrerDomainArr[selectedReferrerIndex] + ",";
		referrerDomainArr.splice(selectedReferrerIndex, 1);
		referrerDomain = referrerDomain + referrerDomainArr.toString();

		var referrerPath = referrerPathArr[selectedReferrerIndex] + ",";
		referrerPathArr.splice(selectedReferrerIndex, 1);
		referrerPath = referrerPath + referrerPathArr.toString();

		var referrerAttribute = referrerAttributeArr[selectedReferrerIndex] + ",";
		referrerAttributeArr.splice(selectedReferrerIndex, 1);
		referrerAttribute = referrerAttribute + referrerAttributeArr.toString();


		torpedo.db.setReferrerSites(referrerDomain, referrerPath, referrerAttribute);

		torpedo.db.getReferrer();
	}

};