var torpedo = torpedo || {};
torpedoOptions = torpedoOptions || {};

torpedo.server = torpedo.server || {};

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);

Components.utils.import("resource://gre/modules/Services.jsm");


var torpedoOptions = {

	blacklistDomains: null,


	/**
	 * set referrer preferences
	 * @param {String} referrerDomain 
	 * @param {String} referrerPath 
	 * @param {String} referrerAttribute 
	 */
	setReferrerSites: function (referrerDomain, referrerPath, referrerAttribute) {
		torpedo.server.setCharValue("torpedo.adv_redirectUrls", referrerDomain);
		torpedo.server.setCharValue("torpedo.adv_redirectUrls2", referrerPath);
		torpedo.server.setCharValue("torpedo.adv_redirectUrls3", referrerAttribute);
	},


	/**
	 * get referrer from preferences
	 * @param server
	 * @return {object} referrer 
	 */
	getReferrerSites: function (server) {
		var referrer = {};
		referrer.domain = server.getCharValue("torpedo.adv_redirectUrls");
		referrer.path = server.getCharValue("torpedo.adv_redirectUrls2");
		referrer.attribute = server.getCharValue("torpedo.adv_redirectUrls3");

		if (referrer.domain && referrer.path && referrer.attribute) {
			referrer.domain = referrer.domain.split(",").filter(String);
			referrer.path = referrer.path.split(",").filter(String);
			referrer.attribute = referrer.attribute.split(",").filter(String);
		} else {
			referrer.domain = "";
			referrer.path = "";
			referrer.attribute = "";
		}
		return referrer;
	},

	addToClickedList: function (domain) {
		var isRedirect = torpedo.functions.isRedirect(domain);
		if (!torpedoOptions.inList(domain, "URLDefaultList") && !torpedoOptions.inList(domain, "URLSecondList") && !isRedirect) {
			if (torpedoOptions.inList(domain, "URLFirstList")) {
				torpedoOptions.addToSecond(domain);
			}
			else {
				torpedoOptions.appendStringPref(domain, "URLFirstList");
			}
		}
	},

	getStringAlreadyInList: function (domain, listArr) {
		for (list of listArr) {
			if (torpedoOptions.inList(domain, list)) {
				return torpedo.stringsBundle.GetStringFromName('alreadyIn' + list);
			}
		}
		return "<IN_NO_LIST>";
	},

	/**
	 * checks if a domain is in a list of preferences
	 * @param {String} domain 
	 * @param {String} listName name of the list in prefs.js to be checked
	 */
	inList: function (domain, listName) {
		var sites = torpedo.prefs.getStringPref(listName).split(",");
		domain = domain.toLowerCase();

		return sites.indexOf(domain) > -1;
	},

	/**
	 * append a string to a list of preferences
	 * @param {String} appendStr string to be appended
	 * @param {String} listName name of the list in prefs.js to which the string should be appended 
	 */
	appendStringPref: function (appendStr, listName) {
		var listStr = torpedo.prefs.getStringPref(listName);

		if (listStr != "" && listStr != null) {
			listStr = listStr + ",";
		}
		var newListStr = listStr + appendStr;
		torpedo.prefs.setStringPref(listName, newListStr);
	},

	removeStringFromList: function (string, listName) {
		var listArr = torpedo.prefs.getStringPref(listName).split(",");
		var deleteIndex = listArr.indexOf(string);

		if (deleteIndex > -1) {
			listArr.splice(deleteIndex, 1);
			var listStr = listArr.toString();
			torpedo.prefs.setStringPref(listName, listStr);
		}
	},

	createRichListItem: function (labelValue, labelStyle) {
		var row = document.createElement('richlistitem');

		let newLabel = document.createElement("label");
		newLabel.value = labelValue;

		if (labelStyle != "<NONE>") {
			newLabel.setAttribute('style', labelStyle);
		}
		row.appendChild(newLabel);
		return row;
	},

	createRichList: function (listStr, docList) {
		list = listStr.split(",");
		list.sort();
		for (var i = 0; i < list.length; i++) {
			if (list[i].length > 0) {
				var row = torpedoOptions.createRichListItem(list[i], "<NONE>");
				docList.appendChild(row);
			}
		}
	},


	displayReferrer: function () {
		var referrerList = document.getElementById('referrerList');
		var referrer = torpedoOptions.getReferrerSites(torpedo.server);

		// remove all elements first
		while (referrerList.firstChild) referrerList.removeChild(referrerList.firstChild);

		// disable buttons
		document.getElementById("editReferrer").disabled = true;
		document.getElementById("addPart2").disabled = true;
		if (referrer.domain && referrer.path && referrer.attribute) {

			//add main redirect
			var mainReferrerLabel = referrer.domain[0] + referrer.path[0] + referrer.attribute[0];
			var mainReferrerRow = torpedoOptions.createRichListItem(mainReferrerLabel, "color:blue");
			referrerList.appendChild(mainReferrerRow);

			//add other redirects
			for (i = 1; i < referrer.domain.length; i++) {
				var referrerLabel = referrer.domain[i] + referrer.path[i] + referrer.attribute[i];
				var row = torpedoOptions.createRichListItem(referrerLabel, "<NONE>");
				referrerList.appendChild(row);

			}
		}
	},

	displaySecond: function () {
		torpedo.stringsBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties");

		document.getElementById('addEntryDialog').textContent = torpedo.stringsBundle.GetStringFromName('addentries');

		var secondSites = torpedo.prefs.getStringPref("URLSecondList");
		var theList = document.getElementById("theList");

		// remove all elements first
		while (theList.firstChild) theList.removeChild(theList.firstChild);

		// disable buttons
		document.documentElement.getButton("extra1").disabled = true;
		document.documentElement.getButton("accept").disabled = true;

		torpedoOptions.createRichList(secondSites, theList);

		document.getElementById("deleteSecond").disabled = (document.getElementById("theList").itemCount == 0) ? true : false;
	},

	displayCloudDomains: function () {

		var cloudDomains = torpedo.prefs.getStringPref("CloudDomainList");
		var cloudList = document.getElementById('cloudDomainList');

		// remove all elements first
		while (cloudList.firstChild) cloudList.removeChild(cloudList.firstChild);

		document.documentElement.getButton("extra1").disabled = true;
		document.documentElement.getButton("accept").disabled = true;

		torpedoOptions.createRichList(cloudDomains, cloudList);
	},


	displayDefaults: function () {
		var defaultList = document.getElementById('defaultList');
		var defaultSites = torpedo.prefs.getStringPref("URLDefaultList");

		torpedoOptions.createRichList(defaultSites, defaultList);
	},


	restoreSettings: function () {
		var resetAll = document.getElementById("defaultdelete").checked;
		torpedo.prefs.resetPrefs(resetAll);
		return true;
	},


	getDefaultReferrer: function () {
		var referrerDomain = "deref-gmx.net,deref-web-02.de,google.*,google.*";
		var referrerPath = "/mail/client/[...]/dereferrer/?,/mail/client/[...]/dereferrer/?,/url?,/url?";
		var referrerAttribute = "redirectUrl=,redirectUrl=,q=,url=";
		torpedoOptions.setReferrerSites(referrerDomain, referrerPath, referrerAttribute);
		torpedoOptions.displayReferrer();
	},

	addToSecond: function (url) {
		// put website into user list
		torpedoOptions.appendStringPref(url, "URLSecondList");

		// delete website out of first clicked links
		torpedoOptions.removeStringFromList(url, "URLFirstList");
	},


	addEntries: function (list) {
		var addSites = document.getElementById("addEntries").value;
		var message = document.getElementById("errormessage");
		var error = document.getElementById("error");
		var panel = document.getElementById("addEntries");
		torpedo.stringsBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties");

		addSites.toLowerCase();
		addSites = addSites.replace(/\s+/g, '').split(",");
		var openpopup = false;
		var listsToBeChecked = ["URLDefaultList", "URLSecondList", "RedirectionList"];

		for (var i = 0; i < addSites.length; i++) {
			var url = addSites[i];

			if (!url.startsWith("http")) url = "http://" + url;
			if (torpedo.functions.isURL(url)) {
				var domain = torpedo.functions.getDomainWithFFSuffix(url);
				var alreadyInList = torpedoOptions.getStringAlreadyInList(domain, listsToBeChecked);

				if (alreadyInList == "<IN_NO_LIST>") {
					if (list == 'URLSecondList') {
						torpedoOptions.addToSecond(domain);
					} else {
						torpedoOptions.appendStringPref(domain, list);
					}
				} else {
					error.textContent = alreadyInList;
					openpopup = true;
				}
			}
			else {
				error.textContent = torpedo.stringsBundle.GetStringFromName('nonValidUrl');
				openpopup = true;
			}
		}
		if (openpopup) {
			torpedoOptions.displayPopup(message, panel, 4500);
			panel.select();
		} else {
			panel.value = "";
		}

		if (list == 'URLSecondList') {
			torpedoOptions.displaySecond();
		} else if (list == 'RedirectionList') {
			torpedo.redirect.displayRedirects();
		} else if (list == 'CloudDomainList') {
			torpedoOptions.displayCloudDomains();
		}
	},


	addReferrer: function () {
		var add1 = document.getElementById("addPart1").value;
		var add2 = document.getElementById("addPart2").value;
		var add3 = document.getElementById("addPart3").value;

		var panel = document.getElementById("addPart3");
		var message = document.getElementById("errormessage");
		var error = document.getElementById("error");
		var openpopup = false;
		torpedo.stringsBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties");

		if (add1 && add2 && add3) {
			var referrer = torpedoOptions.getReferrerSites(torpedo.server);

			add1.toLowerCase(); add2.toLowerCase(); add3.toLowerCase();
			add1 = add1.replace(/\s+/g, ''); add2 = add2.replace(/\s+/g, ''); add3 = add3.replace(/\s+/g, '');

			var alreadyInReferrerList = false;

			//check if list already contains redirect
			if (referrer.domain !== "" && referrer.path !== "" && referrer.attribute !== "") {
				for (var i = 0; i < referrer.domain.length; i++) {
					if (referrer.domain[i].indexOf(add1) > -1 && referrer.path[i].indexOf(add2) > -1 && referrer.attribute.indexOf(add3) > -1) {
						alreadyInReferrerList = true;
						error.textContent = torpedo.stringsBundle.GetStringFromName('alreadyInReferrerList');
						openpopup = true;
						break;
					}
				}
				if (!alreadyInReferrerList) {
					add1 = referrer.domain.toString() + "," + add1;
					add2 = referrer.path + "," + add2;
					add3 = referrer.attribute + "," + add3;
					torpedoOptions.setReferrerSites(add1.replace(/\s+/g, ''), add2.replace(/\s+/g, ''), add3.replace(/\s+/g, ''));
				}
			} else {
				torpedoOptions.setReferrerSites(add1, add2, add3);
			}

			document.getElementById("addPart1").value = "";
			document.getElementById("addPart2").value = "";
			document.getElementById("addPart3").value = "";
			torpedoOptions.displayReferrer();

		} else {
			if (!add2) panel = document.getElementById("addPart2");
			if (!add1) panel = document.getElementById("addPart1");
			error.textContent = torpedo.stringsBundle.GetStringFromName('nonValidInput');
			openpopup = true;
		}
		if (openpopup) {
			torpedoOptions.displayPopup(message, panel, 4500);
			panel.select();
		}
	},



	addMainReferrer: function () {
		var referrerList = document.getElementById('referrerList');
		var selectedReferrerIndex = referrerList.selectedIndex;

		if (selectedReferrerIndex > -1) {

			var referrer = torpedoOptions.getReferrerSites(torpedo.server);

			var referrerDomain = referrer.domain[selectedReferrerIndex] + ",";
			referrer.domain.splice(selectedReferrerIndex, 1);
			referrerDomain = referrerDomain + referrer.domain.toString();

			var referrerPath = referrer.path[selectedReferrerIndex] + ",";
			referrer.path.splice(selectedReferrerIndex, 1);
			referrerPath = referrerPath + referrer.path.toString();

			var referrerAttribute = referrer.attribute[selectedReferrerIndex] + ",";
			referrer.attribute.splice(selectedReferrerIndex, 1);
			referrerAttribute = referrerAttribute + referrer.attribute.toString();


			torpedoOptions.setReferrerSites(referrerDomain, referrerPath, referrerAttribute);

			torpedoOptions.displayReferrer();
		}
	},

	deleteReferrer: function () {
		var referrerList = document.getElementById('referrerList');
		var del = referrerList.selectedIndex;

		if (del > -1) {

			var referrer = torpedoOptions.getReferrerSites(torpedo.server);

			referrer.domain.splice(del, 1);
			var referrerDomainStr = referrer.domain.toString();

			referrer.path.splice(del, 1);
			var referrerPathStr = referrer.path.toString();

			referrer.attribute.splice(del, 1);
			var referrerAttributeStr = referrer.attribute.toString();

			torpedoOptions.setReferrerSites(referrerDomainStr, referrerPathStr, referrerAttributeStr);
			torpedoOptions.displayReferrer();
		}
	},


	deleteSomeSecond: function () {
		var secondSites = torpedo.prefs.getStringPref("URLSecondList");
		var selected = document.getElementById('theList').selectedItem.label;

		if (selected != null && secondSites.length > 0) {
			// cut selected element out of list of trustworthy domains
			torpedoOptions.removeStringFromList(selected, "URLSecondList");
			torpedoOptions.displaySecond();
		}
	},

	deleteCloudDomain: function () {
		var cloudDomains = torpedo.prefs.getStringPref("CloudDomainList");
		var selected = document.getElementById('cloudDomainList').selectedItem.label;

		if (selected != null && cloudDomains.length > 0) {
			torpedoOptions.removeStringFromList(selected, "CloudDomainList");
			torpedoOptions.displayCloudDomains();
		}
	},

	deleteAllSecond: function () {
		var str = "";

		torpedo.prefs.setStringPref("URLSecondList", str);
		torpedo.prefs.setStringPref("URLFirstList", str);
	},

	deleteAllReferrer: function () {
		var str = "";
		var str2 = "";
		var str3 = "";

		torpedoOptions.setReferrerSites(str, str2, str3);
		torpedoOptions.displayReferrer();
	},

	getSimilarOkDomainList: function () {
		var urlSecondSites = torpedo.prefs.getStringPref("URLSecondList");
		var urlSecondListSitesSplit = urlSecondSites.split(",");

		var urlSimilarDefaultSites = torpedo.prefs.getStringPref("URLSimilarDefaultList");
		var urlSimilarDefaultList = urlSimilarDefaultSites.split(",");

		for (var i = 0; i < urlSecondListSitesSplit.length; i++) {
			var domain = urlSecondListSitesSplit[i];
			var similarDomain = domain.replace("-", "");
			var regEx = /^[0-9]+$/;
			similarDomain = similarDomain.replace(regEx, "");

			if (similarDomain.length >= 4) urlSimilarDefaultList.push(similarDomain);
		}
		return urlSimilarDefaultList;
	},

	/**
	  * opens a popup and closes it after some time
	  * @param message 
	  * @param panel 
	  * @param time time after the popup should be closed
	  */

	displayPopup: function (message, panel, time) {
		message.openPopup(panel, "before_start", 0, 0, false, false);
		setTimeout(function (e) {
			message.hidePopup();
		}, time);
	}
}
