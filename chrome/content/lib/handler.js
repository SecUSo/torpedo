var torpedo = torpedo || {};
var clickTimer = null, countDownTimer = null;
var tempTarget;
var Url;
var redirects = [".tk","1u.ro","1url.com","2pl.us","2tu.us","3.ly","a.gd","a.gg","a.nf","a2a.me","abe5.com","adjix.com","alturl.com","atu.ca","awe.sm","b23.ru","bacn.me","bit.ly","bkite.com","blippr.com","blippr.com","bloat.me","bt.io","budurl.com","buk.me","burnurl.com","c.shamekh.ws","cd4.me","chilp.it","chs.mx","clck.ru","cli.gs","clickthru.ca","cort.as","cuthut.com","cutt.us","cuturl.com","decenturl.com","df9.net","digs.by","doiop.com","dwarfurl.com","easyurl.net","eepurl.com","eezurl.com","ewerl.com","fa.by","fav.me","fb.me","ff.im","fff.to","fhurl.com","flic.kr","flq.us","fly2.ws","fuseurl.com","fwd4.me","getir.net","gl.am","go.9nl.com","go2.me","golmao.com","goo.gl","goshrink.com","gri.ms","gurl.es","hellotxt.com","hex.io","href.in","htxt.it","hugeurl.com","hurl.ws","icanhaz.com","icio.us","idek.net","is.gd","it2.in","ito.mx","j.mp","jijr.com","kissa.be","kl.am","korta.nu","l9k.net","liip.to","liltext.com","lin.cr","linkbee.com","littleurl.info","liurl.cn","ln-s.net","ln-s.ru","lnkurl.com","loopt.us","lru.jp","lt.tl","lurl.no","memurl.com","migre.me","minilien.com","miniurl.com","miniurls.org","minurl.fr","moourl.com","myurl.in","ncane.com","netnet.me","nn.nf","o-x.fr","ofl.me","omf.gd","ow.ly","oxyz.info","p8g.tw","parv.us","pic.gd","ping.fm","piurl.com","plurl.me","pnt.me","poll.fm","pop.ly","poprl.com","post.ly","posted.at","ptiturl.com","qurlyq.com","rb6.me","readthis.ca","redirects.ca","redirx.com","relyt.us","retwt.me","ri.ms","rickroll.it","rly.cc","rsmonkey.com","rubyurl.com","rurl.org","s3nt.com","s7y.us","saudim.ac","short.ie","short.to","shortna.me","shoturl.us","shrinkster.com","shrinkurl.us","shrtl.com","shw.me","simurl.net","simurl.org","simurl.us","sn.im","sn.vc","snipr.com","snipurl.com","snurl.com","soo.gd","sp2.ro","spedr.com","starturl.com","stickurl.com","sturly.com","su.pr","t.co","takemyfile.com","tcrn.ch","teq.mx","thrdl.es","tighturl.com","tiny.cc","tiny.pl","tinyarro.ws","tinytw.it","tinyurl.com","tl.gd","tnw.to","to.ly","togoto.us","tr.im","tr.my","trcb.me","tumblr.com","tw0.us","tw1.us","tw2.us","tw5.us","tw6.us","tw8.us","tw9.us","twa.lk","twd.ly","twi.gy","twit.ac","twitthis.com","twiturl.de","twitzap.com","twtr.us","twurl.nl","u.mavrev.com","u.nu","ub0.cc","updating.me","ur1.ca","url.co.uk","url.ie","url.inc-x.eu","url4.eu","urlborg.com","urlbrief.com","urlcut.com","urlhawk.com","urlkiss.com","urlpire.com","urlvi.be","urlx.ie","uservoice.com","ustre.am","virl.com","vl.am","wa9.la","wapurl.co.uk","wipi.es","wkrg.com","wp.me","x.co","x.hypem.com","x.se","xav.cc","xeeurl.com","xr.com","xrl.in","xrl.us","xurl.jp","xzb.cc","yatuc.com","ye-s.com","yep.it","yfrog.com","zi.pe","zz.gd"];

var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.handler = torpedo.handler || {};

torpedo.handler.MouseLeavetimer;

torpedo.handler.mouseOverTooltipPane = function (event)
{
	clearTimeout(torpedo.handler.MouseLeavetimer);
};

torpedo.handler.mouseDownTooltipPane = function (event)
{
	torpedo.handler.MouseLeavetimer = setTimeout(function (e)
	{
		document.getElementById("tooltippanel").hidePopup();

		if(countDownTimer != null)
		{
			clearInterval(countDownTimer);
			countDownTimer = null;
		}

		if(clickTimer != null)
		{
			clearTimeout(clickTimer);
		}
	}, 10);
};

var alreadyClicked = "";

torpedo.handler.mouseOverHref = function (event)
{
	clearTimeout(torpedo.handler.MouseLeavetimer);
	var panel = document.getElementById("tooltippanel");
	tempTarget = torpedo.functions.findParentTagTarget(event,'A');
	var tempTargetc = event.target || event.srcElement;
	var url = tempTarget.href;
	torpedo.updateTooltip(url);
	alreadyClicked = "";
	var redirect = false;
	for(var i = 0; i < redirects.length; i++){
		if(url.contains(redirects[i])) {
			redirect = true;
			break;
		}
	}
	if(redirect) torpedo.functions.traceUrl(url);

	panel.openPopup(tempTarget, "after_start", 0, 0, true, false);
};

torpedo.handler.setCountDownTimer = function (url) {
	Url = url;
	if(countDownTimer == null){
		countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer"),'countdown', url);
		clickTimer = setTimeout(function()
		{
			if(clickTimer != null)
			{
				clearTimeout(clickTimer);
			}
		}, torpedo.prefs.getIntPref("blockingTimer")*1000);
	}
};

torpedo.handler.resetCountDownTimer = function (){
	if(countDownTimer != null)
		{
			clearInterval(countDownTimer);
			countDownTimer = null;
		}

		if(clickTimer != null)
		{
			clearTimeout(clickTimer);
		}
	torpedo.handler.setCountDownTimer(Url);
};

torpedo.handler.mouseDownHref = function (event)
{
	torpedo.handler.MouseLeavetimer = setTimeout(function (e)
	{
		document.getElementById("tooltippanel").hidePopup();

		if(countDownTimer != null)
		{
			clearInterval(countDownTimer);
			countDownTimer = null;
		}

		if(clickTimer != null)
		{
			clearTimeout(clickTimer);
		}
	}, 10);
};

torpedo.handler.mouseClickHref = function (event)
{
	var url = torpedo.functions.getHref();
	
	if(alreadyClicked == ""){
		alreadyClicked = url;

		var baseDomain = torpedo.functions.getDomainWithFFSuffix(url);

	 	torpedo.db.pushUrl(baseDomain);

		var ioservice = Components.classes["@mozilla.org/network/io-service;1"]
	                          .getService(Components.interfaces.nsIIOService);

		var uriToOpen = ioservice.newURI(url, null, null);

		var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
		                      .getService(Components.interfaces.nsIExternalProtocolService);

		// now, open it!
		extps.loadURI(uriToOpen, null);
	}
};

torpedo.handler.mouseClickInfoButton = function (event)
{
	torpedo.dialogmanager.createInstruction(1080,607.5);
};

torpedo.handler.mouseClickDeleteButton = function(event){
	torpedo.dialogmanager.createDelete(440,117);
};

torpedo.handler.mouseClickEditButton = function(event){
	torpedo.dialogmanager.createEdit();
};

torpedo.handler.mouseClickDefaultsButton = function (event) {
	torpedo.dialogmanager.showDefaults();
};

