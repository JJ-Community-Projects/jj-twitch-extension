import {type Component, For, Show, createEffect, type ParentComponent} from "solid-js";
import {JJTab} from "./JJTabs.tsx";
import {useBackend} from "./providers/BackendProvider.tsx";
import {useTabs} from "./TabsProvider.tsx";

const CrossFade: ParentComponent<{ show: boolean }> = (props) => {
  return (
    <div
      class={`absolute inset-0 transition-opacity duration-150 ease-linear ${props.show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {props.children}
    </div>
  )
}

export const ExtensionTabs: Component = () => {
  const {userConfig} = useBackend()
  const {currentTab, setCurrentTab} = useTabs()

  return (
    <Show when={userConfig.data}>
      {(config) => {
        // initialize the current tab to the first available if not set yet
        createEffect(() => {
          const tabs = config().tabs
          if (tabs.length > 0 && !currentTab()) {
            setCurrentTab(tabs[0])
          }
        })

        return (
          <div class={'relative h-full w-full flex-1 overflow-hidden'}>
            <For each={config().tabs}>
              {(tab) => (
                <CrossFade show={currentTab() === tab}>
                  <JJTab tab={tab} bare/>
                </CrossFade>
              )}
            </For>
          </div>
        )
      }}
    </Show>
  );
}
