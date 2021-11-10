changes = [];

$(document).ready(function () {
  $(".tabs .tab-links a").on("click", function (e) {
    var currentAttrValue = $(this).attr("href");
    // Show/Hide Tabs
    $(".tabs " + currentAttrValue)
      .show()
      .fadeIn(400)
      .siblings()
      .hide();

    // Change/remove current tab to active
    $(this).parent("li").addClass("active").siblings().removeClass("active");
    e.preventDefault();
  });
  $("li").on("click", function (e) {
    $("#trustedList").hide();
    $("#userList").hide();
    $("#shortURLList").hide();
    //$("#userShortURLList").hide();
  });

  $("#trustedList").hide();
  $("#userList").hide();
  $("#shortURLList").hide();
  //$("#userShortURLList").hide();

  addTexts();
  init();
  addEvents();
});

/**
 * set texts of options page
 */
function addTexts() {
  // Title
  $("#options").html(chrome.i18n.getMessage("options"));
  $("#title").html(chrome.i18n.getMessage("options"));

  // Timer tab
  $("#timerCheckboxText").html(chrome.i18n.getMessage("timerActivated"));
  $("#timerAmountText").html(chrome.i18n.getMessage("timerAmount"));
  $("#seconds").html(chrome.i18n.getMessage("seconds"));
  $("#trustedTimerActivated").html(
    chrome.i18n.getMessage("activateTimerOnLowRisk")
  );
  $("#userTimerActivated").html(
    chrome.i18n.getMessage("activateTimerOnUserList")
  );
  $("#privacyModeActivated").html(
    chrome.i18n.getMessage("activatePrivacyMode")
  );
  $("#securityModeActivated").html(
    chrome.i18n.getMessage("activateSecurityMode")
  );
  $("#redirectModeActivated").html(
    chrome.i18n.getMessage("activateRedirectMode")
  );

  // Domains tab
  $("#blackListText").html(chrome.i18n.getMessage("highRiskDomains"));
  $("#activateBlackList").html(chrome.i18n.getMessage("activateHighRiskList"));
  $("#trustedListText").html(chrome.i18n.getMessage("lowRiskDomains"));
  $("#activateTrustedList").html(chrome.i18n.getMessage("activateLowRiskList"));
  $("#showTrustedDomains").html(chrome.i18n.getMessage("showLowRiskList"));
  $("#userListText").html(chrome.i18n.getMessage("userDomains"));
  $("#addUserDefined").html(chrome.i18n.getMessage("addEntries"));
  $("#editUserDefined").html(chrome.i18n.getMessage("editUserList"));

  // Referrer tab
  $("#referrerDialog1").html(chrome.i18n.getMessage("referrerInfo1"));
  $("#referrerExample").html(chrome.i18n.getMessage("referrerExample"));
  $("#referrerDialog2").html(chrome.i18n.getMessage("referrerInfo2"));
  $("#referrerListTitle").html(chrome.i18n.getMessage("referrerList"));
  $("#deleteReferrer").html(chrome.i18n.getMessage("deleteEntries"));
  $("#clearReferrer").html(chrome.i18n.getMessage("clearEntries"));
  $("#referrerHeadline").html(chrome.i18n.getMessage("addEntries"));
  $("#addDefaultReferrer").html(chrome.i18n.getMessage("addDefaultReferrer"));
  $("#addReferrerHost").html(chrome.i18n.getMessage("addEntries"));
  $("#addReferrerPath").html(chrome.i18n.getMessage("addEntries"));
  $("#addReferrerAttribute").html(chrome.i18n.getMessage("addEntries"));
  $("#insertRandom").html(chrome.i18n.getMessage("insertRandom"));
  $("#exampleReferrerHost").html(chrome.i18n.getMessage("exampleReferrerHost"));
  $("#exampleReferrerPath").html(chrome.i18n.getMessage("exampleReferrerPath"));
  $("#exampleReferrerAttribute").html(
    chrome.i18n.getMessage("exampleReferrerAttribute")
  );

  // Redirection Short URL tab
  $("#shortURLText").html(chrome.i18n.getMessage("shortURLInfo"));
  $("#shortURLListText").html(chrome.i18n.getMessage("shortURLListText"));
  $("#editShortURL").html(chrome.i18n.getMessage("editUserList"));
  $("#addUserDefinedShortURL").html(chrome.i18n.getMessage("addEntries"));

  // Additional buttons
  $("#saveChanges").html(chrome.i18n.getMessage("saveChanges"));
  $("#revertChanges").html(chrome.i18n.getMessage("revertChanges"));
  $("#defaultSettings").html(chrome.i18n.getMessage("defaultSettings"));

  // Lists
  $("#trustedListTitle").html(chrome.i18n.getMessage("trustedList"));
  $("#userListTitle").html(chrome.i18n.getMessage("userList"));
}

