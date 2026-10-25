import {type Component, Show} from "solid-js";
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {ScheduleSlotDetails} from "../common/schedule/ScheduleSlotDetails.tsx";

// Overlay window for the selected schedule slot. Fills the overlay height.
export const OverlayScheduleSlotDialog: Component = () => {
  const {stream, setStream, hide} = useOverlay()

  return (
    <div class={"flex h-full w-full"}>
      <Show when={stream()}>
        {stream => (
          <ScheduleSlotDetails
            stream={stream()}
            onClose={() => {
              setStream(undefined)
              hide()
            }}
          />
        )}
      </Show>
    </div>
  )
}
