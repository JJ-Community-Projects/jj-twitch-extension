import type {Component} from "solid-js";
import {useCurrency} from "./providers/CurrencyProvider.tsx";
import {useTheme} from "./providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {BsCurrencyDollar, BsCurrencyEuro, BsCurrencyPound} from "solid-icons/bs";

export const CurrencyToggle: Component = () => {
  const {pounds, usd, eur, setCurrency} = useCurrency()
  const {tailwindBGPrimary} = useTheme()

  return (
    <div class={'flex flex-row text-white transition-all items-center justify-center'}>
      <button
        onClick={() => {
          setCurrency('GBP')
        }}
        class={twMerge(
          'hover:scale-1 hover:brightness-101 rounded-l-2xl bg-gray-400 p-1 opacity-60 transition-all',
          pounds() && 'opacity-100',
          pounds() && tailwindBGPrimary(),
        )}
      >
        <BsCurrencyPound size={12}/>
      </button>
      <button
        onClick={() => {
          setCurrency('USD')
        }}
        class={twMerge(
          'hover:scale-1 hover:brightness-101 bg-gray-400 p-1 opacity-60 transition-all',
          usd() && 'opacity-100',
          usd() && tailwindBGPrimary(),
        )}
      >
        <BsCurrencyDollar size={12}/>
      </button>
      <button
        onClick={() => {
          setCurrency('EUR')
        }}
        class={twMerge(
          'hover:scale-1 hover:brightness-101 rounded-r-2xl bg-gray-400 p-1 opacity-60 transition-all',
          eur() && 'opacity-100',
          eur() && tailwindBGPrimary(),
        )}
      >
        <BsCurrencyEuro size={12}/>
      </button>
    </div>
  )
  /*
  return (
    <ToggleButton class={'flex flex-row text-white transition-all items-center justify-center'} pressed={dollar()} onChange={toggle}>
      {state => (
        <>
          <div
            class={twMerge(
              'hover:scale-1 hover:brightness-101 rounded-l-2xl bg-gray-400 p-1 opacity-60 transition-all',
              !state.pressed() && 'opacity-100',
              !state.pressed() && tailwindBGPrimary(),
            )}
          >
            <BsCurrencyPound size={12}/>
          </div>
          <div
            class={twMerge(
              'hover:scale-1 hover:brightness-101 rounded-r-2xl bg-gray-400 p-1 opacity-60 transition-all',
              state.pressed() && 'opacity-100',
              state.pressed() && tailwindBGPrimary(),
            )}
          >
            <BsCurrencyDollar size={12}/>
          </div>
        </>
      )}
    </ToggleButton>
  )*/
}
