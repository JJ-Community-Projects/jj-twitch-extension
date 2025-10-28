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
      <Match when={props.tab == 'fundraisers'}>
        <Tabs.Content value={'fundraisers'} class={'mx-auto w-full flex-1 overflow-hidden overscroll-none'}>
          <CommunityTab/>
        </Tabs.Content>
      </Match>
      <Match when={props.tab == 'user-schedule'}>
        <Tabs.Content value={'user-schedule'} class={'mx-auto w-full flex-1 overflow-hidden overscroll-none'}>
          <UserScheduleTab/>
        </Tabs.Content>
      </Match>
      <Match when={props.tab == 'full-user'}>
        <Tabs.Content value={'full-user'} class={'mx-auto w-full flex-1 overflow-hidden overscroll-none'}>
          <p>Full user</p>
        </Tabs.Content>
      </Match>
    </Switch>
  )
}