/**
 * initialize the options page
 */
function init() {
  chrome.storage.sync.get(null, function (r) {
    // init changes for "revert changes" button
    changes = [];

    // Timer tab
    $("#timerCheckbox").prop("checked", r.timer > 0);
    $("#timerInput").val(r.timer);
    $("#trustedTimerCheckbox").prop("checked", r.trustedTimerActivated);
    $("#userTimerCheckbox").prop("checked", r.userTimerActivated);
    $("#privacyModeCheckbox").prop("checked", r.privacyModeActivated);
    $("#securityModeCheckbox").prop("checked", r.securityModeActivated);
    $("#redirectModeCheckbox").prop("checked", r.redirectModeActivated);

    // Domains tab
    $("#blackListActivated").prop("checked", r.blackListActivated);
    $("#trustedListActivated").prop("checked", r.trustedListActivated);
    $("#showTrustedDomains").prop("disabled", !r.trustedListActivated);

    // Referrer tab
    var arr1 = r.referrerPart1;
    var arr2 = r.referrerPart2;
    var arr3 = r.referrerPart3;
    var index1 = arr1.indexOf("deref-gmx.net");
    var index2 = arr1.indexOf("deref-web-02.de");
    var containsDefault = false;
    if (index1 > -1 && index2 > -1) {
      containsDefault =
        arr2[index1] == "/mail/client/[...]/dereferrer/?" &&
        arr2[index2] == "/mail/client/[...]/dereferrer/?";
    }
    if (document.getElementById("addDefaultReferrer"))
      document.getElementById("addDefaultReferrer").disabled = containsDefault;
    if (document.getElementById("referrerList")) fillReferrerList();

    // Additional buttons
    $("#statusSettings").html("");

    // Additional lists
    if (document.getElementById("trustedList")) fillTrustedList();
    if (document.getElementById("userList")) fillUserList();
    $("#errorAddUserDefined").html("");
    if (document.getElementById("shortURLList")) fillShortURLList();
  });
}

/**
 *   filling the options page elements with functionalities
 */
