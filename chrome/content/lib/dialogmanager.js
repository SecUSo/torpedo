var torpedo = torpedo || {};
torpedo.dialogmanager = torpedo.dialogmanager || {};

torpedo.dialogmanager.createInstruction = function (windowWidth,windowHeight) 
{
    var left = (screen.width/2)-(windowWidth/2);
    var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/dialog/instruction.xul", "bmarks", "chrome=yes, dialog,resizable=yes, modal,top='+top+',left='+left+', width='+width+',height='+height+'");
};

torpedo.dialogmanager.createDelete = function (windowWidth,windowHeight)  
{
	window.openDialog("chrome://torpedo/content/dialog/delete.xul", "bmarks", "chrome, dialog,resizable=yes,centerscreen, modal,width='+windowWidth+',height='+windowHeight+'");
};

torpedo.dialogmanager.createEdit = function () {
	window.openDialog("chrome://torpedo/content/dialog/edit.xul", "bmarks", "chrome=yes, dialog,resizable=yes, modal, centerscreen");
};

torpedo.dialogmanager.createInfo = function () {
	window.openDialog("chrome://torpedo/content/dialog/info.xul", "bmarks", "chrome=yes, dialog,resizable=yes, modal, centerscreen");
};

torpedo.dialogmanager.showDefaults = function(){
	window.openDialog("chrome://torpedo/content/dialog/defaults.xul", "bmarks", "chrome=yes, dialog,resizable=yes, modal, centerscreen");
};

torpedo.dialogmanager.createWelcome = function(windowWidth, windowHeight)
{
    var left = (screen.width/2)-(windowWidth/2);
    var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/dialog/welcome.xul", "bmarks", "chrome=yes, dialog,resizable=yes, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'");
};