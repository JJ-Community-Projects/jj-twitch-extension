import {type Component, Match, Switch} from "solid-js";
import {useScheduleState} from "../../providers/ScheduleStateProvider.tsx";
import {DateTime} from "luxon";
import {useCreatorFilter} from "../../providers/CreatorFilterProvider.tsx";


export const YogsTabHeader: Component = () => {
  const {day,schedule} = useScheduleState()
  const { isEmpty, filter, selectedCreatorsLabels } = useCreatorFilter()
  const singleLabel = () => {
    if (selectedCreatorsLabels().length == 1) {
      return selectedCreatorsLabels()[0]
    }
    return undefined
  }

  const label = () =>{
    if (selectedCreatorsLabels().length > 1) {
      return selectedCreatorsLabels()[0]
    }
    return undefined
  }

  const moreThenOne = () => {
    return filter().length > 1
  }

  const date = () => DateTime.fromFormat(day().date, 'yyyy-MM-dd',{
    zone: 'Europe/London'
  })

  return (
    <div
      class={'h-full flex-1 px-2'}
    >
      <div class={'w-full rounded-2xl shadow-xl hover:shadow-2xl bg-white flex h-full flex-col items-center justify-center'}>
        <h3 class={'text-center text-xl'}>{schedule.title}</h3>
        <Switch>
          <Match when={isEmpty()}>
            <h3 class={'text-md text-center'}>
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
                <h3 class={'text-center text-lg'}>Streams with {singleLabel()}</h3>
              </Match>
              <Match when={moreThenOne()}>
                <h3 class={'text-md text-center'}>
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
