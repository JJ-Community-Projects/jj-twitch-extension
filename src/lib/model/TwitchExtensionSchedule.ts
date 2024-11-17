
export type TwitchExtensionSchedule = {
  title: string
  days: TESDay[]
  updatedAt: string
}

export type TESDay = {
  date: string
  streams: TESStream[]
}
export type TESStream = {
  title: string
  subtitle?: string
  description?: string
  start: string
  end: string
  twitchVods?: TESTwitchLink[]
  creators?: TESTwitchCreator[]
  style: {
    background: {
      colors?: string[]
      orientation: 'TD' | 'LR' | 'RL' | 'DT' | 'TLBR' | 'TRBL'
    }
  }
}

export type TESTwitchCreator = {
  id: string
  label: string
  url: string
  color: string
}

export type TESTwitchLink = {
  label: string
  url: string
}
