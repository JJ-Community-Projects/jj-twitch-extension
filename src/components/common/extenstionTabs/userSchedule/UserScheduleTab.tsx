import {type Component, Show} from "solid-js";
import {ScheduleDayGroups} from "../../schedule/ScheduleDayGroups.tsx";
import {ScheduleLastFetchedPill} from "../../schedule/ScheduleLastFetchedPill.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";
import type {UserScheduleSchema} from "../../../../api";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {ScheduleSlot} from "../../schedule/ScheduleSlotDialog.tsx";
import {CrossFade} from "../../CrossFade.tsx";
import {ErrorPage} from "../../Error.tsx";
import {Loading} from "../../Loading.tsx";
import {InvisibleBodyAlt} from "../../InvisibleBody.tsx";

export const UserScheduleTab: Component = (props) => {
  const {userSchedule, config} = useBackend()


  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show when={config().showUserSchedule} fallback={
              <InvisibleBodyAlt
                text={'The Schedule will be available soon.'}
              />
            }>
              <>
                <CrossFade show={userSchedule.isError}>
                  <ErrorPage message={'Failed to load schedule.'}/>
                </CrossFade>
                <CrossFade show={userSchedule.isPending}>
                  <Loading/>
                </CrossFade>
                <CrossFade show={userSchedule.isSuccess}>
                  <Show when={userSchedule.data}>
                    {
                      (schedule) => {
                        return (
                          <Body schedule={schedule()}/>
                        )
                      }
                    }
                  </Show>
                </CrossFade>
              </>
            </Show>
          )
        }
      }
    </Show>
  );
}


interface BodyProps {
  schedule: UserScheduleSchema
}

export const Body: Component<BodyProps> = (props) => {

  const {theme} = useTheme()
  const {userSchedule} = useBackend()
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
  const scroll =
    'flex-1 overflow-auto overflow-x-hidden scrollbar-thin scrollbar-corner-primary-100 scrollbar-thumb-accent-500 scrollbar-track-accent-100'

  return (

    <div class="h-full flex flex-col">

      <div class={'h-30 mb-2'}>
        <div
          class={'h-full flex-1 px-2'}
        >
          <div
            class={'w-full rounded-2xl shadow-xl hover:shadow-2xl bg-gradient-to-b from-neutral-50 to-neutral-100 flex h-full flex-col items-center justify-center'}>
            <h3 class={'text-center text-xl'}>{props.schedule.title}</h3>
          </div>
        </div>
      </div>
      <div class={twMerge(scroll, scrollbar())}>
        <div class={'flex min-h-full flex-col gap-2 px-2'}>
          <ScheduleDayGroups streams={props.schedule.streams}>
            {stream => (
              <ScheduleSlot stream={stream} showCountdown={true}/>
            )}
          </ScheduleDayGroups>
          <Show when={userSchedule.isSuccess}>
            <ScheduleLastFetchedPill updatedAt={userSchedule.dataUpdatedAt}/>
          </Show>
        </div>
      </div>
    </div>
  );
}
