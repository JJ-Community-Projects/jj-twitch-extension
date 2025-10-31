import {type Component, Show} from "solid-js"
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {DateTime} from "luxon";
import {Numeric} from "solid-i18n";
import {useCurrency} from "../../providers/CurrencyProvider.tsx";
import {CurrencyToggle} from "../../CurrencyToggle.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";


export const CharityOverview: Component = () => {

  const {overview} = useBackend()

  const totalYogsPounds = () => overview.data?.raised.yogscast.gbp ?? 0
  const totalYogs = () => overview.data?.raised.yogscast.usd ?? 0
  const totalFundraiserPounds = () => overview.data?.raised.fundraisers.gbp ?? 0
  const totalFundraiser = () => overview.data?.raised.fundraisers.usd ?? 0
  const totalPounds = () => overview.data?.raised.total.gbp ?? 0
  const total = () => overview.data?.raised.total.usd ?? 0

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
      return 'bg-gradient-to-br from-gray-500 to-gray-600'
    }
    return 'bg-gradient-to-br from-white to-gray-100'
  }

  return (
    <div class={'text-center text-xs'}>
      <div class={twMerge('flex h-full w-full flex-col gap-1 rounded-2xl p-1 shadow-xl', bgColor())}>
        <div id={'parent'} class={'relative h-12'}>
          <div id={'div1'} class={'absolute inset-0 flex flex-col items-center justify-center'}>
            <p class={twMerge('relative text-base font-bold', raisedTextColor())}>
              <Currency dollars={total()} pounds={totalPounds()}/>
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
              <Currency dollars={totalYogs()} pounds={totalYogsPounds()}/>
            </p>
            <p class={twMerge('text-xxs', darkText())}>Raised by the Yogscast</p>
          </div>
          <div>
            <p class={twMerge('text-xs font-bold', raisedTextColor())}>
              <Currency dollars={totalFundraiser()} pounds={totalFundraiserPounds()}/>
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
            <p class={twMerge('text-xxs', darkText())}>Collections Sold</p>
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


interface CurrencyAnimProps {
  dollars: number
  pounds: number
}

const Currency: Component<CurrencyAnimProps> = props => {
  const {pounds} = useCurrency()
  const dollar = () => !pounds()
  return (
    <>
      <Show when={dollar()}>
        <div id={'usd'}>
          <Numeric value={props.dollars} numberStyle="currency" currency={'USD'}/>
        </div>
      </Show>
      <Show when={!dollar()}>
        <div id={'gbp'}>
          <Numeric value={props.pounds} numberStyle="currency" currency={'GBP'}/>
        </div>
      </Show>
    </>
  )
}
