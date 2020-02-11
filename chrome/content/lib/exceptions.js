document.addEventListener('dialogextra1', function () {
	torpedo.db.deleteSomeException();
});

document.addEventListener('dialogaccept', function () {
	torpedo.db.addEntries('exception'); return false;
});