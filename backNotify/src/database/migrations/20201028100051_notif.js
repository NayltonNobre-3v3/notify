tableName = 'notifications'
exports.up = function (knex) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments('ID').primary();
        table.integer('ID_SENSOR').notNullable();
        table.string('NAME').notNullable();
        table.string('EMAIL').notNullable();
        table.string('UNIT').notNullable();
        table.string('COND').notNullable();
        table.decimal('VALUE').notNullable();
        table.integer('TIME').notNullable();
        table.integer('POSITION').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable(tableName);
};
