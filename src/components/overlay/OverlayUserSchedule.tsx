import { type Component, For, Show } from "solid-js";
import { twMerge } from "tailwind-merge";
import { useTheme } from "../common/providers/ThemeProvider.tsx";
import { ColoredScrollbar } from "../common/ColoredScrollbar.tsx";
import { OverlayHeader } from "./OverlayHeader.tsx";
import { CrossFade } from "../common/CrossFade.tsx";
import { ErrorPage } from "../common/Error.tsx";
import { Loading } from "../common/Loading.tsx";
import { StreamStripeCard } from "../common/schedule/StreamCard.tsx";
import type { UserScheduleSchema } from "../../api";
import { useOverlayBackend } from "../common/providers/OverlayBackendProvider.tsx";
import {OverlayStreamStripeCard} from "./OverlayStreamStripeCard.tsx";

export const OverlayUserSchedule: Component = () => {
  const { theme } = useTheme();
  const { userSchedule } = useOverlayBackend();

  const backgroundColor = () => {
    switch (theme()) {
      case "blue":
      case "blue_light":
        return "bg-accent-500/30";
      case "dark":
        return "bg-gray-800/30";
      default:
        return "bg-primary-500/30";
    }
  };

  return (
    <div class={twMerge("absolute h-full w-full flex flex-col gap-2 p-2 rounded-2xl overflow-hidden overscroll-none", backgroundColor())}>
      <OverlayHeader />

      <Show when={userSchedule.data}>{(schedule) => <Body schedule={schedule()} />}</Show>
    </div>
  );
};

interface BodyProps {
  schedule: UserScheduleSchema;
}

const Body: Component<BodyProps> = (props) => {
  return (
    <>
      <Header title={props.schedule.title} />
      <ColoredScrollbar>
        <div class={"flex min-h-full flex-col gap-2 px-2 pb-2"}>
          <For each={props.schedule.streams}>
            {(stream) => (
              <OverlayStreamStripeCard
                stream={stream}
                showCountdown={true}
                showTime={true}
                startFormat={{
                  hour: "numeric",
                  minute: "numeric",
                  timeZoneName: "short",
                  month: "short",
                  day: "numeric",
                }}
              />
            )}
          </For>
        </div>
      </ColoredScrollbar>
    </>
  );
};

const Header: Component<{ title: string }> = (props) => {
  return (
    <div class={"w-full px-2"}>
      <div class={"bg-white rounded-2xl p-2 text-center flex flex-row items-center justify-center"}>
        <h1 class={"~text-base/xl"}>{props.title}</h1>
      </div>
    </div>
  );
};
