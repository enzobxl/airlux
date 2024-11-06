import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Raspberry from '#models/raspberry'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export default class Port extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare portNumber: number

  @column()
  declare raspberryId: string

  @beforeCreate()
  static assignUuid(port: Port) {
    port.id = randomUUID()
  }

  @belongsTo(() => Raspberry)
  declare raspberry: BelongsTo<typeof Raspberry>
}