function addEvents() {
  chrome.storage.sync.get(null, function (r) {
    // Timer tab
    $("#timerCheckbox").on("change", function (e) {
      save("timer", r.timer);
      var checked = $(this).prop("checked");
      if (!checked) {
        chrome.storage.sync.set({ timer: 0 });
        $("#timerInput").val("0");
      } else {
        chrome.storage.sync.set({ timer: 3 });
        $("#timerInput").val("3");
      }
    });
    $("#timerInput").on("change", function (e) {
      save("timer", r.timer);
      var timer = $(this).val();
      chrome.storage.sync.set({ timer: timer });
      if (timer == 0) $("#timerCheckbox").prop("checked", false);
      else $("#timerCheckbox").prop("checked", true);
    });
    $("#trustedTimerCheckbox").on("change", function (e) {
      save("trustedTimerActivated", r.trustedTimerActivated);
      var checked = $(this).prop("checked");
      chrome.storage.sync.set({ trustedTimerActivated: checked });
    });
    $("#userTimerCheckbox").on("change", function (e) {
      save("userTimerActivated", r.userTimerActivated);
      var checked = $(this).prop("checked");
      chrome.storage.sync.set({ userTimerActivated: checked });
    });

    $("#privacyModeCheckbox").on("change", function (e) {
      save("privacyModeActivated", r.privacyModeActivated);
      var checked = $(this).prop("checked");
      $("#securityModeCheckbox").prop("checked", !checked);
      chrome.storage.sync.set({ privacyModeActivated: checked });
      chrome.storage.sync.set({ securityModeActivated: !checked });
    });

    $("#securityModeCheckbox").on("change", function (e) {
      save("securityModeActivated", r.securityModeActivated);
      var checked = $(this).prop("checked");
      $("#privacyModeCheckbox").prop("checked", !checked);
      chrome.storage.sync.set({ securityModeActivated: checked });
      chrome.storage.sync.set({ privacyModeActivated: !checked });
    });

    $("#redirectModeCheckbox").on("change", function (e) {
      save("redirectModeActivated", r.redirectModeActivated);
      var checked = $(this).prop("checked");
      chrome.storage.sync.set({ redirectModeActivated: checked });
    });

    // Domains tab
    $("#blackListActivated").on("change", function (e) {
      save("blackListActivated", r.blackListActivated);
      var checked = $(this).prop("checked");
      chrome.storage.sync.set({ blackListActivated: checked });
    });
    $("#trustedListActivated").on("change", function (e) {
      save("trustedListActivated", r.trustedListActivated);
      var checked = $(this).prop("checked");
      chrome.storage.sync.set({ trustedListActivated: checked });
      if (!checked) $("#showTrustedDomains").prop("disabled", true);
      else $("#showTrustedDomains").prop("disabled", false);
    });
    $("#showTrustedDomains").on("click", function (e) {
      $("#userList").hide();
      $("#trustedList").toggle();
    });
    $("#addUserDefined").on("click", function (e) {
      addUserDefined();
    });
    $("#editUserDefined").on("click", function (e) {
      $("#trustedList").hide();
      $("#userList").toggle();
    });

    // Referrer tab
    $("#clearReferrer").on("click", function (e) {
      save("referrerPart1", r.referrerPart1);
      save("referrerPart2", r.referrerPart2);
      save("referrerPart3", r.referrerPart3);
      var table = document.getElementById("referrerList");
      $(table.getElementsByTagName("tbody")[0]).text(
        chrome.i18n.getMessage("referrerList")
      );
      var arr1 = [];
      var arr2 = [];
      var arr3 = [];
      chrome.storage.sync.set({ referrerPart1: arr1 });
      chrome.storage.sync.set({ referrerPart2: arr2 });
      chrome.storage.sync.set({ referrerPart3: arr3 });
      init();
    });
    $("#addDefaultReferrer").on("click", function (e) {
      addDefaultReferrer();
    });

    $("#addReferrerAttribute").on("click", function (e) {
      addReferrer();
      init();
    });
    $("#insertRandom").on("click", function (e) {
      $("#referrerInput").val($("#referrerInput").val() + "[...]");
    });

    // Short-URL tab

    $("#editShortURL").on("click", function (e) {
      $("#userShortURLList").hide();
      $("#shortURLList").toggle();
    });
    $("#addUserDefinedShortURL").on("click", function (e) {
      addShortURL();
    });
    $("#editUserDefinedShortURL").on("click", function (e) {
      $("#shortURLList").hide();
      $("#userShortURLList").toggle();
    });

    // Additional buttons
    $("#saveChanges").on("click", function (e) {
      changes = [];
      $("#statusSettings").html(chrome.i18n.getMessage("savedChanges"));
    });
    $("#revertChanges").on("click", function (e) {
      for (var i = 0; i < changes.length; i++) {
        if (changes[i][0] == "onceClickedDomains")
          chrome.storage.sync.set({ onceClickedDomains: changes[i][1] });
        else if (changes[i][0] == "userDefinedDomains")
          chrome.storage.sync.set({ userDefinedDomains: changes[i][1] });
        else if (changes[i][0] == "timer")
          chrome.storage.sync.set({ timer: changes[i][1] });
        else if (changes[i][0] == "trustedTimerActivated")
          chrome.storage.sync.set({ trustedTimerActivated: changes[i][1] });
        else if (changes[i][0] == "userTimerActivated")
          chrome.storage.sync.set({ userTimerActivated: changes[i][1] });
        else if (changes[i][0] == "blackListActivated")
          chrome.storage.sync.set({ blackListActivated: changes[i][1] });
        else if (changes[i][0] == "trustedListActivated")
          chrome.storage.sync.set({ trustedListActivated: changes[i][1] });
        else if (changes[i][0] == "referrerPart1")
          chrome.storage.sync.set({ referrerPart1: changes[i][1] });
        else if (changes[i][0] == "referrerPart2")
          chrome.storage.sync.set({ referrerPart2: changes[i][1] });
        else if (changes[i][0] == "referrerPart3")
          chrome.storage.sync.set({ referrerPart3: changes[i][1] });
      }
      init();
      $("#statusSettings").html(chrome.i18n.getMessage("reversedChanges"));
    });
    $("#defaultSettings").on("click", function (e) {
      chrome.storage.sync.set({
        onceClickedDomains: [],
        userDefinedDomains: [],
        timer: 3,
        trustedTimerActivated: false,
        userTimerActivated: false,
        blackListActivated: true,
        trustedListActivated: true,
        referrerPart1: [
          "deref-gmx.net",
          "deref-web-02.de/",
          "google.*",
          "google.*",
        ],
        referrerPart2: [
          "/mail/client/[...]/dereferrer/?",
          "/mail/client/[...]/dereferrer/?",
          "/url?",
          "/url?",
        ],
        referrerPart3: ["redirectUrl=", "redirectUrl=", "url=", "q="],
        redirectDomains: [
          "bit.ly",
          "goo.gl",
          "bit.do",
          "tinyurl.com",
          "is.gd",
          "cli.gs",
          "pic.gd",
          "DwarfURL.com",
          "ow.ly",
          "yfrog.com",
          "migre.me",
          "ff.im",
          "tiny.cc",
          "url4.eu",
          "tr.im",
          "twit.ac",
          "su.pr",
          "twurl.nl",
          "snipurl.com",
          "BudURL.com",
          "short.to",
          "ping.fm",
          "Digg.com",
          "post.ly",
          "Just.as",
          "bkite.com",
          "snipr.com",
          "flic.kr",
          "loopt.us",
          "doiop.com",
          "twitthis.com",
          "htxt.it",
          "AltURL.com",
          "RedirX.com",
          "DigBig.com",
          "short.ie",
          "u.mavrev.com",
          "kl.am",
          "wp.me",
          "u.nu",
          "rubyurl.com",
          "om.ly",
          "linkbee.com",
          "Yep.it",
          "posted.at",
          "xrl.us",
          "metamark.net",
          "sn.im",
          "hurl.ws",
          "eepurl.com",
          "idek.net",
          "urlpire.com",
          "chilp.it",
          "moourl.com",
          "snurl.com",
          "xr.com",
          "lin.cr",
          "EasyURI.com",
          "zz.gd",
          "ur1.ca",
          "URL.ie",
          "adjix.com",
          "twurl.cc",
          "s7y.us",
          "EasyURL.net",
          "atu.ca",
          "sp2.ro",
          "Profile.to",
          "ub0.cc",
          "minurl.fr",
          "cort.as",
          "fire.to",
          "2tu.us",
          "twiturl.de",
          "to.ly",
          "BurnURL.com",
          "nn.nf",
          "clck.ru",
          "notlong.com",
          "thrdl.es",
          "spedr.com",
          "vl.am",
          "miniurl.com",
          "virl.com",
          "PiURL.com",
          "1url.com",
          "gri.ms",
          "tr.my",
          "Sharein.com",
          "urlzen.com",
          "fon.gs",
          "Shrinkify.com",
          "ri.ms",
          "b23.ru",
          "Fly2.ws",
          "xrl.in",
          "Fhurl.com",
          "wipi.es",
          "korta.nu",
          "shortna.me",
          "fa.b",
          "WapURL.co.uk",
          "urlcut.com",
          "6url.com",
          "abbrr.com",
          "SimURL.com",
          "klck.me",
          "x.se",
          "2big.at",
          "url.co.uk",
          "ewerl.com",
          "inreply.to",
          "TightURL.com",
          "a.gg",
          "tinytw.it",
          "zi.pe",
          "riz.gd",
          "hex.io",
          "fwd4.me",
          "bacn.me",
          "shrt.st",
          "ln-s.ru",
          "tiny.pl",
          "o-x.fr",
          "StartURL.com",
          "jijr.com",
          "shorl.com",
          "icanhaz.com",
          "updating.me",
          "kissa.be",
          "hellotxt.com",
          "pnt.me",
          "nsfw.in",
          "xurl.jp",
          "yweb.com",
          "urlkiss.com",
          "QLNK.net",
          "w3t.org",
          "lt.tl",
          "twirl.at",
          "zipmyurl.com",
          "urlot.com",
          "a.nf",
          "hurl.me",
          "URLHawk.com",
          "Tnij.org",
          "4url.cc",
          "firsturl.de",
          "Hurl.it",
          "sturly.com",
          "shrinkster.com",
          "ln-s.net",
          "go2cut.com",
          "liip.to",
          "shw.me",
          "XeeURL.com",
          "liltext.com",
          "lnk.gd",
          "xzb.cc",
          "linkbun.ch",
          "href.in",
          "urlbrief.com",
          "2ya.com",
          "safe.mn",
          "shrunkin.com",
          "bloat.me",
          "krunchd.com",
          "minilien.com",
          "ShortLinks.co.uk",
          "qicute.com",
          "rb6.me",
          "urlx.ie",
          "pd.am",
          "go2.me",
          "tinyarro.ws",
          "tinyvid.io",
          "lurl.no",
          "ru.ly",
          "lru.jp",
          "rickroll.it",
          "togoto.us",
          "ClickMeter.com",
          "hugeurl.com",
          "tinyuri.ca",
          "shrten.com",
          "shorturl.com",
          "Quip-Art.com",
          "urlao.com",
          "a2a.me",
          "tcrn.ch",
          "goshrink.com",
          "DecentURL.com",
          "decenturl.com",
          "zi.ma",
          "1link.in",
          "sharetabs.com",
          "shoturl.us",
          "fff.to",
          "hover.com",
          "lnk.in",
          "jmp2.net",
          "dy.fi",
          "urlcover.com",
          "2pl.us",
          "tweetburner.com",
          "u6e.de",
          "xaddr.com",
          "gl.am",
          "dfl8.me",
          "go.9nl.com",
          "gurl.es",
          "C-O.IN",
          "TraceURL.com",
          "liurl.cn",
          "MyURL.in",
          "urlenco.de",
          "ne1.net",
          "buk.me",
          "rsmonkey.com",
          "cuturl.com",
          "turo.us",
          "sqrl.it",
          "iterasi.net",
          "tiny123.com",
          "EsyURL.com",
          "adf.ly",
          "urlx.org",
          "IsCool.net",
          "twitterpan.com",
          "GoWat.ch",
          "poprl.com",
          "njx.me",
          "shrinkify.info",
        ],
      });
      init();
      $("#statusSettings").html(
        chrome.i18n.getMessage("defaultSettingsRestored")
      );
    });
  });
}

