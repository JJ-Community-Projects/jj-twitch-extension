import {type Component, For} from 'solid-js'
import {CharityListItem} from "./CharityListItem.tsx";
import type {JJCause} from "../../../../api";

interface CharityListProps {
  charityData: JJCause[]
}

export const CharityList: Component<CharityListProps> = props => {
  return (
    <div class={'flex flex-col gap-2 mb-4'}>
      <For each={props.charityData}>
        {(charity, i) => {
          return (
            <CharityListItem charity={charity} i={i()}/>
          )
        }}
      </For>
    </div>
  )
}
