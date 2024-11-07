import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Raspberry from '#models/raspberry'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import PortType from '#models/port_type'
import PortStatus from '#models/port_status'

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
  declare raspberryId: string | null

  @column()
  declare portTypeId: string | null

  @column()
  declare portStatusId: string

  @belongsTo(() => PortType)
  declare portType: BelongsTo<typeof PortType>

  @belongsTo(() => PortType)
  declare portStatus: BelongsTo<typeof PortStatus>

  @belongsTo(() => Raspberry)
  declare raspberry: BelongsTo<typeof Raspberry>

  @beforeCreate()
  static assignUuid(port: Port) {
    port.id = randomUUID()
  }
}
