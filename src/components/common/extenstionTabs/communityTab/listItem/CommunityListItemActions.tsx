import {type Component, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
import {FaBrandsTwitch} from "solid-icons/fa";
import {useCommunityListItem} from "./CommunityListItemProvider.tsx";
import {CommunityListItemCause} from "./CommunityListItemCause.tsx";

export const CommunityListItemActions: Component = () => {
  const {twitchUrl, twitchButtonColor, isLive} = useCommunityListItem()

  return (
    <div class={"flex gap-2 px-2 pb-2 pt-1 justify-between items-end"}>
      <Show when={twitchUrl()}>
        <a
          target={"_blank"}
          href={twitchUrl()!}
          class={twMerge(
            "inline-flex items-center justify-between gap-1 rounded-xl px-2 py-1.5",
            twitchButtonColor(),
            "transition-all duration-200 hover:brightness-105 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10"
          )}
        >
          <Show when={isLive()}>
            <span class={`relative flex h-1.5 w-1.5`}>
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 duration-700"/>
            <span class="relative inline-flex h-full w-full rounded-full bg-white"/>
          </span>
          </Show>
          <Show when={isLive()}
                fallback={
                  <span class={"text-xxs"}>Twitch</span>
                }>
            <span class={"text-xxs"}>Live</span>
          </Show>
          <FaBrandsTwitch size={12}/>
        </a>
      </Show>
      <CommunityListItemCause/>
    </div>
  )
}
