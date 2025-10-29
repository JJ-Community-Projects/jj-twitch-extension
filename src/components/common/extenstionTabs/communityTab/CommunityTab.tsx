import {type Component, For, type ParentComponent, Show} from "solid-js";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {DateTime} from "luxon";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {Numeric} from "solid-i18n";
import {FiExternalLink} from "solid-icons/fi";
import {InvisibleBody} from "../../InvisibleBody.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";
import type {CurrenciesSchema, JJCampaign} from "../../../../api";
import {TwitchIcon} from "../../icons/JJIcons.tsx";
import {FaBrandsTwitch} from "solid-icons/fa";


export const CommunityTab: Component = () => {
  const {config} = useBackend()


  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show when={config().showFundraisers} fallback={
              <InvisibleBody text={'The Community Fundraisers will be shown soon after the Jingle Jam has started.'}>
                <JJStreamTeamLink/>
              </InvisibleBody>
            }>
              <Body/>
            </Show>

          )
        }
      }
    </Show>
  );
}

const Body = () => {
  const {campaigns} = useBackend()


  return (
    <Show when={campaigns.data}>
      {
        (campaigns) => {
          return (
            <div class={'flex h-full flex-1 flex-col'}>
              <ColoredScrollbar>
                <div class={'flex flex-1 flex-col gap-2 mx-2'}>
                  <FundraiserBody fundraisers={campaigns().campaigns}/>
                </div>
              </ColoredScrollbar>
              <p class={'text-center text-xxs text-black bg-white rounded-full p-1 mt-1 mx-2'}>
                Last update, {DateTime.fromJSDate(campaigns().date).toLocaleString(DateTime.DATETIME_MED)}
              </p>
            </div>
          )
        }
      }
    </Show>
  )
}


const FundraiserBody: Component<{ fundraisers: JJCampaign[] }> = props => {
  const fundraiser = () => props.fundraisers

  return (
    <>
      <JJStreamTeamLink/>
      <For each={fundraiser()} fallback={
        <p class={'text-center text-white'}>No Fundraisers found.</p>
      }>
        {(d, i) => {
          const isTwitch = () => d.twitch !== undefined
          const img = () => d.twitch?.avatar ?? d.avatar


          const isLive = () => {
            if (d.twitch) {
              return d.twitch.isLive
            }
            return false
          }

          const name = () => {
            return d.twitch?.name ?? d.tiltifyName
          }

          return (
            <Child
              i={i()}
              img={img()}
              title={d.campaignName}
              subtitle={name()}
              desc={d.tiltifyDescription ?? ''}
              isLive={isLive()}
              raised={d.raised}
              tiltifyUrl={d.tiltifyUrl}
              twitchUrl={d.twitch?.url}
            />
          )
        }}
      </For>
    </>
  )
}

const Live = () => {
  return (
    <div class={'relative flex h-3 items-center justify-center'}>
      <p class={'bg-twitch-500 rounded p-0.5 text-[6px] text-white'}>LIVE</p>
    </div>
  )
}

const Child: Component<{
  i: number
  title: string
  subtitle: string
  img: string
  isLive: boolean
  desc: string
  raised: CurrenciesSchema
  tiltifyUrl: string
  twitchUrl?: string
}> = props => {
  const {theme, tailwindTextPrimary} = useTheme()

  const raisedColor = () => {
    if (theme() === 'rainbow') {
      return 'text-black'
    } else if (theme() === 'dark') {
      return 'text-white'
    }
    return tailwindTextPrimary()
  }

  const gradient = [
    'bg-gradient-to-br from-red-200 to-red-400',
    'bg-gradient-to-br from-orange-200 to-orange-400',
    'bg-gradient-to-br from-yellow-200 to-yellow-400',
    'bg-gradient-to-br from-green-200 to-green-400',
    'bg-gradient-to-br from-cyan-200 to-cyan-400',
    'bg-gradient-to-br from-blue-200 to-blue-400',
    'bg-gradient-to-br from-purple-200 to-purple-400',
  ]

  const campaignColor = (i: number) => {
    if (theme() === 'rainbow') {
      return gradient[i % gradient.length]
    } else if (theme() === 'dark') {
      return 'bg-gray-500 text-white'
    }
    return 'bg-gradient-to-br from-white to-gray-100'
  }
  return (
    <div class={twMerge('min-h-24 w-full rounded-2xl shadow-xl', campaignColor(props.i))}>
      <div class={'flex h-full w-full flex-col items-start gap-2 p-1.5'}>
        <div class={'flex h-full flex-1 flex-col gap-1'}>
          <div class={'flex flex-row gap-1'}>
            <img class={'h-8 w-8 rounded-lg'} alt={props.title} src={props.img} loading={'lazy'}/>
            <div class={'flex h-full flex-1 min-w-0 flex-col justify-between'}>
              <div class={'flex max-h-[14px] flex-row items-center gap-1 overflow-hidden'}>
                <Show when={props.isLive}>
                  <Live/>
                </Show>
                <p class={'truncate text-ellipsis text-sm font-bold min-w-0 flex-1'}>{props.title}</p>
              </div>
              <p class={'truncate text-ellipsis text-xs font-bold min-w-0'}>{props.subtitle}</p>
            </div>
          </div>
          <p class={'line-clamp-2 w-full text-ellipsis text-xs'}>{props.desc}</p>
          <p class={twMerge('text-primary text-xs font-bold', raisedColor())}>
            Raised <Numeric value={props.raised.gbp} numberStyle="currency" currency={'GBP'}/>
          </p>
        </div>

        <div class={'flex flex-row gap-2'}>
          <a target={'_blank'} href={props.tiltifyUrl}
             class={'transition-all hover:scale-102 hover:brightness-105 text-white gap-1 rounded-full bg-tiltify-500 p-1 flex flex-row items-center justify-center'}>
            <span class={'text-xxs'}>Donate</span> <FiExternalLink size={12}/>
          </a>
          <Show when={props.twitchUrl}>
            <a target={'_blank'} href={props.twitchUrl}
               class={'transition-all hover:scale-102 hover:brightness-105 text-white gap-1 rounded-full bg-twitch-500 p-1 flex flex-row items-center justify-center'}>
              <span class={'text-xxs'}>Twitch</span> <FiExternalLink size={12}/>
            </a>
          </Show>
        </div>
      </div>
    </div>
  )
}

const JJStreamTeamLink = () => {
  return (
    <a
      href={'https://twitch.tv/team/jinglejam'}
      target={'_blank'}
      class={'flex flex-row justify-between items-center p-2 rounded-2xl text-white bg-twitch text-center hover:scale-101 hover:brightness-105 transition-all'}>Jingle
      Jam Stream Team
      <FiExternalLink/></a>
  )
}
