import {type ParentComponent} from "solid-js";
import {createI18n, I18nProvider} from "solid-i18n";
import {useLocale} from "@kobalte/core";
import {TwitchAuthProvider} from "./TwitchAuthProvider.tsx";
import {OverlayThemeProvider} from "./ThemeProvider.tsx";
import {TwitchOverlayConfigProvider} from "./OverlayConfigProvider.tsx";
import {LocalStorageProvider} from "./LocalStorageProvider.tsx";
import {AnalyticsProvider} from "./AnalyticsProvider.tsx";
import {BackendProvider} from "./BackendProvider.tsx";
import {OverlayBackendProvider} from "./OverlayBackendProvider.tsx";

export const OverlayExtensionProviders: ParentComponent = (props) => {
  const i18n = createI18n({language: useLocale().locale()})
  return (
    <LocalStorageProvider>
      <I18nProvider i18n={i18n}>
        <TwitchAuthProvider>
          <OverlayBackendProvider>
            <TwitchOverlayConfigProvider>
              <AnalyticsProvider>
                <OverlayThemeProvider>
                  {props.children}
                </OverlayThemeProvider>
              </AnalyticsProvider>
            </TwitchOverlayConfigProvider>
          </OverlayBackendProvider>
        </TwitchAuthProvider>
      </I18nProvider>
    </LocalStorageProvider>
  );
}
