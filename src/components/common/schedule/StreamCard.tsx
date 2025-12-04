import {type Component, Show, Suspense} from 'solid-js'
import {BsPeopleFill} from 'solid-icons/bs'
import {useNow} from "../../../lib/useNow.ts";
import {getTextColor} from "../../../lib/textColors.ts";
import {YogsStreamUtils} from "../../../lib/YogsStreamUtils.ts";
import {createModalSignal} from "../../../lib/createModalSignal.ts";
import {StreamDialog} from "./StreamDialog.tsx";
import {useAnalytics} from '../providers/AnalyticsProvider.tsx';
import type {Stream} from "../../../api";
import {twMerge} from "tailwind-merge";
import type {DateTimeFormatOptions} from "luxon";

interface SlotCardProps {
  stream: Stream
  showCountdown?: boolean
  showTime?: boolean
  startFormat?: DateTimeFormatOptions,
}

export const StreamCard: Component<SlotCardProps> = props => {
  const now = useNow()
  const {logSlotClick} = useAnalytics()
  const stream = props.stream
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
          'hover:scale-101 relative flex h-[68px] cursor-pointer flex-col items-center justify-between rounded-2xl p-2 shadow-2xl transition-all hover:brightness-105'
        }
        style={{
          color: getTextColor(stream.color),
          "background-color": stream.color,
        }}
        onclick={() => {
          modalSignal.toggle()
          logSlotClick(stream)
        }}
      >
        <div class={'absolute top-0 flex h-full w-full flex-col items-center justify-center px-4 py-2'}>
          <Show when={!hasSubtitle()}>
            <p class={'line-clamp-2 w-full text-center text-sm font-bold uppercase'}>{props.stream.title}</p>
          </Show>
          <Show when={hasSubtitle()}>
            <p class={'line-clamp-1 w-full text-center text-sm font-bold uppercase'}>{props.stream.title}</p>
          </Show>
          <Show when={props.stream.subtitle && props.stream.subtitle.length > 0}>
            <p class={'line-clamp-1 text-center text-xs uppercase'}>{props.stream.subtitle}</p>
          </Show>
          <Show when={props.showTime && isOver()}>
            <p class={'line-clamp-1 text-center text-xs'}>
              {start().toLocaleString(startFormat)}
            </p>
          </Show>
          <Show when={props.showCountdown && isBefore()}>
            <p class={'line-clamp-1 text-center text-xs'}>
              <span class={'font-mono'}>{countdownFormat()}</span>,{' '}
              {start().toLocaleString(startFormat)}
            </p>
          </Show>
          <Show when={isLive()}>
            <p class={'text-xs'}>LIVE</p>
          </Show>
        </div>
        <div class={'absolute bottom-0 right-0 p-2'}>
          <Show when={hasCreators()}>
            <BsPeopleFill size={12}/>
          </Show>
        </div>
        <div class={'absolute bottom-0 left-0 p-2'}>
          <Show when={hasTwitchVod() && isOver()}>
            <p class={'text-xxs font-bold'}>VOD</p>
          </Show>
        </div>
      </div>
      <Suspense>
        <StreamDialog
          stream={stream}
          isOpen={modalSignal.isOpen()}
          close={modalSignal.close}
          onOpenChange={modalSignal.toggle}
        />
      </Suspense>
    </>
  )
}

export const StreamStripeCard: Component<SlotCardProps> = props => {
  const now = useNow()
  const {logSlotClick} = useAnalytics()
  const stream = props.stream

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
          modalSignal.toggle()
          logSlotClick(stream)
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
          <Show when={props.showTime && isOver() && !isLive()}>
            <p class={'line-clamp-1 text-xs'}>
              {start().toLocaleString(startFormat)}
            </p>
          </Show>
          <Show when={props.showCountdown && isBefore() && !isLive()}>
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
      <Suspense>
        <StreamDialog
          stream={stream}
          isOpen={modalSignal.isOpen()}
          close={modalSignal.close}
          onOpenChange={modalSignal.toggle}
        />
      </Suspense>
    </>
  )
}
