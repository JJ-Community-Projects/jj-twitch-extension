import {type Component, createMemo, For, Show} from "solid-js";
import {JJTab} from "./JJTabs.tsx";
import {useBackend} from "./providers/BackendProvider.tsx";
import {useTabs} from "./providers/TabsProvider.tsx";

export const ExtensionTabs: Component = () => {
  const {userConfig} = useBackend()
  const {currentTab} = useTabs()
  return (
    <Show when={userConfig.data}>
      {(config) => {
        const direction = createMemo<{ tab: string, dir?: 'left' | 'right' }>((prev) => {
          const tab = currentTab()
          if (!prev.tab || prev.tab === tab) return {tab, dir: prev.dir}
          const tabs: string[] = config().tabs
          return {tab, dir: tabs.indexOf(tab) > tabs.indexOf(prev.tab) ? 'right' : 'left'}
        }, {tab: ''})

        return (
          <div class={'relative h-full w-full flex-1 overflow-hidden'} data-dir={direction().dir}>
            <For each={config().tabs}>
              {(tab) => (
                <JJTab tab={tab}/>
              )}
            </For>
          </div>
        )
      }}
    </Show>
  );
}
