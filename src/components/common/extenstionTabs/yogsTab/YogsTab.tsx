import {type Component, Show} from "solid-js";
import {YogsTabHeader} from "./YogsTabHeader.tsx";
import {ScheduleStreams} from "../../schedule/ScheduleStreams.tsx";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {ScheduleControls} from "../../schedule/ScheduleControls.tsx";
import {ScheduleStateProvider, useScheduleState} from "../../providers/ScheduleStateProvider.tsx";
import {InvisibleBody} from "../../InvisibleBody.tsx";
import {CreatorFilterProvider} from "../../providers/CreatorFilterProvider.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";

export const YogsTab: Component = (props) => {
  const scroll =
    'flex-1 overflow-auto overflow-x-hidden scrollbar-thin scrollbar-corner-primary-100 scrollbar-thumb-accent-500 scrollbar-track-accent-100'

  const {config, yogsSchedule} = useBackend()
  const {theme} = useTheme()
  const scrollbar = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'scrollbar-corner-accent-100 scrollbar-thumb-primary-500 scrollbar-track-primary-100'
      case 'dark':
        return 'scrollbar-corner-gray-100 scrollbar-thumb-gray-600 scrollbar-track-gray-100'
      default:
        return ''
    }
  }

  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show when={config().showYogsSchedule} fallback={
              <InvisibleBody
                text={'The Yogscast Jingle Jam Schedule will be shown soon after it was published.'}
              />
            }>
              <Show when={yogsSchedule.data}>
                {
                  (schedule)=>{
                    return (
                      <ScheduleStateProvider schedule={schedule()}>
                        <CreatorFilterProvider>
                          <div class="h-full flex flex-col">
                            <div class={'h-30 mb-2'}>
                              <YogsTabHeader/>
                            </div>
                            <div class={twMerge(scroll, scrollbar())}>
                              <ScheduleStreams/>
                            </div>
                            <ScheduleControls/>
                          </div>
                        </CreatorFilterProvider>
                      </ScheduleStateProvider>
                    )
                  }
                }
              </Show>
            </Show>
          )
        }
      }
    </Show>
  );
}
// {DateTime.fromISO(schedule.updatedAt).toLocaleString(DateTime.DATETIME_FULL)}
