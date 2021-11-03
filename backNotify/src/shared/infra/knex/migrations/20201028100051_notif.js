tableName = 'notifications'
exports.up = function (knex) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments('ID').primary();
        table.string('ID_REF').notNullable();
        table.string('NAME').notNullable();
        table.enum('TYPE',['sns','dir','mtd','eqp']).notNullable();
        table.string('EMAIL').notNullable();
        // table.string('UNIT').notNullable();
        table.enum('CONDITION',['ACIMA','ABAIXO']).notNullable();
        table.string('MEDITION_TYPE').notNullable();
        table.string('NOTE',100).nullable();
        table.decimal('VALUE').notNullable();
        table.integer('TIME').notNullable();
        table.integer('POSITION').nullable();
        table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
        table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
    })
    
};

exports.down = function (knex) {
    return knex.schema.dropTable(tableName);
};
