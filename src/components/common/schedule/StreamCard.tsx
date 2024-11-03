import {type Component, Show, Suspense} from 'solid-js'
import {BsPeopleFill} from 'solid-icons/bs'
import type {TESStream} from "../../../lib/model/TwitchExtensionSchedule.ts";
import {useNow} from "../../../lib/useNow.ts";
import {getTextColor} from "../../../lib/textColors.ts";
import {YogsStreamUtils} from "../../../lib/YogsStreamUtils.ts";
import {createModalSignal} from "../../../lib/createModalSignal.ts";
import {StreamDialog} from "./StreamDialog.tsx";

interface SlotCardProps {
  stream: TESStream
  showCountdown?: boolean
  showTime?: boolean
}

export const StreamCard: Component<SlotCardProps> = props => {
  const now = useNow()
  const stream = props.stream
  const style = stream.style
  const orientation = style.background.orientation
  const colors = style.background.colors ?? ['#ff0', '#f0f']

  function orientationInCss() {
    switch (orientation) {
      case 'TD':
        return 'to bottom'
      case 'LR':
        return 'to right'
      case 'RL':
        return 'to left'
      case 'DT':
        return 'to top'
      case 'TLBR':
        return 'to bottom right'
      case 'TRBL':
        return 'to bottom left'
      default:
        return orientation
    }
  }

  const gradient = `linear-gradient(${orientationInCss()}, ${colors.join(', ')})`

  function textColor(background: string) {
    return getTextColor(background)
  }

  function _parseColor(c: string): string {
    return '#' + c.substring(2) //  + c.substring(0, 2)
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
    if (!props.stream.twitchVods) {
      return 0
    }
    return props.stream.twitchVods.length > 0
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
          'hover:scale-102 relative flex h-[68px] cursor-pointer flex-col items-center justify-between rounded-2xl p-2 shadow-2xl transition-all hover:brightness-105'
        }
        style={{
          'background-image': gradient,
          color: getTextColor(colors[0]),
        }}
        onclick={modalSignal.toggle}
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
              {start().toLocaleString({
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short',
              })}
            </p>
          </Show>
          <Show when={props.showCountdown && isBefore()}>
            <p class={'line-clamp-1 text-center text-xs'}>
              <span class={'font-mono'}>{countdownFormat()}</span>,{' '}
              {start().toLocaleString({
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short',
              })}
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
