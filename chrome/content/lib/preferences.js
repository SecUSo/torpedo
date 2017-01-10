var torpedo = torpedo || {};

torpedo.prefs = function () {
	const contentPrefService = Components.classes["@mozilla.org/content-pref/service;1"]
                         .getService(Components.interfaces.nsIContentPrefService);

    const prefManager =
        Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService)
            .getBranch("extensions.torpedo.");
		//AddonManager.getAddonByID("torpedo@tu-darmstadt.de", function(addon) {
		//	Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication).console.log("My extension's version is " + addon.version);
		//});
    return {
        getBoolPref: prefManager.getBoolPref,
        getIntPref: prefManager.getIntPref,
        getStringPref: prefManager.getCharPref,
        getComplexValue: prefManager.getComplexValue,
        setBoolPref: prefManager.setBoolPref,
        setIntPref: prefManager.setIntPref,
        setStringPref: prefManager.setCharPref,
        setComplexValue: prefManager.setComplexValue,

        addonUninstallingListener: function ()
		{
			var listener =
			{
				onUninstalling: function(addon)
				{
					if (addon.id == "torpedo@tu-darmstadt.de")
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
					if (addon.id == "torpedo@tu-darmstadt.de"){
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
