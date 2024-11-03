import type {TESTwitchCreator, TESTwitchLink} from "../../lib/model/TwitchExtensionSchedule.ts";
import {type Component, For, Show} from "solid-js";
import {DateTime} from "luxon";
import {FaBrandsTwitch} from "solid-icons/fa";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {AiOutlineClose} from "solid-icons/ai";
import {YogsStreamUtils} from "../../lib/YogsStreamUtils.ts";
import {useNow} from "../../lib/useNow.ts";


export const OverlayStreamDialog: Component = (props) => {

  const {stream, setStream, toggleSchedule} = useOverlay()
  const now = useNow()

  const background = () => {
    return stream()?.style?.background?.colors?.at(0) ?? ''
  }


  const countdownFormat = () => {
    if (YogsStreamUtils.start(stream()!).diff(now()).as('day') < 1) {
      return YogsStreamUtils.start(stream()!).diff(now()).toFormat("hh'h' mm'm' ss's'")
    }
    return YogsStreamUtils.start(stream()!).diff(now()).toFormat("dd'd' hh'h' mm'm' ss's'")
  }


  const isBefore = () => {
    if (stream()) {
      return YogsStreamUtils.isBefore(stream()!, now())
    }
    return true
  }
  return (
    <div
      class="bg-white rounded-2xl shadow-xl w-full h-full">
      <div
        class="p-2 flex flex-row gap-4 rounded-t-2xl"
        style={{
          background: background(),
        }}
      >
        <button class={'rounded-full hover:bg-accent-200/10 aspect-square'} onClick={() => {
          setStream(undefined)
          toggleSchedule()
        }}>
          <AiOutlineClose size={24}/>
        </button>
        <div class={'flex flex-col'}>
          <p class={'text-xl font-bold'}>{stream()?.title}</p>
          <p>{stream()?.subtitle}</p>
        </div>
      </div>
      <Show when={stream()}>
        <div class={'p-2'}>
          <Show when={stream()!.subtitle}>
            <p class="mb-6">{stream()!.subtitle}</p>
          </Show>
          <p>{DateTime.fromISO(stream()!.start).toLocaleString({
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
          })}</p>
          <Show when={isBefore()}>
            <p>{countdownFormat()}</p>
          </Show>
          <Show when={(stream()!.creators?.length ?? 0) > 0}>
            <p>Creators</p>
            <div class={'flex flex-wrap gap-2'}>
              <For each={stream()!.creators}>
                {
                  creator => (<CreatorComponent creator={creator}/>)
                }
              </For>
            </div>
          </Show>
        </div>

      </Show>
    </div>
  )
}

interface VodProps {
  vod: TESTwitchLink
}

const VodComponent: Component<VodProps> = (props) => {
  return (
    <div class={'flex flex-row py-1'}>
      <a
        class={'hover:scale-102 text-xxs flex flex-row items-center p-2 rounded-2xl bg-twitch-500 text-white transition-all '}
        target={'_blank'}
        href={props.vod.url}
      >
        {props.vod.label}
      </a>
    </div>
  )
}


interface CreatorComponentProps {
  creator: TESTwitchCreator
}

const CreatorComponent: Component<CreatorComponentProps> = (props) => {
  return (
    <div class={'flex flex-row py-1'}>
      <a
        class={'hover:scale-102 text-xxs flex flex-row items-center p-2 rounded-2xl bg-twitch-500 text-white transition-all '}
        target={'_blank'}
        href={props.creator.url}
      >
        <FaBrandsTwitch/>/{props.creator.label}
      </a>
    </div>
  );
}
