import {type Component, For, Show} from "solid-js";
import {JJTab} from "./JJTabs.tsx";
import {useBackend} from "./providers/BackendProvider.tsx";

export const ExtensionTabs: Component = () => {
  const {userConfig} = useBackend()
  return (
    <Show when={userConfig.data}>
      {(config) => {
        return (
          <div class={'relative h-full w-full flex-1 overflow-hidden'}>
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
