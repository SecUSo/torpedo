var torpedo = torpedo || {};

torpedo.dialogmanager = torpedo.dialogmanager || {};

torpedo.dialogmanager.createInstruction = function (windowWidth,windowHeight) 
{
	var dimension = torpedo.functions.calcWindowPosition(windowWidth,windowHeight);
	window.openDialog("chrome://torpedo/content/dialog/instruction.xul", "bmarks", "chrome=yes, dialog,resizable=yes, modal, centerscreen, top='+dimension.top+',left='+dimension.left+', width='+windowWidth+',height='+windowHeight+'");
};

torpedo.dialogmanager.createDelete = function (windowWidth,windowHeight, dimension)  
{
	window.openDialog("chrome://torpedo/content/dialog/delete.xul", "bmarks", "chrome, dialog,resizable=yes, modal,top="+dimension.top+",left="+dimension.left+",width="+windowWidth+",height="+windowHeight+"");
};

torpedo.dialogmanager.createEdit = function () {
	window.openDialog("chrome://torpedo/content/dialog/edit.xul", "bmarks", "chrome=yes, dialog,resizable=yes, modal, centerscreen");
};

torpedo.dialogmanager.showDefaults = function(){
	window.openDialog("chrome://torpedo/content/dialog/defaults.xul", "bmarks", "chrome=yes, dialog,resizable=yes, modal, centerscreen");
};