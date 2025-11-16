import {type Component, For, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
import {ColoredScrollbar} from "../common/ColoredScrollbar.tsx";
import {GlobeIcon, TiltifyRoundIcon} from "../common/icons/JJIcons.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {Numeric} from "solid-i18n";
import {OverlayHeader} from "./OverlayHeader.tsx";
import {useOverlayBackend} from "../common/providers/OverlayBackendProvider.tsx";
import type {JJCause} from "../../api";
import {OverlayCharityOverviewCollapsable} from "../common/extenstionTabs/charityTab/CharityOverviewCollapsable.tsx";
import {CharityListItemAlt} from "../common/extenstionTabs/charityTab/CharityListItemAlt.tsx";


export const OverlayJJCharities: Component = () => {
  const {causes} = useOverlayBackend()

  const {theme} = useTheme()

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
      <OverlayHeader/>
      <div class={'w-full px-2'}>
        <OverlayCharityOverviewCollapsable/>
      </div>
      <div class={'h-full w-full overflow-hidden overscroll-none'}>
        <ColoredScrollbar>
          <div class={twMerge(
            'h-full w-full gap-2',
            'lg:grid lg:grid-cols-2',
            'flex flex-col px-2'
          )}>
            <Show when={causes.data}>{
              (causes) => {
                return (<For each={causes().causes }>
                  {(charity, i) => <CharityListItemAlt charity={charity} i={i()}/>}
                </For>)
              }
            }</Show>
          </div>
        </ColoredScrollbar>
      </div>
    </div>
  );
}



const Item: Component<{ cause: JJCause }> = (props) => {
  const {cause: charity} = props
  const {overview} = useOverlayBackend()

  const totalPounds = () => overview.data?.raised.total.gbp ?? 0
  const totalDollar = () => overview.data?.raised.total.usd ?? 0

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
            class={'hover:scale-110 bg-[#133DF4] rounded-full transition-all'}
          >
            <TiltifyRoundIcon class={'~w-4/6 ~h-4/6'}/>
          </a>
        </div>
      </div>
      <p class={'w-full ~text-xs/base'}>{charity.description}</p>


      <div class={'flex flex-row w-full items-start justify-start'}>
        <p class={'text-primary-500 text-xs font-bold'}>
          Raised <Numeric value={totalPounds()} numberStyle="currency" currency={'GBP'}/> / <Numeric
          value={totalDollar()} numberStyle="currency"
          currency={'USD'}/>
        </p>
      </div>
    </div>
  )
}
