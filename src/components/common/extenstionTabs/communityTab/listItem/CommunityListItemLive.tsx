import {type Component, Show} from "solid-js";
import {useCommunityListItem} from "./CommunityListItemProvider.tsx";

export const CommunityListItemLive: Component = () => {
  const {isLive} = useCommunityListItem();
  return (
    <Show when={isLive()}>
      <div
        class={"rounded-full bg-red-500 px-1.5 text-center justify-center items-center py-0.5 shadow text-[8px] text-white"}>
        LIVE
      </div>
    </Show>
  )
}
