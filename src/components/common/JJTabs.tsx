import {type Component, Match, Switch} from 'solid-js'
import {YogsTab} from "./extenstionTabs/yogsTab/YogsTab.tsx";
import {CharityTab} from "./extenstionTabs/charityTab/CharityTab.tsx";
import {CommunityTab} from "./extenstionTabs/communityTab/CommunityTab.tsx";
import type {TabType} from "../../lib/model/TwitchConfig.ts";
import {useTwitchPanelConfig} from "./providers/PanelConfigProvider.tsx";
import {Tabs} from '@kobalte/core';

interface JJTabProps {
  tab: TabType
}

const JJTab: Component<JJTabProps> = props => {
  return (
    <Switch>
      <Match when={props.tab == 'yogs'}>
        <Tabs.Content value={'yogs'} class={'h-full mx-auto w-full flex-1 overflow-hidden overscroll-none'}>
          <YogsTab/>
        </Tabs.Content>
      </Match>
      <Match when={props.tab == 'charities'}>
        <Tabs.Content value={'charities'} class={'h-full mx-auto w-full flex-1 overflow-hidden overscroll-none'}>
          <CharityTab/>
        </Tabs.Content>
      </Match>
      <Match when={props.tab == 'community'}>
        <Tabs.Content value={'community'} class={'mx-auto w-full flex-1 overflow-hidden overscroll-none'}>
          <CommunityTab/>
        </Tabs.Content>
      </Match>
      <Match when={props.tab == 'none'}>
        <p>None</p>
      </Match>
    </Switch>
  )
}

export const JJTab1 = () => {
  const config = useTwitchPanelConfig()
  return <JJTab tab={config.tab1}/>
}
export const JJTab2 = () => {
  const config = useTwitchPanelConfig()
  return <JJTab tab={config.tab2}/>
}
export const JJTab3 = () => {
  const config = useTwitchPanelConfig()
  return <JJTab tab={config.tab3}/>
}
