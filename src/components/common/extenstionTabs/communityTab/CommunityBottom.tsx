import {type Component, createEffect, createSignal, For, type ParentComponent, Show} from "solid-js";
import {useCommunitySearch} from "./CommunitySearchProvider.tsx";
import {FaSolidFilter, FaSolidXmark} from "solid-icons/fa";
import {CrossFade} from "../../CrossFade.tsx";
import {DateTime} from "luxon";
import {TextField} from "@kobalte/core";
import {twMerge} from "tailwind-merge";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {useIsMobile} from "../../MobileProvider.tsx";

export const CommunityBottom: Component<{
  date: Date
}> = (props) => {

  const {hasActiveFilters} = useCommunitySearch()
  const filterAccent = useFilterAccent()
  const [showFilter, setShowFilter] = createSignal<boolean>(false)
  const toggleFilter = () => setShowFilter(v => !v)

  return (
    <div class={"flex flex-col bg-white text-black p-1 mt-1 mx-2 rounded-2xl"}>
      <div class={"flex items-center"}>
        <div class={twMerge("shrink-0 h-6 transition-[width] duration-300 ease-in-out", showFilter() ? "w-0" : "w-7")}/>

        <div class={"relative flex-1 text-center px-2 h-6 w-full"}>
          <CrossFade show={!showFilter()}>
            <p class={"text-xxs h-full w-full justify-center items-center flex"}>
              Last update, {DateTime.fromJSDate(props.date).toLocaleString(DateTime.DATETIME_MED)}
            </p>
          </CrossFade>
          <CrossFade show={showFilter()}>
            <SearchField open={showFilter()}/>
          </CrossFade>
        </div>

        <button
          type="button"
          class={"relative shrink-0 ml-1 flex items-center justify-center h-6 w-6 rounded-full hover:bg-black/5 transition"}
          onClick={toggleFilter}
          aria-label={showFilter() ? "Close filters" : "Show filters"}
          aria-expanded={showFilter()}
        >
          {/* Both icons stay mounted and swap with a rotate + fade, so the button morphs instead of popping. */}
          <FaSolidFilter
            class={twMerge(
              "absolute transition-all duration-300 ease-in-out",
              showFilter() ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
            )}
          />
          <FaSolidXmark
            class={twMerge(
              "absolute transition-all duration-300 ease-in-out",
              showFilter() ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
            )}
          />
          <span
            class={twMerge(
              "absolute top-0.5 right-0.5 size-1.5 rounded-full ring-1 ring-white transition-all duration-300 ease-in-out",
              filterAccent(),
              hasActiveFilters() && !showFilter() ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
          />
        </button>
      </div>

      <FilterUI open={showFilter()}/>
    </div>
  );
}


const SearchField: Component<{ open: boolean }> = (props) => {
  const {searchTerm, setSearchTerm} = useCommunitySearch()
  let input: HTMLInputElement | undefined

  createEffect(() => {
    if (props.open) {
      input?.focus()
    }
  })

  return (
    <TextField.Root class={"h-full w-full"} aria-label="Search fundraisers" value={searchTerm()}
                    onChange={setSearchTerm}>
      <TextField.Input
        ref={input}
        tabIndex={props.open ? 0 : -1}
        placeholder="Search fundraisers..."
        class={"w-full h-full bg-black/5 text-xs text-center placeholder-black/60 rounded-full px-3 border border-black/10 outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:bg-black/10 transition"}
      />
    </TextField.Root>
  )
}


const FilterUI: Component<{ open: boolean }> = (props) => {
  const {
    availableCauses,
    liveOnly,
    setLiveOnly,
    donoMatchOnly,
    setDonoMatchOnly,
    isCauseSelected,
    toggleCause,
    hasActiveFilters,
    resetFilters,
  } = useCommunitySearch()

  const isMobile = useIsMobile()

  return (
    <div
      class={twMerge(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
        props.open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
      )}
      inert={!props.open}
    >
      <div class={"overflow-hidden"}>
        <div class={"flex flex-col gap-1 px-1 pt-1.5 pb-0.5"}>
          <div class={"flex items-center gap-1"}>
            <FilterChip selected={liveOnly()} onClick={() => setLiveOnly(v => !v)}>
              <span
                class={twMerge(isMobile ? "size-1.5" : "size-1", "rounded-full", liveOnly() ? "bg-white" : "bg-red-500")}/>
              Live
            </FilterChip>
            <FilterChip selected={donoMatchOnly()} onClick={() => setDonoMatchOnly(v => !v)}>
              Dono Match
            </FilterChip>
            <Show when={hasActiveFilters()}>
              <button
                type="button"
                class={twMerge(
                  "ml-auto rounded-full font-bold uppercase leading-none tracking-[0.1em] text-black/50 hover:text-black transition-colors duration-200",
                  isMobile ? "px-2 py-1 text-[10px]" : "px-1.5 py-[3px] text-[8px]"
                )}
                onClick={resetFilters}
              >
                Reset
              </button>
            </Show>
          </div>

          <Show when={availableCauses().length > 0}>
            <div class={twMerge("flex flex-wrap gap-1 overflow-y-auto", isMobile ? "max-h-20" : "max-h-16")}>
              <For each={availableCauses()}>
                {(cause) => (
                  <FilterChip selected={isCauseSelected(cause.id)} onClick={() => toggleCause(cause.id)}>
                    <img class={twMerge(isMobile ? "size-3.5" : "size-2.5", "rounded-full bg-white")} src={cause.logo}
                         alt="" loading={"lazy"}/>
                    {cause.name}
                  </FilterChip>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}


const useFilterAccent = () => {
  const {theme} = useTheme()
  return () => {
    if (theme() === 'dark') return "bg-gradient-to-b from-gray-700 to-gray-800 text-white"
    if (theme() === 'blue') return "bg-primary-500 text-white"
    return "bg-accent-500 text-white"
  }
}


const FilterChip: ParentComponent<{ selected: boolean, onClick: () => void }> = (props) => {
  const isMobile = useIsMobile()
  const selectedColor = useFilterAccent()

  return (
    <button
      type="button"
      aria-pressed={props.selected}
      onClick={() => props.onClick()}
      class={twMerge(
        "inline-flex items-center gap-1 rounded-full font-bold uppercase leading-none tracking-[0.1em]",
        isMobile ? "px-2 py-1 text-[10px]" : "px-1.5 py-[3px] text-[8px]",
        "outline-none focus-visible:ring-2 focus-visible:ring-black/20 transition-all duration-200",
        props.selected
          ? twMerge(selectedColor(), "hover:brightness-105")
          : "bg-black/5 text-black/60 hover:bg-black/10 hover:text-black"
      )}
    >
      {props.children}
    </button>
  )
}
