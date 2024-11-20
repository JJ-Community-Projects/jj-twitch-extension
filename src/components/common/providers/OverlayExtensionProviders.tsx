import {type ParentComponent} from "solid-js";
import {createI18n, I18nProvider} from "solid-i18n";
import {useLocale} from "@kobalte/core";
import {TwitchAuthProvider} from "./TwitchAuthProvider.tsx";
import {FirestoreProvider} from "./FirestoreProvider.tsx";
import {OverlayThemeProvider} from "./ThemeProvider.tsx";
import {TwitchOverlayConfigProvider} from "./OverlayConfigProvider.tsx";
import {OverlayConfigLoader} from "./OverlayConfigLoader.tsx";
import {OverlayDataLoader} from "./OverlayDataLoader.tsx";
import {LocalStorageProvider} from "./LocalStorageProvider.tsx";
import {AnalyticsProvider} from "./AnalyticsProvider.tsx";

export const OverlayExtensionProviders: ParentComponent = (props) => {
  const i18n = createI18n({language: useLocale().locale()})
  return (
    <LocalStorageProvider>
      <I18nProvider i18n={i18n}>
        <TwitchAuthProvider>
          <TwitchOverlayConfigProvider>
            <AnalyticsProvider>
              <FirestoreProvider>
                <OverlayConfigLoader>
                  <OverlayDataLoader>
                    <OverlayThemeProvider>
                      {props.children}
                    </OverlayThemeProvider>
                  </OverlayDataLoader>
                </OverlayConfigLoader>
              </FirestoreProvider>
            </AnalyticsProvider>
          </TwitchOverlayConfigProvider>
        </TwitchAuthProvider>
      </I18nProvider>
    </LocalStorageProvider>
  );
}
