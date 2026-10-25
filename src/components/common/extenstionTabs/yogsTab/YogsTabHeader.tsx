import {type Component, Match, Switch} from "solid-js";
import {useScheduleState} from "../../providers/ScheduleStateProvider.tsx";
import {DateTime} from "luxon";
import {useCreatorFilter} from "../../providers/CreatorFilterProvider.tsx";


export const YogsTabHeader: Component = () => {
  const {day, schedule} = useScheduleState()
  const {isEmpty, filter, selectedCreatorsLabels} = useCreatorFilter()
  const singleLabel = () => {
    if (selectedCreatorsLabels().length == 1) {
      return selectedCreatorsLabels()[0]
    }
    return undefined
  }

  const label = () => {
    if (selectedCreatorsLabels().length > 1) {
      return selectedCreatorsLabels()[0]
    }
    return undefined
  }

  const moreThenOne = () => {
    return filter().length > 1
  }

  const date = () => DateTime.fromJSDate(day().start,{
    zone: 'Europe/London'
  })

  return (
    <div
      class={'h-full flex-1 px-2'}
    >
      {/* Single row: schedule title on the left, day (or active filter) on the right */}
      <div class={'w-full rounded-2xl px-3 py-1.5 shadow-sm ring-1 ring-black/5 bg-gradient-to-b from-neutral-50 to-neutral-100 flex h-full flex-row items-center justify-between gap-2'}>
        <h3 class={'min-w-0 truncate text-xs font-bold'}>{schedule.title}</h3>
        <Switch>
          <Match when={isEmpty()}>
            <h3 class={'shrink-0 text-xs opacity-80'}>
              {date().toLocaleString({
                weekday: 'short',
                day: '2-digit',
                month: 'short',
              })}
            </h3>
          </Match>
          <Match when={!isEmpty()}>
            <Switch>
              <Match when={singleLabel()}>
                <h3 class={'min-w-0 truncate text-xs opacity-80'}>Streams with {singleLabel()}</h3>
              </Match>
              <Match when={moreThenOne()}>
                <h3 class={'min-w-0 truncate text-xs opacity-80'}>
                  Streams with {label()} or {filter().length - 1} more
                </h3>
              </Match>
            </Switch>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
