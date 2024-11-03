import { createContext, createSignal, type ParentComponent, useContext } from 'solid-js'
import type {TESStream, TESTwitchCreator} from "../../../lib/model/TwitchExtensionSchedule.ts";
import {useData} from "./DataProvider.tsx";

const useHook = () => {
  const {schedule} = useData()

  const streams = schedule.days.map(day => day.streams).flat()

  const creators = streams
    .filter(s => s.creators != undefined)
    .map(stream => stream.creators as TESTwitchCreator[])
    .flat()
    .filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i)

  const creatorsMap: {[key: string]: TESTwitchCreator} = {}
  creators.forEach(creator => {
    creatorsMap[creator.id] = creator
  })


  const [filter, setFilter] = createSignal<string[]>([])
  const [sortByName, setSortByName] = createSignal(false)

  const add = (id: string) => {
    setFilter([...filter(), id])
  }
  const remove = (id: string) => {
    setFilter(filter().filter(i => i != id))
  }

  const reset = () => {
    setFilter([])
  }

  const includes = (id: string) => filter().includes(id)

  const toggle = (id: string) => {
    if (includes(id)) {
      remove(id)
    } else {
      add(id)
    }
  }

  const isEmpty = () => filter().length == 0
  const toggleSortByName = () => setSortByName(v => !v)

  const selectedCreators = () => {
    return creators.filter(c => includes(c.id))
  }

  const selectedCreatorsLabels = () => {
    return selectedCreators().map(c => c.label)
  }

  const isStreamIncluded=(stream: TESStream) =>{
    if (!stream.creators) {
      return false
    }
    return stream.creators?.some(c => includes(c.id))
  }

  const filteredStreams = () => {
    return streams.filter(isStreamIncluded)
  }
  const appearanceCount = (id: string) => {
    return streams.filter(s => {
      const streamIds = s.creators?.map((c) => c.id)
      return streamIds?.includes(id)
    }).length
  }
  return {
    filter,
    add,
    remove,
    toggle,
    reset,
    includes,
    isEmpty,
    sortByName,
    setSortByName,
    toggleSortByName,
    selectedCreators,
    selectedCreatorsLabels,
    isStreamIncluded,
    filteredStreams,appearanceCount,
    creators
  }
}

const CreatorFilterContext = createContext<ReturnType<typeof useHook>>()
export const CreatorFilterProvider: ParentComponent = props => {
  const hook = useHook()
  return <CreatorFilterContext.Provider value={hook}>{props.children}</CreatorFilterContext.Provider>
}
export const useCreatorFilter = () => useContext(CreatorFilterContext)!
