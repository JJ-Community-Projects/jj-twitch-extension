import {type Component, Show} from "solid-js"
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {DateTime} from "luxon";
import {Numeric} from "solid-i18n";
import {useCurrency} from "../../providers/CurrencyProvider.tsx";
import {CurrencyToggle} from "../../CurrencyToggle.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";
import type {CurrenciesSchema} from "../../../../api";


export const CharityOverview: Component = () => {

  const {overview} = useBackend()

  const totalYogs = () => overview.data?.raised.yogscast
  const totalFundraiser = () => overview.data?.raised.fundraisers
  const total = () => overview.data?.raised.total

  const {tailwindTextPrimary, theme} = useTheme()
  const raisedTextColor = () => {
    if (theme() === 'dark') {
      return 'text-white'
    }
    return tailwindTextPrimary()
  }

  const darkText = () => {
    if (theme() === 'dark') {
      return 'text-white'
    }
    return ''
  }

  const bgColor = () => {
    if (theme() === 'dark') {
      return 'bg-gradient-to-b bg-gradient-to-b from-white/30 to-white/10 '
    }
    return 'bg-gradient-to-b from-white to-gray-100'
  }

  return (
    <div class={'text-center text-xs'}>
      <div class={twMerge('flex h-full w-full flex-col gap-1 rounded-2xl p-1 shadow-xl', bgColor())}>
        <div id={'parent'} class={'relative h-12'}>
          <div id={'div1'} class={'absolute inset-0 flex flex-col items-center justify-center'}>
            <p class={twMerge('relative text-base font-bold', raisedTextColor())}>
              <Show when={total()}>
                {(total) => (
                  <Currency values={total()}/>)}
              </Show>
            </p>
            <Show when={overview.data}>
              {
                (overview) => (
                  <p class={twMerge('text-xs', darkText())}>Raised in {DateTime.fromJSDate(overview().date).year}</p>)
              }
            </Show>
          </div>
          <div id={'div2'} class={'absolute right-0 top-0 p-1'}>
            <CurrencyToggle/>
          </div>
        </div>
        <div class={'grid grid-cols-2 gap-1 gap-y-2'}>
          <div>
            <p class={twMerge('text-xs font-bold', raisedTextColor())}>
              <Show when={totalYogs()}>
                {(totalYogs) => (
                  <Currency values={totalYogs()}/>)}
              </Show>
            </p>
            <p class={twMerge('text-xxs', darkText())}>Raised by the Yogscast</p>
          </div>
          <div>
            <p class={twMerge('text-xs font-bold', raisedTextColor())}>
              <Show when={totalFundraiser()}>
                {(totalFundraiser) => (
                  <Currency values={totalFundraiser()}/>)}
              </Show>
            </p>
            <p class={twMerge('text-xxs', darkText())}>Raised by Fundraisers</p>
          </div>
          <div>
            <Show when={overview.data}>
              {
                (overview) => (
                  <p class={twMerge('text-xs font-bold', raisedTextColor())}>
                    <Numeric value={overview().collections.redeemed} numberStyle={'decimal'}/>
                  </p>
                )
              }
            </Show>
            <p class={twMerge('text-xxs', darkText())}>Collections</p>
          </div>
          <div>
            <Show when={overview.data}>
              {
                (overview) => (
                  <p class={twMerge('text-xs font-bold', raisedTextColor())}>
                    <Numeric value={overview().collections.total - overview().collections.redeemed}
                             numberStyle={'decimal'}/>
                  </p>

                )
              }
            </Show>
            <p class={twMerge('text-xxs', darkText())}>Collections Available</p>
          </div>
        </div>
        <div class={'flex flex-1 items-end justify-center'}>

          <Show when={overview.data}>
            {
              (overview) => (
                <p class={twMerge('text-xxs text-center', darkText())}>
                  Last update, {DateTime.fromJSDate(overview().date).toLocaleString(DateTime.DATETIME_MED)}
                </p>
              )
            }
          </Show>
        </div>
      </div>
    </div>
  )
}


const Currency: Component<{ values: CurrenciesSchema }> = props => {
  const {pounds, usd, eur} = useCurrency()
  return (
    <>
      <Show when={usd()}>
        <div id={'usd'}>
          <Numeric value={props.values.usd} numberStyle="currency" currency={'USD'}/>
        </div>
      </Show>
      <Show when={pounds()}>
        <div id={'gbp'}>
          <Numeric value={props.values.gbp} numberStyle="currency" currency={'GBP'}/>
        </div>
      </Show>
      <Show when={eur()}>
        <div id={'eur'}>
          <Numeric value={props.values.euro} numberStyle="currency" currency={'EUR'}/>
        </div>
      </Show>
    </>
  )
}
