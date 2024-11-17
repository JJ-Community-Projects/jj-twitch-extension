import {type Component, For} from "solid-js";
import {useData} from "../common/providers/DataProvider.tsx";
import type {Cause} from "../../lib/model/jjData/JJData.ts";
import {twMerge} from "tailwind-merge";
import {ColoredScrollbar} from "../common/ColoredScrollbar.tsx";
import {GlobeIcon, HeartIcon} from "../common/icons/JJIcons.tsx";
import {useOverlayConfig, useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {Numeric} from "solid-i18n";


export const OverlayJJCharities: Component = () => {
  const {donation} = useData()
  const charities = donation.causes

  const {theme} = useTheme()
  const config = useOverlayConfig()
  const twitchConfig = useTwitchOverlayConfig()

  const url = () => {
    if (!twitchConfig.donationUrl || twitchConfig.donationUrl === '' || config.donationLink.overrideCustomLink) {
      return config.donationLink.url
    }
    return twitchConfig.donationUrl
  }

  const backgroundColor = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'bg-accent-500/30'
      case 'dark':
        return 'bg-gray-800/30'
      default:
        return 'bg-primary-500/30'
    }
  }
  return (
    <div class={twMerge('h-full flex flex-col gap-2 p-2 rounded-2xl shadow-xl', backgroundColor())}>
      <a
        class={'bg-gradient-to-br from-accent-400 to-accent-500 hover:scale-102 flex w-full flex-row items-center justify-center rounded-2xl p-0.5 text-center text-white shadow-xl transition-all hover:shadow-2xl hover:brightness-105'}
        target={'_blank'}
        href={url()}>Donate</a>
      <div class={'h-full w-full overflow-hidden overscroll-none'}>
        <ColoredScrollbar>
          <div class={twMerge(
            'h-full w-full gap-2',
            'lg:grid lg:grid-cols-2',
            'flex flex-col p-2'
          )}>
            <For each={charities}>
              {charity => <Item cause={charity}/>}
            </For>
          </div>
        </ColoredScrollbar>
      </div>
    </div>
  );
}


const Item: Component<{ cause: Cause }> = (props) => {
  const {cause: charity} = props
  const {donation} = useData()

  const totalPounds = () => charity.raised.yogscast + charity.raised.fundraisers
  const totalDollar = () => totalPounds() * donation.avgConversionRate

  return (
    <div
      class={twMerge('bg-white flex w-full flex-col items-center gap-2 rounded-2xl shadow-xl p-2')}
    >
      <div class={'w-full flex flex-row gap-2 items-center justify-around'}>

        <div class={'w-full flex flex-row gap-1 items-center'}>
          <img class={'~h-6/10 ~w-6/10 rounded-lg'} alt={charity.name} src={charity.logo} loading={'lazy'}/>
          <p class={'font-bold ~text-xs/base'}>{charity.name}</p>
        </div>

        <div class={'flex flex-row items-center justify-between gap-4'}>
          <a
            target={'_blank'}
            href={charity.url}
            class={'hover:scale-110 text-accent-500 transition-all'}
          >
            <GlobeIcon class={'~w-4/6 ~h-4/6'}/>
          </a>
          <a
            target={'_blank'}
            href={charity.donateUrl}
            class={'hover:scale-110 text-primary-500 transition-all'}
          >
            <HeartIcon class={'~w-4/6 ~h-4/6'}/>
          </a>
        </div>
      </div>
      <p class={'w-full ~text-xs/base'}>{charity.description}</p>


      <div class={'flex flex-row w-full items-start justify-start'}>
        <p class={'text-primary-500 text-xs font-bold'}>
          Raised <Numeric value={totalPounds()} numberStyle="currency" currency={'GBP'}/> / <Numeric value={totalDollar()} numberStyle="currency"
                                                                                                     currency={'USD'}/>
        </p>
      </div>
    </div>
  )
}
