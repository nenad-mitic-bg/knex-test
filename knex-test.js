const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig);

async function populateData() {
    await db('test_customers').insert({
        id: 'jane-id',
        first_name: 'jane',
        last_name: 'doe',
        gender: 'female',
    });

    await db('test_orders').insert([
        {
            customer_id: 'jane-id',
            order_note: "Jane's order #1",
        },
        {
            customer_id: 'jane-id',
            order_note: "Jane's order #2",
        }
    ]);

    await db('test_customers').insert({
        id: 'john-id',
        first_name: 'john',
        last_name: 'doe',
        gender: 'male',
    });

    await db('test_orders').insert([
        {
            customer_id: 'john-id',
            order_note: "John's order #1",
        },
        {
            customer_id: 'john-id',
            order_note: "John's order #2",
        }
    ]);

    const result = await db('test_orders').count('* as cnt');
    console.log(`Inserted data, got ${result[0].cnt} orders`);
}

async function countOrders() {
    const result = await db('test_orders').count('* as cnt');
    console.log(`Got ${result[0].cnt} orders`);
}

async function runMigration() {
    await db.migrate.up();
}

// 20250611104706_test_customers.js
runMigration()
    .then(() => {
        // 20250611212237_test_orders.js
        return runMigration();
    })
    .then(() => {
        // Populate data, confirm that orders has 4 rows
        return populateData();
    })
    .then(() => {
        // 20250611212344_alter_test_customers.js
        // This one drops "gender" column from test_customers table
        // and causes all data to be dropped from test_orders table
        // because somehow the foreign key constraint gets activated.
        return runMigration();
    })
    .then(() => {
        // Count orders and confirm the table is empty
        return countOrders();
    })
    .then(() => {
        process.exit();
    });