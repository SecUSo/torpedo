var torpedo = torpedo || {};
torpedo.welcome = torpedo.welcome || {};

torpedo.welcome.picture = function(picture) {
	if(picture==-1){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("updatePic").src="chrome://torpedo/skin/update_de.png";
		else document.getElementById("updatePic").src="chrome://torpedo/skin/update_de.png";
	}
	if(picture==0){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic").src="chrome://torpedo/skin/tutorial1de.png";
		else document.getElementById("welcomePic").src="chrome://torpedo/skin/tutorial1en.png";
	}
	if(picture==1){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic1").src="chrome://torpedo/skin/tutorial2de.png";
		else document.getElementById("welcomePic1").src="chrome://torpedo/skin/tutorial2en.png";
	}
	if(picture==2){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic2").src="chrome://torpedo/skin/tutorial3de.png";
		else document.getElementById("welcomePic2").src="chrome://torpedo/skin/tutorial3en.png";
	}
	if(picture==3){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic3").src="chrome://torpedo/skin/tutorial4de.png";
		else document.getElementById("welcomePic3").src="chrome://torpedo/skin/tutorial4en.png";
	}
	if(picture==4){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic4").src="chrome://torpedo/skin/tutorial5de.png";
		else document.getElementById("welcomePic4").src="chrome://torpedo/skin/tutorial5en.png";
	}
	if(picture==5){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic5").src="chrome://torpedo/skin/tutorial6de.png";
		else document.getElementById("welcomePic5").src="chrome://torpedo/skin/tutorial6en.png";
	}
	if(picture==6){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic6").src="chrome://torpedo/skin/tutorial7de.png";
		else document.getElementById("welcomePic6").src="chrome://torpedo/skin/tutorial7en.png";
	}
	if(picture==7){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic7").src="chrome://torpedo/skin/tutorial8de.png";
		else document.getElementById("welcomePic7").src="chrome://torpedo/skin/tutorial8en.png";
	}
	if(picture==8){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic8").src="chrome://torpedo/skin/tutorial9de.png";
		else document.getElementById("welcomePic8").src="chrome://torpedo/skin/tutorial9en.png";
	}
	if(picture==9){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic9").src="chrome://torpedo/skin/tutorial10de.png";
		else document.getElementById("welcomePic9").src="chrome://torpedo/skin/tutorial10en.png";
	}
	if(picture==10){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic10").src="chrome://torpedo/skin/tutorial11de.png";
		else document.getElementById("welcomePic10").src="chrome://torpedo/skin/tutorial11en.png";
	}
}

/*window.addEventListener("load", function load(event){
	window.moveTo(window.arguments[1],window.arguments[0])
}, false);*/
