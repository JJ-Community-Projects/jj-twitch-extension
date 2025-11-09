import {type Component} from "solid-js";
import {PanelMain} from "./PanelMain.tsx";
import {Background} from "../common/Background.tsx";
import {PanelExtensionProviders} from "../common/providers/PanelExtensionProviders.tsx";

export const PanelRoot: Component = () => {
  return (
    <PanelExtensionProviders>
      <Background>
        <PanelMain/>
      </Background>
    </PanelExtensionProviders>
  );
}
