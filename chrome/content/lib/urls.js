var torpedo = torpedo || {};
torpedo.db = torpedo.db || {};

var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

var jsonUrls = {
	"defaultUrls" : [	{"url" : "google.de"},
						{"url" : "youtube.com"},
						{"url" : "facebook.com"},
						{"url" : "amazon.de"},
						{"url" : "google.com"},
						{"url" : "ebay.de"},
						{"url" : "wikipedia.org"},
						{"url" : "web.de"},
						{"url" : "gmx.net"},
						{"url" : "t-online.de"},
						{"url" : "bing.com"},
						{"url" : "ebay-kleinanzeigen.de"},
						{"url" : "yahoo.com"},
						{"url" : "bild.de"},
						{"url" : "msn.com"},
						{"url" : "spiegel.de"},
						{"url" : "live.com"},
						{"url" : "chip.de"},
						{"url" : "mobile.de"},
						{"url" : "paypal.com"},
						{"url" : "otto.de"},
						{"url" : "gutefrage.net"},
						{"url" : "focus.de"},
						{"url" : "immobilienscout24.de"},
						{"url" : "outbrain.com"},
						{"url" : "twitter.com"},
						{"url" : "telekom.com"},
						{"url" : "postbank.de"},
						{"url" : "instagram.com"},
						{"url" : "bahn.de"},
						{"url" : "chefkoch.de"},
						{"url" : "autoscout24.de"},
						{"url" : "1und1.de"},
						{"url" : "microsoft.com"},
						{"url" : "kicker.de"},
						{"url" : "blogspot.de"},
						{"url" : "welt.de"},
						{"url" : "netflix.com"},
						{"url" : "booking.com"},
						{"url" : "idealo.de"},
						{"url" : "xing.com"},
						{"url" : "fiducia.de"},
						{"url" : "twitch.tv"},
						{"url" : "pinterest.com"},
						{"url" : "tumblr.com"},
						{"url" : "zalando.de"},
						{"url" : "wetter.com"},
						{"url" : "heise.de"},
						{"url" : "dict.cc"},
						{"url" : "arbeitsagentur.de"},
						{"url" : "wordpress.com"},
						{"url" : "computerbild.de"},
						{"url" : "ikea.com"},
						{"url" : "sueddeutsche.de"},
						{"url" : "vice.com"},
						{"url" : "sky.de"},
						{"url" : "leo.org"},
						{"url" : "zeit.de"},
						{"url" : "sport1.de"},
						{"url" : "ask.com"},
						{"url" : "deutsche-bank.de"},
						{"url" : "linkedin.com"},
						{"url" : "commerzbank.de"},
						{"url" : "zdf.de"},
						{"url" : "freenet.de"},
						{"url" : "faz.net"},
						{"url" : "adobe.com"},
						{"url" : "n-tv.de"},
						{"url" : "mediamarkt.de"},
						{"url" : "siteadvisor.com"},
						{"url" : "amazon.com"},
						{"url" : "aol.com"},
						{"url" : "tchibo.de"},
						{"url" : "hm.com"},
						{"url" : "immowelt.de"},
						{"url" : "vodafone.de"},
						{"url" : "ing-diba.de"},
						{"url" : "dhl.de"},
						{"url" : "giga.de"},
						{"url" : "telekom.de"},
						{"url" : "meinestadt.de"},
						{"url" : "wetteronline.de"},
						{"url" : "tagesschau.de"},
						{"url" : "bonprix.de"},
						{"url" : "apple.com"},
						{"url" : "duden.de"},
						{"url" : "whatsapp.com"},
						{"url" : "lidl.de"},
						{"url" : "check24.de"},
						{"url" : "reddit.com"},
						{"url" : "stern.de"},
						{"url" : "wikia.com"},
						{"url" : "9gag.com"},
						{"url" : "arcor.de"},
						{"url" : "ebay.com"},
						{"url" : "dasoertliche.de"},
						{"url" : "dropbox.com"},
						{"url" : "holidaycheck.de"},
						{"url" : "dkb.de"},
						{"url" : "dawanda.com"},
						{"url" : "tripadvisor.de"},
						{"url" : "ardmediathek.de"}
					],
	"secondClickUrls" : [],
	"firstClickUrls" : []
};
var FileUtils = Components.utils.import("resource://gre/modules/FileUtils.jsm").FileUtils;
var directoryService = Components.classes["@mozilla.org/file/directory_service;1"].
      getService(Components.interfaces.nsIProperties);

