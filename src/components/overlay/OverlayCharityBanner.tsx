import {type Component, For} from "solid-js";
import {GlobeIcon, TiltifyIcon} from "../common/icons/JJIcons.tsx";
import {twMerge} from "tailwind-merge";
import {useChat} from "../common/providers/ChatProvider.tsx";
import {useOverlayConfig, useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {Numeric} from "solid-i18n";
import type {JJCause} from "../../api";
import {useOverlayBackend} from "../common/providers/OverlayBackendProvider.tsx";

export const OverlayCharityBanner: Component = () => {
  const {causes, causeId} = useChat()

  return (
    <div class={'relative w-full h-full'}>
      <For each={causes.data?.causes}>
        {
          cause => {
            return (
              <div class={twMerge(
                'absolute inset-0 w-full h-full transition-all duration-500',
                cause.id === causeId() ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}>
                <CauseView cause={cause}/>
              </div>
            )
          }
        }
      </For>
    </div>
  );
}


const CauseView: Component<{ cause: JJCause }> = (props) => {
  const cause = props.cause
  const {overview} = useOverlayBackend()


  const {commandTimeout, causeId, lastCauseId} = useChat()

  const visible = () => causeId() === cause.id || lastCauseId() === cause.id

  const twitchConfig = useTwitchOverlayConfig()
  const config = useOverlayConfig()

  const donationUrl = () => {
    return cause.donateUrl
  }

  const totalPounds = () => overview.data?.raised.total.gbp ?? 0
  const totalDollar = () => overview.data?.raised.total.usd ?? 0

  return (
    <div class={'h-full w-full flex flex-row items-center justify-center'}>
      <div class={'h-full flex flex-row items-center p-4 gap-4 bg-white rounded-2xl shadow'}>
        <img class={'h-12 w-12'} src={cause.logo} alt={cause.name}/>
        <p class={'text-xl'}>{cause.name}</p>
        <div class={'flex flex-col items-start justify-center'}>
          <p class={'text-primary-500'}>
            Raised <Numeric value={totalPounds()} numberStyle="currency" currency={'GBP'}/>
          </p>
          <p class={'text-xs text-primary-500'}>Raised <Numeric value={totalDollar()} numberStyle="currency"
                                                                currency={'USD'}/>
          </p>
        </div>
        <div class={'flex-1'}/>
        <a
          class={'p-2 bg-accent-500 rounded-2xl text-white hover:scale-101 hover:brightness-105 flex flex-row gap-1 items-center'}
          target={'_blank'}
          href={cause.url}><GlobeIcon class={'text-white'}/></a>
        <a
          class={'p-2 bg-accent-500 rounded-2xl text-white hover:scale-101 hover:brightness-105 flex flex-row gap-1 items-center'}
          target={'_blank'}
          href={donationUrl()}
        >Donate <TiltifyIcon class={'text-white'}/></a>
      </div>
    </div>
  )
}
