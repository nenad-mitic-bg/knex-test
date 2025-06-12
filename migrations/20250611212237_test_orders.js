/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('test_orders', function (table) {
        table.increments();
        table.string('customer_id');
        table.foreign('customer_id').references('test_customers.id').onDelete('cascade');
        table.string('order_note');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('test_orders');
};
