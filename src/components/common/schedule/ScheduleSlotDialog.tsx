import {type Component} from "solid-js";
import {Dialog} from "@kobalte/core";
import {createModalSignal} from "../../../lib/createModalSignal.ts";
import {useAnalytics} from "../providers/AnalyticsProvider.tsx";
import {ScheduleSlotDetails} from "./ScheduleSlotDetails.tsx";
import {ScheduleSlotListItem} from "./ScheduleSlotListItem.tsx";
import type {Stream} from "../../../api";
import {usePortalMount} from "../PreviewFrame.tsx";

interface ScheduleSlotDialogProps {
  stream: Stream
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  close: () => void
}

// Panel modal for a schedule slot. The positioner ignores pointer events so a click
// next to the card lands on the overlay and closes the dialog.
export const ScheduleSlotDialog: Component<ScheduleSlotDialogProps> = (props) => {
  return (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal mount={usePortalMount()}>
        <Dialog.Overlay class={"fixed inset-0 z-50 bg-black/40"}/>
        <div class={"pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3"}>
          <Dialog.Content
            class={"pointer-events-auto flex h-full w-full"}
            aria-label={props.stream.title}
          >
            <ScheduleSlotDetails stream={props.stream} onClose={props.close}/>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface ScheduleSlotProps {
  stream: Stream
  showCountdown?: boolean
  showDate?: boolean
  class?: string
}

// Panel schedule slot: list item that opens its dialog.
export const ScheduleSlot: Component<ScheduleSlotProps> = (props) => {
  const {logSlotClick} = useAnalytics()
  const modalSignal = createModalSignal()

  return (
    <>
      <ScheduleSlotListItem
        stream={props.stream}
        showCountdown={props.showCountdown}
        showDate={props.showDate}
        class={props.class}
        onClick={() => {
          modalSignal.open()
          logSlotClick(props.stream)
        }}
      />
      <ScheduleSlotDialog
        stream={props.stream}
        isOpen={modalSignal.isOpen()}
        close={modalSignal.close}
        onOpenChange={modalSignal.setOpen}
      />
    </>
  )
}
