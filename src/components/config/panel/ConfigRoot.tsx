import {type Component} from "solid-js";
import {createI18n, I18nProvider} from "solid-i18n";
import {TwitchAuthProvider} from "../../common/providers/TwitchAuthProvider.tsx";
import {FirestoreProvider} from "../../common/providers/FirestoreProvider.tsx";
import {DataLoader} from "../../common/providers/DataLoader.tsx";
import {ThemeProvider} from "../../common/providers/ThemeProvider.tsx";
import {Background} from "../../common/Background.tsx";
import {ConfigMain} from "./ConfigMain.tsx";
import {useLocale} from "@kobalte/core";
import {PanelConfigLoader} from "../../common/providers/PanelConfigLoader.tsx";
import {TwitchPanelConfigProvider} from "../../common/providers/PanelConfigProvider.tsx";
import {AnalyticsProvider} from "../../common/providers/AnalyticsProvider.tsx";

interface ConfigRootProps {
}

export const ConfigRoot: Component<ConfigRootProps> = (props) => {
  const i18n = createI18n({language: useLocale().locale()})

  return (
    <I18nProvider i18n={i18n}>
      <TwitchAuthProvider>
        <AnalyticsProvider>
          <TwitchPanelConfigProvider>
            <FirestoreProvider>
              <PanelConfigLoader>
                <DataLoader>
                  <ThemeProvider>
                    <Background>
                      <ConfigMain/>
                    </Background>
                  </ThemeProvider>
                </DataLoader>
              </PanelConfigLoader>
            </FirestoreProvider>
          </TwitchPanelConfigProvider>
        </AnalyticsProvider>
      </TwitchAuthProvider>
    </I18nProvider>
  );
}
