import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import Port from '#models/port'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class PortType extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare label: string

  @hasMany(() => Port)
  declare ports: HasMany<typeof Port>

  @beforeCreate()
  static assignUuid(port: PortType) {
    port.id = randomUUID()
  }
}
