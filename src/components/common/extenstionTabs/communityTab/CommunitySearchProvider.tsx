import {createContext, createSignal, type ParentComponent, useContext} from "solid-js";
import type {JJCampaign} from "../../../../api";
import {useBackend} from "../../providers/BackendProvider.tsx";


const useCommunitySearchHook = () => {
  const [searchTerm, setSearchTerm] = createSignal<string>('')
  const {campaigns: campaignsQuery, causes: causesQuery} = useBackend()

  const campaigns = () =>  campaignsQuery.data?.campaigns ?? []
  const causes = () => causesQuery.data?.causes ?? []


  const findCause = (causeId?: number) => causes().find(c => c.id === causeId)


  const campaignsFiltered = () => {
    if (searchTerm() === '') {
      return campaigns();
    }
    const term = searchTerm().toLowerCase()

    return campaigns().filter((c)=> {
      const cause = findCause(c.tiltifyCauseId)
      const causeName = cause?.name ?? ''
      const twitchName = c.twitch?.name ?? ''
      return c.tiltifyName.includes(term) || twitchName.toLowerCase().includes(term) || causeName.toLowerCase().includes(term)
    })
  }

  return {
    campaigns: campaignsFiltered,
    setSearchTerm
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
