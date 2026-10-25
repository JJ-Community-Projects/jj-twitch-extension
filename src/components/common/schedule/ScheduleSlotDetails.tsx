import {type Component, For, Match, Show, Switch} from "solid-js";
import {AiOutlineClose} from "solid-icons/ai";
import {FaBrandsTwitch} from "solid-icons/fa";
import {useNow} from "../../../lib/useNow.ts";
import {getTextColor} from "../../../lib/textColors.ts";
import {YogsStreamUtils} from "../../../lib/YogsStreamUtils.ts";
import type {Creator, Stream, StreamVodsInner} from "../../../api";

interface ScheduleSlotDetailsProps {
  stream: Stream
  onClose: () => void
}

// Content of the schedule slot dialog, shared by the panel modal and the overlay window.
// Fills the parent's height so every slot dialog is the same size; the body scrolls when it overflows.
export const ScheduleSlotDetails: Component<ScheduleSlotDetailsProps> = (props) => {
  const now = useNow()

  const color = () => props.stream.color ?? '#ff0000'
  const start = () => YogsStreamUtils.start(props.stream).toLocal()
  const end = () => YogsStreamUtils.end(props.stream).toLocal()
  const isLive = () => YogsStreamUtils.isLive(props.stream, now())
  const isBefore = () => YogsStreamUtils.isBefore(props.stream, now())

  const countdown = () => {
    const diff = YogsStreamUtils.start(props.stream).diff(now())
    if (diff.as('day') < 1) {
      return diff.toFormat("hh'h' mm'm' ss's'")
    }
    return diff.toFormat("dd'd' hh'h' mm'm' ss's'")
  }

  const time = (dt: ReturnType<typeof start>) => dt.toLocaleString({hour: 'numeric', minute: 'numeric'})

  return (
    <div
      class={"flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 bg-gradient-to-b from-neutral-50 to-neutral-100 text-black shadow-xl"}
      style={{"border-color": color()}}
    >
      <div
        class={"flex shrink-0 flex-row items-start gap-2 p-2"}
        style={{background: color(), color: getTextColor(color())}}
      >
        <div class={"min-w-0 flex-1"}>
          <p class={"text-sm font-bold"}>{props.stream.title}</p>
          <Show when={props.stream.subtitle}>
            <p class={"text-xs opacity-90"}>{props.stream.subtitle}</p>
          </Show>
        </div>
        <button
          type={"button"}
          class={"shrink-0 rounded-full p-1 transition-colors hover:bg-black/10"}
          aria-label={"Close"}
          onClick={() => props.onClose()}
        >
          <AiOutlineClose size={16}/>
        </button>
      </div>
      <div class={"flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2 text-xs"}>
        <div>
          <p class={"font-semibold"}>
            {start().toLocaleString({weekday: 'short', day: 'numeric', month: 'short'})}
            {" · "}
            {time(start())} – {time(end())} {start().offsetNameShort}
          </p>
          <Switch>
            <Match when={isLive()}>
              <span class={"inline-block rounded-full bg-red-500 px-1.5 py-[2px] text-[8px] font-bold uppercase leading-none tracking-[0.1em] text-white"}>
                Live now
              </span>
            </Match>
            <Match when={isBefore()}>
              <p class={"text-xxs opacity-80"}>Starts in <span class={"font-mono"}>{countdown()}</span></p>
            </Match>
            <Match when={true}>
              <p class={"text-xxs opacity-80"}>Ended</p>
            </Match>
          </Switch>
        </div>
        <Show when={props.stream.description}>
          <p class={"opacity-90"}>{props.stream.description}</p>
        </Show>
        <Show when={(props.stream.creators?.length ?? 0) > 0}>
          <div class={"flex flex-col gap-1"}>
            <SectionLabel text={"Participants"}/>
            <div class={"grid grid-cols-2 gap-1.5"}>
              <For each={props.stream.creators}>
                {creator => <CreatorChip creator={creator}/>}
              </For>
            </div>
          </div>
        </Show>
        <Show when={(props.stream.vods?.length ?? 0) > 0}>
          <div class={"flex flex-col gap-1"}>
            <SectionLabel text={"VODs"}/>
            <div class={"flex flex-wrap gap-1.5"}>
              <For each={props.stream.vods}>
                {vod => <VodChip vod={vod}/>}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}

const SectionLabel: Component<{ text: string }> = (props) => {
  return <p class={"text-xxs font-bold uppercase tracking-[0.1em] opacity-60"}>{props.text}</p>
}

const VodChip: Component<{ vod: StreamVodsInner }> = (props) => {
  return (
    <a
      class={"flex flex-row items-center gap-1 rounded-xl bg-twitch-500 px-2 py-1 text-xxs font-semibold text-white shadow-sm transition-all hover:scale-101 hover:brightness-105"}
      target={"_blank"}
      rel={"noopener noreferrer"}
      href={props.vod.link}
    >
      {props.vod.label ?? "Twitch"} <FaBrandsTwitch size={10}/>
    </a>
  )
}

const CreatorChip: Component<{ creator: Creator }> = (props) => {
  const hasUrl = () => !!props.creator.url
  const style = () => ({
    background: props.creator.color,
    color: getTextColor(props.creator.color),
  })

  const content = () => (
    <>
      <Show when={props.creator.imageUrl}>
        {imageUrl => (
          <img
            src={imageUrl()}
            alt={props.creator.name}
            height="20" width="20"
            class={"size-5 shrink-0 rounded-full"}
            loading={"lazy"}
          />
        )}
      </Show>
      <span class={"min-w-0 flex-1 truncate"}>{props.creator.name}</span>
      <Show when={hasUrl()}>
        <FaBrandsTwitch size={10} class={"shrink-0"}/>
      </Show>
    </>
  )

  const chip = "flex min-w-0 flex-row items-center gap-1.5 rounded-xl px-1.5 py-1 text-xs shadow-sm"

  return (
    <Show when={hasUrl()} fallback={<div class={chip} style={style()}>{content()}</div>}>
      <a
        class={`${chip} transition-all hover:scale-101 hover:brightness-105`}
        style={style()}
        target={"_blank"}
        rel={"noopener noreferrer"}
        href={props.creator.url}
      >
        {content()}
      </a>
    </Show>
  )
}
