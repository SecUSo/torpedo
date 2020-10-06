document.addEventListener('dialogextra1', function () {
	torpedoOptions.deleteCloudDomain();
});

document.addEventListener('dialogaccept', function () {
	torpedoOptions.addEntries('CloudDomainList'); 
	event.preventDefault();
});