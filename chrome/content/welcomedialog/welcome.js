var torpedo = torpedo || {};
torpedo.welcome = torpedo.welcome || {};

torpedo.welcome.picture = function(picture) {
	if(picture==0){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic").src="chrome://torpedo/skin/welcome_de.png";
		else document.getElementById("welcomePic").src="chrome://torpedo/skin/welcome_en.png";
	}
	if(picture==1){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic1").src="chrome://torpedo/skin/welcome_de.png";
		else document.getElementById("welcomePic1").src="chrome://torpedo/skin/welcome_en.png";
	}
}

/*window.addEventListener("load", function load(event){
	window.moveTo(window.arguments[1],window.arguments[0])
}, false);*/