// checks if that change in ui has been saved as a recently commited change
function save(list, value) {
  var i = 0;
  for (i = 0; i < changes.length; i++) {
    if (changes[i][0] == list) {
      return;
    }
  }
  changes.push([list, value]);
}

/**
 * adding all entries to the list of referrers
 */
function fillReferrerList() {
  chrome.storage.sync.get(null, function (r) {
    var table = document.getElementById("referrerList");
    $(table.getElementsByTagName("tbody")[0]).text(
      chrome.i18n.getMessage("referrerList")
    );
    var arr1 = r.referrerPart1;
    var arr2 = r.referrerPart2;
    var arr3 = r.referrerPart3;
    for (i = 0; i < arr1.length; i++) {
      if (arr1[i].length > 0) {
        var row = table.insertRow(table.rows.length);
        var cell = row.insertCell(0);
        //var placeholder = arr2[i]? "<span style='color:blue;'> [...] </span>" : "";
        $(cell).html(
          '<div><button id="row' +
            i +
            '" style="margin-right:10px;color:red">X</button><span>' +
            arr1[i] +
            arr2[i] +
            arr3[i] +
            "</span></div>"
        );

        $("#row" + i).on("click", function (e) {
          save("referrerPart1", r.referrerPart1);
          save("referrerPart2", r.referrerPart2);
          save("referrerPart3", r.referrerPart3);
          //var split = $(this).next().html().split('<span style="color:blue;"> [...] </span>');
          var index = $(this).attr("id").replace("row", "");
          $(this).parent().parent().parent().remove();
          //if(!split[1]) split[1] = "";
          var arr1 = r.referrerPart1;
          var arr2 = r.referrerPart2;
          var arr3 = r.referrerPart3;
          arr1.splice(index, 1);
          arr2.splice(index, 1);
          arr3.splice(index, 1);
          chrome.storage.sync.set({ referrerPart1: arr1 });
          chrome.storage.sync.set({ referrerPart2: arr2 });
          chrome.storage.sync.set({ referrerPart3: arr3 });
          init();
        });
      }
    }
  });
}

