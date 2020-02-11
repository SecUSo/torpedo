document.addEventListener('dialogextra1', function () {
	torpedo.db.deleteCloudDomain();
});

document.addEventListener('dialogaccept', function () {
	torpedo.db.addEntries('exception'); return false;
});