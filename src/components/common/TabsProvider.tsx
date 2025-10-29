import {createContext, createSignal, type ParentComponent, useContext} from "solid-js";
import {useTwitchPanelConfig} from "./providers/PanelConfigProvider.tsx";
import {useBackend} from "./providers/BackendProvider.tsx";

const useTabsHook = () => {

  const [currentTab, setCurrentTab] = createSignal<string>('')

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
