import {type Component} from "solid-js";
import {OverlayMain} from "./OverlayMain.tsx";
import {OverlayProvider} from "../common/providers/OverlayProvider.tsx";
import {SleepProvider} from "../common/providers/SleepProvider.tsx";
import {LocalStorageProvider} from "../common/providers/LocalStorageProvider.tsx";
import {createI18n, I18nProvider} from "solid-i18n";
import {TwitchAuthProvider} from "../common/providers/TwitchAuthProvider.tsx";
import {OverlayBackendProvider} from "../common/providers/OverlayBackendProvider.tsx";
import {TwitchOverlayConfigProvider} from "../common/providers/OverlayConfigProvider.tsx";
import {AnalyticsProvider} from "../common/providers/AnalyticsProvider.tsx";
import {OverlayThemeProvider} from "../common/providers/ThemeProvider.tsx";
import {useLocale} from "@kobalte/core";
import {QueryClient, QueryClientProvider} from "@tanstack/solid-query";


export const OverlayRoot: Component = () => {
  const i18n = createI18n({language: useLocale().locale()})
  return (
    <QueryClientProvider client={new QueryClient()}>
      <LocalStorageProvider>
        <I18nProvider i18n={i18n}>
          <TwitchAuthProvider>
            <OverlayProvider>
              <OverlayBackendProvider>
                <TwitchOverlayConfigProvider>
                  <AnalyticsProvider>
                    <OverlayThemeProvider>
                      <SleepProvider>
                        <OverlayMain/>
                      </SleepProvider>
                    </OverlayThemeProvider>
                  </AnalyticsProvider>
                </TwitchOverlayConfigProvider>
              </OverlayBackendProvider>
            </OverlayProvider>
          </TwitchAuthProvider>
        </I18nProvider>
      </LocalStorageProvider>
    </QueryClientProvider>
  );
}
