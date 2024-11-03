import {type Component, For, Show} from "solid-js";
import {Tabs} from "@kobalte/core/tabs";
import {ScheduleStateProvider} from "./providers/ScheduleStateProvider.tsx";
import {CreatorFilterProvider} from "./providers/CreatorFilterProvider.tsx";
import {YogsTab} from "./extenstionTabs/yogsTab/YogsTab.tsx";
import {CharityTab} from "./extenstionTabs/charityTab/CharityTab.tsx";
import {CommunityTab} from "./extenstionTabs/communityTab/CommunityTab.tsx";
import {useTwitchPanelConfig} from "./providers/PanelConfigProvider.tsx";
import {JJTab1, JJTab2, JJTab3} from "./JJTabs.tsx";

export const ExtensionTabs: Component = (props) => {
  const config = useTwitchPanelConfig()
  return (
    <>
      <Show when={config.tab1 !== 'none'}>
        <JJTab1/>
      </Show>
      <Show when={config.tab2 !== 'none'}>
        <JJTab2/>
      </Show>
      <Show when={config.tab3 !== 'none'}>
        <JJTab3/>
      </Show>
    </>
  );
}
