import {type Component} from "solid-js";
import {createI18n, I18nProvider} from "solid-i18n";
import {TwitchAuthProvider} from "../../common/providers/TwitchAuthProvider.tsx";
import {OverlayThemeProvider} from "../../common/providers/ThemeProvider.tsx";
import {Background} from "../../common/Background.tsx";
import {useLocale} from "@kobalte/core";
import {TwitchOverlayConfigProvider} from "../../common/providers/OverlayConfigProvider.tsx";
import {OverlayConfigMain} from "./OverlayConfigMain.tsx";
import {AnalyticsProvider} from "../../common/providers/AnalyticsProvider.tsx";
import {BackendProvider} from "../../common/providers/BackendProvider.tsx";


export const OverlayConfigRoot: Component = () => {
  const i18n = createI18n({language: useLocale().locale()})

  return (
    <I18nProvider i18n={i18n}>
      <TwitchAuthProvider>
        <BackendProvider>
          <TwitchOverlayConfigProvider>
            <AnalyticsProvider>
              <OverlayThemeProvider>
                <Background>
                  <OverlayConfigMain/>
                </Background>
              </OverlayThemeProvider>
            </AnalyticsProvider>
          </TwitchOverlayConfigProvider>
        </BackendProvider>
      </TwitchAuthProvider>
    </I18nProvider>
  );
}
