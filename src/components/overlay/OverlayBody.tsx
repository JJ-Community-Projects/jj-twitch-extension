import {type Component} from "solid-js";
import {OverlayJJCharities} from "./OverlayJJCharities.tsx";
import {OverlayYogsSchedule} from "./OverlayYogsSchedule.tsx";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {twMerge} from "tailwind-merge";
import {OverlayAboutJJ} from "./OverlayAboutJJ.tsx";
import {AboutOverlayExtension} from "./AboutOverlayExtension.tsx";
import {OverlayStreamDialog} from "./OverlayStreamDialog.tsx";
import {OverlayCommunityFundraiser} from "./OverlayCommunityFundraiser.tsx";


export const OverlayBody: Component = () => {
  const {jj, charities, community, schedule, about, showStream} = useOverlay()

  return (
    <div class="h-full w-[50vw] p-4">
      {/* Animated view container */}
      <div class="relative h-full w-[30vw]">
        {/* About JJ Overlay */}
        <div
          class={twMerge(
            "absolute inset-0 h-full w-full transition-opacity duration-500",
            jj() ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <OverlayAboutJJ/>
        </div>

        {/* JJ Charities Overlay */}
        <div
          class={twMerge(
            "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            charities() ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <OverlayJJCharities/>
        </div>

        {/* JJ Community Fundraiser Overlay */}
        <div
          class={twMerge(
            "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            community() ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <OverlayCommunityFundraiser/>
        </div>

        {/* Yogs Schedule Overlay */}
        <div
          class={twMerge(
            "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            schedule() ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <OverlayYogsSchedule/>
        </div>
        <div
          class={twMerge(
            "absolute inset-0 h-full w-[30vw] transition-opacity duration-500",
            about() ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <AboutOverlayExtension/>
        </div>
        <div
          class={twMerge(
            "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            showStream() ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <OverlayStreamDialog/>
        </div>
      </div>

    </div>
  );
}
