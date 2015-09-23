var torpedo = torpedo || {};

torpedo.dialogmanager = torpedo.dialogmanager || {};

torpedo.dialogmanager.createRedirection = function (windowWidth,windowHeight,description,url,question) 
{
	var baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
	var params = {inn:{question: question,description: description,url: url,domain: baseDomain}, out:{accept:false}};
	var dimension = torpedo.functions.calcWindowPosition(windowWidth,windowHeight);
	
	window.openDialog("chrome://torpedo/content/dialog/redirection.xul", "bmarks", "chrome, dialog,resizable=yes, modal,top="+dimension.top+",left="+dimension.left+",width="+windowWidth+",height="+windowHeight+"",params);
	
	return params.out.accept;
}

torpedo.dialogmanager.createInstruction = function (windowWidth,windowHeight) 
{
	var dimension = torpedo.functions.calcWindowPosition(windowWidth,windowHeight);
	window.openDialog("chrome://torpedo/content/dialog/instruction.xul", "bmarks", "chrome, dialog,resizable=yes, modal,top="+dimension.top+",left="+dimension.left+",width="+windowWidth+",height="+windowHeight+"");
}
