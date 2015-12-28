/**
 * Created by Joshua on 24.9.2015.
 */
var torpedo = torpedo || {};

torpedo.db = function ()
{

    Components.utils.import("resource://gre/modules/Sqlite.jsm");
    Components.utils.import("resource://gre/modules/Task.jsm");

    function openConnection()
    {
        var database = Sqlite.openConnection({"ProfD": "torpedo.sqlite", sharedMemoryCache: false });

        return database.then
        (
            function onConnection(connection)
            {
                createWhiteListTable(connection);
                console.log("database connected");
            },
            function onError(error)
            {
                console.log("Database Error " + error);
            }

        );
    }

    function createWhiteListTable(connection)
    {
        let statement = "CREATE TABLE IF NOT EXISTS whitelist (domain VARCHAR(100))";
        conn.execute(statement,params);
    }

    return{
        insertWhiteList: function(domainName) {
            return Task.spawn(function insert() {
                try {
                    let conn = yield openConnection();
                    let statement = "INSERT INTO whitelist (domain) VALUES (:domain)";
                    let params = { domain: domainName};

                    yield conn.execute(statement,params);
                }
                catch (err)
                {
                    console.log("Insert Error " + error);
                }
                finally {
                    conn.close();
                }
            });
        },
        isInside: function(domainName) {
            return Task.spawn(function insert() {
                try {
                    let conn = yield openConnection();
                    let statement = "SELECT domainName FROM " + database + " WHERE domainName = :domain";
                    let params = { domain: domainName};

                    var result  = yield conn.execute(statement,params);

                    if(result)
                    {
                        return true;
                    }

                    return false;
                }
                catch (err)
                {
                    console.log("isInside Error " + error);
                }
                finally {
                    conn.close();
                }
            });
        }
    };


}();