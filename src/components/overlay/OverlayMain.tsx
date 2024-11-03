import {type Component, createEffect, Show} from "solid-js";
import {useSleep} from "../common/providers/SleepProvider.tsx";
import {useHiddenCursor} from "../../lib/overlay/useHiddenCursor.ts";
import {twMerge} from "tailwind-merge";
import {OverlaySideNav} from "./OverlaySideNav.tsx";
import {OverlayBody} from "./OverlayBody.tsx";
import {OverlayCharityBanner} from "./OverlayCharityBanner.tsx";
import {ChatProvider} from "../common/providers/ChatProvider.tsx";
import {useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";

const timeout = 5_000;

export const OverlayMain: Component = () => {
  const {
    sleeping,
    wake,
    sleep,
    on: addSleepListener,
    off: removeSleepListener,
  } = useSleep();

  const twitchConfig = useTwitchOverlayConfig()

  const interacted = (() => {
    wake(timeout)
  });

  const [, showCursor] = useHiddenCursor();
  createEffect(() => {
    addSleepListener("wake", showCursor);
    return () => {
      removeSleepListener("wake", showCursor)
    };
  });

  const debug = false


  const isHiding = () => {
    if (debug) {
      return false
    }
    return sleeping()
  }

  return (
    <div class={'h-full w-full'}>

      <div
        class={twMerge(
          'h-full w-full opacity-100 transition-all duration-500',
          isHiding() && 'opacity-0 cursor-none'
        )}
        onMouseEnter={interacted}
        onMouseMove={interacted}
        onWheel={interacted}
        onTouchMove={interacted}
        onKeyDown={interacted}
        onMouseLeave={sleep}
      >
        <div class={'h-full flex flex-row pl-2 pr-28'}>
          <OverlaySideNav/>
          <OverlayBody/>
        </div>
      </div>

      <Show when={twitchConfig.chat.enabled}>
        <Show when={twitchConfig.chat.position === 'top'}>
          <div class={'pl-20 pr-[7rem] pb-2 absolute top-0 right-0 px-2 w-full h-16'}>
            <ChatProvider>
              <OverlayCharityBanner/>
            </ChatProvider>
          </div>
        </Show>
        <Show when={twitchConfig.chat.position === 'bottom'}>
          <div class={'pl-20 pr-[7rem] pb-2 absolute bottom-0 right-0 px-2 w-full h-16'}>
            <ChatProvider>
              <OverlayCharityBanner/>
            </ChatProvider>
          </div>
        </Show>
        <Show when={twitchConfig.chat.position === 'right'}>
          <div class={'h-full absolute top-0 right-0 pr-[7rem]'}>
            <ChatProvider>
              <OverlayCharityBanner/>
            </ChatProvider>
          </div>
        </Show>
      </Show>
    </div>
  );
}
