import type {ExtensionConfig, UserExtensionConfig, UserExtensionConfigTabsEnum} from "../api";
import type {Theme} from "./model/TwitchConfig.ts";

// Dev-only layout switches, for arranging the extension for screenshots (e.g. the Twitch promo images).
// `?theme=blue` shows a theme without changing the broadcaster config (red, blue, dark, red_light, blue_light, rainbow).
// `?header` (or `?header=1`) shows the user header with the channel's fundraiser, `?header=0` the plain logo header.
// The user header needs a channel with a campaign, e.g. `?user=hrry&header`.
// `?tabs=fundraisers,charities,yogs,user-schedule` shows exactly these tabs in this order; the first one opens.
// The tabs' extension-wide switches are turned on with them. `user-schedule` needs a channel with a schedule,
// or `?mockUserSchedule` for the dummy one.
// Both override the backend configs and the other mock flags.
// `?force-open` keeps the overlay visible instead of showing it on hover only (read in OverlayMain.tsx).
// Only loaded behind `import.meta.env.DEV`, so it never ships in a build.

const allTabs: UserExtensionConfigTabsEnum[] = ['user-schedule', 'yogs', 'charities', 'fundraisers']

const allThemes: Theme[] = ['red', 'blue', 'dark', 'red_light', 'blue_light', 'rainbow']

const params = () => new URLSearchParams(window.location.search)

// The requested theme, or undefined to keep the broadcaster's.
export const devLayoutTheme = (): Theme | undefined => {
  const value = params().get('theme')
  if (value === null) return undefined
  if (allThemes.includes(value as Theme)) return value as Theme
  console.warn(`Unknown dev theme "${value}" ignored. Known themes: ${allThemes.join(', ')}`)
  return undefined
}

// true / false when `?header` is set, undefined to keep the backend's choice.
const headerFlag = (): boolean | undefined => {
  const value = params().get('header')
  if (value === null) return undefined
  return !['0', 'false', 'off'].includes(value)
}

// The requested tabs in order, or undefined without `?tabs`.
const tabsFlag = (): UserExtensionConfigTabsEnum[] | undefined => {
  const value = params().get('tabs')
  if (value === null) return undefined
  const names = value.split(',').map(t => t.trim()).filter(t => t !== '')
  const unknown = names.filter(t => !allTabs.includes(t as UserExtensionConfigTabsEnum))
  if (unknown.length > 0) {
    console.warn(`Unknown dev tabs "${unknown.join(', ')}" ignored. Known tabs: ${allTabs.join(', ')}`)
  }
  const tabs = names.filter((t): t is UserExtensionConfigTabsEnum => allTabs.includes(t as UserExtensionConfigTabsEnum))
  return [...new Set(tabs)]
}

export const devLayoutConfig = (config: ExtensionConfig): ExtensionConfig => {
  const header = headerFlag()
  const tabs = tabsFlag()
  return {
    ...config,
    ...(header !== undefined && {showUserFundraiser: header}),
    ...(tabs && {
      showUserSchedule: config.showUserSchedule || tabs.includes('user-schedule'),
      showYogsSchedule: config.showYogsSchedule || tabs.includes('yogs'),
      showCharities: config.showCharities || tabs.includes('charities'),
      showFundraisers: config.showFundraisers || tabs.includes('fundraisers'),
    }),
  }
}

export const devLayoutUserConfig = (config: UserExtensionConfig): UserExtensionConfig => {
  const header = headerFlag()
  const tabs = tabsFlag()
  return {
    ...config,
    ...(header !== undefined && {hasCampaign: header}),
    ...(tabs && {
      tabs,
      hasSchedule: config.hasSchedule || tabs.includes('user-schedule'),
    }),
  }
}
