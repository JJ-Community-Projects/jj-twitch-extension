import {type Component} from "solid-js";
import {DonationButton} from "../common/DonationButton.tsx";
import {Tabs} from "@kobalte/core/tabs";
import {NavBar} from "../common/NavBar.tsx";
import {ExtensionTabs} from "../common/ExtensionTabs.tsx";

export const PanelMain: Component = (props) => {
  return (
    <Tabs class={'h-screen flex-1 flex flex-col gap-2 py-2'}>
      <DonationButton/>
      <NavBar/>
      <ExtensionTabs/>
    </Tabs>
  );
}
