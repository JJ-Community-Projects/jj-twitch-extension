import {type Component} from "solid-js";
import {MobileMain} from "./MobileMain.tsx";
import {Background} from "../common/Background.tsx";
import {PanelExtensionProviders} from "../common/providers/PanelExtensionProviders.tsx";


export const MobileRoot: Component = () => {
  return (
    <PanelExtensionProviders>
      <Background>
        <MobileMain/>
      </Background>
    </PanelExtensionProviders>
  );
}
