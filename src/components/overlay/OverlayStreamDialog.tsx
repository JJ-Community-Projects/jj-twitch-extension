import {type Component, For, Match, Show, Switch} from "solid-js";
import {DateTime} from "luxon";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {AiOutlineClose} from "solid-icons/ai";
import {YogsStreamUtils} from "../../lib/YogsStreamUtils.ts";
import {useNow} from "../../lib/useNow.ts";
import {getTextColor} from "../../lib/textColors.ts";
import type {Creator, StreamVodsInner} from "../../api";


export const OverlayStreamDialog: Component = (props) => {

  const {stream, setStream, hide} = useOverlay()
  const now = useNow()

  const background = () => {
    return stream()?.color ?? 'transparent'
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
          hide()
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
          <Show when={stream()!.description}>
            <p class="mb-6">{stream()!.description}</p>
          </Show>
          <p>{DateTime.fromJSDate(stream()!.start).toLocaleString({
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
          <div>
            <Show when={stream()!.vods}>
              <Show when={stream()!.vods!.length > 0}>
                <p>Twitch Vods</p>
                <div class={'flex flex-wrap gap-2'}>
                  <For each={stream()!.vods}>
                    {
                      vod => (<VodComponent vod={vod}/>)
                    }
                  </For>
                </div>
              </Show>
            </Show>
          </div>
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
  vod: StreamVodsInner
}

const VodComponent: Component<VodProps> = (props) => {
  return (
    <div class={'flex flex-row py-1'}>
      <a
        class={'hover:scale-101 text-xxs flex flex-row items-center p-2 rounded-2xl bg-twitch-500 text-white transition-all '}
        target={'_blank'}
        href={props.vod.link}
      >
        {props.vod.label}
      </a>
    </div>
  )
}


interface CreatorComponentProps {
  creator: Creator
}

const CreatorComponent: Component<CreatorComponentProps> = (props) => {
  const url = () => props.creator.url

  const color = () => {
    return props.creator.color
  }

  const hasUrl = () => {
    return props.creator.url !== ''
  }

  const label = () => props.creator.name

  return (
    <Switch>
      <Match when={hasUrl()}>
        <a
          class={'hover:scale-101 text-xs flex flex-row items-center p-2 rounded-2xl transition-all gap-1'}
          style={{
            background: color(),
            color: getTextColor(color())
          }}
          target={'_blank'}
          href={url()}
        ><Show when={props.creator.imageUrl}>
          <img
            src={props.creator.imageUrl}
            alt={label()}
            height="24" width="24"
            class="rounded-full size-6"
          />
        </Show>
          <span>{label()}</span>
        </a>
      </Match>
      <Match when={!hasUrl()}>
        <div class={'text-xs flex flex-row py-1 gap-1'}>
          <Show when={props.creator.imageUrl}>
            <img
              src={props.creator.imageUrl}
              alt={label()}
              height="24" width="24"
              class="rounded-full size-6"
            />
          </Show>
          <p
            class={'text-xxs flex flex-row items-center p-2 rounded-2xl'}
            style={{
              background: color(),
              color: getTextColor(color())
            }}
          >
            {label()}
          </p>
        </div>
      </Match>
    </Switch>
  );
}
