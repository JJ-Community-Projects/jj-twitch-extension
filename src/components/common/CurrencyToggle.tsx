import type {Component} from "solid-js";
import {useCurrency} from "./providers/CurrencyProvider.tsx";
import {useTheme} from "./providers/ThemeProvider.tsx";
import {ToggleButton} from "@kobalte/core/toggle-button";
import {twMerge} from "tailwind-merge";
import {BsCurrencyDollar, BsCurrencyPound} from "solid-icons/bs";

export const CurrencyToggle: Component = () => {
  const {pounds, toggle} = useCurrency()
  const {tailwindBGPrimary} = useTheme()
  const dollar = () => !pounds()

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
  )
}
