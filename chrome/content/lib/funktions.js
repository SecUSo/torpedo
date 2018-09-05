var torpedo = torpedo || {};
var Url = "";
var redirects = [".tk","1u.ro","1url.com","2pl.us","2tu.us","3.ly","a.gd","a.gg","a.nf","a2a.me","abe5.com","adjix.com","alturl.com","atu.ca","awe.sm","b23.ru","bacn.me","bit.ly","bkite.com","blippr.com","blippr.com","bloat.me","bt.io","budurl.com","buk.me","burnurl.com","c.shamekh.ws","cd4.me","chilp.it","chs.mx","clck.ru","cli.gs","clickthru.ca","cort.as","cuthut.com","cutt.us","cuturl.com","decenturl.com","df9.net","digs.by","doiop.com","dwarfurl.com","easyurl.net","eepurl.com","eezurl.com","ewerl.com","fa.by","fav.me","fb.me","ff.im","fff.to","fhurl.com","flic.kr","flq.us","fly2.ws","fuseurl.com","fwd4.me","getir.net","gl.am","go.9nl.com","go2.me","golmao.com","goo.gl","goshrink.com","gri.ms","gurl.es","hellotxt.com","hex.io","href.in","htxt.it","hugeurl.com","hurl.ws","icanhaz.com","icio.us","idek.net","is.gd","it2.in","ito.mx","j.mp","jijr.com","kissa.be","kl.am","korta.nu","l9k.net","liip.to","liltext.com","lin.cr","linkbee.com","littleurl.info","liurl.cn","ln-s.net","ln-s.ru","lnkurl.com","loopt.us","lru.jp","lt.tl","lurl.no","memurl.com","migre.me","minilien.com","miniurl.com","miniurls.org","minurl.fr","moourl.com","myurl.in","ncane.com","netnet.me","nn.nf","o-x.fr","ofl.me","omf.gd","ow.ly","oxyz.info","p8g.tw","parv.us","pic.gd","ping.fm","piurl.com","plurl.me","pnt.me","poll.fm","pop.ly","poprl.com","post.ly","posted.at","ptiturl.com","qurlyq.com","rb6.me","readthis.ca","redirects.ca","redirx.com","relyt.us","retwt.me","ri.ms","rickroll.it","rly.cc","rsmonkey.com","rubyurl.com","rurl.org","s3nt.com","s7y.us","saudim.ac","short.ie","short.to","shortna.me","shoturl.us","shrinkster.com","shrinkurl.us","shrtl.com","shw.me","simurl.net","simurl.org","simurl.us","sn.im","sn.vc","snipr.com","snipurl.com","snurl.com","soo.gd","sp2.ro","spedr.com","starturl.com","stickurl.com","sturly.com","su.pr","t.co","takemyfile.com","tcrn.ch","teq.mx","thrdl.es","tighturl.com","tiny.cc","tiny.pl","tinyarro.ws","tinytw.it","tinyurl.com","tl.gd","tnw.to","to.ly","togoto.us","tr.im","tr.my","trcb.me","tw0.us","tw1.us","tw2.us","tw5.us","tw6.us","tw8.us","tw9.us","twa.lk","twd.ly","twi.gy","twit.ac","twitthis.com","twiturl.de","twitzap.com","twtr.us","twurl.nl","u.mavrev.com","u.nu","ub0.cc","updating.me","ur1.ca","url.co.uk","url.ie","url.inc-x.eu","url4.eu","urlborg.com","urlbrief.com","urlcut.com","urlhawk.com","urlkiss.com","urlpire.com","urlvi.be","urlx.ie","uservoice.com","ustre.am","virl.com","vl.am","wa9.la","wapurl.co.uk","wipi.es","wkrg.com","wp.me","x.co","x.hypem.com","x.se","xav.cc","xeeurl.com","xr.com","xrl.in","xrl.us","xurl.jp","xzb.cc","yatuc.com","ye-s.com","yep.it","yfrog.com","zi.pe","zz.gd"];

torpedo.functions = torpedo.functions || {};
torpedo.currentlyRunning = false;
torpedo.functions.manualRedirect = false;

torpedo.functions.calcWindowPosition = function (windowWidth, windowHeight) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    if (width < screen.width && height < screen.height) {
        width = screen.width;
        height = screen.height;
    }

    var left = ((width / 2) - (windowWidth / 2)) + dualScreenLeft;
    var top = ((height / 2) - (windowHeight / 2)) + dualScreenTop;

    return {
        top: top,
        left: left,
        width: width,
        height: height
    };
}

