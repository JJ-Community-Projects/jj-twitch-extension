import {type Component, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
import {Tooltip} from "@kobalte/core/tooltip";
import {FaSolidHeart, FaSolidInfo} from "solid-icons/fa";
import {usePanelConfig, useTwitchPanelConfig} from "./providers/PanelConfigProvider.tsx";

import red from '../../assets/JingleJam_Red.png'
import blue from '../../assets/JingleJam_Blue.png'
import black from '../../assets/JingleJam_Black.png'
import {Dialog} from "@kobalte/core";
import {createModalSignal} from "../../lib/createModalSignal.ts";
import {AiOutlineClose} from "solid-icons/ai";
import {
  DiscordIcon,
  GithubIcon,
  GlobeIcon,
  InstagramIcon,
  TiktokIcon,
  TwitchIcon,
  TwitterIcon
} from "./icons/JJIcons.tsx";
import {useTheme} from "./providers/ThemeProvider.tsx";

interface PanelHeaderProps {
}

export const PanelHeader: Component<PanelHeaderProps> = (props) => {
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
        <div class={'flex-1 flex flex-row items-center justify-start px-2'}>
          <About/>
        </div>
        <img src={image()} class={'h-full'} alt={'JJ Logo'}/>
        <div class={'flex-1 flex flex-row items-center justify-end px-2'}>
          <Donate/>
        </div>
      </div>
    </div>
  );
}

const About = () => {
  const modalSignal = createModalSignal()

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
  )
}

const Donate = () => {
  const config = useTwitchPanelConfig()
  const jjConfig = usePanelConfig()
  const {theme} = useTheme()

  const url = () => {
    if (!config.donationUrl || config.donationUrl === '' || jjConfig.donationLink.overrideCustomLink) {
      return jjConfig.donationLink.url
    }
    return config.donationUrl
  }

  const text = () => {
    return jjConfig.donationLink.text ?? 'Donate'
  }

  const color = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'text-blue-500'
      case 'dark':
        return 'text-white'
      default:
        return 'text-primary'
    }
  }

  return (
    <Show when={jjConfig.donationLink.visible}>
      <Tooltip placement={'bottom'}>
        <Tooltip.Trigger
          onClick={() => {
          }}
          class={
            twMerge('w-5 h-5 items-center justify-center flex flex-col',
            )
          }>
          <a
            class={twMerge(
              'hover:scale-102 flex flex-row items-center justify-center p-1 text-center transition-all',
              color(),
            )}
            href={url()}
            target={'_blank'}
          >
            <FaSolidHeart/>
          </a>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="tooltip__content flex flex-row bg-accent-500 text-white p-2 rounded">
            <Tooltip.Arrow/>
            <p class={'text-white'}>{text()}</p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
    </Show>
  )
}

interface AboutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  close: () => void;
}

const AboutDialog: Component<AboutDialogProps> = (props) => {
  return (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class={'fixed inset-0 z-50 bg-black bg-opacity-20'}/>
        <Dialog.Content
          class={'fixed inset-0 z-50 h-fit flex flex-col items-center justify-center bg-white text-black m-2 rounded-2xl shadow-xl'}>
          <Dialog.Title
            class="w-full p-2 flex flex-row gap-4 rounded-t-2xl"
          >
            <button class={'rounded-full hover:bg-accent-200/10 aspect-square'} onClick={() => props.close()}>
              <AiOutlineClose size={24}/>
            </button>
            <div class={'flex flex-col'}>
              <p class={'text-xl font-bold'}>About the extension</p>
            </div>
          </Dialog.Title>
          <div
            class={twMerge('flex flex-col items-center gap-2 p-4')}>
              <span class={' ~text-xs/base text-center'}>
                <p>The Jingle Jam Community Extension shows information about the Charities and Community Fundraisers.</p>
                <p>This is a community project and not affiliated with the Jingle Jam.</p>
              </span>
            <ExternalLinks/>
            <a
              class={'text-xs flex flex-row gap-1 justify-center items-center hover:scale-105 transition-all'}
              href={'https://github.com/orgs/JJ-Community-Projects/repositories'}
              target={'_blank'}
            >
              Contribute on Github <GithubIcon/>
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const ExternalLinks = () => {
  return (
    <div class={'flex flex-row justify-between ~gap-2/4 items-center'}>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'https://jinglejam.co.uk'}
        aria-label={'Jingle Jam Website'}>
        <GlobeIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        href={'https://twitch.tv/team/jinglejam'}
        target={'_blank'}
        aria-label={'Jingle Jam Stream Team'}>
        <TwitchIcon class={'~w-4/8 ~h-4/6'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'https://discord.gg/dsCsJJcvAx'}
        aria-label={'Jingle Jam Discord'}>
        <DiscordIcon class={'~w-4/8 ~h-4/6'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'https://x.com/jinglejam'}
        aria-label={'Jingle Jam Twitter'}>
        <TwitterIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'http://instagram.com/jinglejamofficial'}
        aria-label={'Jingle Jam Instagram'}>
        <InstagramIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'http://tiktok.com/@jinglejamofficial'}
        aria-label={'Jingle Jam Tiktok'}>
        <TiktokIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
    </div>

  )
}
