import {type Component, For} from 'solid-js'
import type {JJCause} from "../../../../api";
import {CharityListItemAlt} from "./CharityListItemAlt.tsx";
import {Key} from "@solid-primitives/keyed";

interface CharityListProps {
  charityData: JJCause[]
}

export const CharityList: Component<CharityListProps> = props => {
  return (
    <div class={'flex flex-col gap-2 mb-4'}>
      <Key each={props.charityData} by={(charity) => charity.id}>
        {(charity, i) => {
          return (
            <CharityListItemAlt charity={charity()} i={i()}/>
          )
        }}
      </Key>
    </div>
  )
}
