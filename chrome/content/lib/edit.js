document.addEventListener('dialogextra1', function() {
	torpedo.db.deleteSomeSecond();
});

document.addEventListener('dialogaccept', function() {
	torpedo.db.addEntries('second'); return false;
});