/**
 * adding all entries to the list of trusted domains
 */
function fillTrustedList() {
  chrome.storage.sync.get(null, function (r) {
    var i = 0;
    var table = document.getElementById("trustedList");
    $(table.getElementsByTagName("tbody")[0]).text(
      chrome.i18n.getMessage("trustedList")
    );
    for (i = 0; i < r.trustedDomains.length; i++) {
      var row = table.insertRow(table.rows.length);
      var cell = row.insertCell(0);
      $(cell).html(r.trustedDomains[i]);
    }
  });
}

/**
 * adding all entries to the list of user defined domains
 */
function fillUserList() {
  chrome.storage.sync.get(null, function (r) {
    var userDomains = r.userDefinedDomains;
    var table = document.getElementById("userList");
    $(table.getElementsByTagName("tbody")[0]).text(
      chrome.i18n.getMessage("userList")
    );
    for (i = 0; i < userDomains.length; i++) {
      var row = table.insertRow(table.rows.length);
      var cell = row.insertCell(0);
      $(cell).html(
        '<div><button id="user' +
          i +
          '" name="' +
          userDomains[i] +
          '" style="margin-right:10px;color:red">X</button><span>' +
          userDomains[i] +
          "</span></div>"
      );
      $("#user" + i).on("click", function (e) {
        save("userDefinedDomains", r.userDefinedDomains);
        var element = $(this).next().html();
        var index = $(this).attr("id").replace("user", "");
        $(this).parent().parent().parent().remove();
        var arr = r.userDefinedDomains;
        arr.splice(index, 1);
        chrome.storage.sync.set({ userDefinedDomains: arr });
      });
    }
  });
}
function addDefaultReferrer() {
  chrome.storage.sync.get(null, function (r) {
    save("referrerPart1", r.referrerPart1);
    save("referrerPart2", r.referrerPart2);
    var arr1 = r.referrerPart1;
    var arr2 = r.referrerPart2;
    var arr3 = r.referrerPart3;
    var index1 = arr1.indexOf("deref-gmx.net");
    var index2 = arr1.indexOf("deref-web-02.de");
    var containsDefaultPath = false;
    var containsDefaultAttribute = false;
    if (index1 > -1 && index2 > -1) {
      containsDefaultPath =
        arr2[index1] == "/mail/client/[...]/dereferrer/?" &&
        arr2[index2] == "/mail/client/[...]/dereferrer/?";
      containsDefaultAttribute =
        arr3[index1] == "redirectUrl=" && arr3[index2] == "redirectUrl=";
    }
    if (!containsDefaultPath && !containsDefaultAttribute) {
      if (index1 == -1) {
        arr1.push("deref-gmx.net");
        arr2.push("/mail/client/[...]/dereferrer/?");
        arr3.push("redirectUrl=");
      }
      if (index2 == -1) {
        arr1.push("deref-web-02.de");
        arr2.push("/mail/client/[...]/dereferrer/?");
        arr3.push("redirectUrl=");
      }
      chrome.storage.sync.set({ referrerPart1: arr1 });
      chrome.storage.sync.set({ referrerPart2: arr2 });
      chrome.storage.sync.set({ referrerPart3: arr3 });
      fillReferrerList();
    }
    document.getElementById("addDefaultReferrer").disabled = true;
  });
}
/**
 * adding one entry to the list of user defined domains
 */
