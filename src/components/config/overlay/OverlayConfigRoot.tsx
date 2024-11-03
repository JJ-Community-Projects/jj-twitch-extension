import {type Component} from "solid-js";
import {createI18n, I18nProvider} from "solid-i18n";
import {TwitchAuthProvider} from "../../common/providers/TwitchAuthProvider.tsx";
import {FirestoreProvider} from "../../common/providers/FirestoreProvider.tsx";
import {DataLoader} from "../../common/providers/DataLoader.tsx";
import {OverlayThemeProvider, ThemeProvider} from "../../common/providers/ThemeProvider.tsx";
import {Background} from "../../common/Background.tsx";
import {useLocale} from "@kobalte/core";
import {TwitchOverlayConfigProvider} from "../../common/providers/OverlayConfigProvider.tsx";
import {OverlayConfigMain} from "./OverlayConfigMain.tsx";
import { OverlayConfigLoader } from "../../common/providers/OverlayConfigLoader.tsx";
import {OverlayDataLoader} from "../../common/providers/OverlayDataLoader.tsx";


export const OverlayConfigRoot: Component = () => {
  const i18n = createI18n({language: useLocale().locale()})

  return (
    <I18nProvider i18n={i18n}>
      <TwitchAuthProvider>
        <TwitchOverlayConfigProvider>
          <FirestoreProvider>
            <OverlayConfigLoader>
              <OverlayDataLoader>
                <OverlayThemeProvider>
                  <Background>
                    <OverlayConfigMain/>
                  </Background>
                </OverlayThemeProvider>
              </OverlayDataLoader>
            </OverlayConfigLoader>
          </FirestoreProvider>
        </TwitchOverlayConfigProvider>
      </TwitchAuthProvider>
    </I18nProvider>
  );
}
