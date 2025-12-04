import {type Component, For, Show} from "solid-js";
import {useScheduleState} from "../providers/ScheduleStateProvider.tsx";
import {StreamStripeCard} from "./StreamCard.tsx";
import {useCreatorFilter} from "../providers/CreatorFilterProvider.tsx";
import {useBackend} from "../providers/BackendProvider.tsx";
import {DateTime} from "luxon";


export const ScheduleStreams: Component = () => {
  const {day} = useScheduleState()
  const {yogsSchedule} = useBackend()
  const dayStreams = () => {
    return day().streams
  }

  const {isEmpty, filteredStreams} = useCreatorFilter()

  const date = () => {
    if (yogsSchedule.status !== 'success') {
      return undefined
    }
    return DateTime.fromMillis(yogsSchedule.dataUpdatedAt)
  }

  return (
    <div class={'flex min-h-full flex-col gap-2 px-2'}>
      <Show when={isEmpty()}>
        <For each={dayStreams()}>
          {stream => (
            <StreamStripeCard stream={stream} showCountdown={true} showTime={true}/>
          )}
        </For>
      </Show>
      <Show when={!isEmpty()}>
        <For each={filteredStreams()}>
          {stream => (
            <StreamStripeCard
              stream={stream}
              showCountdown={true}
              showTime={true}
              startFormat={{
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short',
                month: 'short',
                day: 'numeric',
              }}
            />
          )}
        </For>
      </Show>
      <Show when={date()}>
        {
          date => {
            return <p class={'text-black bg-white rounded-2xl p-1 text-xs text-center font-semibold'}>
              Last fetched {
              date().toLocaleString(DateTime.DATETIME_SHORT)
            }</p>
          }
        }
      </Show>
    </div>
  );
}
