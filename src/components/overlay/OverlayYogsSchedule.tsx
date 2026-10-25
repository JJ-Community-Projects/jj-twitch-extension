import {type Component, Show} from "solid-js";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {ColoredScrollbar} from "../common/ColoredScrollbar.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {OverlayHeader} from "./OverlayHeader.tsx";
import {FaSolidArrowUpRightFromSquare} from "solid-icons/fa";
import {useOverlayBackend} from "../common/providers/OverlayBackendProvider.tsx";
import {useAnalytics} from "../common/providers/AnalyticsProvider.tsx";
import {ScheduleSlotListItem} from "../common/schedule/ScheduleSlotListItem.tsx";
import {ScheduleLastFetchedPill} from "../common/schedule/ScheduleLastFetchedPill.tsx";
import {ScheduleDayGroups} from "../common/schedule/ScheduleDayGroups.tsx";

// The whole Yogs schedule as one list of slots split into days, with the last-fetched pill at the bottom.
export const OverlayYogsSchedule: Component = () => {
  const {theme} = useTheme()
  const {yogsSchedule} = useOverlayBackend()
  const {setStream} = useOverlay()
  const {logSlotClick} = useAnalytics()

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
    <div
      class={twMerge('h-full w-full flex flex-col gap-2 p-2 rounded-2xl overflow-hidden overscroll-none', backgroundColor())}>
      <OverlayHeader/>
      <Show when={yogsSchedule.data}>
        {schedule => (
          <>
            <Header title={schedule().title}/>
            <ColoredScrollbar>
              <div class={'flex min-h-full flex-col gap-2 px-2'}>
                <ScheduleDayGroups streams={schedule().days.flatMap(d => d.streams)}>
                  {stream => (
                    <ScheduleSlotListItem
                      stream={stream}
                      showCountdown={true}
                      onClick={() => {
                        logSlotClick(stream)
                        setStream(stream)
                      }}
                    />
                  )}
                </ScheduleDayGroups>
                <ScheduleLastFetchedPill updatedAt={yogsSchedule.dataUpdatedAt}/>
              </div>
            </ColoredScrollbar>
          </>
        )}
      </Show>
    </div>
  );
}

// Same compact card as the panel's schedule header; links to the full schedule on the community page.
const Header: Component<{ title: string }> = (props) => {
  return (
    <div class={'w-full px-2'}>
      <a
        class={'flex w-full flex-row items-center justify-between gap-2 rounded-2xl bg-gradient-to-b from-neutral-50 to-neutral-100 px-3 py-1.5 shadow-sm ring-1 ring-black/5 transition-all hover:brightness-105'}
        target={'_blank'}
        rel={'noopener noreferrer'}
        href={'https://jinglejam.ostof.dev/yogs'}
      >
        <h3 class={'min-w-0 truncate text-xs font-bold'}>{props.title}</h3>
        <FaSolidArrowUpRightFromSquare class={'h-3 w-3 shrink-0 opacity-80'}/>
      </a>
    </div>
  );
}
