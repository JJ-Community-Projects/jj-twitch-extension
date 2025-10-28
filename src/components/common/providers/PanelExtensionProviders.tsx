import {type ParentComponent} from "solid-js";
import {createI18n, I18nProvider} from "solid-i18n";
import {useLocale} from "@kobalte/core";
import {TwitchAuthProvider} from "./TwitchAuthProvider.tsx";
import {ThemeProvider} from "./ThemeProvider.tsx";
import {TabsProvider} from "../TabsProvider.tsx";
import {TwitchPanelConfigProvider} from "./PanelConfigProvider.tsx";
import {AnalyticsProvider} from "./AnalyticsProvider.tsx";
import {BackendProvider} from "./BackendProvider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/solid-query";
import {CurrencyProvider} from "./CurrencyProvider.tsx";

export const PanelExtensionProviders: ParentComponent = (props) => {
  const i18n = createI18n({language: useLocale().locale()})
  return (
    <QueryClientProvider client={new QueryClient()}>
      <I18nProvider i18n={i18n}>
        <TwitchAuthProvider>
          <BackendProvider>
            <TwitchPanelConfigProvider>
              <AnalyticsProvider>
                <ThemeProvider>
                  <CurrencyProvider>
                    <TabsProvider>
                      {props.children}
                    </TabsProvider>
                  </CurrencyProvider>
                </ThemeProvider>
              </AnalyticsProvider>
            </TwitchPanelConfigProvider>
          </BackendProvider>
        </TwitchAuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
