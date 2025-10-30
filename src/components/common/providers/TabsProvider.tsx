import {createContext, createSignal, type ParentComponent, useContext} from "solid-js";

const useTabsHook = () => {
  const [currentTab, setCurrentTab] = createSignal<string>('')
  return {
    currentTab,
    setCurrentTab,
  }
}

const TabsContext = createContext<ReturnType<typeof useTabsHook>>();

export const TabsProvider: ParentComponent = (props) => {
  const hook = useTabsHook()
  return (
    <TabsContext.Provider value={hook}>{props.children}</TabsContext.Provider>
  );
}

export const useTabs = () => useContext(TabsContext)!