function addUserDefined() {
  chrome.storage.sync.get(null, function (r) {
    save("userDefinedDomains", r.userDefinedDomains);
    var table = document.getElementById("userList");
    var input = $("#userDefinedInput").val().replace(" ", "");
    $("#errorAddUserDefined").html("");
    chrome.runtime.sendMessage({ name: "TLD" }, function (tld) {
      torpedo.publicSuffixList.parse(tld, punycode.toASCII);
      try {
        const href = new URL(input);
        input = extractDomain(href.hostname);
      } catch (e) {
        $("#errorAddUserDefined").html(chrome.i18n.getMessage("nonValidUrl"));
        return;
      }
      if (r.trustedDomains.indexOf(input) > -1 && r.trustedListActivated) {
        $("#errorAddUserDefined").html(
          chrome.i18n.getMessage("alreadyInTrustedUrls")
        );
        return;
      }
      var arr = r.userDefinedDomains;
      if (arr.indexOf(input) > -1) {
        $("#errorAddUserDefined").html(
          chrome.i18n.getMessage("alreadyInUserDefinedDomains")
        );
        return;
      }
      $("#userDefinedInput").val("");
      arr.push(input);
      chrome.storage.sync.set({ userDefinedDomains: arr });

      var row = table.insertRow(table.rows.length);
      var cell = row.insertCell(0);
      $(cell).html(
        '<div><button id="user' +
          table.rows.length +
          '" name="' +
          input +
          '" style="margin-right:10px;color:red">X</button><span>' +
          input +
          "</span></div>"
      );
      $("#userDefinedInput").val("");
      init();
    });
  });
}

