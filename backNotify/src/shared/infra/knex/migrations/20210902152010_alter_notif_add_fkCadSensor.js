tableName = 'notifications'
exports.up = function(knex) {
    return knex.schema.alterTable(tableName,function (table){
        table.foreign('ID_SENSOR').references('ID').inTable('CAD_SENSOR');
    })
};

exports.down = function(knex) {
    return knex.schema.dropForeign('ID_SENSOR');
};
