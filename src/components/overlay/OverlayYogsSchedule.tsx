import {type Component, For, Show} from "solid-js";
import {useNow} from "../../lib/useNow.ts";
import {DateTime} from "luxon";
import {getTextColor} from "../../lib/textColors.ts";
import {Button} from "@kobalte/core/button";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {useCurrentStream, useFutureStreams} from "../../lib/overlayYogScheduleHooks.ts";
import {ColoredScrollbar} from "../common/ColoredScrollbar.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {OverlayHeader} from "./OverlayHeader.tsx";
import {FaSolidArrowUpRightFromSquare} from "solid-icons/fa";
import type { Stream } from "../../api/index.ts";
import {useBackend} from "../common/providers/BackendProvider.tsx";

export const OverlayYogsSchedule: Component = () => {

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
    <div class={twMerge('h-full w-full flex flex-col gap-2 p-2 rounded-2xl overflow-hidden overscroll-none', backgroundColor())}>
      <OverlayHeader/>
      <Header/>
      <ColoredScrollbar>
        <div class={'flex flex-col gap-2 px-2'}>
          <CurrentStream/>
          <UpcomingStream/>
        </div>
      </ColoredScrollbar>
      <div class={'flex-1'}/>
      <CurrentYogsTime/>
    </div>
  );
}

const Header: Component = () => {
  const {yogsSchedule} = useBackend()
  return (
    <Show when={yogsSchedule.data}>
      {
        (schedule) => {
          return (
            <div class={'w-full px-2'}>
              <div class={'bg-white rounded-2xl p-2 text-center flex flex-row items-center justify-between'}>
                <h1 class={'~text-base/xl'}>{schedule().title}</h1>
                <a
                  class={'hover:scale-105 hover:bg-text-500 transition-all'}
                  target={'_blank'}
                  href={'https://jinglejam.ostof.dev/yogs'}
                >
                  <FaSolidArrowUpRightFromSquare class={'~text-base/xl'}/>
                </a>
              </div>
            </div>
          )
        }
      }
    </Show>
  );
}

const CurrentYogsTime: Component = () => {
  const now = useNow()
  return (
    <div class={'bg-white rounded-2xl p-2 text-center'}>
      <p class={'font-mono ~text-xs/base'}>{now().setZone('Europe/London').toLocaleString({
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })} UK Time</p>
    </div>
  );
}

const CurrentStream: Component = () => {
  const stream = useCurrentStream()
  return (
    <Show when={stream()}>
      <div class={'flex flex-col gap-1'}>
        <div class={'bg-white rounded-2xl px-2 text-center'}>
          <h2 class={'~text-base/xl'}>Current Streams</h2>
        </div>
        <SingleStreamCard stream={stream()!}/>
      </div>
    </Show>
  )
}

const SingleStreamCard: Component<{ stream: Stream }> = (props) => {
  const {setStream} = useOverlay()
  const stream = props.stream

  const start = () => {
    return DateTime.fromJSDate(stream.start, {
      zone: 'Europe/London'
    }).toLocal().toFormat('HH:mm')
  }

  const end = () => {
    return DateTime.fromJSDate(stream.end, {
      zone: 'Europe/London'
    }).toLocal().toFormat('HH:mm')
  }

  return (
    <Button
      class={'w-full ~h-24/32 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 hover:brightness-105'}
      style={{
        'background-color': props.stream.color,
        color: getTextColor(props.stream.color),
      }}
      onClick={() => {
        setStream(stream)
      }}
    >
      <p class={'~text-md/2xl'}> {stream.title}</p>
      <p class={'~text-xs/base'}>{start()} - {end()}</p>
    </Button>
  );
}

const UpcomingStreamsHeader: Component = () => {
  return (
    <div class={'bg-white rounded-2xl ~p-1/2 text-center'}>
      <h2 class={'~text-base/xl'}>Upcoming Streams</h2>
    </div>
  );
}

const UpcomingStream: Component = () => {
  return <div class={'flex flex-col gap-1'}>
    <UpcomingStreamsHeader/>
    <div class={'flex-1 hidden xl:grid w-full h-full grid-cols-3 gap-2'}>
      <UpcomingStreamList i={6}/>
    </div>
    <div class={'flex-1 grid xl:hidden grid-cols-2 gap-2'}>
      <UpcomingStreamList i={4}/>
    </div>
  </div>
}

const UpcomingStreamList: Component<{
  i: number
}> = (props) => {
  const streams = useFutureStreams(props.i)
  return (
    <For each={streams()}>
      {stream => <StreamCard stream={stream}/>}
    </For>
  );
}


interface StreamCardProps {
  stream: Stream
}

const StreamCard: Component<StreamCardProps> = (props) => {
  const {stream} = props

  const {setStream} = useOverlay()

  const now = useNow()

  const start = DateTime.fromJSDate(stream.start, {
    zone: 'Europe/London'
  })

  const startFormatted = () => start.toLocal().toLocal().toLocaleString({
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    day: '2-digit',
  })

  const startHourFormatted = () => start.toLocal().toLocal().toLocaleString({
    hour: 'numeric',
    minute: 'numeric',
  })

  const countdown = () => {
    const diff = start.diff(now())
    if (diff.as('days') > 1) {
      return diff.toFormat("dd'd' hh'h' mm'm' ss's'")
    }
    return diff.toFormat("hh'h' mm'm' ss's'")
  }

  const isBefore = () => {
    return now() < start
  }

  const isToday = () => {
    return start.toLocal().hasSame(now(), 'day')
  }

  return (
    <Button
      class={'flex-1 rounded-2xl p-2 shadow-2xl flex flex-col items-center justify-center hover:brightness-105'}
      style={{
        'background-color': props.stream.color,
        color: getTextColor(props.stream.color),
      }}
      onClick={() => {
        setStream(stream)
      }}
    >
      <h3 class={'~text-base/2xl'}>{stream.title}</h3>
      <h3 class={'~text-xs/md'}>{stream.subtitle}</h3>
      <Show when={isToday()}>
        <p class={'~text-xxs/base xl:visible'}>{startHourFormatted()}</p>
      </Show>
      <Show when={!isToday()}>
        <p class={'~text-xxs/base xl:visible'}>{startFormatted()}</p>
      </Show>
      <Show when={isBefore()}>
        <p class={'font-mono ~text-xxs/base xl:visible'}>{countdown()}</p>
      </Show>
    </Button>
  );
}
