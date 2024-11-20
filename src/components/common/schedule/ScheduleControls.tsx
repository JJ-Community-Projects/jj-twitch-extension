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
import {Tooltip} from "@kobalte/core/tooltip";
import {FilterDialog} from "../CreatorFilterDialog.tsx";

export const ScheduleControls: Component = () => {
  const {previousDay, nextDay, switchToToday, streams} = useScheduleState()
  const firstStream = streams[0]
  const lastStream = streams[streams.length - 1]
  const start = DateTime.fromISO(firstStream.start, {
    zone: 'Europe/London'
  })

  const end = DateTime.fromISO(lastStream.end, {
    zone: 'Europe/London'
  })
  const modalSignal = createModalSignal()
  const {reset, isEmpty} = useCreatorFilter()
  const now = useNow()

  const isJJ = () => {
    return now() >= start && now() <= end
  }

  const link = 'hover:border-accent-500 hover:bg-accent-500 flex flex-1 flex-col items-center justify-center p-1 transition-all hover:scale-110 hover:text-white'
  return (
    <>
      <div class={'flex flex-col justify-center px-2 pb-0 pt-2'}>
        <Switch>
          <Match when={isEmpty()}>
            <div class={`h-full w-full rounded-2xl shadow-xl hover:shadow-2xl bg-white flex flex-row justify-between`}>
              <Tooltip>
                <Tooltip.Trigger class={twMerge('rounded-l-2xl', link)} onClick={previousDay}>
                  <FaSolidChevronLeft/>
                </Tooltip.Trigger>
                <LinkTooltipContent tooltip={'Previous Day'}/>
              </Tooltip>
              <Tooltip>
                <Tooltip.Trigger class={link} onClick={modalSignal.open}>
                  <FaSolidFilter/>
                </Tooltip.Trigger>
                <LinkTooltipContent tooltip={'Filter'}/>
              </Tooltip>

              <Show when={isJJ()}>
                <Tooltip>
                  <Tooltip.Trigger class={link} onClick={switchToToday}>
                    <FaSolidCalendarDay/>
                  </Tooltip.Trigger>
                  <LinkTooltipContent tooltip={'Today'}/>
                </Tooltip>
              </Show>
              <a class={link} href={'https://jinglejam.ostof.dev/yogs'} target={'_blank'}>
                <FiExternalLink/>
              </a>
              <Tooltip>
                <Tooltip.Trigger class={twMerge(link, 'rounded-r-2xl')} onClick={nextDay}>
                  <FaSolidChevronRight/>
                </Tooltip.Trigger>
                <LinkTooltipContent tooltip={'Next da'}/>
              </Tooltip>
            </div>
          </Match>
          <Match when={!isEmpty()}>
            <div class={`w-full rounded-2xl shadow-xl hover:shadow-2xl bg-white flex h-full flex-row`}>
              <Tooltip>
                <Tooltip.Trigger class={twMerge('rounded-l-2xl', link)} onClick={modalSignal.open}>
                  <FaSolidFilter/>
                </Tooltip.Trigger>
                <LinkTooltipContent tooltip={'Filter'}/>
              </Tooltip>
              <Tooltip>
                <Tooltip.Trigger class={twMerge('rounded-l-2xl', link)} onClick={reset}>
                  <BiRegularReset/>
                </Tooltip.Trigger>
                <LinkTooltipContent tooltip={'Reset'}/>
              </Tooltip>
            </div>
          </Match>
        </Switch>
      </div>
      <FilterDialog modalSignal={modalSignal}/>
    </>
  )
}


interface LinkTooltipContentProps {
  tooltip: string
}

export const LinkTooltipContent: Component<LinkTooltipContentProps> = (props) => {
  return (
    <Tooltip.Portal>
      <Tooltip.Content>
        <Tooltip.Arrow/>
        <span
          class={twMerge('bg-accent text-xxs -mt-20 rounded p-1 text-white shadow-lg')}>{props.tooltip}</span>
      </Tooltip.Content>
    </Tooltip.Portal>
  );
}
