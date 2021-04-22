var torpedo = torpedo || {};

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
    .getService(Components.interfaces.nsIConsoleService);



var torpedoTimer = {

    isTimerRequired: function (timerSetting, state) {
        var greenListDelayActivated = !torpedo.functions.settingIsChecked("greenListDelayActivated") && torpedoOptions.inList(torpedo.currentDomain, "URLDefaultList");
        var blueListDelayActivated = !torpedo.functions.settingIsChecked("blueListDelayActivated") && torpedoOptions.inList(torpedo.currentDomain, "URLSecondList");
        var isInBlacklist = state == "T4" || state == "T4a";
        var redirectResolving = document.getElementById("redirect").textContent == torpedo.stringsBundle.GetStringFromName('wait');

        if ((greenListDelayActivated || blueListDelayActivated  || timerSetting == 0) && !isInBlacklist) { //redirectResolving?
            return false;
        }
        return true;
    },

    isAlreadyVisited: function (timerIsCurrentlyRunning, state) {
        var isInBlacklist = state == "T4" || state == "T4a";
        var a = torpedo.handler.TempTarget;
        var hrefIsVisited = a.classList.contains("torpedoVisited");

        if(!timerIsCurrentlyRunning && !isInBlacklist && hrefIsVisited) {
            return true;
        }
        return false;
    },


    countdown: function (state) {
        var startTime = torpedo.prefs.getIntPref("blockingTimer");
        if (!torpedoTimer.isTimerRequired(startTime, state)) { 
            startTime = 0;
            $("#seconds-box").hide();
        } else {
            $("#seconds-box").show();
        }
        var currentlyRunning = false;

        function showTime() {
            var second = startTime % 60;
            var a = torpedo.handler.TempTarget;
            var alreadyVisited = torpedoTimer.isAlreadyVisited(currentlyRunning, state);

            strZeit = (second < 10) ? ((second == 0) ? second : "0" + second) : second;
            if (alreadyVisited) strZeit = 0;
            document.getElementById("countdown").textContent = torpedo.stringsBundle.GetStringFromName('VerbleibendeZeit');
            var remainingTimeText = document.getElementById("countdown").textContent.replace("$TIME$", strZeit);
            document.getElementById("countdown").textContent = remainingTimeText;

            if (strZeit == 0) {
                if (state != "T4") {
                    // make URL in tooltip clickable
                    $("#clickbox").unbind("click");
                    $("#clickbox").bind("click", torpedo.handler.mouseClickHref);
                    $(torpedo.handler.TempTarget).unbind("click");
                    $(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHref);
                    $("#clickbox").css("cssText", "cursor:pointer !important");
                    currentlyRunning = false;

                    // make sure countdown is not started all over again if we visit the same link again
                    // by adding "torpedoVisited" to the class of the visited link tag
                    a.classList ? a.classList.add('torpedoVisited') : a.className += ' torpedoVisited';
                } else {
                    $("#torpedoActivateLinkButton").prop("disabled", false);
                    $("#torpedoActivateLinkButton").click(function () {
                        torpedo.handler.mouseClickActivateLinkButton("T4a");
                    });
                }
            }
            else {
                try {
                    $("#clickbox").unbind("click");
                    $("#clickbox").bind("click", torpedo.handler.mouseClickHrefError);
                    $(torpedo.handler.TempTarget).unbind("click");
                    $(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHrefError);
                    $("#clickbox").css("cssText", "cursor:wait !important;");
                    currentlyRunning = true;
                } catch (e) {
                    consoleService.logStringMessage(e);
                }
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
    },

    changeCheckedTimer: function () {
        var d = torpedo.prefs.getBoolPref("checkedTimer");
        d = !d;
        torpedo.prefs.setBoolPref("checkedTimer", d);
        if (d == false) {
            torpedo.prefs.setIntPref("blockingTimer", 0);
            document.getElementById("greenlistactivated").disabled = true;
            document.getElementById("activateTimerOnLowRisk").setAttribute("style", "color:grey;width:330px; margin-top:10px");
            document.getElementById("orangelistactivated").disabled = true;
            document.getElementById("activateTimerOnUserList").setAttribute("style", "color:grey;width:330px; margin-top:15px");
        }
        else {
            torpedo.prefs.setIntPref("blockingTimer", 3);
            document.getElementById("greenlistactivated").disabled = false;
            document.getElementById("activateTimerOnLowRisk").removeAttribute("style");
            document.getElementById("activateTimerOnLowRisk").setAttribute("style", "width:330px; margin-top:10px");
            document.getElementById("orangelistactivated").disabled = false;
            document.getElementById("activateTimerOnUserList").removeAttribute("style");
            document.getElementById("activateTimerOnUserList").setAttribute("style", "width:330px; margin-top:15px");
        }
    }
}