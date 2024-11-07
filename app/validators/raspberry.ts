import vine from '@vinejs/vine'
import { macAddress } from '#validators/mac_address'

// Custom rule to check if the user-agent matches ours
const userAgentCheck = vine.createRule(async (value, _, field) => {
  if (value !== 'my-user-agent') {
    field.report('Not authorized', 'unique', field)
  }

  return
})

export const registerRaspberryValidator = vine.compile(
  vine.object({
    ...macAddress.getProperties(),
    tcpPorts: vine.array(vine.string().minLength(1).maxLength(4).regex(/^\d+$/).trim()),
    httpPorts: vine.array(vine.string().minLength(1).maxLength(4).regex(/^\d+$/).trim()),
    key: vine.string().trim(),
    userAgent: vine.string().use(userAgentCheck()).trim(),
  })
)
