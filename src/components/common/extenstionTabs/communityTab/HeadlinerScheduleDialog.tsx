import {type Component, onMount} from "solid-js";
import {Dialog} from "@kobalte/core";
import {AiOutlineClose} from "solid-icons/ai";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {ScheduleDayGroups} from "../../schedule/ScheduleDayGroups.tsx";
import {ScheduleSlot} from "../../schedule/ScheduleSlotDialog.tsx";
import {YogsStreamUtils} from "../../../../lib/YogsStreamUtils.ts";
import type {Stream} from "../../../../api";
import {usePortalMount} from "../../PreviewFrame.tsx";

interface HeadlinerScheduleDialogProps {
  streams: Stream[]
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  close: () => void
}

// Panel modal with every headliner as a standard schedule slot, grouped by day. Same size as the
// slot dialog, on a solid white surface; a slot opens its own dialog on top.
export const HeadlinerScheduleDialog: Component<HeadlinerScheduleDialogProps> = (props) => {
  return (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal mount={usePortalMount()}>
        <Dialog.Overlay class={"fixed inset-0 z-50 bg-black/40"}/>
        <div class={"pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3"}>
          <Dialog.Content
            class={"pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-black shadow-xl"}
          >
            <div class={"flex shrink-0 flex-row items-center gap-2 border-b border-black/5 p-2"}>
              <Dialog.Title class={"min-w-0 flex-1 text-sm font-bold"}>Headliner</Dialog.Title>
              <button
                type={"button"}
                class={"shrink-0 rounded-full p-1 transition-colors hover:bg-black/10"}
                aria-label={"Close"}
                onClick={() => props.close()}
              >
                <AiOutlineClose size={16}/>
              </button>
            </div>
            <div class={"min-h-0 flex-1"}>
              <ColoredScrollbar>
                <HeadlinerList streams={props.streams}/>
              </ColoredScrollbar>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Opens scrolled to the first headliner that has not ended, so past days stay reachable above it.
const HeadlinerList: Component<{ streams: Stream[] }> = (props) => {
  let list: HTMLDivElement | undefined

  onMount(() => {
    const current = list?.querySelector('[data-over="false"]')
    current?.scrollIntoView({block: 'start'})
  })

  return (
    <div ref={list} class={"flex flex-col gap-2 p-2"}>
      <ScheduleDayGroups streams={props.streams} light={true}>
        {stream => (
          <div data-over={String(YogsStreamUtils.isOver(stream))} class={"scroll-mt-8"}>
            <ScheduleSlot stream={stream} showCountdown={true}/>
          </div>
        )}
      </ScheduleDayGroups>
    </div>
  )
}
