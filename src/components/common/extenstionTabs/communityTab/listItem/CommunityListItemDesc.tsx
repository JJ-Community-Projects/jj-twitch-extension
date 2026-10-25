import {type Component, Show} from "solid-js";
import {useCommunityListItem} from "./CommunityListItemProvider.tsx";
import {twMerge} from "tailwind-merge";


export const CommunityListItemDesc: Component = () => {

  const {campaign, donoMatch} = useCommunityListItem();

  return (
    <Show when={campaign.tiltifyDescription}>
      {(d) => <p class={twMerge(
        "px-2 line-clamp-2 text-xxs opacity-90",
        donoMatch() && 'pt-1'
      )}>{d()}</p>}
    </Show>
  )
}
