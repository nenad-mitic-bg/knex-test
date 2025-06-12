module.exports = {
    client: 'better-sqlite3',
    debug: true,
    connection: {
        filename: 'db.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
        tableName: 'knex_migrations',
    }
};