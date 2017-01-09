function onLoad() {
	if (navigator.language.indexOf("de") > -1)
	    document.getElementById("unknownPic").src="chrome://torpedo/skin/unknown_de.png";
	else document.getElementById("unknownPic").src="chrome://torpedo/skin/unknown_en.png";
}

window.addEventListener("load", function load(event){
	window.moveTo(window.arguments[1],window.arguments[0])
}, false);
