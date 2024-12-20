import {twMerge} from "tailwind-merge";
import {type Component, Show} from "solid-js";
import {usePanelConfig, useTwitchPanelConfig} from "./providers/PanelConfigProvider.tsx";
import type {Theme} from "../../lib/model/TwitchConfig.ts";

export const DonationButton: Component = () => {
  const config = useTwitchPanelConfig()
  const jjConfig = usePanelConfig()

  const theme = (): Theme => {
    return config.theme
  }

  const url = () => {
    if (!config.donationUrl || config.donationUrl === '' || jjConfig.donationLink.overrideCustomLink) {
      return jjConfig.donationLink.url
    }
    return config.donationUrl
  }

  const gradient = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'bg-gradient-to-br from-primary-400 to-primary-500'
      case 'dark':
        return 'bg-gradient-to-br from-gray-400 to-gray-500'
      default:
        return 'bg-gradient-to-br from-accent-400 to-accent-500'
    }
  }
  return (
    <Show when={jjConfig.donationLink.visible}>
      <a
        class={twMerge(
          'hover:scale-102 flex flex-row items-center justify-center rounded-2xl p-1 text-center text-white shadow-xl transition-all hover:shadow-2xl hover:brightness-105',
          gradient(),
        )}
        href={url()}
        target={'_blank'}
      >
        {jjConfig.donationLink.text ?? 'Donate'}
      </a>
    </Show>
  )
}
