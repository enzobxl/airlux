import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import Port from '#models/port'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Raspberry extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare macAddress: string

  @column()
  declare sshKey: string

  @hasMany(() => Port)
  declare ports: HasMany<typeof Port>

  @beforeCreate()
  static assignUuid(raspberry: Raspberry) {
    raspberry.id = randomUUID()
  }
}
