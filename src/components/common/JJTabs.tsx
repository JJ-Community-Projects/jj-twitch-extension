import {type Component, Match, Switch} from 'solid-js'
import {YogsTab} from "./extenstionTabs/yogsTab/YogsTab.tsx";
import {CharityTab} from "./extenstionTabs/charityTab/CharityTab.tsx";
import {CommunityTab} from "./extenstionTabs/communityTab/CommunityTab.tsx";
import {Tabs} from '@kobalte/core';
import type {UserExtensionConfigTabsEnum} from "../../api";
import {UserScheduleTab} from "./extenstionTabs/userSchedule/UserScheduleTab.tsx";

interface JJTabProps {
  tab: UserExtensionConfigTabsEnum
}

export const JJTab: Component<JJTabProps> = props => {
  const cls = 'h-full mx-auto w-full flex-1 overflow-hidden overscroll-none'

  return (
    <Switch>
      <Match when={props.tab == 'yogs'}>
        <Tabs.Content value={props.tab}><YogsTab/></Tabs.Content>
      </Match>
      <Match when={props.tab == 'charities'}>
        <Tabs.Content value={props.tab}><CharityTab/></Tabs.Content>
      </Match>
      <Match when={props.tab == 'fundraisers'}>
        <Tabs.Content value={props.tab}><CommunityTab/></Tabs.Content>
      </Match>
      <Match when={props.tab == 'user-schedule'}>
        <Tabs.Content value={props.tab}><UserScheduleTab/></Tabs.Content>
      </Match>
    </Switch>
  )
}
