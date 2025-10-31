import {type Component, For} from "solid-js";
import {useOverlayConfig, useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {GlobeIcon, TiltifyIcon} from "../common/icons/JJIcons.tsx";
import {Numeric} from "solid-i18n";
import {useChat} from "../common/providers/ChatProvider.tsx";
import {twMerge} from "tailwind-merge";
import type {JJCause} from "../../api";
import {useBackend} from "../common/providers/BackendProvider.tsx";

export const OverlayCharitySideBanner: Component = () => {
  const {causes, causeId} = useChat()

  return (
    <div class={'relative w-48 h-full flex flex-col justify-center items-center'}>
      <For each={causes.data?.causes}>
        {
          cause => {
            return (
              <div class={twMerge(
                'absolute w-full transition-all duration-500',
                cause.id === causeId() ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}>
                <CauseViewSide cause={cause}/>
              </div>
            )
          }
        }
      </For>
    </div>
  );
}
const CauseViewSide: Component<{ cause: JJCause }> = (props) => {
  const cause = props.cause
  const {causes} = useBackend()

  const twitchConfig = useTwitchOverlayConfig()
  const config = useOverlayConfig()

  const streamerDonationUrl = () => {
    return config.donationLink.url
  }

  const useStreamerDonationLink = () => twitchConfig.chat.useDonationLink

  const donationUrl = () => {
    if (useStreamerDonationLink()) {
      return streamerDonationUrl()
    }
    return cause.donateUrl
  }
  const totalPounds = () => causes.data?.overview.raised.total.gbp ?? 0
  const totalDollar = () => causes.data?.overview.raised.total.usd ?? 0


  return (
    <div class={'w-full h-full flex flex-col items-center p-4 gap-4 bg-white rounded-2xl shadow'}>
      <div class={'flex flex-col items-center justify-center gap-2'}>
        <img class={'h-12 w-12'} src={cause.logo} alt={cause.name}/>
        <p class={'text-xl text-center'}>{cause.name}</p>
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
        class={'p-2 bg-accent-500 rounded-2xl text-white hover:scale-101 hover:brightness-105 flex flex-row gap-1 items-center'}
        target={'_blank'}
        href={cause.url}>Website <GlobeIcon class={'text-white'}/></a>
      <a
        class={'p-2 bg-accent-500 rounded-2xl text-white hover:scale-101 hover:brightness-105 flex flex-row gap-1 items-center'}
        target={'_blank'}
        href={donationUrl()}
      >Donate <TiltifyIcon class={'text-white'}/></a>
    </div>
  )
}
