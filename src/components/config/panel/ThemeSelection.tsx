import type { Component } from "solid-js"
import {useTwitchPanelConfig, useTwitchPanelConfigEdit} from "../../common/providers/PanelConfigProvider.tsx";
import {Select} from "@kobalte/core/select";
import {AiOutlineCheck} from "solid-icons/ai";

const optionsMap = new Map<string, string>([
  ['red', 'Red'],
  ['red_light', 'Light Red'],
  ['blue', 'Blue'],
  ['blue_light', 'Light Blue'],
  ['dark', 'Dark'],
  ['rainbow', 'Rainbow'],
])
export const ThemeSelection: Component = () => {
  const config = useTwitchPanelConfig()
  const { setTwitchConfiguration } = useTwitchPanelConfigEdit()

  const options = () => [...optionsMap.keys()]

  return (
    <div class={'flex flex-col'}>
      <p>Theme</p>
      <Select<string>
        class="row col w-32 gap-4 p-2"
        value={config.theme}
        placeholder="Select a Theme"
        onChange={v => {
          setTwitchConfiguration({
            theme: v as 'red' | 'blue',
          })
        }}
        options={options()}
        itemComponent={props => (
          <Select.Item
            class={'flex w-full flex-row justify-between p-1 text-white hover:cursor-pointer'}
            item={props.item}
          >
            <Select.ItemLabel>{optionsMap.get(props.item.rawValue)}</Select.ItemLabel>
            <Select.ItemIndicator>
              <AiOutlineCheck />
            </Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.Trigger class="flex w-32 flex-row items-center justify-between" aria-label="Fruit">
          <Select.Value<string>>{state => optionsMap.get(state.selectedOption())}</Select.Value>
          <Select.Icon class="select__icon">
            <svg
              fill="currentColor"
              stroke-width="0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="2em"
              width="2em"
              style="overflow: visible; --darkreader-inline-fill: currentColor;"
              data-darkreader-inline-fill=""
            >
              <path
                fill="currentColor"
                d="m12 15-4.243-4.242 1.415-1.414L12 12.172l2.828-2.828 1.415 1.414L12 15.001Z"
                data-darkreader-inline-fill=""
                style="--darkreader-inline-fill: currentColor;"
              ></path>
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class="bg-accent-500 rounded shadow">
            <Select.Listbox class="flex flex-col gap-1" />
          </Select.Content>
        </Select.Portal>
      </Select>
    </div>
  )
}
