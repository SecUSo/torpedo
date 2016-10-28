var torpedo = torpedo || {};
torpedo.dialogmanager = torpedo.dialogmanager || {};

torpedo.dialogmanager.createInstruction = function () {	
    windowWidth=1100;
	windowHeight=690;
    var left = (screen.width/2)-(windowWidth/2);
    var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/dialog/instruction.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal,top='+top+',left='+left+', width='+width+',height='+height+'", top,left);
};

torpedo.dialogmanager.createDelete = function (windowWidth,windowHeight)  {
	window.openDialog("chrome://torpedo/content/dialog/delete.xul", "bmarks", "chrome, dialog,resizable=no,centerscreen, modal,width='+windowWidth+',height='+windowHeight+'");
};

torpedo.dialogmanager.createDefaultDelete = function (windowWidth,windowHeight)  {
	window.openDialog("chrome://torpedo/content/dialog/defaultdelete.xul", "bmarks", "chrome, dialog,resizable=no,centerscreen, modal,width='+windowWidth+',height='+windowHeight+'");
};

torpedo.dialogmanager.createEdit = function () {
	window.openDialog("chrome://torpedo/content/dialog/edit.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen, width='300px'");
};

torpedo.dialogmanager.createInfo = function () {
	window.openDialog("chrome://torpedo/content/dialog/info.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen");
};

torpedo.dialogmanager.showDefaults = function(){
	window.openDialog("chrome://torpedo/content/dialog/defaults.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen");
};

torpedo.dialogmanager.showRedirects = function(){
	window.openDialog("chrome://torpedo/content/dialog/redirects.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen");
};

torpedo.dialogmanager.createWelcome = function(){
    windowWidth=900;
	windowHeight=580;
    var left = (screen.width/2)-(windowWidth/2);
    var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/dialog/welcome.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};