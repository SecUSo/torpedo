var torpedo = torpedo || {};

var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
    .getService(Components.interfaces.nsIConsoleService);



var torpedoTimer = {

    isTimerRequired: function (timerSetting) {
        var greenListDelayActivated = !torpedo.functions.settingIsChecked("greenListDelayActivated") && torpedoOptions.inList(torpedo.currentDomain, "URLDefaultList");
        var blueListDelayActivated = !torpedo.functions.settingIsChecked("blueListDelayActivated") && torpedoOptions.inList(torpedo.currentDomain, "URLSecondList");
        var redirectResolving = document.getElementById("redirect").textContent == torpedo.stringsBundle.GetStringFromName('wait');

        if (greenListDelayActivated || blueListDelayActivated || redirectResolving || timerSetting == 0) {
            return false;
        }
        return true;
    },


    countdown: function () {
        var startTime = torpedo.prefs.getIntPref("blockingTimer");
        if (!torpedoTimer.isTimerRequired(startTime)) {
            startTime = 0;
            $("#seconds-box").hide();
        } else {
            $("#seconds-box").show();
        }
        var currentlyRunning = false;

        function showTime() {
            var second = startTime % 60;
            var a = torpedo.handler.TempTarget;
            var alreadyVisited = !currentlyRunning && a.classList.contains("torpedoVisited");

            strZeit = (second < 10) ? ((second == 0) ? second : "0" + second) : second;
            if (alreadyVisited) strZeit = 0;
            document.getElementById("countdown").textContent = torpedo.stringsBundle.GetStringFromName('VerbleibendeZeit');
            var remainingTimeText = document.getElementById("countdown").textContent.replace("$TIME$", strZeit);
            document.getElementById("countdown").textContent = remainingTimeText;

            if (strZeit == 0) {
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