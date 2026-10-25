import {createContext, createMemo, createSignal, type ParentComponent, useContext} from "solid-js";
import {useBackend} from "../../providers/BackendProvider.tsx";
import {createList} from "../../createList.ts";
import type {JJCampaign} from "../../../../api";


const useCommunitySearchHook = () => {
  const [searchTerm, setSearchTerm] = createSignal<string>('')
  const [liveOnly, setLiveOnly] = createSignal<boolean>(false)
  const [donoMatchOnly, setDonoMatchOnly] = createSignal<boolean>(false)

  const filteredCauses = createList<string>()

  const {campaigns: campaignsQuery, causes: causesQuery} = useBackend()

  const campaigns = () => campaignsQuery.data?.campaigns ?? []
  const causes = () => causesQuery.data?.causes ?? []

  const findCause = (causeId?: string) => causes().find(c => c.id === causeId)

  const toggleCause = (causeId: string) => {
    if (filteredCauses.contains(causeId)) {
      filteredCauses.remove(causeId)
    } else {
      filteredCauses.add(causeId)
    }
  }

  const activeFilterCount = () =>
    filteredCauses.list().length + (liveOnly() ? 1 : 0) + (donoMatchOnly() ? 1 : 0)

  const hasActiveFilters = () => activeFilterCount() > 0 || searchTerm().trim() !== ''

  const resetFilters = () => {
    setSearchTerm('')
    setLiveOnly(false)
    setDonoMatchOnly(false)
    filteredCauses.clear()
  }

  const matchesSearch = (c: JJCampaign, term: string) => {
    if (term === '') {
      return true
    }
    const causeName = findCause(c.tiltifyCauseId)?.name ?? ''
    const twitchName = c.twitch?.name ?? ''
    return c.tiltifyName.toLowerCase().includes(term) || twitchName.toLowerCase().includes(term) || causeName.toLowerCase().includes(term)
  }

  const matchesFilters = (c: JJCampaign) => {
    if (liveOnly() && !(c.twitch?.isLive ?? false)) {
      return false
    }
    if (donoMatchOnly() && !(c.hasActiveDonationMatch ?? false)) {
      return false
    }
    if (!filteredCauses.isEmpty() && (c.tiltifyCauseId === undefined || !filteredCauses.contains(c.tiltifyCauseId))) {
      return false
    }
    return true
  }

  const campaignsFiltered = createMemo(() => {
    const term = searchTerm().trim().toLowerCase()
    if (term === '' && activeFilterCount() === 0) {
      return campaigns();
    }
    return campaigns().filter((c) => matchesFilters(c) && matchesSearch(c, term))
  })

  const campaignCauses = createMemo(() => {
    return campaignsFiltered().map(c => ({
      cause: findCause(c.tiltifyCauseId),
      campaign: c
    }))
  })

  // Only offer causes that at least one fundraiser supports, so no chip leads to an empty list.
  const availableCauses = createMemo(() => {
    const used = new Set(campaigns().map(c => c.tiltifyCauseId))
    return causes().filter(c => used.has(c.id))
  })

  return {
    campaigns: campaignCauses,
    availableCauses,
    searchTerm,
    setSearchTerm,
    liveOnly,
    setLiveOnly,
    donoMatchOnly,
    setDonoMatchOnly,
    isCauseSelected: filteredCauses.contains,
    toggleCause,
    activeFilterCount,
    hasActiveFilters,
    resetFilters,
  }
}


const CommunitySearchContext = createContext<ReturnType<typeof useCommunitySearchHook>>();

export const CommunitySearchProvider: ParentComponent = (props) => {
  const hook = useCommunitySearchHook()
  return (
    <CommunitySearchContext.Provider value={hook}>
      {props.children}
    </CommunitySearchContext.Provider>
  );
}
export const useCommunitySearch = () => useContext(CommunitySearchContext)!
