import {type Component, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
import {useNow} from "../../../lib/useNow.ts";
import {getTextColor} from "../../../lib/textColors.ts";
import {YogsStreamUtils} from "../../../lib/YogsStreamUtils.ts";
import {useTheme} from "../providers/ThemeProvider.tsx";
import type {Stream} from "../../../api";
import {CreatorAvatarStack} from "./CreatorAvatarStack.tsx";

interface ScheduleSlotListItemProps {
  stream: Stream
  onClick: () => void
  showCountdown?: boolean
  // Adds the day above the start time, for lists that span several days.
  showDate?: boolean
  class?: string
}

// Compact schedule slot row. The slot colour forms a time block on the left holding the start and end time;
// a "Live" label joins the time block while live; the right column shows the countdown or VOD and the participants' avatars.
export const ScheduleSlotListItem: Component<ScheduleSlotListItemProps> = (props) => {
  const now = useNow()
  const {theme} = useTheme()

  const start = () => YogsStreamUtils.start(props.stream).toLocal()
  const end = () => YogsStreamUtils.end(props.stream).toLocal()
  const isLive = () => YogsStreamUtils.isLive(props.stream, now())
  const isBefore = () => YogsStreamUtils.isBefore(props.stream, now())
  const isOver = () => YogsStreamUtils.isOver(props.stream, now())

  const hasSubtitle = () => (props.stream.subtitle?.length ?? 0) > 0
  const hasVods = () => (props.stream.vods?.length ?? 0) > 0
  const hasCreators = () => (props.stream.creators?.length ?? 0) > 0

  // Short form so it fits the right column: "2d 3h" when far away, a ticking "02:14:09" on the day.
  const countdown = () => {
    const diff = YogsStreamUtils.start(props.stream).diff(now())
    if (diff.as('day') >= 1) {
      return diff.toFormat("d'd' h'h'")
    }
    return diff.toFormat('hh:mm:ss')
  }

  const surface = () => {
    if (theme() === "dark") {
      return "bg-gradient-to-b from-white/30 to-white/10 ring-1 ring-white/10 text-white backdrop-blur-sm";
    }
    return "bg-gradient-to-b from-neutral-50 to-neutral-100 ring-1 ring-black/5";
  }

  return (
    <button
      type={"button"}
      class={twMerge(
        "flex min-h-11 w-full flex-row overflow-hidden rounded-2xl text-left shadow-sm transition-all duration-200",
        "hover:brightness-105 hover:scale-101 active:brightness-[0.98] hover:shadow-lg",
        surface(),
        props.class
      )}
      onClick={() => props.onClick()}
    >
      <div
        class={twMerge(
          "flex w-14 shrink-0 flex-col items-center justify-between px-1 py-2 text-center",
          isLive() && "animate-pulse-soft"
        )}
        style={{
          "background-color": props.stream.color,
          color: getTextColor(props.stream.color),
        }}
      >
        <Show when={props.showDate}>
          <span class={"whitespace-nowrap text-[9px] leading-[11px]"}>
            {start().toLocaleString({day: 'numeric', month: 'short'})}
          </span>
        </Show>
        <span class={"whitespace-nowrap text-xs font-bold leading-4 tabular-nums"}>
          {start().toLocaleString({hour: 'numeric', minute: 'numeric'})}
        </span>
        {/* Inverted colours (slot colour on the readable text colour) so it stands out inside the block */}
        <Show when={isLive()}>
          <span
            class={"mt-0.5 rounded-full px-1.5 text-[8px] font-bold uppercase leading-[10px] tracking-[0.1em]"}
            style={{
              "background-color": getTextColor(props.stream.color),
              color: props.stream.color,
            }}
          >
            Live
          </span>
        </Show>
        <span class={twMerge("mt-1 whitespace-nowrap text-[9px] leading-[11px] tabular-nums", isLive() && "mt-0.5")}>
          {end().toLocaleString({hour: 'numeric', minute: 'numeric'})}
        </span>
      </div>
      <div class={"flex min-w-0 flex-1 flex-col justify-start px-2 py-2"}>
        <p class={twMerge("text-xs font-bold uppercase", hasSubtitle() ? "truncate" : "line-clamp-2")}>
          {props.stream.title}
        </p>
        <Show when={hasSubtitle()}>
          <p class={"truncate text-xxs uppercase opacity-80"}>{props.stream.subtitle}</p>
        </Show>
      </div>
      <div class={"flex shrink-0 flex-col items-end justify-end gap-1 py-2 pr-2"}>
        <Show when={props.showCountdown && isBefore()}>
          <span class={"font-mono text-[9px] leading-3"}>{countdown()}</span>
        </Show>
        <Show when={isOver() && hasVods()}>
          <span class={"text-[9px] font-bold leading-3"}>VOD</span>
        </Show>
        <Show when={hasCreators()}>
          <CreatorAvatarStack creators={props.stream.creators!}/>
        </Show>
      </div>
    </button>
  )
}
