import {type Component, createMemo, For, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
import {DateTime} from "luxon";
import {useBackend} from "../../providers/BackendProvider.tsx";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {useAnalytics} from "../../providers/AnalyticsProvider.tsx";
import {useNow} from "../../../../lib/useNow.ts";
import {getTextColor} from "../../../../lib/textColors.ts";
import {YogsStreamUtils} from "../../../../lib/YogsStreamUtils.ts";
import {createModalSignal} from "../../../../lib/createModalSignal.ts";
import {ScheduleSlotDialog} from "../../schedule/ScheduleSlotDialog.tsx";
import {CreatorAvatarStack} from "../../schedule/CreatorAvatarStack.tsx";
import type {Stream} from "../../../../api";
import {HeadlinerScheduleDialog} from "./HeadlinerScheduleDialog.tsx";

// Headliner card for the fundraisers tab: the live headliners first, then the upcoming ones, two at most.
// Hidden while the headliner schedule is switched off or nothing is live or upcoming.
export const HeadlinerUpNext: Component = () => {
  const {config, headlinerSchedule} = useBackend()

  return (
    <Show when={config.data?.showHeadlinerSchedule && headlinerSchedule.data}>
      {schedule => <HeadlinerCard streams={schedule().streams}/>}
    </Show>
  )
}

// Card with the ScheduleSlotListItem surface: a "Headliner" heading over one sub-card per headliner,
// each opening the slot dialog of its headliner.
const HeadlinerCard: Component<{ streams: Stream[] }> = (props) => {
  const now = useNow()
  const {theme} = useTheme()
  const modalSignal = createModalSignal()

  const picks = createMemo(() => {
    const n = now()
    const live = props.streams.filter(s => YogsStreamUtils.isLive(s, n))
    const upcoming = props.streams.filter(s => YogsStreamUtils.isBefore(s, n))
    return [...live, ...upcoming].slice(0, 2)
  })

  const surface = () => {
    if (theme() === "dark") {
      return "bg-gradient-to-b from-white/30 to-white/10 ring-1 ring-white/10 text-white backdrop-blur-sm";
    }
    return "bg-gradient-to-b from-neutral-50 to-neutral-100 ring-1 ring-black/5";
  }

  const rowsSurface = () => theme() === "dark" ? "bg-white/10" : "bg-white"

  return (
    <Show when={picks().length > 0}>
      <section
        class={twMerge(
          "flex w-full flex-col overflow-hidden rounded-2xl shadow-sm",
          surface()
        )}
        aria-labelledby={"headliner-heading"}
      >
        <div class={"flex flex-row items-center justify-between gap-2 py-1 pl-2.5 pr-1.5"}>
          <h3 id={"headliner-heading"} class={"text-left text-[11px] font-bold leading-[14px]"}>Headliner</h3>
          <button
            type={"button"}
            class={twMerge(
              "rounded-full px-2 py-0.5 text-[9px] font-semibold leading-3 transition-colors duration-200",
              theme() === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
            )}
            onClick={() => modalSignal.open()}
          >
            Show all
          </button>
        </div>
        {/* One block edge to edge, clipped by the card's corners: the rows share columns,
            so the colour strips are as wide as the widest time range and touch */}
        <div class={twMerge("grid grid-cols-[auto_minmax(0,1fr)]", rowsSurface())}>
          <For each={picks()}>
            {(stream, i) => <HeadlinerRow stream={stream} first={i() === 0}/>}
          </For>
        </div>
      </section>
      <HeadlinerScheduleDialog
        streams={props.streams}
        isOpen={modalSignal.isOpen()}
        close={modalSignal.close}
        onOpenChange={modalSignal.setOpen}
      />
    </Show>
  )
}

const time = (date: DateTime) => date.toLocaleString({hour: 'numeric', minute: 'numeric'})

const HeadlinerRow: Component<{ stream: Stream, first: boolean }> = (props) => {
  const now = useNow()
  const {theme} = useTheme()
  const {logSlotClick} = useAnalytics()
  const modalSignal = createModalSignal()

  const start = () => YogsStreamUtils.start(props.stream).toLocal()
  const end = () => YogsStreamUtils.end(props.stream).toLocal()
  const isLive = () => YogsStreamUtils.isLive(props.stream, now())
  const hasCreators = () => (props.stream.creators?.length ?? 0) > 0

  // Same short form as the slot list item: "2d 3h" when far away, a ticking "02:14:09" on the day.
  const countdown = () => {
    const diff = YogsStreamUtils.start(props.stream).diff(now())
    if (diff.as('day') >= 1) {
      return diff.toFormat("d'd' h'h'")
    }
    return diff.toFormat('hh:mm:ss')
  }

  const hover = () => theme() === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"
  const divider = () => theme() === "dark" ? "border-white/10" : "border-black/5"

  return (
    <>
      <button
        type={"button"}
        class={twMerge(
          "group col-span-2 grid min-h-[26px] grid-cols-subgrid text-left transition-colors duration-200",
          hover()
        )}
        onClick={() => {
          modalSignal.open()
          logSlotClick(props.stream)
        }}
      >
        {/* Slot colour strip: start and end time, or the live label while live */}
        <div
          class={twMerge(
            "flex min-w-[4.5rem] items-center justify-center px-1.5 transition-[filter] duration-200 group-hover:brightness-110",
            isLive() && "animate-pulse-soft"
          )}
          style={{
            "background-color": props.stream.color,
            color: getTextColor(props.stream.color),
          }}
        >
          <Show
            when={isLive()}
            fallback={
              <span class={"whitespace-nowrap text-[8px] font-bold leading-[11px] tabular-nums"}>
                {time(start())} - {time(end())}
              </span>
            }
          >
            {/* Inverted colours (slot colour on the readable text colour), like the slot's "Live" label */}
            <span
              class={"rounded-full px-1.5 text-[7px] font-bold uppercase leading-[10px] tracking-[0.1em]"}
              style={{
                "background-color": getTextColor(props.stream.color),
                color: props.stream.color,
              }}
            >
              Live
            </span>
          </Show>
        </div>
        {/* Divider in the text column only, so the colour strips stay one continuous edge */}
        <div class={twMerge("flex min-w-0 flex-row items-center gap-1.5 px-2 py-1", !props.first && "border-t", divider())}>
          <p class={"min-w-0 flex-1 truncate text-[10px] font-bold uppercase leading-[13px]"}>
            {props.stream.title}
          </p>
          {/* The countdown for upcoming rows, the avatars for live ones: both would leave the title a few letters */}
          <Show when={!isLive()}>
            <span class={"shrink-0 font-mono text-[8px] leading-[11px]"}>{countdown()}</span>
          </Show>
          <Show when={isLive() && hasCreators()}>
            <CreatorAvatarStack creators={props.stream.creators!} max={2} class={"shrink-0"}/>
          </Show>        </div>
      </button>
      <ScheduleSlotDialog
        stream={props.stream}
        isOpen={modalSignal.isOpen()}
        close={modalSignal.close}
        onOpenChange={modalSignal.setOpen}
      />
    </>
  )
}