torpedo.functions.findParentTagTarget = function (event, aTag) {
    var tempTarget = event.target || event.srcElement;

    if (tempTarget.nodeName == aTag) {
       return tempTarget;
    }
    var children = event.target.childNodes;
    for( var i = 0; i < children.length; i++){
        if(children[i].nodeName == aTag){
            return children[i];
        }
    }
    var parent = event.target.parentNode;
    for( var j = 0; j < 5; j++){
        if(parent.nodeName == aTag){
            return parent;
        }
        parent = parent.parentNode;
    }
    return undefined;
}

torpedo.functions.isURL = function (url) {
  try{
	if(!url.includes("https://") && !url.includes("http://")){
	  url = "http://" + url;
	}
	const href = new URL(url);
    if(href.hostname)
      return true;
    else return false;
    }catch(e){
    return false;
  }
};

torpedo.functions.getDomainWithFFSuffix = function (url) {
  if(!url.includes("https://") && !url.includes("http://")){
	  url = "http://" + url;
	}
	
  if(torpedo.functions.isURL(url)){
    var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].getService(Components.interfaces.nsIEffectiveTLDService);
    try {
      var tempURI = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(url, null, null);
      var baseDomain = eTLDService.getBaseDomain(tempURI);
      return baseDomain;
    }
    catch(err) {}
  }
};

torpedo.functions.traceUrl = function (url, redirect) {
    // check if url is redirect and already in our list of saved entries
    var requestList = torpedo.prefs.getStringPref("URLRequestList");
    if(redirect && requestList.includes(torpedo.functions.getDomainWithFFSuffix(url)+",")){
      unknown = false;
      var requestArray = requestList.split(",");
      var i = 0;
      var urlPos = 0;
      for(i=0; i<requestArray.length;i++){
        if(requestArray[i] == url){
          urlPos = i;
        }
      }
      var answerList = torpedo.prefs.getStringPref("URLAnswerList");
      var answerArray = answerList.split(",");
      torpedo.currentUrl = answerArray[urlPos];
    }
};

torpedo.functions.trace = function (url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function(){
      if(this.readyState == 4){
        torpedo.functions.saveRedirection(url, xhr.responseURL);
        torpedo.updateShortUrlResolved(xhr.responseURL);
      }
    };
    xhr.send(null);
};

torpedo.functions.containsRedirect = function(url){
    torpedo.handler.clickEnabled = false;
    var redirect = document.getElementById("redirect");
    redirect.textContent = torpedo.stringsBundle.getString('wait');
    document.getElementById("redirectButton").disabled = true;
    $("#clickbox").unbind("click", torpedo.handler.mouseClickHref);
    setTimeout(function(e){
      $("#clickbox").bind("click", torpedo.handler.mouseClickHref);
      torpedo.handler.Url = url;
      torpedo.functions.trace(url);
    }, 2000);
};

torpedo.functions.saveRedirection = function(url, response){
  // save redirection URL in user data
  var str1 = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
  var str2 = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
  var preVal1 = torpedo.prefs.getStringPref("URLRequestList");
  var preVal2 = torpedo.prefs.getStringPref("URLAnswerList");
  var request = preVal1 + url + ",";
  var answer = preVal2 + response + ",";
  str1.data = request;
  str2.data = answer;
  if(!preVal1.includes(url + ",")){
    torpedo.prefs.setStringPref("URLRequestList", Components.interfaces.nsISupportsString, str1);
    torpedo.prefs.setStringPref("URLAnswerList", Components.interfaces.nsISupportsString, str2);
    var requestArray = request.split(",");

    // if list of saved redirections has more than 100 entries
    if(requestArray.length>100){
      var reqWithoutFirst = request.substr(request.indexOf(",")+1,request.length);
      var ansWithoutFirst = answer.substr(answer.indexOf(",")+1,answer.length);
      str1.data = reqWithoutFirst;
      str2.data = ansWithoutFirst;
      torpedo.prefs.setStringPref("URLRequestList", Components.interfaces.nsISupportsString, str1);
      torpedo.prefs.setStringPref("URLAnswerList", Components.interfaces.nsISupportsString, str2);
    }
  }
}

// Countdown functions

