var torpedo = torpedo || {};
torpedo.dialogmanager = torpedo.dialogmanager || {};


Components.utils.import("resource://gre/modules/Services.jsm");

torpedo.dialogmanager.createDelete = function () {
	windowWidth = 700;
	windowHeight = 500;
	var left = (screen.width / 2) - (windowWidth / 2);
	var top = (screen.height / 2) - (windowHeight / 2);
	window.openDialog("chrome://torpedo/content/dialog/delete.xul", "bmarksdelete", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'", top, left);
};

torpedo.dialogmanager.options = function () {
	window.openDialog('chrome://torpedo/content/options.xul', 'bmarksoptions', 'chrome=yes, dialog,resizable=no, modal, centerscreen');
}
torpedo.dialogmanager.createDefaultDelete = function (windowWidth, windowHeight) {
	window.openDialog("chrome://torpedo/content/dialog/defaultdelete.xul", "bmarks", "chrome, dialog,resizable=no,centerscreen, modal,width='+windowWidth+',height='+windowHeight+'");
};

torpedo.dialogmanager.createEdit = function () {
	window.openDialog("chrome://torpedo/content/dialog/edit.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen, width='300px'");
};

torpedo.dialogmanager.createEditCloudDomains = function () {
	window.openDialog("chrome://torpedo/content/dialog/cloud.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen, width='300px'");
};

torpedo.dialogmanager.createEditRedirect = function () {
	window.openDialog("chrome://torpedo/content/dialog/redirects.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen, width='300px'");
};

torpedo.dialogmanager.createInfo = function () {
	window.openDialog("chrome://torpedo/content/dialog/info.xul", "bmarksinfo", "chrome=yes, dialog,resizable=no, modal, centerscreen");
};

torpedo.dialogmanager.showDefaults = function () {
	window.openDialog("chrome://torpedo/content/dialog/defaults.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen");
};

torpedo.dialogmanager.createUnknownInfo = function () {
	windowWidth = 700;
	windowHeight = 500;
	var left = (screen.width / 2) - (windowWidth / 2);
	var top = (screen.height / 2) - (windowHeight / 2);
	window.openDialog("chrome://torpedo/content/dialog/unknown.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'", top, left);
};

torpedo.dialogmanager.openTutorial = function () {
	window.openDialog("chrome://torpedo/content/dialog/guide.xul", "torpedo-guide", "chrome=yes, dialog,resizable=no, modal");
};

torpedo.dialogmanager.deleteDB = function () {
	window.openDialog("chrome://torpedo/content/dialog/deleteDB.xul", "bmarksinfo", "chrome=yes, dialog,resizable=no, modal, centerscreen");
};