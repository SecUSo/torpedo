var torpedo = torpedo || {};
torpedo.redirect = torpedo.redirect || {};

document.addEventListener('dialogaccept', function (event) {
	torpedoOptions.addEntries('RedirectionList');
	event.preventDefault();
});

document.addEventListener('dialogextra1', function () {
	torpedo.redirect.delete();
});



torpedo.redirect.delete = function () {
	var redirects = torpedo.prefs.getStringPref("RedirectionList");
	var selected = document.getElementById('redirectsList').selectedItem.label;
	if (selected != null && redirects.length > 0) {
		// cut selected element out of list of redirect domains
		torpedoOptions.removeStringFromList(selected, "RedirectionList");
		torpedo.redirect.displayRedirects();
	}
};

torpedo.redirect.displayRedirects = function () {
	var reList = document.getElementById('redirectsList');
	var redirects = torpedo.prefs.getStringPref("RedirectionList");

	// remove all elements first
	while (reList.firstChild) reList.removeChild(reList.firstChild);

	document.documentElement.getButton("extra1").disabled = true;
	document.documentElement.getButton("accept").disabled = true;

	torpedoOptions.createRichList(redirects, reList);
};
