var torpedo = torpedo || {};

torpedo.prefs = function () {
	const contentPrefService = Components.classes["@mozilla.org/content-pref/service;1"]
                         .getService(Components.interfaces.nsIContentPrefService);
	
    const prefManager =
        Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService)
            .getBranch("extensions.torpedo.");
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
			if(all)prefManager.clearUserPref("firstrun");
			prefManager.clearUserPref("blockingTimer");
			prefManager.clearUserPref("checkedGreenList");
			prefManager.clearUserPref("activatedGreenList");
			prefManager.clearUserPref("activatedOrangeList");
			prefManager.clearUserPref("redirection0");
			prefManager.clearUserPref("redirection1");
			prefManager.clearUserPref("redirection2");
			prefManager.clearUserPref("URLDefaultList");
			if(all)prefManager.clearUserPref("URLSecondList");
			if(all)prefManager.clearUserPref("URLFirstList");
		}		
    };
}();
