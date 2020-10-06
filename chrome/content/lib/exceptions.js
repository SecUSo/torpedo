document.addEventListener('dialogextra1', function () {
	torpedoOptions.deleteSomeException();
});

document.addEventListener('dialogaccept', function () {
	torpedoOptions.addEntries('exception'); return false;
});