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
import {QueryClient, QueryClientProvider} from "@tanstack/solid-query";
import {LocalStorageProvider} from "../../common/providers/LocalStorageProvider.tsx";
import {OverlayProvider} from "../../common/providers/OverlayProvider.tsx";
import {OverlayBackendProvider} from "../../common/providers/OverlayBackendProvider.tsx";
import {SleepProvider} from "../../common/providers/SleepProvider.tsx";
import {CurrencyProvider} from "../../common/providers/CurrencyProvider.tsx";
import {OverlayMain} from "../../overlay/OverlayMain.tsx";


export const OverlayConfigRoot: Component = () => {
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
                        <CurrencyProvider>
                          <Background>
                            <div class="max-h-[700px] overflow-y-auto">
                              <OverlayConfigMain/>
                            </div>
                          </Background>
                        </CurrencyProvider>
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
  /*
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
  );*/
}
