var torpedo = torpedo || {};
torpedo.server = torpedo.server || {};



var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                     .getService(Components.interfaces.nsIConsoleService);
					 
Components.utils.import("resource://gre/modules/Services.jsm");

function onPreInit(account)  {
	torpedo.server = account.incomingServer;
};

function onInit()  { 
	torpedo.addPart1 = document.getElementById("addPart1");
	torpedo.addPart2 = document.getElementById("addPart2");
	torpedo.addPart3 = document.getElementById("addPart3");
	
	torpedo.stringsBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties");
	document.getElementById('referrerDialog').textContent = torpedo.stringsBundle.GetStringFromName('referrerInfo1');
	
	torpedoOptions.displayReferrer();
   
	
};