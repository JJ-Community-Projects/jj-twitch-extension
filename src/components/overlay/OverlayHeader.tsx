import {type Component, Show} from "solid-js";
import {twMerge} from "tailwind-merge";

import red from '../../assets/JingleJam_Red.png'
import blue from '../../assets/JingleJam_Blue.png'
import black from '../../assets/JingleJam_Black.png'
import {TiltifyRoundIcon} from "../common/icons/JJIcons.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {BiRegularInfoCircle} from "solid-icons/bi";
import {useOverlayConfig, useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";


export const OverlayHeader: Component = (props) => {
  const {theme} = useTheme()

  const image = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return blue.src
      case 'dark':
        return black.src
      default:
        return red.src
    }
  }

  return (
    <div class={'px-2'}>
      <div class={'h-8 flex flex-row bg-white shadow rounded-2xl items-center p-1'}>
        <div class={'flex-1 flex flex-row items-center justify-start px-1 h-full'}>
        </div>
        <img src={image()} class={'h-full'} alt={'JJ Logo'}/>
        <div class={'flex-1 flex flex-row items-center justify-end px-1 h-full'}>
          <Donate/>
        </div>
      </div>
    </div>
  );
}

const About = () => {
  const {showAboutJJ} = useOverlay()
  return (
    <>
      <button
        class={twMerge(
          'group h-full group inline-flex items-center justify-center gap-1 cursor-pointer',
          'rounded-full shadow',
          'transition-all duration-300',
          'bg-white hover:bg-gray-500'
        )}
        onClick={() => {
          showAboutJJ()
        }}
      >
        <BiRegularInfoCircle class={'text-black group-hover:text-white size-6'} size={24}/>
        <p
          class={twMerge(
            'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
            'text-white text-xs text-center',
            'transition-all duration-300 ease-in-out',
            'group-hover:max-w-xs group-hover:opacity-100 group-hover:pr-2'
          )}
        >
          About
        </p>
      </button>
    </>
  )
  /*
  return (
    <>
      <Tooltip placement={'bottom'}>
        <Tooltip.Trigger
          onClick={() => {
            modalSignal.open()
          }}
          class={
            twMerge('w-5 h-5 items-center justify-center flex flex-col',
            )
          }>
          <FaSolidInfo class={'text-black'} size={18}/>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="tooltip__content flex flex-row bg-accent-500 text-white p-2 rounded">
            <Tooltip.Arrow/>
            <p class={'text-white'}>About</p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
      <AboutDialog
        isOpen={modalSignal.isOpen()}
        close={modalSignal.close}
        onOpenChange={modalSignal.toggle}
      />
    </>
  )*/
}

const Donate = () => {
  const config = useTwitchOverlayConfig()
  const jjConfig = useOverlayConfig()

  const url = () => {
    if (!config.donationUrl || config.donationUrl === '' || jjConfig.donationLink.overrideCustomLink) {
      return jjConfig.donationLink.url
    }
    return config.donationUrl
  }

  const text = () => {
    return jjConfig.donationLink.text ?? 'Donate'
  }

  return (
    <Show when={jjConfig.donationLink.visible}>
      <a
        class={twMerge(
          'group inline-flex items-center justify-center cursor-pointer',
          'bg-[#133DF4]',
          'rounded-full shadow',
          'transition-all duration-300',
        )}
        href={url()}
        target="_blank"
      >
        <p
          class={twMerge(
            'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
            'text-white text-xs',
            'transition-all duration-300 ease-in-out',
            'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-2'
          )}
        >
          {text()}
        </p>
        <TiltifyRoundIcon
          class={twMerge(
            'size-6',
            'transition-transform duration-300 ease-in-out',
          )}
        />
      </a>
    </Show>
  )
}
