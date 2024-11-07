import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.integer('port_number').notNullable()
      table
        .uuid('raspberry_id')
        .nullable()
        .references('id')
        .inTable('raspberries')
        .onDelete('CASCADE')
      table
        .uuid('port_type_id')
        .nullable()
        .references('id')
        .inTable('port_types')
        .onDelete('CASCADE')
      table
        .uuid('port_status_id')
        .notNullable()
        .references('id')
        .inTable('port_statuses')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
