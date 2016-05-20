// Called once if and only if the user clicks OK
function onLoad(picture) {
	if(picture=="instruction") {
	    if (navigator.language.indexOf("en") > -1) 
		{
	      document.getElementById("instructionPic").src="chrome://torpedo/skin/instruction_en.png";
	    } 
		else if (navigator.language.indexOf("de") > -1) 
		{
			document.getElementById("instructionPic").src="chrome://torpedo/skin/instruction_de.png";
	    }
		else
		{
			document.getElementById("instructionPic").src="chrome://torpedo/skin/instruction_en.png";
		}
	}
	else{ 
		if (navigator.language.indexOf("en") > -1) 
		{
	      document.getElementById("welcomePic").src="chrome://torpedo/skin/welcome_en.png";
	    } 
		else if (navigator.language.indexOf("de") > -1) 
		{
			document.getElementById("welcomePic").src="chrome://torpedo/skin/welcome_de.png";
	    }
		else
		{
			document.getElementById("welcomePic").src="chrome://torpedo/skin/welcome_en.png";
		}
	}
}