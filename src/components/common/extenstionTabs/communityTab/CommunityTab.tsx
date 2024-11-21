import {type Component, For, Match, type ParentComponent, Show, Switch} from "solid-js";
import {useData} from "../../providers/DataProvider.tsx";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {DateTime} from "luxon";
import type {Campaign} from "../../../../lib/model/jjData/JJCommunityFundraiser.ts";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {Numeric} from "solid-i18n";
import {FiExternalLink} from "solid-icons/fi";
import {usePanelConfig} from "../../providers/PanelConfigProvider.tsx";
import {InvisibleBody} from "../../InvisibleBody.tsx";


export const CommunityTab: Component = () => {
  const config = usePanelConfig()
  const {fundraiser} = useData()
  const campaigns = () => fundraiser.campaigns

  return (
    <>
      <Show when={config.showFundraiser}>
        <div class={'flex h-full flex-1 flex-col'}>
          <ColoredScrollbar>
            <p class={'px-2 text-center text-xl text-white'}>Community Fundraiser</p>
            <p class={'mb-2 text-center text-base text-white'}>
              Last update, {DateTime.fromISO(fundraiser.date).toLocaleString(DateTime.DATETIME_MED)}
            </p>
            <div class={'flex flex-1 flex-col gap-2 mx-2 mb-4'}>
              <FundraiserBody fundraisers={campaigns()}/>
            </div>
          </ColoredScrollbar>
        </div>
      </Show>
      <Show when={!config.showFundraiser}>
        <InvisibleBody text={'The Community Fundraisers will be shown soon after the Jingle Jam has started.'} />
      </Show>
    </>
  );
}


const FundraiserBody: Component<{ fundraisers: Campaign[] }> = props => {
  const fundraiser = () => props.fundraisers

  return (
    <>
      <Show when={fundraiser().length == 0}>
        <p class={'text-center text-white'}>No Fundraisers found.</p>
      </Show>
      <For each={fundraiser()}>
        {(d: Campaign, i) => {
          const isTwitch = () => d.twitch_data && d.livestream.type === 'twitch'
          const img = () => {
            if (d.user.avatar === 'https://assets.tiltify.com/assets/default-avatar.png') {
              if (isTwitch()) {
                return d.twitch_data!.profile_image_url
              }
            }
            return d.user.avatar
          }

          const url = () => {
            if (!d.twitch_data) {
              return undefined
            }
            return `https://twitch.tv/${d.twitch_data.login}`
          }

          return (
            <Child
              i={i()}
              img={img()}
              title={d?.twitch_data?.display_name ?? d.user.name}
              subtitle={d.name}
              desc={d.description}
              isLive={d.isLive!}
              raised={d.raised}
              url={url()}
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
  raised: number
  url?: string
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

  return (
    <ChildBody url={props.url} i={props.i}>
      <div class={'flex h-full w-full flex-row items-center gap-2 p-1.5'}>
        <div class={'flex h-full flex-1 flex-col gap-1 overflow-hidden'}>
          <div class={'flex flex-row gap-1'}>
            <img class={'h-8 w-8 rounded-lg'} alt={props.title} src={props.img} loading={'lazy'}/>
            <div class={'flex h-full flex-col justify-between overflow-hidden'}>
              <div class={'flex max-h-[14px] flex-row items-center gap-1 overflow-hidden'}>
                <Show when={props.isLive && props.url}>
                  <Live/>
                </Show>
                <p class={'truncate text-ellipsis text-sm font-bold'}>{props.title}</p>
              </div>
              <p class={'truncate text-ellipsis text-xs font-bold'}>{props.subtitle}</p>
            </div>
          </div>
          <p class={'line-clamp-2 w-full text-ellipsis text-xs'}>{props.desc}</p>
          <p class={twMerge('text-primary text-xs font-bold', raisedColor())}>
            Raised <Numeric value={props.raised} numberStyle="currency" currency={'GBP'}/>
          </p>
        </div>
        <Show when={props.url}>
          <FiExternalLink/>
        </Show>
      </div>
    </ChildBody>
  )
}

const ChildBody: ParentComponent<{ i: number; url?: string }> = (props) => {
  const {theme} = useTheme()

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
    <Switch>
      <Match when={props.url}>
        <a
          class={twMerge(
            'min-h-24 w-full rounded-2xl shadow-xl',
            'hover:scale-102 group/live transition-all hover:shadow-2xl hover:brightness-105',
            campaignColor(props.i),
          )}
          href={props.url}
          target={'_blank'}
        >
          {props.children}
        </a>
      </Match>
      <Match when={!props.url}>
        <div class={twMerge('min-h-24 w-full rounded-2xl shadow-xl transition-all', campaignColor(props.i))}>
          {props.children}
        </div>
      </Match>
    </Switch>
  )
}
