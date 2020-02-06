Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

  function TorpedoAccountManagerExtension() {}; 
  
  TorpedoAccountManagerExtension.prototype = 
  {
    name : "torpedo-account",
    chromePackageName : "torpedo",
    showPanel: function(server) 
    {
        return true;
    },
    QueryInterface: ChromeUtils.generateQI([
      Components.interfaces.nsIMsgAccountManagerExtension
    ]),
	_xpcom_categories: [{
		category: "mailnews-accountmanager-extensions",
		entry: "Torpedo Account Manager Extension",
		service: false
	}],
   };
   
TorpedoAccountManagerExtension.prototype.classID = Components.ID("{C1441ACE-1836-11E9-BF6B-382C69511AEB}");
TorpedoAccountManagerExtension.prototype.classDescription = "Torpedo Account Manager Extension";
TorpedoAccountManagerExtension.prototype.contractID = "@mozilla.org/accountmanager/extension;1?name=torpedo-account";

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([TorpedoAccountManagerExtension]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([TorpedoAccountManagerExtension]);