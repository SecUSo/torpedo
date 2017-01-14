var torpedo = torpedo || {};
torpedo.welcome = torpedo.welcome || {};

torpedo.welcome.picture = function(picture) {
	if(picture==-1){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("updatePic").src="chrome://torpedo/skin/update_de.png";
		else document.getElementById("updatePic").src="chrome://torpedo/skin/update_en.png";
	}
	if(picture==0){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic").src="chrome://torpedo/skin/tutorial_de-01.png";
		else document.getElementById("welcomePic").src="chrome://torpedo/skin/tutorial_en-01.png";
	}
	if(picture==1){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic1").src="chrome://torpedo/skin/tutorial_de-02.png";
		else document.getElementById("welcomePic1").src="chrome://torpedo/skin/tutorial_en-02.png";
	}
	if(picture==2){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic2").src="chrome://torpedo/skin/tutorial_de-03.png";
		else document.getElementById("welcomePic2").src="chrome://torpedo/skin/tutorial_en-03.png";
	}
	if(picture==3){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic3").src="chrome://torpedo/skin/tutorial_de-04.png";
		else document.getElementById("welcomePic3").src="chrome://torpedo/skin/tutorial_en-04.png";
	}
	if(picture==4){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic4").src="chrome://torpedo/skin/tutorial_de-05.png";
		else document.getElementById("welcomePic4").src="chrome://torpedo/skin/tutorial_en-05.png";
	}
	if(picture==5){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic5").src="chrome://torpedo/skin/tutorial_de-06.png";
		else document.getElementById("welcomePic5").src="chrome://torpedo/skin/tutorial_en-06.png";
	}
	if(picture==6){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic6").src="chrome://torpedo/skin/tutorial_de-07.png";
		else document.getElementById("welcomePic6").src="chrome://torpedo/skin/tutorial_en-07.png";
	}
	if(picture==7){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic7").src="chrome://torpedo/skin/tutorial_de-08.png";
		else document.getElementById("welcomePic7").src="chrome://torpedo/skin/tutorial_en-08.png";
	}
	if(picture==8){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic8").src="chrome://torpedo/skin/tutorial_de-09.png";
		else document.getElementById("welcomePic8").src="chrome://torpedo/skin/tutorial_en-09.png";
	}
	if(picture==9){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic9").src="chrome://torpedo/skin/tutorial_de-10.png";
		else document.getElementById("welcomePic9").src="chrome://torpedo/skin/tutorial_en-10.png";
	}
	if(picture==10){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic10").src="chrome://torpedo/skin/tutorial_de-11.png";
		else document.getElementById("welcomePic10").src="chrome://torpedo/skin/tutorial_en-11.png";
	}
}

window.addEventListener("load", function load(event){
	window.moveTo(window.arguments[1],window.arguments[0])
}, false);
