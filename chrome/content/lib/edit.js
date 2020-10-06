document.addEventListener('dialogextra1', function() {
	torpedoOptions.deleteSomeSecond();
});

document.addEventListener('dialogaccept', function(event) {
	torpedoOptions.addEntries('URLSecondList'); 
	event.preventDefault();
});