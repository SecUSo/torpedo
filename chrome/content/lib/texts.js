var torpedo = torpedo || {};
torpedo.texts = torpedo.texts || {};

var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.texts.assignTexts = function (url)
{
  var state = torpedo.state;

  // get texts from textfile
  var button = torpedo.stringsBundle.getString('ButtonWeiterleitung');
  var ueberschrift = torpedo.stringsBundle.getString(state+"Ueberschrift");
  var erklaerung = torpedo.stringsBundle.getString(state+"Erklaerung");
  var mehrInfo = torpedo.stringsBundle.getString(state+"MehrInfo");
  var infotext = torpedo.stringsBundle.getString(state+"Infotext").replace("<URL>", url);
  var infoCheck = torpedo.stringsBundle.getString("Info");
  var gluehbirneText = torpedo.stringsBundle.getString(state+"GluehbirneText");
  var linkDeaktivierung = torpedo.stringsBundle.getString(state+"LinkDeaktivierung");

  // get parts of URL: Prefix, Domain and Suffix
	torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	var split = url.indexOf(torpedo.baseDomain);
	var prefix = url.substring(0, split);
	var suffix = url.substring(split+torpedo.baseDomain.length, url.length);
  // remove end of URL if it is too long
	if(suffix.length > 75) suffix = suffix.substring(0,75) +  "...";
	//avoid unnessecary slash
	if(suffix == "/") suffix = "";
  var url1Text = torpedo.stringsBundle.getString("URLPrefix").replace("<PREFIX>", prefix);
  var baseDomain = torpedo.stringsBundle.getString("URLDomain").replace("<DOMAIN>", torpedo.baseDomain);
  var url2Text = torpedo.stringsBundle.getString("URLSuffix").replace("<SUFFIX>", suffix);

  // assign texts
  document.getElementById("phish").textContent = ueberschrift;
  document.getElementById("url1").textContent = url1Text;
  document.getElementById("baseDomain").textContent = baseDomain;
  document.getElementById("url2").textContent = url2Text;
  document.getElementById("redirect").textContent = erklaerung;
  document.getElementById("advice").textContent = gluehbirneText;
  document.getElementById("infotext").textContent = mehrInfo;
  document.getElementById("moreinfos").textContent = infotext;
  document.getElementById("redirectButton").textContent = button;
  document.getElementById("linkDeactivate").textContent = linkDeaktivierung;
  document.getElementById("infocheck").textContent = infoCheck;

  // hide light bulb if no text is there
  if(gluehbirneText) $("#advicebox").show()
  else $("#advicebox").hide()
};
