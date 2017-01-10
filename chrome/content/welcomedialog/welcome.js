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
			document.getElementById("welcomePic").src="chrome://torpedo/skin/tutorial1_de.png";
		else document.getElementById("welcomePic").src="chrome://torpedo/skin/tutorial1_en.png";
	}
	if(picture==1){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic1").src="chrome://torpedo/skin/tutorial2_de.png";
		else document.getElementById("welcomePic1").src="chrome://torpedo/skin/tutorial2_en.png";
	}
	if(picture==2){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic2").src="chrome://torpedo/skin/tutorial3_de.png";
		else document.getElementById("welcomePic2").src="chrome://torpedo/skin/tutorial3_en.png";
	}
	if(picture==3){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic3").src="chrome://torpedo/skin/tutorial4_de.png";
		else document.getElementById("welcomePic3").src="chrome://torpedo/skin/tutorial4_en.png";
	}
	if(picture==4){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic4").src="chrome://torpedo/skin/tutorial5_de.png";
		else document.getElementById("welcomePic4").src="chrome://torpedo/skin/tutorial5_en.png";
	}
	if(picture==5){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic5").src="chrome://torpedo/skin/tutorial6_de.png";
		else document.getElementById("welcomePic5").src="chrome://torpedo/skin/tutorial6_en.png";
	}
	if(picture==6){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic6").src="chrome://torpedo/skin/tutorial7_de.png";
		else document.getElementById("welcomePic6").src="chrome://torpedo/skin/tutorial7_en.png";
	}
	if(picture==7){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic7").src="chrome://torpedo/skin/tutorial8_de.png";
		else document.getElementById("welcomePic7").src="chrome://torpedo/skin/tutorial8_en.png";
	}
	if(picture==8){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic8").src="chrome://torpedo/skin/tutorial9_de.png";
		else document.getElementById("welcomePic8").src="chrome://torpedo/skin/tutorial9_en.png";
	}
	if(picture==9){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic9").src="chrome://torpedo/skin/tutorial10_de.png";
		else document.getElementById("welcomePic9").src="chrome://torpedo/skin/tutorial10_en.png";
	}
	if(picture==10){
		if (navigator.language.indexOf("de") > -1)
			document.getElementById("welcomePic10").src="chrome://torpedo/skin/tutorial11_de.png";
		else document.getElementById("welcomePic10").src="chrome://torpedo/skin/tutorial11_en.png";
	}
}

window.addEventListener("load", function load(event){
	window.moveTo(window.arguments[1],window.arguments[0])
}, false);
