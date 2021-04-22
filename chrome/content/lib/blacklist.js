var torpedo = torpedo || {};


var torpedoBlacklist = {

	blacklistArr: [],

	setBlacklistArray: function (blacklistDomainsArr) {
		torpedoBlacklist.blacklistArr = blacklistDomainsArr;
	},

	getBlacklistArray: function () {
		return torpedoBlacklist.blacklistArr;
	},

	inBlacklist: function (domain) {
		if (torpedo.prefs.getBoolPref("blacklistIsReady")) {
			var blacklistDomainArr = torpedoBlacklist.getBlacklistArray();
			if(blacklistDomainArr.length > 0) {
				domain.toLowerCase();
				return blacklistDomainArr.indexOf(domain) > -1;
			}
		}
		return false;
	},

	calcTimeSinceLastRequest: function () {
		var currentTime = new Date().getTime();
		var lastCtcBlacklistRequest = torpedo.prefs.getStringPref("lastCtcBlacklistRequest");
		var lastCtcBlacklistRequestInMilisecs = Date.parse(lastCtcBlacklistRequest);
		return currentTime - lastCtcBlacklistRequestInMilisecs;
	},

	initBlacklist: async function (blacklistDomainArr) {
		if (blacklistDomainArr.length > 0) {
			DB.updateBlacklist(blacklistDomainArr).then(function () {
				torpedo.prefs.setBoolPref("blacklistWasUpdated", true);
			});
			torpedoBlacklist.setBlacklistArray(blacklistDomainArr);
			torpedo.prefs.setBoolPref("blacklistIsReady", true);
		} else {
			var blacklistArr = await DB.getBlacklistDomains();
			if(blacklistArr.length > 0) {
				blacklistArr.then(function (blacklistDomains) {
					torpedoBlacklist.setBlacklistArray(blacklistDomains);
					torpedo.prefs.setBoolPref("blacklistIsReady", true);
				});
			}
		}
	},

	// request Blacklist from cyberthreatcoalition.org, after request start initBlacklist() method
	readInBlacklist: function () {
		this.requestBlacklist(this.initBlacklist);
		torpedo.prefs.setBoolPref("blacklistWasUpdated", false);
	},

	// Method for reading in the blacklist
	requestBlacklist: function (callback) {
		var blacklistDomainArr = [];

		var currentCtcBlacklistVersion = torpedo.prefs.getIntPref("currentCtcBlacklistVersion");

		var currentTime = new Date().toUTCString();

		torpedo.prefs.setStringPref("lastCtcBlacklistRequest", currentTime);
		var ctcBlacklistRequest = new XMLHttpRequest();
		ctcBlacklistRequest.open('GET', 'https://blocklist.cyberthreatcoalition.org/vetted/domain.txt', true);
		ctcBlacklistRequest.setRequestHeader("If-Modified-Since", currentCtcBlacklistVersion);
		ctcBlacklistRequest.send(null);
		
		ctcBlacklistRequest.onload = function () {
			if (ctcBlacklistRequest.status === 200) {
				var contentType = ctcBlacklistRequest.getResponseHeader('Content-Type');
				if (contentType == "text/plain") {
					var blackListDomainSet = new Set();
					// Read in text line by line (each line is one domain in file) and create array
					var extractedLines = ctcBlacklistRequest.responseText.split('\n');
					// Investigate each line whether it is a well formed domain and if yes, put it into array dangerousDomains
					for (var i = 1; i < extractedLines.length - 1; i++) {
						if (extractedLines[i].length <= 253) {
							var domainWithoutSpaces = extractedLines[i].replace(/(\r\n|\n|\r)/gm, "");
							domainWithoutSpaces = torpedo.functions.getDomainWithFFSuffix(domainWithoutSpaces);
							blackListDomainSet.add(domainWithoutSpaces);
						}
					}
					blacklistDomainArr = Array.from(blackListDomainSet);
					torpedo.prefs.setIntPref("currentCtcBlacklistVersion", currentCtcBlacklistVersion);
				}
			}
		}

		ctcBlacklistRequest.onloadend = function () {
			callback.apply(this, [blacklistDomainArr]);
		}

	}
}