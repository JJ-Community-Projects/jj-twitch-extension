import {type Component, For} from 'solid-js'
import type {Cause} from "../../../../lib/model/jjData/JJData.ts";
import {CharityListItem} from "./CharityListItem.tsx";

interface CharityListProps {
  charityData: Cause[]
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
