import {type Component, Show} from "solid-js";
import {twMerge} from "tailwind-merge";

import red from '../../assets/JingleJam_Red.png'
import blue from '../../assets/JingleJam_Blue.png'
import black from '../../assets/JingleJam_Black.png'
import {TiltifyRoundIcon} from "../common/icons/JJIcons.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {BiRegularInfoCircle} from "solid-icons/bi";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {useOverlayBackend} from "../common/providers/OverlayBackendProvider.tsx";
import type {CurrenciesSchema, GetUserData200Response, JJCampaign} from "../../api";
import {Numeric} from "solid-i18n";
import {useCurrency} from "../common/providers/CurrencyProvider.tsx";


export const OverlayHeader: Component = () => {
  const {theme} = useTheme()
  const {userConfig, userData, config} = useOverlayBackend()

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
      <div class={'flex flex-col bg-white shadow rounded-2xl items-start p-1 gap-1'}>
        <Show when={config.data}>
          {
            (config) => {
              return (
                <Show when={userConfig.data}
                      fallback={<NoUserCampaignHeader image={image()}/>}
                >
                  {(userConfig) => (
                    <Show when={userConfig().hasCampaign && config().showUserFundraiser}
                          fallback={<NoUserCampaignHeader image={image()}/>}
                    >
                      <Show when={userData.data}>
                        {(ud) => <UserCampaignHeader image={image()} userData={ud()}/>}
                      </Show>
                    </Show>
                  )}
                </Show>
              )
            }
          }
        </Show>
      </div>
    </div>
  );
}

const NoUserCampaignHeader: Component<{ image: string }> = (props) => {
  return (
    <div class={'w-full h-8 flex flex-row items-center p-1'}>
      <div class={'flex-1 flex flex-row items-center justify-start h-full'}>
        <About/>
      </div>
      <img src={props.image} class={'h-full'} alt={'JJ Logo'}/>
      <div class={'flex-1 flex flex-row items-center justify-end h-full'}>
      </div>
    </div>
  )
}

const UserCampaignHeader: Component<{ image: string, userData: GetUserData200Response }> = (props) => {
  const {theme, tailwindTextPrimary} = useTheme()

  const raisedTextColor = () => {
    if (theme() === 'dark') return 'text-white'
    return tailwindTextPrimary()
  }

  const darkText = () => (theme() === 'dark' ? 'text-white' : '')

  return (
    <>
      <div class={'w-full h-8 flex flex-row items-center p-1'}>
        <div class={'flex-1 flex flex-row items-center justify-start h-full'}>
          <About/>
        </div>
        <img src={props.image} class={'h-full'} alt={'JJ Logo'}/>
        <div class={'flex-1 flex flex-row items-center justify-end h-full'}>
        </div>
      </div>
      <div class={'w-full px-1 pb-1'}>
        <div class={twMerge('w-full h-full flex flex-row items-start gap-2')}>
          <img src={props.userData.campaign.twitch?.avatar ?? props.userData.campaign.avatar} alt={'Campaign Avatar'}
               class={'~w-8/12 ~h-8/12 rounded-xl object-cover'}/>

          <UserCampaignTexts campaign={props.userData.campaign}/>

          <div class={'h-full flex flex-col items-end justify-start'}>
            <p class={twMerge('text-xs font-bold', raisedTextColor())}>
              <CurrencyAmount values={props.userData.campaign.raised}/>
            </p>
            <p class={twMerge('text-[10px]', darkText())}>Raised</p>
          </div>
        </div>
      </div>
    </>
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
    <div class={'relative min-w-0 flex-1 flex flex-col leading-tight'}>
      <p class={twMerge('text-xs font-bold truncate', raisedTextColor())}>{platformName()}</p>
      <p class={twMerge('text-[10px] truncate', darkText())}>{props.campaign.campaignName}</p>
    </div>
  )
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
