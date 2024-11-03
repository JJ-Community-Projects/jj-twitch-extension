import {createContext, createSignal, type ParentComponent, useContext} from "solid-js";
import {useTwitchPanelConfig} from "./providers/PanelConfigProvider.tsx";

const useTabsHook = () => {

  const config = useTwitchPanelConfig()

  const tab1 = config.tab1
  const tab2 = config.tab2
  const tab3 = config.tab3

  const firstTab = tab1 !== 'none' ? tab1 : tab2 !== 'none' ? tab2 : tab3 !== 'none' ? tab3 : 'none'

  const [currentTab, setCurrentTab] = createSignal<string>(firstTab)

  return {
    currentTab,
    setCurrentTab,
  }
}

interface TabsProps {
}

const TabsContext = createContext<ReturnType<typeof useTabsHook>>();

export const TabsProvider: ParentComponent<TabsProps> = (props) => {
  const hook = useTabsHook()
  return (
    <TabsContext.Provider value={hook}>{props.children}</TabsContext.Provider>
  );
}

export const useTabs = () => useContext(TabsContext)!