torpedo.functions.countdown = function (timee, id, url) {
    var startTime = timee;
    var setBaseDomain = document.getElementById("baseDomain");
    var noTimer = ((!torpedo.functions.isChecked("greenActivated") && torpedo.db.inList(torpedo.baseDomain, "URLDefaultList")) ||
            (!torpedo.functions.isChecked("orangeActivated") && torpedo.db.inList(torpedo.baseDomain, "URLSecondList")) ||
          (document.getElementById("redirect").textContent == torpedo.stringsBundle.getString('wait')) ||
          (torpedo.prefs.getIntPref("blockingTimer")==0));
    if (noTimer) {
        startTime = 0;
        $("#seconds-box").hide();
    }
    else $("#seconds-box").show();
    torpedo.currentlyRunning = true;

    function showTime() {
        var second = startTime % 60;
        var panel = document.getElementById("tooltippanel");
        var content = document.getElementById("tooltipcontent");
        var a = torpedo.handler.TempTarget;
        var alreadyVisited = !torpedo.currentlyRunning && a.classList.contains("torpedoVisited");

        strZeit = (second < 10) ? ((second == 0)? second : "0" + second) : second;
        if(alreadyVisited) strZeit = 0;
        document.getElementById("countdown").textContent = torpedo.stringsBundle.getString('VerbleibendeZeit');
        var remainingTimeText = document.getElementById("countdown").textContent.replace("$TIME$",strZeit);
        document.getElementById("countdown").textContent = remainingTimeText;

        if (strZeit == 0 ) {
            // make URL in tooltip clickable
            $("#clickbox").unbind("click");
            $("#clickbox").bind("click", torpedo.handler.mouseClickHref);
            $(torpedo.handler.TempTarget).unbind("click");
            $(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHref);
            $("#clickbox").css("cssText", "cursor:pointer !important");
            torpedo.currentlyRunning = false;

            // make sure countdown is not started all over again if we visit the same link again
            // by adding "torpedoVisited" to the class of the visited link tag
      			a.classList ? a.classList.add('torpedoVisited') : a.className += ' torpedoVisited';
        }
        else {
            $("#clickbox").unbind("click");
            $("#clickbox").bind("click", torpedo.handler.mouseClickHrefError);
            $(torpedo.handler.TempTarget).unbind("click");
            $(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHrefError);
            $("#clickbox").css("cssText", "cursor:wait !important;");
            torpedo.currentlyRunning = true;
        }
    }

    showTime();
    if (startTime > 0) {
        --startTime;
    }

    var timerInterval = setInterval(function timer() {
        showTime();
        if (startTime == 0) {
            clearInterval(timerInterval);
        }
        else{
            --startTime;
        }

    }, 1000);

    return timerInterval;
}

torpedo.functions.setHref = function (url) {
    Url = url;
    torpedo.handler.resetCountDownTimer();
}
torpedo.functions.getHref = function () {
    return Url;
}

// text settings

var e = torpedo.prefs.getBoolPref("language");

torpedo.functions.changeLanguage = function(){
    e = !e;
    torpedo.prefs.setBoolPref("language", e);
    if(e) document.getElementById("changeLang").textContent = torpedo.stringsBundle.getString('longtext');
    else document.getElementById("changeLang").textContent = torpedo.stringsBundle.getString('shorttext');
}

/*torpedo.functions.changeTextsize = function(){
    var notsize;
    var editor = document.getElementById("editor");
    var panel = document.getElementById("changeSize")
    if(panel.textContent == torpedo.stringsBundle.getString('smalltext')){
  		panel.textContent = torpedo.stringsBundle.getString('bigtext');
      notsize = "big";
      torpedo.prefs.setIntPref("textsize", 100);
      torpedo.textSize = 100;
      if(editor!=null) editor.style.fontSize="100%";
    }
    else {
  		  document.getElementById("changeSize").textContent = torpedo.stringsBundle.getString('smalltext');
        notsize = "normal";
        torpedo.prefs.setIntPref("textsize", 115);
        torpedo.textSize = 115;
        if(editor!=null) editor.style.fontSize="115%";
    }
}*/

// list settings

var a = torpedo.prefs.getBoolPref("checkedGreenList");
var b = torpedo.prefs.getBoolPref("activatedGreenList");
var c = torpedo.prefs.getBoolPref("activatedOrangeList");
var d = torpedo.prefs.getBoolPref("checkedTimer");


torpedo.functions.isChecked = function (color){
    if(color == "green") return torpedo.prefs.getBoolPref("checkedGreenList");
    if(color == "greenActivated") return torpedo.prefs.getBoolPref("activatedGreenList");
    if(color == "orangeActivated") return torpedo.prefs.getBoolPref("activatedOrangeList");
};

torpedo.functions.changeChecked = function (){
    a = !a;
    torpedo.prefs.setBoolPref("checkedGreenlist", a);
};

