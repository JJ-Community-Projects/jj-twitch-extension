import {type Component, Show} from "solid-js";
import {useCommunityListItem} from "./CommunityListItemProvider.tsx";
import {twMerge} from "tailwind-merge";
import {useTheme} from "../../../providers/ThemeProvider.tsx";


export const CommunityListItemGoalProgress: Component = () => {
  const {theme} = useTheme()
  const {goalPercent, reached, progressFill, progressTrack} = useCommunityListItem()
  return (
    <Show when={goalPercent() !== null}>
      <div class={"ml-auto flex shrink-0 flex-col items-end gap-[3px]"}>
        {/* Reached: the label replaces the percentage — a full bar and an
                  over-100% figure both stop carrying information. */}
        <Show
          when={reached()}
          fallback={
            <span
              class={twMerge(
                "text-[9px] font-semibold leading-none tabular-nums",
                theme() === "dark" ? "text-white/70" : "text-black/60"
              )}
            >
                    {goalPercent()}% of goal
                  </span>
          }
        >
                <span
                  class={twMerge(
                    "rounded-full px-1.5 py-[2px] text-[8px] font-bold uppercase leading-none tracking-[0.1em] text-white",
                    progressFill()
                  )}
                >
                  Goal reached
                </span>
        </Show>
        {/* Dropped once the goal is met: a full bar carries no information,
                  and this is also what keeps `aria-valuenow` and the width in
                  range without clamping. */}
        <Show when={!reached()}>
          <div
            class={twMerge("h-1 w-16 overflow-hidden rounded-full", progressTrack())}
            role={"progressbar"}
            aria-label={"Fundraising goal progress"}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={goalPercent() ?? 0}
          >
            <div
              class={twMerge("h-full rounded-full transition-all duration-300", progressFill())}
              style={{width: `${goalPercent() ?? 0}%`}}
            />
          </div>
        </Show>
      </div>
    </Show>
  );
}
