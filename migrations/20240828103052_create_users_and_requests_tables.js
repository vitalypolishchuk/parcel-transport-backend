exports.up = function(knex) {
    return knex.schema
      .createTable('users', function(table) {
        table.increments('id').primary();
        table.text('email').unique().notNullable();
        table.text('password_hash').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('requests', function(table) {
        table.increments('id').primary();
        table.text('user_email').notNullable();
        table.enu('request_type', ['order', 'delivery']).notNullable();
        table.string('from_city', 100).notNullable();
        table.string('to_city', 100).notNullable();
        table.string('parcel_type', 50);
        table.date('dispatch_date').notNullable();
        table.text('description');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
};
  
exports.down = function(knex) {
return knex.schema
    .dropTable('requests')
    .dropTable('users');
};