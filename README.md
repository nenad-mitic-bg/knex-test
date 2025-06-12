# Test case for Knex.js migrations bug

## Issue

Migration for altering a table triggers an "on delete cascade"
foreign key, causing the connected table to lose all it's data.

## Environment

* Nodejs: 20.10.0
* Knex.js: 3.1.0
* better-sqlite3: 11.10.0

## Reproduction steps

```shell
node knex-test.js
```

The script will execute first two migrations, creating `test_customers` and
`test_orders` table, then insert some dummy data. Finally, it will execute the
third migration, which drops `gender` column from `test_customers`. Because
the migration doesn't simply run `ALTER TABLE test_customers DROP COLUMN gender`,
but instead creates a temp table, copies data into it, drops `test_customers`,
and renames the temp table to `test_customers`, it triggers the "on delete cascade"
foreign key constraint in `test_orders`, causing all data in the table to be lost.

If the same code is executed outside of migrations, by calling `knex.schema.xxxx`
directly inside a JS file (like in `knex-test-no-error.js`), the issue does not 
appear and no data loss occurs.
