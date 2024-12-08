import {Dialog, ToggleButton} from "@kobalte/core";
import type {ModalSignal} from "../../lib/createModalSignal.ts";
import {type Component, createSignal, For, Match, Show, Switch} from "solid-js";
import {useCreatorFilter} from "./providers/CreatorFilterProvider.tsx";
import {CgClose} from "solid-icons/cg";
import {twMerge} from "tailwind-merge";
import {FaRegularSquare, FaSolidSquareCheck} from "solid-icons/fa";
import {useAnalytics} from "./providers/AnalyticsProvider.tsx";
import {useSchedule} from "./providers/data/ScheduleProvider.tsx";

interface FilterDialogProps {
  modalSignal: ModalSignal
}

export const FilterDialog: Component<FilterDialogProps> = props => {
  const {modalSignal} = props

  return (
    <Dialog.Root open={modalSignal.isOpen()} onOpenChange={modalSignal.setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay class={'fixed inset-0 z-50 bg-black bg-opacity-20'}/>
        <div class={'fixed inset-0 z-50 flex items-center justify-center'}>
          <Dialog.Content class={'h-full w-full max-w-[500px] p-2 lg:w-[min(calc(100vw_-_16px),_500px)] lg:p-16'}>
            <FilterDialogBody onClose={modalSignal.close}/>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface FilterDialogBodyProps {
  onClose: () => void
}

const FilterDialogBody: Component<FilterDialogBodyProps> = props => {
  const {onClose} = props
  const {log} = useAnalytics()
  const {schedule} = useSchedule()
  const {creators, toggle, reset, filter, filteredStreams, appearanceCount, includes, sortByName} =
    useCreatorFilter()
  const [search, setSearch] = createSignal('')

  const searchCreatorList = () => {
    if (search() === '') {
      return creators
    }
    return creators.filter(c => {
      return c.label.toLowerCase().includes(search().toLowerCase())
    })
  }

  const sortedCreatorList = () => {
    if (sortByName()) {
      return searchCreatorList().sort((a, b) => {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      })
    }
    return searchCreatorList().sort((a, b) => {
      const aAppearance = appearanceCount(a.id)
      const bAppearance = appearanceCount(b.id)
      if (aAppearance == bAppearance) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      }
      return bAppearance - aAppearance
    })
  }

  return (
    <div class={'flex h-full w-full flex-col rounded-3xl bg-white'}>
      <div class={`bg-primary flex h-[72px] items-center justify-center rounded-t-3xl p-2 text-white shadow-xl`}>
        <button onClick={onClose}>
          <CgClose size={24} class={''}/>
        </button>
        <div class={'flex-1'}></div>
        <h3 class={'text-2xl'}>Creator Filter</h3>
        <div class={'flex-1'}></div>
        <div class={'w-[24px]'}></div>
      </div>
      <div class={'flex w-full flex-1 flex-col gap-2 overflow-auto p-4'}>
        <Switch>
          <Match when={creators}>
            <p>Filtered streams: {filteredStreams().length}</p>
            <div class={'flex flex-row items-center justify-stretch gap-2'}>
              <SortToggle/>
            </div>
            <div class="p-2">
              <label class="mb-2 block text-sm font-bold text-gray-700" for="search">
                Search
              </label>
              <input
                class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="search"
                type="text"
                placeholder="Search"
                value={search()}
                onInput={e => {
                  const target = e.target as HTMLInputElement
                  if (target) {
                    setSearch(target.value)
                  }
                }}
              />
            </div>
            <For each={sortedCreatorList()}>
              {creator => (
                <>
                  <button
                    class={'hover:bg-accent-50 border-accent-50 rounded-xl border-2 p-4 hover:brightness-105'}
                    onClick={() => toggle(creator.id)}
                  >
                    <div class={'flex flex-row items-center'}>
                      <p class={'flex-1 text-left'}>
                        {creator.label} ({appearanceCount(creator.id)})
                      </p>
                      <div class={'text-accent-500'}>
                        <Show when={includes(creator.id)}>
                          <FaSolidSquareCheck size={24}/>
                        </Show>
                        <Show when={!includes(creator.id)}>
                          <FaRegularSquare size={24}/>
                        </Show>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </For>
          </Match>
        </Switch>
      </div>
      <div class={'flex h-[72px] flex-row items-center justify-end gap-2 p-4'}>
        <button
          class={'bg-primary rounded-xl p-2 text-white'}
          onclick={() => {
            reset()
          }}
        >
          Reset
        </button>
        <button
          class={'bg-primary rounded-xl p-2 text-white'}
          onclick={() => {
            onClose()
            log('schedule_filter', {
              filter: filter().join(','),
              schedule: schedule.title,
            })
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}


const SortToggle = () => {
  const {sortByName, toggleSortByName} = useCreatorFilter()

  return (
    <ToggleButton.Root
      class={'border-accent-50 flex flex-1 flex-row rounded-full border-2 text-sm text-white transition-all'}
      pressed={sortByName()}
      onChange={toggleSortByName}
    >
      {state => (
        <>
          <div
            class={twMerge(
              'flex-1 rounded-l-2xl bg-gray-400 p-1 opacity-60 transition-all',
              !state.pressed() && 'bg-primary opacity-100',
            )}
          >
            <p>Appearance</p>
          </div>
          <div
            class={twMerge(
              'flex-1 rounded-r-2xl bg-gray-400 p-1 opacity-60 transition-all',
              state.pressed() && 'bg-primary opacity-100',
            )}
          >
            <p>Name</p>
          </div>
        </>
      )}
    </ToggleButton.Root>
  )
}
