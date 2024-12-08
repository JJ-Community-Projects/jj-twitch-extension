import {type ParentComponent} from "solid-js";
import {createI18n, I18nProvider} from "solid-i18n";
import {useLocale} from "@kobalte/core";
import {TwitchAuthProvider} from "./TwitchAuthProvider.tsx";
import {FirestoreProvider} from "./FirestoreProvider.tsx";
import {ThemeProvider} from "./ThemeProvider.tsx";
import {PanelConfigLoader} from "./PanelConfigLoader.tsx";
import {TabsProvider} from "../TabsProvider.tsx";
import {TwitchPanelConfigProvider} from "./PanelConfigProvider.tsx";
import {AnalyticsProvider} from "./AnalyticsProvider.tsx";

export const PanelExtensionProviders: ParentComponent = (props) => {
  const i18n = createI18n({language: useLocale().locale()})
  return (
    <I18nProvider i18n={i18n}>
      <TwitchAuthProvider>
        <TwitchPanelConfigProvider>
          <AnalyticsProvider>
            <FirestoreProvider>
              <PanelConfigLoader>
                <ThemeProvider>
                  <TabsProvider>
                    {props.children}
                  </TabsProvider>
                </ThemeProvider>
              </PanelConfigLoader>
            </FirestoreProvider>
          </AnalyticsProvider>
        </TwitchPanelConfigProvider>
      </TwitchAuthProvider>
    </I18nProvider>
  );
}
