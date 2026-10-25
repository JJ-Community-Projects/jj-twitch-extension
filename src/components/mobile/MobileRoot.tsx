import {type Component} from "solid-js";
import {MobileMain} from "./MobileMain.tsx";
import {Background} from "../common/Background.tsx";
import {PanelExtensionProviders} from "../common/providers/PanelExtensionProviders.tsx";
import {IsMobileProvider} from "../common/MobileProvider.tsx";


export const MobileRoot: Component = () => {
  return (
    <IsMobileProvider isMobile={true}>
      <PanelExtensionProviders>
        <Background>
          <MobileMain/>
        </Background>
      </PanelExtensionProviders>
    </IsMobileProvider>
  );
}
