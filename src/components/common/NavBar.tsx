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

export const NavBar: Component = () => {
  const {userConfig} = useBackend()

  return (
    <Show when={userConfig.data}>
      {
        (config) => {
          const tabCount = config().tabs.length
          return (
            <Show when={config().tabs.length > 1} fallback={<div class={'h-2'}/>}>
              <Tabs.List class={`flex flex-row items-center px-2`}>
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
                          href={'/1'}
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
  href: string;
  tabType: UserExtensionConfigTabsEnum;
  class?: string,
}> = props => {
  const {theme} = useTheme()
  const {currentTab, setCurrentTab} = useTabs()
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
        'group flex h-full w-full flex-1 items-center justify-center border-2 border-white p-1 text-center text-white transition-all',
        active(),
        hover(),
        props.class,
        currentTab() === props.tabType ? 'active' : ''
      )}
      value={props.tabType}
      onClick={() => setCurrentTab(props.tabType)}
    >
      <TabIcon tab={props.tabType}/>
    </Tabs.Trigger>
  )
}
