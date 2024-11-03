import type {Component} from "solid-js";
import type {Cause} from "../../lib/model/jjData/JJData.ts";
import {useOverlayConfig, useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {GlobeIcon, TiltifyIcon} from "../common/icons/JJIcons.tsx";
import {useData} from "../common/providers/DataProvider.tsx";
import {Numeric} from "solid-i18n";

const CauseViewSide: Component<{ cause: Cause }> = (props) => {
  const cause = props.cause
  const {donation} = useData()

  const twitchConfig = useTwitchOverlayConfig()
  const config = useOverlayConfig()

  const streamerDonationUrl = () => {
    const url = twitchConfig.donationUrl
    if (!url || url === '') {
      return config.donationLink.url
    }
    return url
  }

  const useStreamerDonationLink = () => twitchConfig.chat.useDonationLink

  const donationUrl = () => {
    if (useStreamerDonationLink()) {
      return streamerDonationUrl()
    }
    return cause.donateUrl
  }
  const totalPounds = () => cause.raised.yogscast + cause.raised.fundraisers
  const totalDollar = () => totalPounds() * donation.avgConversionRate


  return (
    <div class={'w-full h-[50%] flex flex-col items-center p-4 gap-4 bg-white rounded-2xl shadow'}>
      <div class={'flex flex-col items-center justify-center gap-2'}>
        <img class={'h-12 w-12'} src={cause.logo} alt={cause.name}/>
        <p class={'text-xl'}>{cause.name}</p>
      </div>
      <div class={'flex flex-col items-center justify-center gap-1'}>
        <p class={'text-primary-500'}>
          Raised <Numeric value={totalPounds()} numberStyle="currency" currency={'GBP'}/>
        </p>
        <p class={'text-xs text-primary-500'}>Raised <Numeric value={totalDollar()} numberStyle="currency" currency={'USD'}/>
        </p>
      </div>

      <div class={'flex-1'}/>
      <a
        class={'p-2 bg-accent-500 rounded-2xl text-white hover:scale-102 hover:brightness-105 flex flex-row gap-1 items-center'}
        target={'_blank'}
        href={cause.url}>Website <GlobeIcon class={'text-white'}/></a>
      <a
        class={'p-2 bg-accent-500 rounded-2xl text-white hover:scale-102 hover:brightness-105 flex flex-row gap-1 items-center'}
        target={'_blank'}
        href={donationUrl()}
      >Donate <TiltifyIcon class={'text-white'}/></a>
    </div>
  )
}

export const ChatSideDemo = () => {
  const {donation} = useData()

  return (
    <div class={'w-48 h-full flex flex-col justify-center items-center'}>
      <CauseViewSide cause={donation.causes[0]}/>
    </div>
  )
}


export const OverlayCharitySideCard: Component = (props) => {
  return (
    <div class={'w-48 h-full bg-purple-500 flex flex-col justify-center items-center'}>
      <p>test</p>
    </div>
  );
}