/**
 * adding one entry to the list of referrers
 */
function addReferrer() {
  chrome.storage.sync.get(null, function (r) {
    save("referrerPart1", r.referrerPart1);
    save("referrerPart2", r.referrerPart2);
    save("referrerPart3", r.referrerPart3);
    var table = document.getElementById("referrerList");
    var inputHost = $("#referrerInputHost")
      .val()
      .replace(" ", "")
      .toLowerCase();
    var inputPath = $("#referrerInputPath").val().replace(" ", "");
    var inputAttribute = $("#referrerInputAttribute").val().replace(" ", "");

    var arr1 = r.referrerPart1;
    var arr2 = r.referrerPart2;
    var arr3 = r.referrerPart3;

    var i = 0;
    var alreadyInReferrerList = false;
    var alreadyInPart1Index = arr1.indexOf(inputHost, i);
    while (alreadyInPart1Index !== -1) {
      alreadyInPart1Index = arr1.indexOf(inputHost, i);
      if (
        arr2[alreadyInPart1Index] === inputPath &&
        arr3[alreadyInPart1Index] === inputAttribute
      ) {
        alreadyInReferrerList = true;
        break;
      }
      i++;
    }
    if (alreadyInReferrerList) {
      $("#errorAddReferrer").html(
        chrome.i18n.getMessage("alreadyInReferrerList")
      );
      return;
    }
    var row = table.insertRow(table.rows.length);
    var cell = row.insertCell(0);
    if (inputAttribute == undefined) inputAttribute = "";
    //var placeholder = input[1]? "<span style='color:blue'> [...] </span>" : "";
    $(cell).html(
      '<div><button id="row' +
        table.rows.length +
        '" name="' +
        inputHost +
        "," +
        inputPath +
        "," +
        inputAttribute +
        'style="margin-right:10px;color:red">X</button><span>' +
        inputHost +
        inputPath +
        inputAttribute +
        "</span></div>"
    );
    arr1.push(inputHost);
    arr2.push(inputPath);
    arr3.push(inputAttribute);
    chrome.storage.sync.set({ referrerPart1: arr1 });
    chrome.storage.sync.set({ referrerPart2: arr2 });
    chrome.storage.sync.set({ referrerPart3: arr3 });
    $("#referrerInputHost").val("");
    $("#referrerInputPath").val("");
    $("#referrerInputAttribute").val("");
    init();
  });
}

