var torpedo = torpedo || {};
torpedo.target = null;
torpedo.api = null;
torpedo.uri = "";
torpedo.url = "";
torpedo.domain = "";
torpedo.pathname = "";
torpedo.publicsuffixlist = "";
torpedo.event;
torpedo.location;
torpedo.opened = false;
torpedo.progUrl = false;
torpedo.hasTooltip = false;

$(document).ready(function () {
  chrome.runtime.sendMessage({ name: "TLD" }, function (r) {
    torpedo.publicSuffixList.parse(r, punycode.toASCII);
  });

  //torpedo.location = window.location.host;
  torpedo.opened = false;
  torpedo.progUrl = false;
  torpedo.hasTooltip = false;

  $("body").unbind();

  $("body").on("mouseenter", "a", function (e) {
    openTooltip(e, "a");
  });

  $("body").on("mouseenter", "form", function (e) {
    openTooltip(e, "form");
    torpedo.progUrl = true;
  });
});

function openTooltip(e, type) {
  torpedo.target = e.currentTarget;
  torpedo.progUrl = false;
  torpedo.hasTooltip = false;

  if (type == "a") {
    if (
      torpedo.target.href.indexOf("mailto:") > -1 ||
      torpedo.opened ||
      $(torpedo.target).hasClass("qtip-close")
    )
      return;
    if (torpedo.target.href == "") {
      try {
        $(torpedo.target).attr("href", e.relatedTarget.href);
      } catch (err) {}
    }
  }

  torpedo.state = "unknown";
  chrome.storage.sync.get(null, function (r) {
    try {
      // try to construct a URL, this will fail if it's a non-valid URL
      var url;
      if (type == "form") {
        url = new URL(torpedo.target.action);
      } else {
        url = new URL(torpedo.target.href);
      }

      setNewUrl(url);

      // checks for programmed tooltip (if there, then assigned to tooltipURL)
      var tooltipURL = hasTooltip(torpedo.target);

      if (tooltipURL != "<HAS_NO_TOOLTIP>") {
        torpedo.hasTooltip = isTooltipMismatch(tooltipURL, torpedo.url);
      }

      $(torpedo.target).on("mouseenter", function (event) {
        if (torpedo.timerInterval != null) {
          clearInterval(torpedo.timerInterval);
        }
      });

      // open the qTip
      $(torpedo.target).qtip({
        id: "torpedo",
        content: {
          text: tooltipText(url),
          button: true,
        },
        show: {
          event: e.type,
          ready: true,
          solo: true,
          delay: 20,
        },
        hide: {
          fixed: true,
          event: "mouseleave",
          delay: 200,
        },
        position: {
          my: "top left",
          at: "bottom left",
          target: $(torpedo.target),
          adjust: {
            y: 0,
            x: 0,
            mouse: false,
            method: "flip flip",
            resize: true,
          },
        },
        style: {
          tip: false,
          classes: "torpedoTooltip",
        },
        events: {
          render: function (event, api) {
            torpedo.api = api;
            torpedo.tooltip = api.elements.content;

            $(torpedo.tooltip).on("mouseenter", function () {
              torpedo.opened = true;
            });

            $(torpedo.tooltip).on("mouseleave", function () {
              torpedo.opened = false;
            });

            // init the tooltip elements and texts
            initTooltip();
            updateTooltip();
          },
          hide: function () {
            if (torpedo.timerInterval != null) {
              clearInterval(torpedo.timerInterval);
            }
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
}
