// Dev-only Twitch auth for running the extension outside Twitch.
// Pick the channel with `?user=<name>`, e.g. `/panel?user=hrry` or `/overlay?user=test`; defaults to yogscast.
// Only loaded behind `import.meta.env.DEV`, so it never ships in a build.

interface DevUser {
  channelId: string
  // Serve the dummy user schedule (see mockUserSchedule.ts) without the `?mockUserSchedule` flag.
  mockUserSchedule?: boolean
}

const devUsers: Record<string, DevUser> = {
  'ostof': {channelId: '96860795'},
  'ostofbot': {channelId: '960814823'},
  'hrry': {channelId: '27063689'},
  'martyn': {channelId: '12131870'},
  'brionykay': {channelId: '79911474'},
  'mousie': {channelId: '46969360'},
  'shadowatnoon': {channelId: '68525019'},
  'yogscast': {channelId: '20786541'},
  'mudkipninja': {channelId: '96202541'},
  'chasedbyvoices': {channelId: '675328467'},
  'a': {channelId: '333'},
  'dawnfire': {channelId: '75214953'},
  // Channels unknown to the backend, which treats them as streamers who are not Yogs, without a campaign or schedule.
  'test': {channelId: '334', mockUserSchedule: true},
  'test-no-schedule': {channelId: '335'},
}

const defaultUser = 'yogscast'

// Resolved once when the module loads; switching users means reloading with another `?user=`.
const resolveUserName = () => {
  const name = new URLSearchParams(window.location.search).get('user') ?? defaultUser
  if (name in devUsers) {
    return name
  }
  console.warn(`Unknown dev user "${name}", using ${defaultUser}. Known users: ${Object.keys(devUsers).join(', ')}`)
  return defaultUser
}

const userName = resolveUserName()

export const devUserName = () => userName

export const devUser = () => devUsers[userName]

export const devAuth = (): Twitch.ext.Authorized => ({
  channelId: devUser().channelId,
  clientId: '333',
  token: 'test-123',
  userId: '333',
  helixToken: '333',
})
