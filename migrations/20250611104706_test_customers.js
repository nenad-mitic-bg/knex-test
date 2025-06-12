/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('test_customers', function (table) {
        table.string('id').primary();
        table.string('first_name');
        table.string('last_name');
        table.string('gender');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('test_customers');
};
