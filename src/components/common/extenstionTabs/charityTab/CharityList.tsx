import {type Component, For} from 'solid-js'
import type {JJCause} from "../../../../api";
import {CharityListItemAlt} from "./CharityListItemAlt.tsx";

interface CharityListProps {
  charityData: JJCause[]
}

export const CharityList: Component<CharityListProps> = props => {
  return (
    <div class={'flex flex-col gap-2 mb-4'}>
      <For each={props.charityData}>
        {(charity, i) => {
          return (
            <CharityListItemAlt charity={charity} i={i()}/>
          )
        }}
      </For>
    </div>
  )
}
