export type Config = {
  showSchedule: boolean,
  showCharities: boolean,
  showFundraiser: boolean,
  year: string
  donationLink: DonationLink
  donationTrackerUrl: string
  jingleJamRegistrationUrl: string
}

type DonationLink = {
  url: string,
  overrideCustomLink: boolean
  allowCustomLinks: boolean
  visible: boolean
  text: string
}


export type OverlayConfig = {
  showYogsSchedule: boolean,
  showCharities: boolean,
  showFundraiser: boolean,
  year: string
  donationLink: DonationLink
}
