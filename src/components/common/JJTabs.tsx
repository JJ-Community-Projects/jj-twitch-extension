import {type Component, createSignal, Match, onMount, type ParentProps, Switch, Show} from 'solid-js'
import {YogsTab} from "./extenstionTabs/yogsTab/YogsTab.tsx";
import {CharityTab} from "./extenstionTabs/charityTab/CharityTab.tsx";
import {CommunityTab} from "./extenstionTabs/communityTab/CommunityTab.tsx";
import {Tabs} from '@kobalte/core';
import type {UserExtensionConfigTabsEnum} from "../../api";
import {UserScheduleTab} from "./extenstionTabs/userSchedule/UserScheduleTab.tsx";

interface JJTabProps {
  tab: UserExtensionConfigTabsEnum
  bare?: boolean
}

export const JJTab: Component<JJTabProps> = props => {
  const cls = 'h-full mx-auto w-full flex-1 overflow-hidden overscroll-none'

  return (
    <Switch>
      <Match when={props.tab == 'yogs'}>
        <Show when={!props.bare} fallback={<div class={cls}><YogsTab/></div>}>
          <Tabs.Content value={'yogs'} class={cls}>
            <YogsTab/>
          </Tabs.Content>
        </Show>
      </Match>
      <Match when={props.tab == 'charities'}>
        <Show when={!props.bare} fallback={<div class={cls}><CharityTab/></div>}>
          <Tabs.Content value={'charities'} class={cls}>
            <CharityTab/>
          </Tabs.Content>
        </Show>
      </Match>
      <Match when={props.tab == 'fundraisers'}>
        <Show when={!props.bare} fallback={<div class={cls}><CommunityTab/></div>}>
          <Tabs.Content value={'fundraisers'} class={cls}>
            <CommunityTab/>
          </Tabs.Content>
        </Show>
      </Match>
      <Match when={props.tab == 'user-schedule'}>
        <Show when={!props.bare} fallback={<div class={cls}><UserScheduleTab/></div>}>
          <Tabs.Content value={'user-schedule'} class={cls}>
            <UserScheduleTab/>
          </Tabs.Content>
        </Show>
      </Match>
    </Switch>
  )
}
