export type TabType = 'yogs' | 'charities' | 'community' | 'none'
export type Theme = 'red' | 'blue' | 'dark' | 'red_light' | 'blue_light' | 'rainbow'

export interface TwitchConfig {
  tab1: TabType
  tab2: TabType
  tab3: TabType
  theme: Theme
  donationUrl: string
}

export const defaultConfig: TwitchConfig = {
  tab1: 'yogs',
  tab2: 'charities',
  tab3: 'community',
  theme: 'red',
  donationUrl: 'https://jinglejam.tiltify.com',
}

export interface TwitchOverlayConfig {
  showYogsSchedule: boolean
  showCommunityFundraiser: boolean
  donationUrl: string
  theme: Theme,
  chat: TwitchOverlayChatConfig
}

export interface TwitchOverlayChatConfig {
  enabled: boolean
  useDonationLink: boolean
  position: string
  commands: TwitchOverlayChatCommand[]
}

export interface TwitchOverlayChatCommand {
  tiltifyId: number
  command: string
  name: string
}


export const defaultOverlayConfig: TwitchOverlayConfig = {
  showYogsSchedule: true,
  showCommunityFundraiser: true,
  donationUrl: 'https://jinglejam.tiltify.com',
  theme: 'red',
  chat: {
    enabled: true,
    useDonationLink: true,
    position: 'bottom',
    commands: [
      {
        tiltifyId: 588,
        command: 'warchild',
        name: 'War Child',
      },
      {
        tiltifyId: 575,
        command: 'calm',
        name: 'Calm',
      },
      {
        tiltifyId: 582,
        command: 'autistica',
        name: 'Autistica',
      },
      {
        tiltifyId: 1227,
        command: 'coolearth',
        name: 'Cool Earth',
      },
      {
        tiltifyId: 1228,
        command: 'sacroma',
        name: 'Sacroma UK',
      },
      {
        tiltifyId: 1229,
        command: 'trevor',
        name: 'The Trevor Project',
      },
      {
        tiltifyId: 565,
        name: 'Wallace and Gromit’s Grand Appeal',
        command: 'wallace',
      },
      {
        name: 'Whale and Dolphin Conservation',
        tiltifyId: 574,
        command: 'wdc',
      }
    ]
  }
}
