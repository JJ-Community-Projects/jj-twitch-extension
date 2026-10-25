import {type Component} from "solid-js";
import {DateTime} from "luxon";

// Sits directly below the last slot; sticky, so it stays visible at the bottom when the list scrolls.
// Also names the viewer's time zone, since the slot items show local times without one.
export const ScheduleLastFetchedPill: Component<{ updatedAt: number }> = (props) => {
  return (
    <div class={'sticky bottom-0 flex flex-row justify-between gap-2 rounded-2xl bg-white px-3 py-1 text-xxs font-semibold text-black shadow-sm'}>
      <p class={'min-w-0 truncate'}>Last fetched {DateTime.fromMillis(props.updatedAt).toLocaleString(DateTime.DATETIME_SHORT)}</p>
      <p class={'shrink-0'}>All times in {DateTime.local().offsetNameShort}</p>
    </div>
  );
}
