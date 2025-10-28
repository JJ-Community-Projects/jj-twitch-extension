import {type Component, For, Show} from "solid-js";
import {JJTab} from "./JJTabs.tsx";
import {useBackend} from "./providers/BackendProvider.tsx";

export const ExtensionTabs: Component = (props) => {
  const {userConfig} = useBackend()
  return (
    <Show when={userConfig.data}>
      {
        (config) => {
          return (
            <For each={config().tabs}>
              {
                (tab) => {
                  return (
                    <JJTab tab={tab}/>
                  )
                }
              }
            </For>
          )
        }
      }
    </Show>
  );
}
