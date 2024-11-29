import {type Component, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
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
  TiltifyRoundIcon,
  TwitchIcon,
  TwitterIcon
} from "./icons/JJIcons.tsx";
import {useTheme} from "./providers/ThemeProvider.tsx";
import {twLinkBGHoverColor, twLinkHoverColor} from "../../lib/colorUtil.ts";
import {BiRegularInfoCircle} from "solid-icons/bi";

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
        <div class={'flex-1 flex flex-row items-center justify-start px-1 h-full'}>
          <About/>
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
  const modalSignal = createModalSignal()
  const {theme} = useTheme()

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
    <>
      <button
        class={twMerge(
          'group h-full group inline-flex items-center justify-center gap-1 cursor-pointer',
          'rounded-full shadow',
          'transition-all duration-300',
          'bg-white hover:bg-gray-500'
        )}
        onClick={() => {
          modalSignal.open()
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
      <AboutDialog
        isOpen={modalSignal.isOpen()}
        close={modalSignal.close}
        onOpenChange={modalSignal.toggle}
      />
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
  const config = useTwitchPanelConfig()
  const jjConfig = usePanelConfig()

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
    <Show when={true || jjConfig.donationLink.visible}>
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
              <p class={'text-xl font-bold'}>About</p>
            </div>
          </Dialog.Title>
          <div
            class={twMerge('flex flex-col items-center gap-2 p-4')}>
            <p class={'text-lg text-center'}>About the Jingle Jam</p>
            <span class={' ~text-xs/base text-center'}>
              <p>Jingle Jam is a registered charity in England and Wales (1200061).</p>
              <p>The Jingle Jam fundraising event is organised by Jingle Jam Promotions on behalf of Jingle Jam to raise funds for our charity partners.</p>
            </span>
            <ExternalLinks/>
            <p class={'text-lg text-center'}>About the Extension</p>
            <span class={' ~text-xs/base text-center'}>
                <p>The Jingle Jam Community Extension shows information about the Charities and Community Fundraisers.</p>
                <p>This is a community project and not affiliated with the Jingle Jam.</p>
                <p>The Yogs Schedule is subject to change.</p>
              </span>
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
        class={twMerge('hover:scale-110 transition-all rounded-full p-1',
          twLinkHoverColor('jj'),
          twLinkBGHoverColor('jj')
        )}
        target={'_blank'}
        href={'https://jinglejam.co.uk'}
        aria-label={'Jingle Jam Website'}>
        <GlobeIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={twMerge('hover:scale-110 transition-all rounded-full p-1',
          twLinkHoverColor('twitch'),
          twLinkBGHoverColor('twitch')
        )}
        href={'https://twitch.tv/team/jinglejam'}
        target={'_blank'}
        aria-label={'Jingle Jam Stream Team'}>
        <TwitchIcon class={'~w-4/8 ~h-4/6'}/>
      </a>
      <a
        class={twMerge('hover:scale-110 transition-all rounded-full p-1',
          twLinkHoverColor('discord'),
          twLinkBGHoverColor('discord')
        )}
        target={'_blank'}
        href={'https://discord.gg/dsCsJJcvAx'}
        aria-label={'Jingle Jam Discord'}>
        <DiscordIcon class={'~w-4/8 ~h-4/6'}/>
      </a>
      <a
        class={twMerge('hover:scale-110 transition-all rounded-full p-1',
          twLinkHoverColor('twitter'),
          twLinkBGHoverColor('twitter')
        )}
        target={'_blank'}
        href={'https://x.com/jinglejam'}
        aria-label={'Jingle Jam Twitter'}>
        <TwitterIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={twMerge('hover:scale-110 transition-all rounded-full p-1',
          twLinkHoverColor('instagram'),
          twLinkBGHoverColor('instagram')
        )}
        target={'_blank'}
        href={'http://instagram.com/jinglejamofficial'}
        aria-label={'Jingle Jam Instagram'}>
        <InstagramIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={twMerge('hover:scale-110 transition-all rounded-full p-1',
          twLinkHoverColor('tiktok'),
          twLinkBGHoverColor('tiktok')
        )}
        target={'_blank'}
        href={'http://tiktok.com/@jinglejamofficial'}
        aria-label={'Jingle Jam Tiktok'}>
        <TiktokIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
    </div>

  )
}
