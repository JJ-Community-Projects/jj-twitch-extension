import {type Component, Show} from "solid-js";
import {useNow} from "../../lib/useNow.ts";
import {useAnalytics} from "../common/providers/AnalyticsProvider.tsx";
import {YogsStreamUtils} from "../../lib/YogsStreamUtils.ts";
import {createModalSignal} from "../../lib/createModalSignal.ts";
import {twMerge} from "tailwind-merge";
import {BsPeopleFill} from "solid-icons/bs";
import type {Stream} from "../../api";
import type {DateTimeFormatOptions} from "luxon";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
interface SlotCardProps {
  stream: Stream
  showCountdown?: boolean
  showTime?: boolean
  startFormat?: DateTimeFormatOptions,
}
export const OverlayStreamStripeCard: Component<SlotCardProps> = props => {
  const now = useNow()
  const {logSlotClick} = useAnalytics()
  const stream = props.stream
  const {setStream} = useOverlay()

  const startFormat = props.startFormat ?? {
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  }
  const isLive = () => {
    return YogsStreamUtils.isLive(props.stream, now())
  }

  const isBefore = () => {
    return YogsStreamUtils.isBefore(props.stream, now())
  }

  const start = () => {
    return YogsStreamUtils.start(props.stream).toLocal()
  }

  const isOver = () => {
    return YogsStreamUtils.isOver(props.stream, now())
  }

  const countdownFormat = () => {
    if (YogsStreamUtils.start(stream).diff(now()).as('day') < 1) {
      return YogsStreamUtils.start(stream).diff(now()).toFormat("hh'h' mm'm' ss's'")
    }
    return YogsStreamUtils.start(stream).diff(now()).toFormat("dd'd' hh'h' mm'm' ss's'")
  }

  const modalSignal = createModalSignal()
  const hasSubtitle = () => props.stream.subtitle && props.stream.subtitle?.length > 0
  const hasTwitchVod = () => {
    if (!props.stream.vods) {
      return 0
    }
    return props.stream.vods.length > 0
  }

  const hasCreators = () => {
    if (!props.stream.creators) {
      return 0
    }

    return props.stream.creators.length > 0
  }

  return (
    <>
      <div
        class={
          'hover:scale-101 bg-gradient-to-b from-neutral-50 to-neutral-100 flex h-[68px] w-full cursor-pointer flex-row rounded-2xl shadow-xl transition-all hover:brightness-105'
        }
        onclick={() => {
          logSlotClick(stream)
          setStream(stream)
        }}
      >
        <div
          class={twMerge('w-6 rounded-l-2xl', isLive() && 'animate-pulse')}
          style={{'background-color': stream.color}}
        />
        <div class={'flex flex-col w-full h-full p-2'}>
          <Show when={!hasSubtitle()}>
            <p class={'line-clamp-2 w-full text-sm font-bold uppercase'}>{props.stream.title}</p>
          </Show>
          <Show when={hasSubtitle()}>
            <p class={'line-clamp-1 w-full text-sm font-bold uppercase'}>{props.stream.title}</p>
          </Show>
          <Show when={props.stream.subtitle && props.stream.subtitle.length > 0}>
            <p class={'line-clamp-1 text-xs uppercase'}>{props.stream.subtitle}</p>
          </Show>
          <Show when={props.showTime && isOver()}>
            <p class={'line-clamp-1 text-xs'}>
              {start().toLocaleString(startFormat)}
            </p>
          </Show>
          <Show when={props.showCountdown && isBefore()}>
            <p class={'line-clamp-1 text-xs'}>
              <span class={'font-mono'}>{countdownFormat()}</span>,{' '}
              {start().toLocaleString(startFormat)}
            </p>
          </Show>
          <Show when={isLive()}>
            <p class={'text-xs'}>LIVE</p>
          </Show>
        </div>
        <div class={'flex flex-col items-end justify-end p-2'}>
          <Show when={hasCreators()}>
            <BsPeopleFill size={12}/>
          </Show>
          <Show when={hasTwitchVod() && isOver()}>
            <p class={'text-xxs font-bold'}>VOD</p>
          </Show>
        </div>
      </div>
    </>
  )
}
