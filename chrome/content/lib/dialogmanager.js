var torpedo = torpedo || {};

torpedo.dialogmanager = torpedo.dialogmanager || {};

torpedo.dialogmanager.createInstruction = function (windowWidth,windowHeight) 
{
	var dimension = torpedo.functions.calcWindowPosition(windowWidth,windowHeight);
	window.openDialog("chrome://torpedo/content/dialog/instruction.xul", "bmarks", "chrome, dialog,resizable=yes, modal,top="+dimension.top+",left="+dimension.left+",width="+windowWidth+",height="+windowHeight+"");
}
