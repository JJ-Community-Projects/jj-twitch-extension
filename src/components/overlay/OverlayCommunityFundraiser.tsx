import {type Component, For, Match, type ParentComponent, Show, Switch} from "solid-js";
import {ColoredScrollbar} from "../common/ColoredScrollbar.tsx";
import {twMerge} from "tailwind-merge";
import {useData} from "../common/providers/DataProvider.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {Numeric} from "solid-i18n";
import {FiExternalLink} from "solid-icons/fi";


export const OverlayCommunityFundraiser: Component = (props) => {
  const {fundraiser} = useData()

  const {theme} = useTheme()

  const backgroundColor = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'bg-accent-500/30'
      case 'dark':
        return 'bg-gray-800/30'
      default:
        return 'bg-primary-500/30'
    }
  }

  return (
    <div class={
      twMerge('h-full w-full overflow-hidden overscroll-none p-2 rounded-2xl shadow-xl',
        backgroundColor()
      )
    }>
      <Show when={fundraiser.campaigns.length === 0}>
        <div class={'h-full w-full flex items-center justify-center'}>
          <p class={'text-lg text-center text-black bg-white rounded-2xl p-2'}>No fundraisers found.</p>
        </div>
      </Show>
      <ColoredScrollbar>
        <div class={twMerge(
          'h-full w-full gap-2',
          'lg:grid lg:grid-cols-2',
          'flex flex-col p-2'
        )}>
          <For each={fundraiser.campaigns}>
            {(d, i) => {
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
        </div>
      </ColoredScrollbar>
    </div>
  );
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
