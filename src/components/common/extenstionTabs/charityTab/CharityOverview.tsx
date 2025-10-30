import {type Component, Show} from "solid-js"
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {DateTime} from "luxon";
import {Numeric} from "solid-i18n";
import {useCurrency} from "../../providers/CurrencyProvider.tsx";
import {ToggleButton} from "@kobalte/core/toggle-button";
import {BsCurrencyDollar, BsCurrencyPound} from "solid-icons/bs";
import type {OverviewSchema} from "../../../../api";
import {CurrencyToggle} from "../../CurrencyToggle.tsx";

interface CharityOverviewProps {
  data: OverviewSchema
}

export const CharityOverview: Component<CharityOverviewProps> = props => {
  const totalYogsPounds = () => props.data.raised.yogscast.gbp
  const totalYogs = () => props.data.raised.yogscast.usd
  const totalFundraiserPounds = () => props.data.raised.fundraisers.gbp
  const totalFundraiser = () =>  props.data.raised.fundraisers.usd
  const totalPounds = () => props.data.raised.total.gbp
  const total = () => props.data.raised.total.usd

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
            <p class={darkText()}>Raised in {DateTime.fromJSDate(props.data.date).year}</p>
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
            <p class={darkText()}>Raised by the Yogscast</p>
          </div>
          <div>
            <p class={twMerge('text-xs font-bold', raisedTextColor())}>
              <Currency dollars={totalFundraiser()} pounds={totalFundraiserPounds()}/>
            </p>
            <p class={darkText()}>Raised by Fundraisers</p>
          </div>
          <div>
            <p class={twMerge('text-xs font-bold', raisedTextColor())}>
              <Numeric value={props.data.collections.redeemed} numberStyle={'decimal'}/>
            </p>
            <p class={darkText()}>Collections Sold</p>
          </div>
          <div>
            <p class={twMerge('text-xs font-bold', raisedTextColor())}>
              <Numeric value={props.data.collections.total - props.data.collections.redeemed} numberStyle={'decimal'}/>
            </p>
            <p class={darkText()}>Collections Available</p>
          </div>
        </div>
        <div class={'flex flex-1 items-end justify-center'}>
          <p class={twMerge('text-center', darkText())}>
            Last update, {DateTime.fromJSDate(props.data.date).toLocaleString(DateTime.DATETIME_MED)}
          </p>
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
