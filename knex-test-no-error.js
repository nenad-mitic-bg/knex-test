const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig);

async function migrationOne() {
    await db.schema.createTable('test_customers', function (table) {
        table.string('id').primary();
        table.string('first_name');
        table.string('last_name');
        table.string('gender');
    });

    await db.schema.createTable('test_orders', function (table) {
        table.increments();
        table.string('customer_id');
        table.foreign('customer_id').references('test_customers.id').onDelete('cascade');
        table.string('order_note');
    });
}

async function migrationTwo() {
    await db.schema.alterTable('test_customers', function (table) {
        table.dropColumn('gender');
    });
}

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

migrationOne()
    .then(() => {
        // Populate data, confirm that orders has 4 rows
        return populateData();
    })
    .then(() => {
        // This one drops "gender" column from test_customers table
        // and causes all data to be dropped from test_orders table
        // because somehow the foreign key constraint gets activated.
        return migrationTwo();
    })
    .then(() => {
        // Count orders and confirm the table is NOT empty. If the same
        // code is triggered via migrations, test_orders table looses all data.
        return countOrders();
    })
    .then(() => {
        process.exit();
    });
