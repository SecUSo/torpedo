var torpedo = torpedo || {};

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
    .getService(Components.interfaces.nsIConsoleService);

var torpedoStatus = {

    getSecurityStatus: function (url) {

        torpedo.currentURL = url;
        torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);

        var state = "0";
        var referrerURL = torpedoStatus.matchReferrer(torpedo.currentURL);

        while (referrerURL != "<NO_RESOLVED_REFERRER>") {
            torpedo.redirectURL = torpedo.currentURL;
            torpedo.currentURL = referrerURL;
            referrerURL = torpedoStatus.matchReferrer(torpedo.currentURL);
            torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(torpedo.currentURL);
            torpedo.numberGmxRedirects = torpedo.numberGmxRedirects + 1;
        }

        if (torpedo.functions.isRedirect(torpedo.currentURL)) {
            if (torpedo.prefs.getBoolPref("privacyMode")) {
                state = "DetermineUrlButton";
            } else {
                torpedo.functions.trace(torpedo.currentURL);
                return state;
            }
        } else if (torpedoBlacklist.inBlacklist(torpedo.currentDomain) && torpedo.functions.settingIsChecked("blacklistActivated")) {
            state = "T4";
        } else if (torpedoOptions.inList(torpedo.currentDomain, "URLDefaultList") && torpedo.functions.settingIsChecked("activatedGreenList")) {
            state = "T1";
        } else if (torpedoOptions.inList(torpedo.currentDomain, "URLSecondList")) {
            state = "T2";
        } else if (torpedo.progURL || torpedo.functions.isIP(torpedo.currentURL) || torpedo.hasTooltip) {
            state = "T33";
        } else if (torpedo.numberGmxRedirects == 0) {
            if (torpedo.functions.isMismatch(torpedo.baseDomain, torpedo.handler.title)) { // mismatch, domain extension is temporarily removed
                torpedo.currentURL = url;
                torpedo.currentDomain = torpedo.functions.getDomainWithFFSuffix(url);
                state = "T32";
            } else {
                state = "T31";
            }
        }
        else if (torpedo.numberGmxRedirects == 1 || torpedo.prefs.getBoolPref("redirectMode")) {
            if (torpedoStatus.matchesMainReferrer(torpedo.redirectURL) && !(torpedo.functions.isMismatch(torpedo.baseDomain, torpedo.handler.title) && torpedo.functions.isMismatch(torpedo.currentDomain, torpedo.handler.title))) {
                state = "T31"
            } else {
                state = "T32";
            }
        } else {
            state = "T32";
        }

        torpedo.texts.assignTexts(torpedo.currentURL, state);
        if (torpedo.prefs.getBoolPref("privacyMode")) {
            torpedo.functions.setHref(torpedo.currentURL, state);
        } else {
            torpedo.functions.setHref(torpedo.initialURL, state);
        }
        return state;
    },

    /**
	 * checks if the current url is a referrer 
	 * @param url
	 * @return resolved referrer or <NO_RESOLVED_REFERRER> if the current url is no referrer or there was an error 
	 */
    matchReferrer: function (url) {
        const href = new URL(url);
        var hostnameURL = href.hostname;

        var referrer = torpedoOptions.getReferrerSites(torpedo.message.folder.server);
        if (referrer.domain === null || referrer.path === null || !hostnameURL) {
            return "<NO_RESOLVED_REFERRER>";
        }

        var referrerDomainArr = referrer.domain;
        var referrerPathArr = referrer.path;
        var referrerAttributeArr = referrer.attribute;

        if (referrerDomainArr != "") {
            var indices = referrerDomainArr.map(function (element, i) {
                var domainParts = element.split("*").filter(String);
                return domainParts.every(function (el) {
                    return hostnameURL.includes(el);
                }, hostnameURL) ? i : '';
            }, hostnameURL).filter(String);

            for (var i = indices.length - 1; i >= 0; i--) {
                var ind = indices[i];
                var pathParts = referrerPathArr[ind].split("[...]").filter(String);
                for (path of pathParts) {
                    if (!url.includes(path)) {
                        indices = indices.splice(i, 1);
                        break;
                    }
                }
            }

            for (index of indices) {
                var cut = referrerAttributeArr[index];
                var urlAttrIndex = url.indexOf(cut);
                var temp = url.substring(urlAttrIndex + cut.length, url.length);
                temp = decodeURIComponent(temp);
                if (torpedo.functions.isURL(temp)) {
                    url = temp;
                    return url;
                }
            }
        }
        return "<NO_RESOLVED_REFERRER>";
    },

	/**
	 * checks if url matches main referrer in settings
	 * @param url
	 * @return {boolean}
	 */

    matchesMainReferrer: function (url) {

        const href = new URL(url);
        hostnameURL = href.hostname;

        var referrer = torpedoOptions.getReferrerSites(torpedo.message.folder.server);

        var referrerDomain = referrer.domain[0];
        var referrerPath = referrer.path[0];
        var referrerAttribute = referrer.attribute[0];

        if (referrerDomain === null || referrerPath === null || referrerAttribute == null || !hostnameURL) {
            return false;
        }

        referrerDomain = referrerDomain.split("*").filter(String);
        referrerPath = referrerPath.split("[...]").filter(String);

        var containsDomain = referrerDomain.every(function (el) {
            return hostnameURL.includes(el);
        }, hostnameURL);
        if (containsDomain) {
            var containsPath = referrerPath.every(function (el) {
                return url.includes(el);
            }, url);
            if (containsPath && url.includes(referrerAttribute)) {
                return true;
            }
        }
        return false;

    },

    /**
    * checks if the domain of the url is similar to a domain name in the green or blue list
    * @param url
    * @return {boolean}
    */

    isDomainExtension: function (url) {
        var domain = torpedo.functions.getDomainWithFFSuffix(url);
        var domainWithoutTLD = domain.split(".")[0];
        var similarOkDomainList = torpedoOptions.getSimilarOkDomainList();

        var okDomains = torpedo.prefs.getStringPref("URLDefaultList") + torpedo.prefs.getStringPref("URLSecondList");
        var okDomainList = okDomains.split(",");
        okDomainList = okDomainList.concat(similarOkDomainList);

        for (var j = 0; j < okDomainList.length; j++) {
            var okDomain = okDomainList[j];
            var okDomainSplit = okDomainList[j].split(".");
            var okDomainWithoutTLD = okDomainSplit[0];

            //check if a domain from the green, blue, or ok domain similar list was shortened and used in the link, e.g. immobilienscout.co.uk -> immobilienscout24.de
            if (okDomain.includes(domainWithoutTLD)) {
                var domainTLD = eTLDService.getPublicSuffixFromHost(domain);
                var domain2TLD = eTLDService.getPublicSuffixFromHost(okDomain);

                if (domainTLD != domain2TLD && domainTLD != "de" && domainTLD != "com") {
                    return true;
                }
            };
            // does the link domain include a domain name from the green/blue list or from the ok domain similar list, e.g google-shop includes google
            if (domain.includes(okDomainWithoutTLD) && okDomainWithoutTLD != "" && domainWithoutTLD != okDomainWithoutTLD) {
                return true;
            }
        }
        return false;
    },
}