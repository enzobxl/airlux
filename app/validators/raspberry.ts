import vine from '@vinejs/vine'

const CONSTRUCTOR_PREFIXES = [
  '28:CD:C1',
  '2C:CF:67',
  'B8:27:EB',
  'D8:3A:DD',
  'DC:A6:32',
  'E4:5F:01',
]

// Custom rule to check if the mac address starts with one of the prefixes
const macPrefixCheck = vine.createRule(async (value, _, field) => {
  const startsWithPrefix = CONSTRUCTOR_PREFIXES.some((prefix) =>
    (value as string).toLowerCase().startsWith(prefix.toLowerCase())
  )
  if (!startsWithPrefix) {
    field.report(`Incorrect mac address`, 'startsWith', field)
  }
})

// Custom rule to check if the user-agent matches ours
const userAgentCheck = vine.createRule(async (value, _, field) => {
  if (value !== 'my-user-agent') {
    field.report('Not authorized', 'unique', field)
  }

  return
})

export const registerRaspberryValidator = vine.compile(
  vine.object({
    mac: vine
      .string()
      .fixedLength(17)
      .regex(/^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$/)
      .use(macPrefixCheck())
      .trim(),
    ports: vine.array(vine.string().minLength(1).maxLength(4).regex(/^\d+$/).trim()),
    key: vine.string().trim(),
    userAgent: vine.string().use(userAgentCheck()).trim(),
  })
)
