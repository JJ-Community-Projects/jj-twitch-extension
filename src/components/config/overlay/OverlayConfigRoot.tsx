import {type Component} from "solid-js";
import {createI18n, I18nProvider} from "solid-i18n";
import {TwitchAuthProvider} from "../../common/providers/TwitchAuthProvider.tsx";
import {FirestoreProvider} from "../../common/providers/FirestoreProvider.tsx";
import {OverlayThemeProvider} from "../../common/providers/ThemeProvider.tsx";
import {Background} from "../../common/Background.tsx";
import {useLocale} from "@kobalte/core";
import {TwitchOverlayConfigProvider} from "../../common/providers/OverlayConfigProvider.tsx";
import {OverlayConfigMain} from "./OverlayConfigMain.tsx";
import {OverlayConfigLoader} from "../../common/providers/OverlayConfigLoader.tsx";
import {OverlayDataLoader} from "../../common/providers/OverlayDataLoader.tsx";
import {AnalyticsProvider} from "../../common/providers/AnalyticsProvider.tsx";


export const OverlayConfigRoot: Component = () => {
  const i18n = createI18n({language: useLocale().locale()})

  return (
    <I18nProvider i18n={i18n}>
      <TwitchAuthProvider>
        <TwitchOverlayConfigProvider>
          <AnalyticsProvider>
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
          </AnalyticsProvider>
        </TwitchOverlayConfigProvider>
      </TwitchAuthProvider>
    </I18nProvider>
  );
}
