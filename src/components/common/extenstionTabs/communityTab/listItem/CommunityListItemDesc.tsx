import {type Component, Show} from "solid-js";
import {useCommunityListItem} from "./CommunityListItemProvider.tsx";


export const CommunityListItemDesc: Component = () => {

  const {campaign} = useCommunityListItem();

  return (
    <Show when={campaign.tiltifyDescription}>
      {(d) => <p class={"px-2 line-clamp-2 text-xxs opacity-90"}>{d()}</p>}
    </Show>
  )
}
