import {type Component, createEffect, createSignal, Show} from "solid-js";
import {Checkbox} from "@kobalte/core/checkbox";
import {FaSolidCheck} from "solid-icons/fa";
import {useLocalStorage} from "../common/providers/LocalStorageProvider.tsx";
import {useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {GithubIcon} from "../common/icons/JJIcons.tsx";


export const AboutOverlayExtension: Component = () => {
  const {theme} = useTheme()

  const backgroundColor = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'bg-accent-500'
      case 'dark':
        return 'bg-gray-800'
      default:
        return 'bg-primary-500'
    }
  }
  return (
    <div class={twMerge('text-white flex flex-col rounded-2xl shadow-xl items-center gap-2 p-4', backgroundColor())}>
      <p class={'~text-xl/2xl text-center'}>About the overlay extension</p>
      <span class={' ~text-xs/base text-center'}>
        <p>The Jingle Jam Community Extension with information about the charities and Yogscast Jingle Jam Streams.</p>
        <p>This is a community project and not affiliated with the Jingle Jam.</p>
        <p>If you have suggestions or concerns contact @Ostof on Twitch or Discord</p>
      </span>
      <ChatSettings/>
      <a
        class={'text-xs flex flex-row gap-1 justify-center items-center'}
        href={'https://github.com/orgs/JJ-Community-Projects/repositories'}
        target={'_blank'}
      >
        Contribute on Github <GithubIcon/>
      </a>
    </div>
  );
}


const ChatSettings: Component = () => {
  const config = useTwitchOverlayConfig()
  const storage = useLocalStorage()
  const [enabled, setEnabled] = createSignal<boolean>(storage.getBoolean('chat', true))

  createEffect(() => {
    storage.setBoolean('chat', enabled())
  })

  return (
    <Show when={config.chat.enabled}>
      <Checkbox
        class={'~text-xs/base flex flex-row items-center gap-2 cursor-pointer'}
        checked={enabled()}
        onChange={setEnabled}>
        <Checkbox.Input/>
        <Checkbox.Control class={'w-4 h-4 border-2 rounded border-white p-2 flex items-center justify-center'}>
          <Checkbox.Indicator>
            <FaSolidCheck size={14}/>
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label class={'cursor-pointer'}>
          Show Mod-triggered Charity popups
        </Checkbox.Label>
      </Checkbox>
    </Show>
  );
}
