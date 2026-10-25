import {type Component, createSignal, onCleanup, Show} from "solid-js";
import {twMerge} from "tailwind-merge";

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
import {useBackend} from "./providers/BackendProvider.tsx";
import type {CurrenciesSchema, GetUserData200Response} from "../../api";
import {Numeric} from "solid-i18n";
import {useCurrency} from "./providers/CurrencyProvider.tsx";
import {CrossFade} from "./CrossFade.tsx";
import {usePortalMount} from "./PreviewFrame.tsx";

export const PanelHeader: Component = () => {

  const {userData, userConfig, config} = useBackend()

  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show when={userConfig.data}>
              {
                (userConfig) => {
                  return (
                    <Show
                      when={userConfig().hasCampaign && config().showUserFundraiser}
                      fallback={<NoUserCampaignHeader/>}
                    >
                      <Show
                        when={userData.data}
                        fallback={<NoUserCampaignHeader/>}>
                        {
                          (userData) => (
                            <UserCampaignHeader userData={userData()}/>
                          )
                        }
                      </Show>
                    </Show>
                  )
                }
              }
            </Show>
          )
        }
      }
    </Show>
  );
}

// Same card surface as the redesigned list items, so the header reads as part of the same family.
const useHeaderStyle = () => {
  const {theme} = useTheme()

  const surface = () => {
    if (theme() === 'dark') {
      return 'bg-gradient-to-b from-white/30 to-white/10 ring-1 ring-white/10 text-white backdrop-blur-sm'
    }
    return 'bg-gradient-to-b from-neutral-50 to-neutral-100 ring-1 ring-black/5'
  }

  const raisedColor = () => {
    if (theme() === 'dark') return 'text-white'
    if (theme() === 'blue' || theme() === 'blue_light') return 'text-accent-600'
    return 'text-primary-600'
  }

  const logo = () => {
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

  return {surface, raisedColor, logo}
}

// Logo row shared by both headers: About on the left, logo centred, an empty slot on the right to balance it.
const LogoRow: Component = () => {
  const {logo} = useHeaderStyle()
  return (
    <div class={'flex h-7 w-full flex-row items-center'}>
      <div class={'flex h-full flex-1 flex-row items-center justify-start'}>
        <About/>
      </div>
      <img src={logo()} class={'h-full'} alt={'JJ Logo'}/>
      <div class={'flex-1'}/>
    </div>
  )
}

const NoUserCampaignHeader: Component = () => {
  const {surface} = useHeaderStyle()

  return (
    <div class={'px-2'}>
      <div class={twMerge('rounded-2xl p-1.5 shadow-sm', surface())}>
        <LogoRow/>
      </div>
    </div>
  );
}

// Logo on top, then a single row in the CommunityListItem layout: avatar, name + campaign, "Raised" over the amount.
const UserCampaignHeader: Component<{
  userData: GetUserData200Response
}> = (props) => {
  const {surface, raisedColor} = useHeaderStyle()

  return (
    <div class={'px-2'}>
      <div class={twMerge('flex flex-col gap-1 rounded-2xl p-1.5 shadow-sm', surface())}>
        <LogoRow/>
        <div class={'flex w-full flex-row items-center gap-2 px-0.5 pb-0.5'}>
          <img
            src={props.userData.campaign.twitch?.avatar ?? props.userData.campaign.avatar}
            alt={'Campaign Avatar'}
            class={'size-8 rounded-lg object-cover ring-1 ring-white'}
          />
          <UserHeaderTexts userData={props.userData}/>
          <div class={twMerge('flex shrink-0 flex-col items-end font-bold', raisedColor())}>
            <p class={'text-xxs'}>Raised</p>
            <p class={'text-xs'}>
              <CurrencyAmount values={props.userData.campaign.raised}/>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const UserHeaderTexts: Component<{ userData: GetUserData200Response }> = (props) => {
  const [showCampaign, setShowCampaign] = createSignal<boolean>(true)

  const interval = setInterval(() => {
    setShowCampaign(v => !v)
  }, 10000)

  onCleanup(() => clearInterval(interval))

  const name = () => props.userData.campaign.twitch?.name ?? props.userData.campaign.tiltifyName

  // Only the subtitle rotates between campaign name and cause; the name stays put.
  return (
    <div class={'min-w-0 flex-1'}>
      <p class={'truncate text-xs font-semibold'}>{name()}</p>
      <Show
        when={props.userData.cause}
        fallback={<p class={'truncate text-xxs opacity-80'}>{props.userData.campaign.campaignName}</p>}
      >
        {
          (cause) => (
            <div class={'relative h-3'}>
              <CrossFade show={showCampaign()}>
                <p class={'truncate text-xxs opacity-80'}>{props.userData.campaign.campaignName}</p>
              </CrossFade>
              <CrossFade show={!showCampaign()}>
                <p class={'truncate text-xxs opacity-80'}>Raising for {cause().name}</p>
              </CrossFade>
            </div>
          )
        }
      </Show>
    </div>
  )
}

const About = () => {
  const modalSignal = createModalSignal()
  return (
    <>
      <button
        class={twMerge(
          'group h-6 group inline-flex items-center justify-center cursor-pointer',
          'rounded-full shadow-sm',
          'transition-all duration-300',
          'bg-gray-700'
        )}
        aria-label={'About'}
        onClick={() => {
          modalSignal.open()
        }}
      >
        <BiRegularInfoCircle class={'text-white size-6'} size={24}/>
        <p
          class={twMerge(
            'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
            'text-white text-xs text-center',
            'transition-all duration-300 ease-in-out',
            'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-1 group-hover:pr-2'
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
}

const Donate = () => {
  const {config} = useBackend()

  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show when={config().donationLink.visible}>
              <a
                class={twMerge(
                  'group inline-flex items-center justify-center cursor-pointer',
                  'bg-tiltify-500',
                  'rounded-full shadow-xl',
                  'transition-all duration-300',
                )}
                href={config().donationLink.url}
                target="_blank"
              >
                <p
                  class={twMerge(
                    'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
                    'text-white text-xs',
                    'transition-all duration-300 ease-in-out',
                    'group-hover:max-w-xs group-hover:opacity-100 group-hover:pr-1 group-hover:pl-2 flex flex-row items-center justify-center gap-0.5'
                  )}
                >
                  {config().donationLink.text}
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
      }
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
      <Dialog.Portal mount={usePortalMount()}>
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
            <p class={'text-lg text-center'}>About Jingle Jam</p>
            <span class={' ~text-xs/base text-center'}>
              <p>Jingle Jam is a registered charity in England and Wales (1200061).</p>
              <p>The Jingle Jam fundraising event is organised by Jingle Jam Promotions on behalf of Jingle Jam to raise funds for our charity partners.</p>
            </span>
            <ExternalLinks/>
            <p class={'text-lg text-center'}>About the Extension</p>
            <span class={' ~text-xs/base text-center'}>
                <p>The Jingle Jam Community Extension is a community project and not affiliated with the Jingle Jam.</p>
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


const CurrencyAmount: Component<{ values: CurrenciesSchema }> = (props) => {
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
