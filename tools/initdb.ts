import dotenv from "dotenv";
import fs from "fs-extra";
import { join } from "path";
import { Client } from "pg";

const { error, log } = console;

const init = async () => {

    dotenv.config();

    const client = new Client();

    try {

        await client.connect();

        const sql = await fs.readFile(join(__dirname, "initdb.pgsql"), { encoding: "UTF-8" });

        // split the file into separate statements
        const statements = sql.split( /;\s*$/m );

        // log('NOW', await client.query('SELECT NOW()'))

        for ( const statement of statements ) {

            if ( statement.length > 3 ) {

                // execute each of the statements
                await client.query( statement );
            }
        }

    } catch ( err ) {

        error( err );
        throw err;

    } finally {

        // close the database client
        await client.end();
    }
};

init().then(() => log( "finished" )).catch(() => log( "finished with errors" ));
