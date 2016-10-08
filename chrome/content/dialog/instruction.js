// Called once if and only if the user clicks OK
function onLoad() {
	if (navigator.language.indexOf("de") > -1)
	    document.getElementById("instructionPic").src="chrome://torpedo/skin/instruction_de.png";
	else document.getElementById("instructionPic").src="chrome://torpedo/skin/instruction_en.png";
}