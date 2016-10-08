function picture(picture) {
	if(picture=="instruction") {
	    if (navigator.language.indexOf("de") > -1) 
	    	document.getElementById("welcomePic").src="chrome://torpedo/skin/instruction_de.png";
		else document.getElementById("welcomePic").src="chrome://torpedo/skin/instruction_en.png";
	}
	if(picture=="welcome"){ 
		if (navigator.language.indexOf("de") > -1) 
			document.getElementById("welcomePic").src="chrome://torpedo/skin/welcome_de.png";
		else document.getElementById("welcomePic").src="chrome://torpedo/skin/welcome_en.png";
	}
}

window.addEventListener("load", function load(event)
{
    window.moveTo(window.arguments[1],window.arguments[0]);  
}, false);
