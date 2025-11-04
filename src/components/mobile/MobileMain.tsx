import {type Component} from "solid-js";
import {Tabs} from "@kobalte/core/tabs";
import {ExtensionTabs} from "../common/ExtensionTabs.tsx";
import {PanelHeader} from "../common/PanelHeader.tsx";
import {NavBarAlt} from "../common/NavBarAlt.tsx";


export const MobileMain: Component = () => {
  return (
    <Tabs
      class={'h-screen flex-1 flex flex-col gap-2 py-2'}
    >
      <PanelHeader/>
      <ExtensionTabs/>
      <NavBarAlt/>
    </Tabs>
  );
}
