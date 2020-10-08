var torpedo = torpedo || {};


Components.utils.import("resource://gre/modules/Sqlite.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");


var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);



var DB = {

	getBlacklistDomains: async function () {
		var connection = await Sqlite.openConnection({ path: "torpedodb.sqlite" });
		var blacklistDomains = [];
		try {
			await connection.execute("CREATE TABLE IF NOT EXISTS BlacklistDomains (blacklistDomain)");

			var statement = "SELECT blacklistDomain FROM BlacklistDomains";
			var result = await connection.execute(statement);
			if (result.length > 0) {
				result.forEach(function (row) {
					var domain = row.getResultByName("blacklistDomain");
					blacklistDomains.push(domain);
				});
			}
		} catch (e) {
			connection.close();
			throw e;
		}
		finally {
			connection.close();
			return blacklistDomains;
		}
	},

	deleteTable: async function (connection, tableName) {
		var deleteStatement = "DROP TABLE IF EXISTS " + tableName;
		await connection.execute(deleteStatement);
	},

	deleteDB: async function () {

		try {
			let file = FileUtils.getFile("ProfD", ["torpedodb.sqlite"]);
			if (file.isFile()) {
				file.remove(false);
			}
		} catch (e) {

			throw e;
		}
	},

	updateBlacklist: async function (blacklistDomains) {

		var connection = await Sqlite.openConnection({ path: "torpedodb.sqlite" });
		try {
			var deleteStatement = "DROP TABLE IF EXISTS BlacklistDomains";
			await connection.execute(deleteStatement);
			await connection.execute("CREATE TABLE IF NOT EXISTS BlacklistDomains (blacklistDomain)");

			await connection.executeTransaction(async function simpleTransaction() {
				for (var i = 0; i < blacklistDomains.length; i++) {
					await connection.execute("INSERT INTO BlacklistDomains VALUES (@0)", [blacklistDomains[i]]);
				}
			});
			connection.close();
		} catch (e) {
			connection.close();
			throw e;
		}
	}
};
