var torpedo = torpedo || {};
torpedo.texts = torpedo.texts || {};

torpedo.texts.assignTexts = function (url)
{
  var state = torpedo.state+"";

  // get texts from textfile
  var buttontext = torpedo.stringsBundle.GetStringFromName("ButtonWeiterleitung");
  var ueberschrift = torpedo.stringsBundle.GetStringFromName(state+"Ueberschrift");
  var erklaerung = torpedo.stringsBundle.GetStringFromName(state+"Erklaerung");
  var mehrInfo = torpedo.stringsBundle.GetStringFromName("mehrInfo");
  var infotext = torpedo.stringsBundle.GetStringFromName(state+"Infotext").replace("<URL>", url);
  var infoCheck = torpedo.stringsBundle.GetStringFromName("Info");
  var gluehbirneInfo = torpedo.stringsBundle.GetStringFromName("GluehbirneInfo");
  var gluehbirneText = torpedo.stringsBundle.GetStringFromName(state+"GluehbirneText");
  var linkDeaktivierung = torpedo.stringsBundle.GetStringFromName(state+"LinkDeaktivierung");
  
  // get parts of URL: Prefix, Domain and Suffix
  var domain = torpedo.functions.getDomainWithFFSuffix(url);
	var split = url.indexOf(domain);
	var prefix = url.substring(0, split);
	var suffix = url.substring(split+domain.length, url.length);
  // remove end of URL if it is too long
	if(suffix.length > 75) suffix = suffix.substring(0,75) +  "...";
	//avoid unnessecary slash
	if(suffix == "/") suffix = "";
 
 
  // assign texts
  $("#phish").html(ueberschrift);
  $("#url1").html(prefix);
  $("#baseDomain").html(domain);
  $("#url2").html(suffix);
  $("#redirect").html(erklaerung);
  $("#advice").html(gluehbirneInfo);
  $("#moreadviceinfos").html(gluehbirneText);
  $("#infotext").html(mehrInfo);
  $("#moreinfos").html(infotext);
  document.getElementById("redirectButton").setAttribute("label", buttontext);
  $("#linkDeactivate").html(linkDeaktivierung);
 // document.getElementById("infocheck").setAttribute("label", infoCheck);

  // hide light bulb if no text is there
  if(gluehbirneText) $("#advicebox").show()
  else $("#advicebox").hide()
};