/**
*   resolve a redirection url, f.e. tinyurl
*/
function resolveRedirect(event) {
	showLoaderWithOverlay();
	chrome.runtime.sendMessage({ name: "redirect", url: torpedo.url }, function (r) {
	  torpedo.api.set("hide.event", "unfocus");
	  torpedo.api.set("hide.delay", 0);
	  try {
		const href = new URL(r);
		setNewUrl(href);
		updateTooltip();
	  } catch (e) { console.log(e) }
	});
  };
  
  /**
  *   resolve a referrer url, f.e. https://deref-gmx.net/mail/client/..
  */
  function resolveReferrer(r) {
	var url = torpedo.url;
	var arr1 = r.referrerPart1;
	var arr2 = r.referrerPart2;
	var arr3 = r.referrerPart3;
  
	for (var i = 0; i < (arr1.length + arr2.length); i++) {
	  if (url.indexOf(arr1[i]) > -1) {
		var cut = arr3[i] ? arr3[i] : arr2[i];
		var index = url.indexOf(cut);
		var temp = url.substring(index + cut.length, url.length);
		temp = decodeURIComponent(temp);
		try {
		  const href = new URL(temp);
		  setNewUrl(href);
		} catch (e) { }
		break;
	  }
	}
  };
  
  
  /**
   * checks if the current url is a referrer 
   * @param url
   * @return resolved referrer or <NO_RESOLVED_REFERRER> if the current url is no referrer or there was an error 
   */
  function matchReferrer(url) {
	const href = new URL(url);
	var hostnameURL = href.hostname;
  
	var referrerDomainArr = r.referrerPart1;
	var referrerPathArr = r.referrerPart2;
	var referrerAttributeArr = r.referrerPart3;
  
	if (referrerDomainArr === null || referrerPathArr === null || !hostnameURL) {
	  return "<NO_RESOLVED_REFERRER>";
	}
  
	var indices = referrerDomainArr.map(function (element, i) {
	  var domainParts = element.split("*").filter(String);
	  return domainParts.every(function (el) {
		return hostnameURL.includes(el);
	  }, hostnameURL) ? i : '';
	}, hostnameURL).filter(String);
  
	for (var i = indices.length - 1; i >= 0; i--) {
	  var ind = indices[i];
	  var pathParts = referrerPathArr[ind].split("[...]").filter(String);
	  for (path of pathParts) {
		if (!url.includes(path)) {
		  indices = indices.splice(i, 1);
		  break;
		}
	  }
	}
  
	for (index of indices) {
	  var cut = referrerAttributeArr[index];
	  var urlAttrIndex = url.indexOf(cut);
	  var temp = url.substring(urlAttrIndex + cut.length, url.length);
	  temp = decodeURIComponent(temp);
	  if (temp.startsWith("http") || temp.startsWith("https") || temp.startsWith("www")) {
		url = temp;
		return url;
	  }
  
	}
	return "<NO_RESOLVED_REFERRER>";
  }
  
  