torpedo.db.getLocalDirectory = function ()
{
  // this is a reference to the profile dir (ProfD) now.
  let localDir = directoryService.get("ProfD", Components.interfaces.nsIFile);

  localDir.append("torpedo");

  if (!localDir.exists() || !localDir.isDirectory()) {
    // read and write permissions to owner and group, read-only for others.
    localDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
 	Application.console.log("localDir created");
  }
  return localDir;
};

torpedo.db.initDB = function ()
{
	let myFile = torpedo.db.getLocalDirectory();
	myFile.append("websites.js");
};

torpedo.db.pushUrl = function (website) 
{
	var first = torpedo.db.inFirstClick(website);
	if (torpedo.db.inDefault(website)){
		return 1;
	}
	else if (torpedo.db.inSecondClick(website)){
		var jsonString = JSON.stringify(jsonUrls);
		Application.console.log(jsonString);
		return 2;
	}
	else if (first >= 0){
		jsonUrls.secondClickUrls.push({"url" : website});
		var jsonString = JSON.stringify(jsonUrls);
		Application.console.log(jsonString);

		jsonUrls.firstClickUrls.splice(first,1);

		var jsonString = JSON.stringify(jsonUrls);
		Application.console.log(jsonString);
		return 3;
	}
	else {
		jsonUrls.firstClickUrls.push({"url" : website});
		var jsonString = JSON.stringify(jsonUrls);
		Application.console.log(jsonString);
		return 4;
	}
};

torpedo.db.inDefault = function (website){
	var jsonString = JSON.stringify(jsonUrls);
	var urlArray = JSON.parse(jsonString);
	var counter = 0;
	for(counter = 0; urlArray.defaultUrls[counter] != null; counter++){
		if(urlArray.defaultUrls[counter].url == website) {
		 return true;
		}
	}
	return false;
};

torpedo.db.inSecondClick = function (website){
	var jsonString = JSON.stringify(jsonUrls);
	var urlArray = JSON.parse(jsonString);
	var counter = 0;
	for(counter = 0; urlArray.secondClickUrls[counter] != null; counter++){
		if(urlArray.secondClickUrls[counter].url == website) {
			return true;
		}
	}
	return false;
};

torpedo.db.inFirstClick = function (website){
	var jsonString = JSON.stringify(jsonUrls);
	var urlArray = JSON.parse(jsonString);
	var position = 0;
	var counter = 0;
	for(counter = 0; urlArray.firstClickUrls[counter] != null; counter++){
		if(urlArray.firstClickUrls[counter].url == website) {
			return position;
		}
		else position++;
	}
	return -1;
};


var selected;

torpedo.db.deleteAllSecond = function () {
	var jsonString = JSON.stringify(jsonUrls);
	var urlArray = JSON.parse(jsonString);

	jsonUrls.secondClickUrls.splice(0,urlArray.length);

	jsonString = JSON.stringify(jsonUrls);
	Application.console.log(jsonString);
	//torpedo.stringsBundle = document.getElementById('string-bundle'); torpedo.stringsBundle.getString('entries_gone');
};

torpedo.db.deleteSomeSecond = function () {
	var jsonString = JSON.stringify(jsonUrls);
	var urlArray = JSON.parse(jsonString);

	var website = jsonUrls.secondClickUrls[selected].url;
	jsonUrls.secondClickUrls.splice(selected, 1);

	var theList = document.getElementById('theList');
	theList.removeChild(theList.getItemAtIndex(selected));
	
	jsonString = JSON.stringify(jsonUrls);
	Application.console.log(jsonString);
};

torpedo.db.getSecond = function () {
	var theList = document.getElementById('theList');
	var jsonString = JSON.stringify(jsonUrls);
	var urlArray = JSON.parse(jsonString);
	
	var i = 0;
	for (i = 0; jsonUrls.secondClickUrls[i] != null; i++) {
	    
		Application.console.log(jsonUrls.secondClickUrls[i].url);
		var row = document.createElement('listitem');
	    row.setAttribute('label', jsonUrls.secondClickUrls[i].url);
	    theList.appendChild(row);
	}
};

torpedo.db.select = function(index){
	selected = index;
};

torpedo.db.getDefaults = function (){
	var defaultList = document.getElementById('defaultList');
	var jsonString = JSON.stringify(jsonUrls);
	var urlArray = JSON.parse(jsonString);
	
	var i = 0;
	for (i = 0; jsonUrls.defaultUrls[i] != null; i++) {
		var row = document.createElement('listitem');
	    row.setAttribute('label', jsonUrls.defaultUrls[i].url);
	    defaultList.appendChild(row);
	}
}