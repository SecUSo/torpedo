var torpedo = torpedo || {};
torpedo.installName = "torpedo@tu-darmstadt.de";

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);

var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
	.getService(Components.interfaces.nsIMsgAccountManager);

Components.utils.import("resource://gre/modules/AddonManager.jsm");

Components.utils.import("resource://gre/modules/Services.jsm");


torpedo.prefs = function () {
	const contentPrefService = Components.classes["@mozilla.org/content-pref/service;1"]
		.getService(Components.interfaces.nsIContentPrefService2);


	const prefManager =
		Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.torpedo.");


	AddonManager.getAddonByID(torpedo.installName).then(function (addon) {
		torpedo.installVersion = addon.version;

	});

	return {
		getBoolPref: prefManager.getBoolPref,
		getIntPref: prefManager.getIntPref,
		getStringPref: prefManager.getCharPref,
		setBoolPref: prefManager.setBoolPref,
		setIntPref: prefManager.setIntPref,
		setStringPref: prefManager.setCharPref,

		addonUninstallingListener: function () {
			var listener =
			{
				onUninstalling: function (addon) {
					if (addon.id == torpedo.installName) {
						// It will be automatically removed if the default value is set
						torpedo.prefs.resetPrefs(true);
						torpedo.prefs.resetBlacklistPrefs();
						torpedo.dialogmanager.deleteDB();
					}

				}
			};
			try {
				AddonManager.addAddonListener(listener);
			}
			catch (ex) {

			}
		},

		addonInstallingListener: function () {
			var listener =
			{
				onInstalling: function (addon) {
					if (addon.id == torpedo.installName) {
						prefManager.clearUserPref("firstrun");
						torpedo.prefs.resetReferrer();
					}
				}
			};
			try {
				ChromeUtils.import("resource://gre/modules/AddonManager.jsm");
				AddonManager.addAddonListener(listener);
			}
			catch (ex) {
			}
		},
		resetReferrer: function () {
			var accounts = acctMgr.accounts;
			for (var i = 0; i < accounts.length; i++) {
				var account = accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount);
				account.incomingServer.setCharValue("torpedo.adv_redirectUrls", "deref-gmx.net,deref-web-02.de,google.*,google.*,");
				account.incomingServer.setCharValue("torpedo.adv_redirectUrls2", "/mail/client/[...]/dereferrer/?,/mail/client/[...]/dereferrer/?,/url?,/url?,");
				account.incomingServer.setCharValue("torpedo.adv_redirectUrls3", "redirectUrl=,redirectUrl=,q=,url=,");
			}
		},

		resetBlacklistPrefs: function () {
			prefManager.clearUserPref("lastCtcBlacklistRequest");
			prefManager.clearUserPref("blacklistWasUpdated");
			prefManager.clearUserPref("blacklistIsReady");
			prefManager.clearUserPref("currentCtcBlacklistVersion");

		},
		resetPrefs: function (all) {
			// reset all prefs manually
			if (all) {
				prefManager.clearUserPref("URLSecondList");
			}
			prefManager.clearUserPref("URLFirstList");
			prefManager.clearUserPref("URLRequestList");
			prefManager.clearUserPref("URLAnswerList");
			prefManager.clearUserPref("CloudDomainList");
			prefManager.clearUserPref("RedirectionList");
			prefManager.clearUserPref("firstrun");
			prefManager.clearUserPref("language");
			prefManager.clearUserPref("textsize");
			prefManager.clearUserPref("checkedTimer");
			prefManager.clearUserPref("blockingTimer");
			prefManager.clearUserPref("activatedGreenList");
			prefManager.clearUserPref("blacklistActivated");
			prefManager.clearUserPref("greenListDelayActivated");
			prefManager.clearUserPref("blueListDelayActivated");
			prefManager.clearUserPref("redirectMode");
			prefManager.clearUserPref("blueListDelayActivated");
			//prefManager.clearUserPref("CloudDomainList");
		},
	};
}();