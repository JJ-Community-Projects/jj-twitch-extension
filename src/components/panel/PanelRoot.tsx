import {type Component} from "solid-js";
import {PanelMain} from "./PanelMain.tsx";
import {Background} from "../common/Background.tsx";
import {PanelExtensionProviders} from "../common/providers/PanelExtensionProviders.tsx";
import {IsMobileProvider} from "../common/MobileProvider.tsx";

export const PanelRoot: Component = () => {
  return (

    <IsMobileProvider isMobile={false}>
      <PanelExtensionProviders>
        <Background>
          <PanelMain/>
        </Background>
      </PanelExtensionProviders>
    </IsMobileProvider>
  );
}
