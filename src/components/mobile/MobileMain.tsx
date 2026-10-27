import {type Component} from "solid-js";
import {Tabs} from "@kobalte/core/tabs";
import {ExtensionTabs} from "../common/ExtensionTabs.tsx";
import {PanelHeader} from "../common/PanelHeader.tsx";
import {NavBarAlt} from "../common/NavBarAlt.tsx";
import {useTabs} from "../common/providers/TabsProvider.tsx";


export const MobileMain: Component = () => {
  const {currentTab, setCurrentTab} = useTabs()
  return (
    <Tabs
      class={'h-screen flex-1 flex flex-col gap-2 py-2'}
      value={currentTab()}
      onChange={setCurrentTab}
    >
      <PanelHeader/>
      <ExtensionTabs/>
      <NavBarAlt/>
    </Tabs>
  );
}
