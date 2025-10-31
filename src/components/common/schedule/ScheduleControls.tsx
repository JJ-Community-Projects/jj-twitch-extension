import {type Component, Match, Show, Switch} from "solid-js";
import {useScheduleState} from "../providers/ScheduleStateProvider.tsx";
import {useCreatorFilter} from "../providers/CreatorFilterProvider.tsx";
import {createModalSignal} from "../../../lib/createModalSignal.ts";
import {FaSolidCalendarDay, FaSolidChevronLeft, FaSolidChevronRight, FaSolidFilter} from "solid-icons/fa";
import {FiExternalLink} from "solid-icons/fi";
import {BiRegularReset} from "solid-icons/bi";
import {useNow} from "../../../lib/useNow.ts";
import {DateTime} from "luxon";
import {twMerge} from "tailwind-merge";
import {useTheme} from "../providers/ThemeProvider.tsx";
import {FilterDialog} from "../CreatorFilterDialog.tsx";

export const ScheduleControls: Component = () => {
  const {previousDay, nextDay, switchToToday, streams} = useScheduleState()
  const firstStream = streams[0]
  const lastStream = streams[streams.length - 1]
  const start = DateTime.fromJSDate(firstStream.start, {
    zone: 'Europe/London'
  })

  const end = DateTime.fromJSDate(lastStream.end, {
    zone: 'Europe/London'
  })
  const modalSignal = createModalSignal()
  const {reset, isEmpty} = useCreatorFilter()
  const now = useNow()
  const {theme} = useTheme()

  const isJJ = () => {
    return now() >= start && now() <= end
  }

  const hover = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'hover:bg-primary-400'
      case 'dark':
        return 'hover:bg-gray-600'
      default:
        return 'hover:bg-accent-400'
    }
  }

  const active = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'active:bg-primary-500'
      case 'dark':
        return 'active:bg-gray-700'
      default:
        return 'active:bg-accent-500'
    }
  }

  const link = twMerge(
    'group overflow-hidden flex flex-1 flex-col items-center justify-center p-1 transition-all duration-300',
    'hover:text-white',
    hover(),
    active(),
  )

  return (
    <>
      <div class={'flex flex-col justify-center px-2 pb-0 pt-2'}>
        <Switch>
          <Match when={isEmpty()}>
            <div class={`h-full w-full rounded-2xl shadow-xl hover:shadow-2xl bg-white flex flex-row justify-between`}>
              <button class={twMerge('rounded-l-2xl', link)} onClick={previousDay}>
                <div class={twMerge(
                  'flex flex-row items-center justify-center gap-0.5',
                  'transition-[gap] duration-300 delay-0',
                  'group-hover:gap-0.5 group-hover:delay-150'
                )}>
                  <span class={'transition-transform duration-300 group-hover:-translate-x-0.5'}>
                    <FaSolidChevronLeft class={'size-4 transition-all duration-300 group-hover:size-3'}/>
                  </span>
                  <p class={twMerge(
                    'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
                    'text-white text-xxs',
                    'transition-[max-width,opacity,padding] duration-300 delay-0 ease-in-out',
                    'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-0.5 group-hover:pr-1 group-hover:delay-150',
                  )}>
                    Previous
                  </p>
                </div>
              </button>
              <button class={link} onClick={modalSignal.open}>
                <div class={twMerge(
                  'flex flex-row items-center justify-center gap-0.5',
                  'transition-[gap] duration-300 delay-0',
                  'group-hover:gap-0.5 group-hover:delay-150'
                )}>
                  <span class={'transition-transform duration-300 group-hover:-translate-x-0.5'}>
                    <FaSolidFilter class={'size-4 transition-all duration-300 group-hover:size-3'}/>
                  </span>
                  <p class={twMerge(
                    'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
                    'text-white text-xxs',
                    'transition-[max-width,opacity,padding] duration-300 delay-0 ease-in-out',
                    'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-0.5 group-hover:pr-1 group-hover:delay-150',
                  )}>
                    Filter
                  </p>
                </div>
              </button>

              <Show when={isJJ()}>
                <button class={link} onClick={switchToToday}>
                  <div class={twMerge(
                    'flex flex-row items-center justify-center gap-0.5',
                    'transition-[gap] duration-300 delay-0',
                    'group-hover:gap-0.5 group-hover:delay-150'
                  )}>
                    <span class={'transition-transform duration-300 group-hover:-translate-x-0.5'}>
                      <FaSolidCalendarDay class={'size-4 transition-all duration-300 group-hover:size-3'}/>
                    </span>
                    <p class={twMerge(
                      'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
                      'text-white text-xxs',
                      'transition-[max-width,opacity,padding] duration-300 delay-0 ease-in-out',
                      'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-0.5 group-hover:pr-1 group-hover:delay-150',
                    )}>
                      Today
                    </p>
                  </div>
                </button>
              </Show>
              <a class={link} href={'https://jinglejam.ostof.dev/yogs'} target={'_blank'}>
                <div class={twMerge(
                  'flex flex-row items-center justify-center gap-0.5',
                  'transition-[gap] duration-300 delay-0',
                  'group-hover:gap-0.5 group-hover:delay-150'
                )}>
                  <span class={'transition-transform duration-300 group-hover:-translate-x-0.5'}>
                    <FiExternalLink class={'size-4 transition-all duration-300 group-hover:size-3'}/>
                  </span>
                  <p class={twMerge(
                    'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
                    'text-white text-xxs',
                    'transition-[max-width,opacity,padding] duration-300 delay-0 ease-in-out',
                    'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-0.5 group-hover:pr-1 group-hover:delay-150',
                  )}>
                    Website
                  </p>
                </div>
              </a>
              <button class={twMerge(link, 'rounded-r-2xl')} onClick={nextDay}>
                <div class={twMerge(
                  'flex flex-row items-center justify-center gap-0.5',
                  'transition-[gap] duration-300 delay-0',
                  'group-hover:gap-0.5 group-hover:delay-150'
                )}>
                  <p class={twMerge(
                    'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
                    'text-white text-xxs',
                    'transition-[max-width,opacity,padding] duration-300 delay-0 ease-in-out',
                    'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-1 group-hover:pr-0.5 group-hover:delay-150',
                  )}>
                    Next
                  </p>
                  <span class={'transition-transform duration-300 group-hover:translate-x-0.5'}>
                    <FaSolidChevronRight class={'size-4 transition-all duration-300 group-hover:size-3'}/>
                  </span>
                </div>
              </button>
            </div>
          </Match>
          <Match when={!isEmpty()}>
            <div class={`w-full rounded-2xl shadow-xl hover:shadow-2xl bg-white flex h-full flex-row`}>
              <button class={twMerge('rounded-l-2xl', link)} onClick={modalSignal.open}>
                <div class={twMerge(
                  'flex flex-row items-center justify-center gap-0.5',
                  'transition-[gap] duration-300 delay-0',
                  'group-hover:gap-0.5 group-hover:delay-150'
                )}>
                  <span class={'transition-transform duration-300 group-hover:-translate-x-0.5'}>
                    <FaSolidFilter class={'size-4 transition-all duration-300 group-hover:size-3'}/>
                  </span>
                  <p class={twMerge(
                    'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
                    'text-white text-xxs',
                    'transition-[max-width,opacity,padding] duration-300 delay-0 ease-in-out',
                    'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-0.5 group-hover:pr-1 group-hover:delay-150',
                  )}>
                    Filter
                  </p>
                </div>
              </button>
              <button class={twMerge('rounded-l-2xl', link)} onClick={reset}>
                <div class={twMerge(
                  'flex flex-row items-center justify-center gap-0.5',
                  'transition-[gap] duration-300 delay-0',
                  'group-hover:gap-0.5 group-hover:delay-150'
                )}>
                  <span class={'transition-transform duration-300 group-hover:-translate-x-0.5'}>
                    <BiRegularReset class={'size-4 transition-all duration-300 group-hover:size-3'}/>
                  </span>
                  <p class={twMerge(
                    'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
                    'text-white text-xxs',
                    'transition-[max-width,opacity,padding] duration-300 delay-0 ease-in-out',
                    'group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-0.5 group-hover:pr-1 group-hover:delay-150',
                  )}>
                    Reset
                  </p>
                </div>
              </button>
            </div>
          </Match>
        </Switch>
      </div>
      <FilterDialog modalSignal={modalSignal}/>
    </>
  )
}
