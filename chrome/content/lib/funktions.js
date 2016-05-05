var torpedo = torpedo || {};
var Url = "";

var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.functions = torpedo.functions || {};

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
var oldUrl = "";

torpedo.functions.traceUrl = function (url) {
    oldUrl = url;
    $.getJSON('http://untiny.me/api/1.0/extract', {format: 'json', 'url': url})
        .done(function (json) {
   	      torpedo.functions.containsUrl(json.org_url);
        })
       .fail(function (jqxhr, textStatus, error) {
         Application.console.log("redirection error");
        });
};

torpedo.functions.containsUrl = function (url, err){
    if(url == undefined){
       torpedo.updateTooltip(oldUrl, false);
     }
     else{
        if(url.contains("redirect")){
          var index = url.lastIndexOf("http");
          var subs = url.slice(index, url.length);
          index = subs.indexOf("&");
          url = subs.slice(0, index);
        }
        torpedo.updateTooltip(url, true);
    }
};

torpedo.functions.findParentTagTarget = function (event, tagName) {
    var tempTarget = event.target || event.srcElement;

    if (tempTarget.nodeName == tagName) {
        return tempTarget;
    }

    return event.target.parentNode;
}

torpedo.functions.isURL = function (url) {
    if (url.match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i)) {
        return true;
    }
    return false;
};

torpedo.functions.getDomainWithFFSuffix = function (url) {
    var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].getService(Components.interfaces.nsIEffectiveTLDService);
    var tempURI = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI("" + url, null, null);
    try {
        //hardcoded because this is the only url where this doesn't work
        if (eTLDService.getBaseDomain(tempURI) == "www.blogspot.de") return "blogspot.de";
        return eTLDService.getBaseDomain(tempURI);
    }
    catch (err) {
        return "";
    }
}

torpedo.functions.countdown = function (timee, id, url) {
    var startTime = timee;

    var setBaseDomain = document.getElementById("baseDomain");
    var setUrl1 = document.getElementById("url1");
    var setUrl2 = document.getElementById("url2");

    setUrl2.style.color = "#808080";
    var baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
    var noTimer = ((!torpedo.functions.isChecked("greenActivated") && torpedo.db.inList(baseDomain, "URLDefaultList")) || 
            (!torpedo.functions.isChecked("orangeActivated") && torpedo.db.inList(baseDomain, "URLSecondList")));

    if (noTimer) {
        startTime = 0;
        document.getElementById("description").textContent = torpedo.stringsBundle.getString('click_link');
        setUrl1.style.color = "#0066cc";
        setBaseDomain.style.color = "#0066cc";
    }

    function showTime() {
        var second = startTime % 60;
        strZeit = (second < 10) ? ((second == 0)? second : "0" + second) : second;
        $("#" + id).html(strZeit);

        if (second == 0) {
            //change text from tooltip to "you can click link now"
            document.getElementById("description").textContent = torpedo.stringsBundle.getString('click_link');

            // make URL in tooltip clickable
            $(document.getElementById("url-box")).bind("click", torpedo.handler.mouseClickHref);
            setUrl1.style.color = "#0066cc";
            setBaseDomain.style.color = "#0066cc";
        }
        else {
            $(document.getElementById("url-box")).unbind("click");
            setUrl1.style.color = "#404040";
            setBaseDomain.style.color = "#404040";
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
        else {
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

var a = torpedo.prefs.getBoolPref("checkedGreenList");
var b = torpedo.prefs.getBoolPref("activatedGreenList");
var c = torpedo.prefs.getBoolPref("activatedOrangeList");

torpedo.functions.isChecked = function (color){
    if(color == "green") return torpedo.prefs.getBoolPref("checkedGreenList");
    if(color == "greenActivated") return torpedo.prefs.getBoolPref("activatedGreenList");
    if(color == "orangeActivated") return torpedo.prefs.getBoolPref("activatedOrangeList");
};

torpedo.functions.changeChecked = function (){
    a = !a;
    torpedo.prefs.setBoolPref("checkedGreenlist", a);
};

torpedo.functions.changeActivatedGreen = function (){
    b = !b;
    torpedo.prefs.setBoolPref("activatedGreenlist", b);
};

torpedo.functions.changeActivatedOrange = function (){
    c = !c;
    torpedo.prefs.setBoolPref("activatedOrangelist", c);
};
