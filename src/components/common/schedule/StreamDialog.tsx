import {type Component, For, Show} from "solid-js";
import {Dialog} from "@kobalte/core";
import {AiOutlineClose} from "solid-icons/ai";
import {DateTime} from "luxon";
import type {TESStream, TESTwitchCreator, TESTwitchLink} from "../../../lib/model/TwitchExtensionSchedule.ts";
import {FaBrandsTwitch} from "solid-icons/fa";
import {YogsStreamUtils} from "../../../lib/YogsStreamUtils.ts";
import {useNow} from "../../../lib/useNow.ts";

interface YogsScheduleDetailDialogProps {
  stream: TESStream
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  close: () => void;
}

export const StreamDialog: Component<YogsScheduleDetailDialogProps> = (props) => {

  const background = () => {
    return props.stream.style?.background?.colors?.at(0) ?? '#ff0000'
  }

  return (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>

        <Dialog.Overlay class={'fixed inset-0 z-50 bg-black bg-opacity-20'}/>
        <div class={'h-full w-full'}>
          <Dialog.Content class={'fixed inset-0 z-50 flex flex-col items-center justify-center p-2'}>
            <Dialog.Title
              class="w-full p-2 flex flex-row gap-4 rounded-t-2xl"
              style={{
                background: background(),
              }}
            >
              <button class={'rounded-full hover:bg-accent-200/10 aspect-square'} onClick={() => props.close()}>
                <AiOutlineClose size={24}/>
              </button>
              <div class={'flex flex-col'}>
                <p class={'text-xl font-bold'}>{props.stream.title}</p>
                <p>{props.stream.subtitle}</p>
              </div>
            </Dialog.Title>
            <Body stream={props.stream}/>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface BodyProps {
  stream: TESStream
}

const Body: Component<BodyProps> = (props) => {
  const {stream} = props
  const now = useNow()

  const countdownFormat = () => {
    if (YogsStreamUtils.start(stream).diff(now()).as('day') < 1) {
      return YogsStreamUtils.start(stream).diff(now()).toFormat("hh'h' mm'm' ss's'")
    }
    return YogsStreamUtils.start(stream).diff(now()).toFormat("dd'd' hh'h' mm'm' ss's'")
  }

  const isBefore = () => {
    return YogsStreamUtils.isBefore(stream, now())
  }

  return (
    <div class={'overflow-auto h-full w-full bg-white flex flex-col gap-2 p-2 rounded-b-2xl'}>
      <Show when={props.stream.subtitle}>
        <Dialog.Description class="mb-6">{props.stream.subtitle}</Dialog.Description>
      </Show>
      <div>
        <p>{DateTime.fromISO(props.stream.start).toLocaleString({
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
      </div>
      <div>
        <Show when={props.stream.twitchVods && props.stream.twitchVods.length > 0}>
          <p>Twitch Vods</p>
          <div class={'flex flex-wrap gap-2'}>
            <For each={props.stream.twitchVods}>
              {
                vod => (<VodComponent vod={vod}/>)
              }
            </For>
          </div>
        </Show>
      </div>
      <Show
        when={props.stream.twitchVods && props.stream.twitchVods.length > 0 && (props.stream.creators?.length ?? 0) > 0}>
        <div class={'h-2'}/>
      </Show>
      <Show when={(props.stream.creators?.length ?? 0) > 0}>
        <p>Creators</p>
        <div class={'flex flex-wrap gap-2'}>
          <For each={props.stream.creators}>
            {
              creator => (<CreatorComponent creator={creator}/>)
            }
          </For>
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
