import {type Component, For, Match, Show, Switch} from 'solid-js'
import {FaSolidCalendarWeek, FaSolidHeart, FaSolidPeopleGroup} from 'solid-icons/fa'
import {twMerge} from 'tailwind-merge'
import {useTheme} from "./providers/ThemeProvider.tsx";
import {Tabs} from "@kobalte/core/tabs";
import {YogsIcon} from "./icons/YogsIcon.tsx";
import {useBackend} from "./providers/BackendProvider.tsx";
import type {UserExtensionConfigTabsEnum} from "../../api";

export const NavBarAlt: Component = () => {
  const {userConfig} = useBackend()

  return (
    <Show when={userConfig.data}>
      {
        (config) => {
          const tabCount = config().tabs.length
          return (
            <Show when={config().tabs.length > 1} fallback={<div class={'h-2'}/>}>
              <Tabs.List class={`flex w-full flex-row items-center px-2`}>
                <For each={config().tabs} fallback={<div class={'h-2'}/>}>
                  {
                    (tab, i) => {

                      const isFirstTab = () => i() === 0

                      const isLastTab = () => i() === (tabCount - 1)

                      const classes = () => {
                        if (isFirstTab()) {
                          return 'rounded-l-2xl'
                        } else if (isLastTab()) {
                          return 'rounded-r-2xl'
                        } else {
                          return 'rounded-none'
                        }
                      }

                      return (
                        <TabC
                          tabType={tab}
                          class={classes()}
                          tabCount={tabCount}
                        />
                      )
                    }
                  }
                </For>
              </Tabs.List>
            </Show>
          )
        }
      }
    </Show>
  )
}

const TabIcon: Component<{ tab: UserExtensionConfigTabsEnum }> = props => {
  return (
    <Switch>
      <Match when={props.tab === 'yogs'}>
        <YogsIcon/>
      </Match>
      <Match when={props.tab === 'charities'}>
        <FaSolidHeart/>
      </Match>
      <Match when={props.tab === 'fundraisers'}>
        <FaSolidPeopleGroup/>
      </Match>
      <Match when={props.tab === 'user-schedule'}>
        <FaSolidCalendarWeek/>
      </Match>
    </Switch>
  )
}

const TabC: Component<{
  tabType: UserExtensionConfigTabsEnum;
  class?: string,
  tabCount: number,
}> = props => {
  const {theme} = useTheme()

  const labelForTab = (tab: UserExtensionConfigTabsEnum) => {
    switch (tab) {
      case 'yogs':
        return 'Yogs';
      case 'charities':
        return 'Charities';
      case 'fundraisers':
        return 'Community';
      case 'user-schedule':
        return 'Schedule';
      default:
        return ''
    }
  }

  // not `data-[selected]:`, which sorts before `hover:`
  const active = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return '[&[data-selected]]:bg-primary-500'
      case 'dark':
        return '[&[data-selected]]:bg-gray-800'
      default:
        return '[&[data-selected]]:bg-accent-500'
    }
  }
  const hover = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'hover:bg-primary-300'
      case 'dark':
        return 'hover:bg-gray-600'
      default:
        return 'hover:bg-accent-300'
    }
  }

  const largeTabs = () => props.tabCount < 4

  return (
    <Tabs.Trigger
      class={twMerge(
        // base layout
        'group flex h-full none min-w-0 items-center justify-center border-2 border-white text-white',
        // colour fades out faster than in, so two tabs never look selected at once
        'transition-[flex-grow,padding,background-color] duration-[250ms,250ms,120ms] ease-[cubic-bezier(0.2,0,0,1)]',
        'data-[selected]:duration-[250ms,250ms,200ms]',
        'motion-reduce:transition-none',
        // padding and rounding
        'py-1',
        largeTabs() ? 'px-8' : 'px-4',
        // when the tab is selected we give it a bit more horizontal padding so it "extends"
        'data-[selected]:px-4',
        // make the selected tab take all the remaining space
        'data-[selected]:flex-1 data-[selected]:basis-0',
        active(),
        hover(),
        props.class,
      )}
      value={props.tabType}
    >
      <div class={'flex flex-row items-center justify-center'}>
        <TabIcon tab={props.tabType}/>
        {/* 0fr -> 1fr animates to the label's real width */}
        <div
          class={twMerge(
            'grid grid-cols-[0fr] opacity-0',
            'transition-[grid-template-columns,opacity] duration-150 ease-[cubic-bezier(0.2,0,0,1)]',
            'group-data-[selected]:grid-cols-[1fr] group-data-[selected]:opacity-100 group-data-[selected]:duration-200 group-data-[selected]:delay-75',
            'motion-reduce:transition-none',
          )}
        >
          <p class={'min-w-0 overflow-hidden'}>
            <span class={'block whitespace-nowrap px-2 text-white text-xs'}>
              {labelForTab(props.tabType)}
            </span>
          </p>
        </div>
      </div>
    </Tabs.Trigger>
  )
}
