var torpedo = torpedo || {};
torpedo.dialogmanager = torpedo.dialogmanager || {};

torpedo.dialogmanager.createDelete = function ()  {
  windowWidth=700;
	windowHeight=500;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
  window.openDialog("chrome://torpedo/content/dialog/delete.xul", "bmarksdelete", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.options = function() {
  window.openDialog('chrome://torpedo/content/options.xul','bmarksoptions','chrome=yes, dialog,resizable=no, modal, centerscreen');
}
torpedo.dialogmanager.createDefaultDelete = function (windowWidth,windowHeight)  {
	window.openDialog("chrome://torpedo/content/dialog/defaultdelete.xul", "bmarks", "chrome, dialog,resizable=no,centerscreen, modal,width='+windowWidth+',height='+windowHeight+'");
};

torpedo.dialogmanager.createEdit = function () {
	window.openDialog("chrome://torpedo/content/dialog/edit.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen, width='300px'");
};

torpedo.dialogmanager.createInfo = function () {
	window.openDialog("chrome://torpedo/content/dialog/info.xul", "bmarksinfo", "chrome=yes, dialog,resizable=no, modal, centerscreen");
};

torpedo.dialogmanager.showDefaults = function(){
	window.openDialog("chrome://torpedo/content/dialog/defaults.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, centerscreen");
};

torpedo.dialogmanager.createUnknownInfo = function(){
  windowWidth=700;
	windowHeight=500;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
  window.openDialog("chrome://torpedo/content/dialog/unknown.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.createUpdate = function(){
  windowWidth=600;
	windowHeight=390;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/update.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.createWelcome = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};
torpedo.dialogmanager.welcome1 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome1.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};
torpedo.dialogmanager.welcome2 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome2.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.welcome3 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome3.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.welcome4 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome4.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.welcome5 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome5.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.welcome6 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome6.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.welcome7 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome7.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.welcome8 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome8.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.welcome9 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome9.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};

torpedo.dialogmanager.welcome10 = function(){
  windowWidth=900;
	windowHeight=700;
  var left = (screen.width/2)-(windowWidth/2);
  var top = (screen.height/2)-(windowHeight/2);
	window.openDialog("chrome://torpedo/content/welcomedialog/welcome10.xul", "bmarks", "chrome=yes, dialog,resizable=no, modal, top='+top+',left='+left+',width='+windowWidth+',height='+windowHeight+'",top,left);
};
