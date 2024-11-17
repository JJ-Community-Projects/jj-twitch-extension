import {type Component, createEffect, For, onMount, Show} from "solid-js";
import type {Cause} from "../../lib/model/jjData/JJData.ts";
import {GlobeIcon, TiltifyIcon} from "../common/icons/JJIcons.tsx";
import {twMerge} from "tailwind-merge";
import {useChat} from "../common/providers/ChatProvider.tsx";
import {useOverlayConfig, useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {useData} from "../common/providers/DataProvider.tsx";
import {Numeric} from "solid-i18n";
import { Transition, TransitionGroup } from "solid-transition-group";

export const OverlayCharityBanner: Component = () => {
  const {causes, causeId} = useChat()
  return (
    <div class={'relative w-full h-full'}>
      <For each={causes}>
        {
          cause => {
            const show = () => causeId() === cause.id
            return (
              <Transition>
                <Show when={show()}>
                  <div class={twMerge(
                    'absolute inset-0 w-full h-full transition-all duration-500',
                    cause.id === causeId() ? '' : 'pointer-events-none'
                  )}>
                    <CauseView cause={cause}/>
                  </div>
                </Show>
              </Transition>
            )
          }
        }
      </For>
    </div>
  );
}

export const ChatDemo = () => {
  const {donation} = useData()

  return (
    <div class={'relative w-full h-full'}>
      <div class={twMerge(
        'absolute inset-0 w-full h-full transition-all duration-500',
      )}>
        <CauseView cause={donation.causes[0]}/>
      </div>
    </div>
  )
}


const CauseView: Component<{ cause: Cause }> = (props) => {
  const cause = props.cause
  const {donation} = useData()


  const {commandTimeout, causeId, lastCauseId} = useChat()

  const visible = () => causeId() === cause.id || lastCauseId() === cause.id

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
          class={'p-2 bg-accent-500 rounded-2xl text-white hover:scale-102 hover:brightness-105 flex flex-row gap-1 items-center'}
          target={'_blank'}
          href={cause.url}><GlobeIcon class={'text-white'}/></a>
        <a
          class={'p-2 bg-accent-500 rounded-2xl text-white hover:scale-102 hover:brightness-105 flex flex-row gap-1 items-center'}
          target={'_blank'}
          href={donationUrl()}
        >Donate <TiltifyIcon class={'text-white'}/></a>
      </div>
    </div>
  )
}
