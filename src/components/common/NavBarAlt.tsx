import {type Component, For, Match, Show, Switch} from 'solid-js'
import {FaSolidHeart, FaSolidPeopleGroup} from 'solid-icons/fa'
import {twMerge} from 'tailwind-merge'
import {useTheme} from "./providers/ThemeProvider.tsx";
import {Tabs} from "@kobalte/core/tabs";
import {YogsIcon} from "./icons/YogsIcon.tsx";
import {useBackend} from "./providers/BackendProvider.tsx";
import type {UserExtensionConfigTabsEnum} from "../../api";
import {JJIcon} from "./icons/JJIcons.tsx";
import {useTabs} from "./providers/TabsProvider.tsx";

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
        <JJIcon/>
      </Match>
    </Switch>
  )
}

const TabC: Component<{
  tabType: UserExtensionConfigTabsEnum;
  class?: string,
}> = props => {
  const {theme} = useTheme()
  const {currentTab, setCurrentTab} = useTabs()

  const labelForTab = (tab: UserExtensionConfigTabsEnum) => {
    switch (tab) {
      case 'yogs':
        return 'Yogs';
      case 'charities':
        return 'Charities';
      case 'fundraisers':
        return 'Fundraisers';
      case 'user-schedule':
        return 'Schedule';
      default:
        return ''
    }
  }

  const active = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return '[&.active]:bg-primary-500'
      case 'dark':
        return '[&.active]:bg-gray-800'
      default:
        return '[&.active]:bg-accent-500'
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
  return (
    <Tabs.Trigger
      class={twMerge(
        // base layout
        'group flex h-full none min-w-0 items-center justify-center border-2 border-white text-white transition-all duration-300',
        // padding and rounding
        'py-1 px-8',
        // when the tab is active we give it a bit more horizontal padding so it "extends"
        '[&.active]:pl-4 [&.active]:pr-4',
        // make the active tab take all the remaining space
        '[&.active]:flex-1 [&.active]:basis-0',

        active(),
        hover(),
        props.class,
        currentTab() === props.tabType ? 'active' : ''
      )}
      value={props.tabType}
      onClick={() => setCurrentTab(props.tabType)}
    >
      <div class={twMerge(
        'flex flex-row items-center justify-center gap-0.5',
        // add a touch more gap when active for a smoother reveal
        'transition-[gap] duration-300 delay-0',
        'group-[.active]:gap-1 group-[.active]:delay-150'
      )}>
        <TabIcon tab={props.tabType}/>
        <p
          class={twMerge(
            // hidden by default
            'overflow-hidden max-w-0 opacity-0 whitespace-nowrap',
            'text-white text-xs',
            'transition-[max-width,opacity,padding] duration-300 delay-0 ease-in-out',
            // reveal when the parent trigger has the .active class (using Tailwind arbitrary group variant)
            'group-[.active]:max-w-xs group-[.active]:opacity-100 group-[.active]:pl-1 group-[.active]:pr-2 group-[.active]:delay-150',
          )}
        >
          {labelForTab(props.tabType)}
        </p>
      </div>
    </Tabs.Trigger>
  )
}
