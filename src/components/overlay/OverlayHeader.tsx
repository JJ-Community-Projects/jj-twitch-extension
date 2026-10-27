import {type Component, createSignal, onCleanup, Show} from "solid-js";
import {twMerge} from "tailwind-merge";

import red from '../../assets/JingleJam_Red.png'
import blue from '../../assets/JingleJam_Blue.png'
import black from '../../assets/JingleJam_Black.png'
import {TiltifyRoundIcon} from "../common/icons/JJIcons.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {BiRegularInfoCircle} from "solid-icons/bi";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {useOverlayBackend} from "../common/providers/OverlayBackendProvider.tsx";
import type {CurrenciesSchema, GetUserData200Response} from "../../api";
import {Numeric} from "solid-i18n";
import {useCurrency} from "../common/providers/CurrencyProvider.tsx";
import {CrossFade} from "../common/CrossFade.tsx";


export const OverlayHeader: Component = () => {
  const {userConfig, userData, config} = useOverlayBackend()

  return (
    <Show when={config.data}>
      {
        (config) => (
          <Show when={userConfig.data} fallback={<NoUserCampaignHeader/>}>
            {
              (userConfig) => (
                <Show
                  when={userConfig().hasCampaign && config().showUserFundraiser}
                  fallback={<NoUserCampaignHeader/>}
                >
                  <Show when={userData.data} fallback={<NoUserCampaignHeader/>}>
                    {(userData) => <UserCampaignHeader userData={userData()}/>}
                  </Show>
                </Show>
              )
            }
          </Show>
        )
      }
    </Show>
  );
}

// Same card surface as the panel header, so both extensions read as one family.
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

// About on the left, logo centred, an empty slot on the right to balance it.
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

// Logo on top, then avatar, name + campaign, "Raised" over the amount.
const UserCampaignHeader: Component<{ userData: GetUserData200Response }> = (props) => {
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
  const {showAboutJJ} = useOverlay()
  return (
    <button
      class={twMerge(
        'group h-6 group inline-flex items-center justify-center cursor-pointer',
        'rounded-full shadow-sm',
        'transition-all duration-300',
        'bg-gray-700'
      )}
      aria-label={'About'}
      onClick={() => {
        showAboutJJ()
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
  )
}

const Donate = () => {
  const {userData, config} = useOverlayBackend()

  const url = () => {
    return userData.data?.campaign.tiltifyUrl ?? config.data?.donationLink.url
  }

  const text = () => {
    return config.data?.donationLink.text ?? 'Donate'
  }

  return (
    <Show when={config.data?.donationLink.visible}>
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
