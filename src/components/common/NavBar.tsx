import {type Component, Match, Show, Switch} from 'solid-js'
import {FaSolidHeart, FaSolidPeopleGroup} from 'solid-icons/fa'
import {twMerge} from 'tailwind-merge'
import {useTwitchPanelConfig} from "./providers/PanelConfigProvider.tsx";
import type {TabType} from "../../lib/model/TwitchConfig.ts";
import {useTheme} from "./providers/ThemeProvider.tsx";
import {Tabs} from "@kobalte/core/tabs";
import {useTabs} from "./TabsProvider.tsx";
import {YogsIcon} from "./icons/YogsIcon.tsx";

export const NavBar: Component = () => {
  const config = useTwitchPanelConfig()
  const tab1 = () => config.tab1
  const tab2 = () => config.tab2
  const tab3 = () => config.tab3
  const visibleTabs = () => [config.tab1, config.tab2, config.tab3].filter(t => t !== 'none')
  const visibleTabsLength = () => visibleTabs().length
  const showTabs = () => visibleTabsLength() > 1

  return (
    <>
      <Show when={showTabs()}>
        <Tabs.List class={`flex flex-row items-center px-2`}>
          <TabC href={'/1'} tabType={tab1()} class={'rounded-l-2xl'}/>
          <TabC href={'/2'} tabType={tab2()} class={tab3() === 'none' ? 'rounded-r-2xl' : ''}/>
          <TabC href={'/3'} tabType={tab3()} class={'rounded-r-2xl'}/>
        </Tabs.List>
      </Show>
      <Show when={!showTabs()}>
        <div class={'h-2'}/>
      </Show>
    </>
  )
}
const TabIcon: Component<{ tab: TabType }> = props => {
  return (
    <Switch>
      <Match when={props.tab === 'yogs'}>
        <YogsIcon/>
      </Match>
      <Match when={props.tab === 'charities'}>
        <FaSolidHeart/>
      </Match>
      <Match when={props.tab === 'community'}>
        <FaSolidPeopleGroup/>
      </Match>
    </Switch>
  )
}

const TabC: Component<{ href: string; tabType: TabType; class?: string }> = props => {
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
    <Show when={props.tabType !== 'none'}>
      <Tabs.Trigger
        class={twMerge(
          'group flex h-full w-full flex-1 items-center justify-center border-2 border-white p-1 text-center text-white transition-all',
          active(),
          hover(),
          props.class,
          currentTab() === props.tabType ? 'active' : ''
        )}
        value={props.tabType}
        onClick={() => setCurrentTab(props.tabType)       }
      >
        <TabIcon tab={props.tabType}/>
      </Tabs.Trigger>
    </Show>
  )
}