torpedo.functions.changeActivatedGreen = function (click){
    b = !b;
    torpedo.prefs.setBoolPref("activatedGreenlist", b);
    if(click){
      document.getElementById("greenlistactivated").checked = b;
    }
};

torpedo.functions.changeActivatedOrange = function (click){
    c = !c;
    torpedo.prefs.setBoolPref("activatedOrangelist", c);
    if(click){
      document.getElementById("orangelistactivated").checked = c;
    }
};

// timer settings

torpedo.functions.changeCheckedTimer = function (){
    d = !d;
    torpedo.prefs.setBoolPref("checkedTimer", d);
    if(!d){
        torpedo.prefs.setIntPref("blockingTimer", 0);
        // TODO document.getElementById("countdown").disabled = true;
        document.getElementById("greenlistactivated").disabled = true;
        document.getElementById("activateTimerOnLowRisk").setAttribute("style","color:grey;width:330px; margin-top:10px");
        document.getElementById("orangelistactivated").disabled = true;
        document.getElementById("activateTimerOnUserList").setAttribute("style","color:grey;width:330px; margin-top:15px");
    }
    else{
        torpedo.prefs.setIntPref("blockingTimer", 3);
      // TODO  document.getElementById("countdown").disabled = false;
        document.getElementById("greenlistactivated").disabled = false;
        document.getElementById("activateTimerOnLowRisk").removeAttribute("style");
        document.getElementById("activateTimerOnLowRisk").setAttribute("style","width:330px; margin-top:10px");
        document.getElementById("orangelistactivated").disabled = false;
        document.getElementById("activateTimerOnUserList").removeAttribute("style");
        document.getElementById("activateTimerOnUserList").setAttribute("style","width:330px; margin-top:15px");
    }
}

// redirection settings

torpedo.functions.redirect = function (id){
    torpedo.prefs.setBoolPref("redirection"+id, true);
    var id1 = (id+1)%3;
    var id2 = (id+2)%3;
    torpedo.prefs.setBoolPref("redirection"+id1, false);
    torpedo.prefs.setBoolPref("redirection"+id2, false);

    // prevent user from selecting no option at all in settings
    if(document.getElementById("redirect"+id).checked == false){
        document.getElementById("redirect"+id).checked = true;
    }
};

/*
* check if url
* contains "redirect" or contains domain from list of redirections
*/
torpedo.functions.isRedirect = function(url){
  if(torpedo.functions.isURL(url)){
    for(var i = 0; i < redirects.length; i++){
        if(torpedo.functions.getDomainWithFFSuffix(url) == redirects[i]) {
            return true;
        }
    }
  }
  return false;
};

torpedo.functions.isMismatch = function(domain){
  var title = torpedo.handler.title;
  if(title == "" || title == undefined) return false;
  if(!torpedo.functions.isURL(title)) return false;
  var titleDomain = torpedo.functions.getDomainWithFFSuffix(title);
  //var a = titleDomain.split(".");
  //var b = domain.split(".");
  return (titleDomain != domain);
  /*if(titleDomain != domain && !(a.length != b.length && a[a.length-2] == b[b.length-2] &&  a[a.length-1] == b[b.length-1])){
    return true;
  }
  return false;*/
}
torpedo.gmxRedirect;
torpedo.gmxRedirectIndex;
torpedo.functions.resolveRedirect = function(url){
  var sites = torpedo.prefs.getStringPref("redirectUrls");
  var sites2 = torpedo.prefs.getStringPref("redirectUrls2");
  sites = sites.split(",");
  sites2 = sites2.split(",");
  if(torpedo.gmxRedirectIndex > -1){
    var compare = sites[torpedo.gmxRedirectIndex];
    if(sites2[torpedo.gmxRedirectIndex] != "") compare = sites2[torpedo.gmxRedirectIndex];
    var index = url.indexOf(compare);
    if(index > -1){
      var temp = url.substring(index+compare.length, url.length);
      temp = decodeURIComponent(temp);
      if(torpedo.functions.isURL(temp)) url = temp;
    }
  }
  return url;
};

torpedo.functions.isGmxRedirect = function(url){
  var sites = torpedo.prefs.getStringPref("redirectUrls");
  sites = sites.split(",");
  for(var i = 0; i < sites.length-1; i++){
    if(url.startsWith(sites[i])) {
      torpedo.gmxRedirect = true;
      torpedo.gmxRedirectIndex = i;
      return true;
    }
  }
  torpedo.gmxRedirect = false;
  return false;
};
