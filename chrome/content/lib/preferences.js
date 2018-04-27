var torpedo = torpedo || {};
torpedo.installName = "torpedo@tu-darmstadt.de";

torpedo.prefs = function () {
	const contentPrefService = Components.classes["@mozilla.org/content-pref/service;1"]
                         .getService(Components.interfaces.nsIContentPrefService2);

    const prefManager =
        Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService)
            .getBranch("extensions.torpedo.");
		Components.utils.import("resource://gre/modules/AddonManager.jsm");
		AddonManager.getAddonByID(torpedo.installName, function(addon) {
			torpedo.installVersion = addon.version;
		});
    return {
        getBoolPref: prefManager.getBoolPref,
        getIntPref: prefManager.getIntPref,
        getStringPref: prefManager.getCharPref,
        setBoolPref: prefManager.setBoolPref,
        setIntPref: prefManager.setIntPref,
        setStringPref: prefManager.setCharPref,

        addonUninstallingListener: function ()
		{
			var listener =
			{
				onUninstalling: function(addon)
				{
					if (addon.id == torpedo.installName)
					{
						// It will be automatically removed if the default value is set
						torpedo.prefs.resetPrefs(true);
					}
				}
			};
			try
			{
				AddonManager.addAddonListener(listener);
			}
			catch (ex)
			{

			}
        },

		addonInstallingListener: function ()
				{
				var listener =
				{
				onInstalling: function(addon)
				{
					if (addon.id == torpedo.installName){
						prefManager.clearUserPref("firstrun");
					}
				}
				};
				try
				{
					Components.utils.import("resource://gre/modules/AddonManager.jsm");
					AddonManager.addAddonListener(listener);
				}
				catch (ex)
				{
				}
					},
		resetPrefs: function (all)
		{
      // reset all prefs manually
			if(all){
				prefManager.clearUserPref("URLSecondList");
				prefManager.clearUserPref("URLFirstList");
				prefManager.clearUserPref("URLRequestList");
				prefManager.clearUserPref("URLAnswerList");
				prefManager.clearUserPref("RedirectionList");
				prefManager.clearUserPref("redirectUrls");
				prefManager.clearUserPref("redirectUrls2");
			}
			prefManager.clearUserPref("firstrun");
			prefManager.clearUserPref("language");
			prefManager.clearUserPref("textsize");
			prefManager.clearUserPref("checkedTimer");
			prefManager.clearUserPref("blockingTimer");
			prefManager.clearUserPref("checkedGreenList");
			prefManager.clearUserPref("activatedGreenList");
			prefManager.clearUserPref("activatedOrangeList");
			prefManager.clearUserPref("redirection0");
			prefManager.clearUserPref("redirection1");
			prefManager.clearUserPref("redirection2");
			prefManager.clearUserPref("URLDefaultList");
		}
  };
}();
