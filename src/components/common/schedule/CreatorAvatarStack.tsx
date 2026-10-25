import {type Component, createSignal, For, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
import {getTextColor} from "../../../lib/textColors.ts";
import type {Creator} from "../../../api";

interface CreatorAvatarStackProps {
  creators: Creator[]
  // How many avatars to show before collapsing the rest into a "+N" chip.
  max?: number
  class?: string
}

// Overlapping creator avatars with a "+N" chip for the overflow.
export const CreatorAvatarStack: Component<CreatorAvatarStackProps> = (props) => {
  const max = () => props.max ?? 3
  const shown = () => props.creators.slice(0, max())
  const hidden = () => props.creators.length - shown().length

  return (
    <div
      class={twMerge("flex flex-row items-center -space-x-1.5", props.class)}
      role={"img"}
      aria-label={`${props.creators.length} participant${props.creators.length === 1 ? "" : "s"}: ${props.creators.map(c => c.name).join(", ")}`}
    >
      <For each={shown()}>
        {creator => <CreatorAvatar creator={creator}/>}
      </For>
      <Show when={hidden() > 0}>
        <span class={"z-0 flex size-4 items-center justify-center rounded-full bg-neutral-200 text-[8px] font-bold leading-none text-black ring-1 ring-white"}>
          +{hidden()}
        </span>
      </Show>
    </div>
  )
}

// Falls back to the creator's colour with their initial when there is no image or it fails to load.
const CreatorAvatar: Component<{ creator: Creator }> = (props) => {
  const [failed, setFailed] = createSignal(false)

  return (
    <Show
      when={props.creator.imageUrl && !failed()}
      fallback={
        <span
          class={"flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold leading-none ring-1 ring-white"}
          style={{background: props.creator.color, color: getTextColor(props.creator.color)}}
        >
          {props.creator.name.charAt(0).toUpperCase()}
        </span>
      }
    >
      <img
        src={props.creator.imageUrl}
        alt={""}
        loading={"lazy"}
        class={"size-4 shrink-0 rounded-full object-cover ring-1 ring-white"}
        style={{background: props.creator.color}}
        onError={() => setFailed(true)}
      />
    </Show>
  )
}
