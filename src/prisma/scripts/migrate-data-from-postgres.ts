// migrate data from postgres to to sqlite using prisma
/*
1. Dump the data only sql to file
  $ pg_dump --data-only --inserts YOUR_DB_NAME > dump.sql
2. scp to local

3. Remove the SET statements at the top
  such as:
    SET statement_timeout = 0;
    SET client_encoding = 'SQL_ASCII';

4. Remove the setval sequence queries
  such as: 
    SELECT pg_catalog.setval('MY_OBJECT_id_seq', 10, true);
    
5. Replace true => ‘t’ and false => ‘f’
  -- These:
  INSERT INTO table_name VALUES (1, true, false);
  -- Should be replace to:
  INSERT INTO table_name VALUES (1, 't', 'f');

6. Add BEGIN; and END; to wrap the whole thing as a trasaction

7. Import
  $ rm db/development.sqlite3
  $ rake db:migrate
  $ sqlite3 db/development.sqlite3
  > delete from schema_migrations;
  > .read dump.sql
  > .exit
*/

const { exec } = require("child_process");
const test_process = require('child_process')
const fs = require('fs');
const execPromise = require('util').promisify(require('child_process').exec);


const main = async () => {
  const command = "docker exec surf-tracker_db_1 pg_dump -U postgres --data-only --column-inserts > backup.sql";
  // Step 1
  // Dump the data only sql to file in project folder backup.sql

  await execPromise(command, async (error: any, stdout: any, stderr: any) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }

    

    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);

    // Step 2
    // scp to local
      
    // open file
    let backupFile = fs.readFileSync('backup.sql', 'utf8');

    // Step 3
    // Remove all lines above the first line with "-- Data for Name:""

    backupFile = backupFile.replace(/^([\s\S]*?)-- Data for Name:/m, '-- Data for Name:');

    // Step 4
    // Remove the setval sequence queries
    // such as:
    // SELECT pg_catalog.setval('MY_OBJECT_id_seq', 10, true);
    backupFile = backupFile.replace(/SELECT pg_catalog.setval.*\n/, '');

    // Step 5
    // Replace true => ‘t’ and false => ‘f’
    // -- These:
    // INSERT INTO table_name VALUES (1, true, false);
    // -- Should be replace to:
    // INSERT INTO table_name VALUES (1, 't', 'f');
    backupFile = backupFile.replace(/true/g, "1");
    backupFile = backupFile.replace(/false/g, "0");
    // Step 6
    // Add BEGIN; and END; to wrap the whole thing as a trasaction
    // Add BEGIN to a new line at the beginning of the file
    // Add END to a new line at the end of the file
    backupFile = backupFile.replace(/^/, 'BEGIN;\n');
    backupFile = backupFile.replace(/$/, 'END;\n');

    // remove public schema from table names
    backupFile = backupFile.replace(/public."/g, '"');

    console.log('Modified backup file')

    // Step 7
    // Import
    // $ rm db/development.sqlite3
    // $ rake db:migrate
    // $ sqlite3 db/development.sqlite3
    // > delete from schema_migrations;
    // > .read dump.sql
    // > .exit

    console.log('Writing backup file')
    try {
      fs.writeFileSync('backup.sql', backupFile, 'utf8');
    }
    catch (e: any) {
      console.log('Error:', e.stack);
      return
    }

    console.log('Importing backup file')
    var cmd = test_process.spawn('sqlite3', ['src/prisma/db/surf.db', '.read backup.sql', '.exit']);
    cmd.stdout.on('data', function(output: any){
      console.log(output.toString());
    });
  
    cmd.on('close', function(){
        console.log('Finished');
    });
    
    //Error handling
    cmd.stderr.on('data', function(err: any){
        console.log(err.toString());
    });
  });
}


main();

