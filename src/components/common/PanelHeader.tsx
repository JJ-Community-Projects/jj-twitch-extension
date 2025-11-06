import {type Component, createSignal, Show} from "solid-js";
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
import type {CurrenciesSchema, GetUserData200Response, JJCampaign, JJCause} from "../../api";
import {Numeric} from "solid-i18n";
import {useCurrency} from "./providers/CurrencyProvider.tsx";
import {CrossFade} from "./CrossFade.tsx";

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

const NoUserCampaignHeader: Component = () => {
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
      <div class={'h-8 flex flex-row bg-gradient-to-b from-neutral-50 to bg-neutral-100 shadow rounded-2xl items-center p-1'}>
        <div class={'flex-1 flex flex-row items-center justify-start h-full'}>
          <About/>
        </div>
        <img src={image()} class={'h-full'} alt={'JJ Logo'}/>
        <div class={'flex-1 flex flex-row items-center justify-end h-full'}>
          <Donate/>
        </div>
      </div>
    </div>
  );
}

const UserCampaignHeader: Component<{
  userData: GetUserData200Response
}> = (props) => {

  const {theme, tailwindTextPrimary} = useTheme()

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

  const raisedTextColor = () => {
    if (theme() === 'dark') return 'text-white'
    return tailwindTextPrimary()
  }

  const darkText = () => (theme() === 'dark' ? 'text-white' : '')

  const {config} = useBackend()

  return (
    <div class={'px-2'}>
      <div class={'flex flex-col bg-gradient-to-b from-neutral-50 to bg-neutral-100  shadow rounded-2xl items-start p-1 gap-1'}>
        <div class={'w-full h-8 flex flex-row items-center p-1'}>
          <div class={'flex-1 flex flex-row items-center justify-start h-full'}>
            <About/>
          </div>
          <img src={image()} class={'h-full'} alt={'JJ Logo'}/>
          <div class={'flex-1 flex flex-row items-center justify-end h-full'}>
            <Show when={config.data}>
              {
                (config) => {
                  return (
                    <Show when={config().donationLink.visible}>
                      <a href={props.userData.campaign.tiltifyUrl} target={'_blank'}
                         class={'bg-tiltify-500 text-xs pl-2 p-1 text-white rounded-full flex flex-row gap-1 hover:brightness-105 hover:scale-101'}>Donate
                        <TiltifyRoundIcon
                          class={twMerge(
                            'size-4',
                          )}
                        /></a>
                    </Show>
                  )
                }
              }
            </Show>
          </div>
        </div>
        <div class={'w-full px-1 pb-1'}>
          <div class={twMerge('w-full h-full flex flex-row items-start gap-2')}>
            <img src={props.userData.campaign.twitch?.avatar ?? props.userData.campaign.avatar} alt={'Campaign Avatar'}
                 class={'~w-8/12 ~h-8/12 rounded-xl object-cover'}/>

            <UserHeaderTexts userData={props.userData}/>

            <div class={'h-full flex flex-col items-end justify-start'}>
              <p class={twMerge('text-xs font-bold', raisedTextColor())}>
                <CurrencyAmount values={props.userData.campaign.raised}/>
              </p>
              <p class={twMerge('text-[10px]', darkText())}>Raised</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const UserHeaderTexts: Component<{ userData: GetUserData200Response }> = (props) => {

  const [showCampaign, setShowCampaign] = createSignal<boolean>(true)


  const intervall = setInterval(() => {
    setShowCampaign(v => !v)
  }, 10000)

  return (

    <div class={'relative min-w-0 flex-1 flex flex-col leading-tight'}>
      <Show
        when={props.userData.cause}
        fallback={<UserCampaignTexts campaign={props.userData.campaign}/>}
      >
        {
          (cause) => {
            return (
              <>
                <CrossFade show={showCampaign()}>
                  <UserCampaignTexts campaign={props.userData.campaign}/>
                </CrossFade>
                <CrossFade show={!showCampaign()}>
                  <UserCauseTexts campaign={props.userData.campaign} cause={cause()}/>
                </CrossFade>
              </>
            )
          }
        }
      </Show>
    </div>
  )
}

const UserCampaignTexts: Component<{ campaign: JJCampaign }> = (props) => {

  const {theme, tailwindTextPrimary} = useTheme()
  const raisedTextColor = () => {
    if (theme() === 'dark') return 'text-white'
    return tailwindTextPrimary()
  }

  const darkText = () => (theme() === 'dark' ? 'text-white' : '')

  const platformName = () => {
    const t = props.campaign.twitch
    return t?.name ?? props.campaign.tiltifyName
  }

  return (
    <>
      <p class={twMerge('text-xs font-bold truncate', raisedTextColor())}>{platformName()}</p>
      <p class={twMerge('text-[10px] truncate', darkText())}>{props.campaign.campaignName}</p>
    </>
  )
}

const UserCauseTexts: Component<{ campaign: JJCampaign, cause: JJCause }> = (props) => {
  const {theme, tailwindTextPrimary} = useTheme()
  const raisedTextColor = () => {
    if (theme() === 'dark') return 'text-white'
    return tailwindTextPrimary()
  }

  const darkText = () => (theme() === 'dark' ? 'text-white' : '')

  const platformName = () => {
    const t = props.campaign.twitch
    return t?.name ?? props.campaign.tiltifyName
  }

  return (
    <>
      <p class={twMerge('text-xs font-bold truncate', raisedTextColor())}>{platformName()}</p>
      <p class={twMerge('text-[10px] truncate', darkText())}>Raising for {props.cause.name}</p>
    </>
  )
}

const About = () => {
  const modalSignal = createModalSignal()
  return (
    <>
      <button
        class={twMerge(
          'group h-full group inline-flex items-center justify-center cursor-pointer',
          'rounded-full shadow',
          'transition-all duration-300',
          'bg-gray-700'
        )}
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
