import {type Component, Show} from "solid-js";
import {useCommunityListItem} from "./CommunityListItemProvider.tsx";
import {twMerge} from "tailwind-merge";


export const CommunityListItemCause: Component = () => {
  const {cause} = useCommunityListItem()

  return (
    <Show when={cause}>
      {
        (cause) =>{
          const c = cause()
          return <div class={'flex items-center gap-1'}>
            <p class={'text-xxxs'}>{c.name}</p>
            <img
              class={twMerge(
                "size-6 ring-1 ring-white",
              )}
              alt={c.name}
              src={c.logo}
              loading={"lazy"}
            />
          </div>
        }
      }
    </Show>
  )
}