/**
 * adding all entries to the list of Short-URLs
 */
function fillShortURLList() {
  chrome.storage.sync.get(null, function (r) {
    var i = 0;
    var table = document.getElementById("shortURLList");
    $(table.getElementsByTagName("tbody")[0]).text(
      chrome.i18n.getMessage("trustedList")
    );
    for (i = 0; i < r.redirectDomains.length; i++) {
      var row = table.insertRow(table.rows.length);
      var cell = row.insertCell(0);
      $(cell).html(
        '<div><button id="shortURL' +
          i +
          '" style="margin-right:10px;color:red">X</button><span>' +
          r.redirectDomains[i] +
          "</span></div>"
      );

      $("#shortURL" + i).on("click", function (e) {
        save("redirectDomains", r.redirectDomains);
        var index = $(this).attr("id").replace("shortURL", "");
        $(this).parent().parent().parent().remove();
        r.redirectDomains.splice(index, 1);
        chrome.storage.sync.set({ redirectDomains: r.redirectDomains });
        init();
      });
    }
  });
}

/**
 * adding one entry to the list of short urls
 */
function addShortURL() {
  chrome.storage.sync.get(null, function (r) {
    save("redirectDomains", r.redirectDomains);
    var table = document.getElementById("shortURLList");
    var input = $("#userDefinedShortURLInput")
      .val()
      .replace(" ", "")
      .toLowerCase();

    var arr1 = r.redirectDomains;
    if (arr1.indexOf(input) > -1) {
      $("#errorAddUserDefinedShortURL").html(
        chrome.i18n.getMessage("alreadyInReferrerList")
      );
      return;
    }
    var row = table.insertRow(table.rows.length);
    var cell = row.insertCell(0);
    $(cell).html(
      '<div><button id="shortURL' +
        table.rows.length +
        '" name="' +
        input +
        '" style="margin-right:10px;color:red">X</button><span>' +
        input +
        "</span></div>"
    );
    arr1.push(input);
    chrome.storage.sync.set({ redirectDomains: arr1 });
    $("#userDefinedShortURLInput").val("");
    init();
  });
}
