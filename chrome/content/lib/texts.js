var torpedo = torpedo || {};
torpedo.texts = torpedo.texts || {};


torpedo.texts.assignTexts = function (url)
{
  var state = torpedo.state+"";

  // get texts from textfile
  var button = torpedo.stringsBundle.getString('ButtonWeiterleitung');
  var ueberschrift = torpedo.stringsBundle.getString(state+"Ueberschrift");
  var erklaerung = torpedo.stringsBundle.getString(state+"Erklaerung");
  var mehrInfo = torpedo.stringsBundle.getString("mehrInfo");
  var infotext = torpedo.stringsBundle.getString(state+"Infotext").replace("<URL>", url);
  var infoCheck = torpedo.stringsBundle.getString("Info");
  var gluehbirneText = torpedo.stringsBundle.getString(state+"GluehbirneText");
  var linkDeaktivierung = torpedo.stringsBundle.getString(state+"LinkDeaktivierung");
  
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
  $("#advice").html(gluehbirneText);
  $("#infotext").html(mehrInfo);
  $("#moreinfos").html(infotext);
  $("#redirectButton").html(button);
  $("#linkDeactivate").html(linkDeaktivierung);
  $("#infocheck").html(infoCheck);

  // hide light bulb if no text is there
  if(gluehbirneText) $("#advicebox").show()
  else $("#advicebox").hide()
};
