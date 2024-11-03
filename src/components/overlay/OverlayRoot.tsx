import {type Component} from "solid-js";
import {OverlayMain} from "./OverlayMain.tsx";
import {OverlayProvider} from "../common/providers/OverlayProvider.tsx";
import {SleepProvider} from "../common/providers/SleepProvider.tsx";
import {OverlayExtensionProviders} from "../common/providers/OverlayExtensionProviders.tsx";


// const PanelMain = lazy(() => import('./PanelMain.tsx'));

export const OverlayRoot: Component = () => {
  return (
    <OverlayExtensionProviders>
      <SleepProvider>
        <OverlayProvider>
          <OverlayMain/>
        </OverlayProvider>
      </SleepProvider>
    </OverlayExtensionProviders>
  );
}
