import {type Component} from "solid-js";
import {OverlayJJCharities} from "./OverlayJJCharities.tsx";
import {OverlayYogsSchedule} from "./OverlayYogsSchedule.tsx";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {twMerge} from "tailwind-merge";
import {OverlayAboutJJ} from "./OverlayAboutJJ.tsx";
import {AboutOverlayExtension} from "./AboutOverlayExtension.tsx";
import {OverlayStreamDialog} from "./OverlayStreamDialog.tsx";
import {OverlayCommunityFundraiser} from "./OverlayCommunityFundraiser.tsx";
import {OverlayUserSchedule} from "./OverlayUserSchedule.tsx";
import {CrossFade} from "../common/CrossFade.tsx";


export const OverlayBody: Component = () => {
  const {jj, charities, community, yogsSchedule, userSchedule, about, showStream} = useOverlay()

  return (
    <div class="h-full w-[50vw] p-4">
      {/* Animated view container */}
      <div class="relative h-full w-[30vw]">
        {/* About JJ Overlay */}
        <CrossFade show={jj()}>
          <div
            class={twMerge(
              "absolute inset-0 h-full w-full transition-opacity duration-500",
            )}
          >
            <OverlayAboutJJ/>
          </div>
        </CrossFade>

        {/* JJ Charities Overlay */}
        <CrossFade show={charities()}>
          <div
            class={twMerge(
              "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            )}
          >
            <OverlayJJCharities/>
          </div>
        </CrossFade>

        {/* JJ Community Fundraiser Overlay */}
        <CrossFade show={community()}>
          <div
            class={twMerge(
              "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            )}
          >
            <OverlayCommunityFundraiser/>
          </div>
        </CrossFade>

        {/* Yogs Schedule Overlay */}
        <CrossFade show={yogsSchedule()}>
          <div
            class={twMerge(
              "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            )}
          >
            <OverlayYogsSchedule/>
          </div>
        </CrossFade>
        <CrossFade show={userSchedule()}>
          <div
            class={twMerge(
              "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            )}
          >
            <OverlayUserSchedule/>
          </div>
        </CrossFade>
        <CrossFade show={about()}>
          <div
            class={twMerge(
              "absolute inset-0 h-full w-[30vw] transition-opacity duration-500",
            )}
          >
            <AboutOverlayExtension/>
          </div>
        </CrossFade>
        <CrossFade show={showStream()}>
          <div
            class={twMerge(
              "absolute inset-0 h-full w-[50vw] transition-opacity duration-500",
            )}
          >
            <OverlayStreamDialog/>
          </div>
        </CrossFade>
      </div>

    </div>
  );
}
