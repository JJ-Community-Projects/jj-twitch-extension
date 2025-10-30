import {type Component, type ParentComponent} from "solid-js";
import {Tabs} from "@kobalte/core/tabs";
import {ExtensionTabs} from "../common/ExtensionTabs.tsx";
import {PanelHeader} from "../common/PanelHeader.tsx";
import {NavBarAlt} from "../common/NavBarAlt.tsx";
import {useBackend} from "../common/providers/BackendProvider.tsx";
import JingleJamLogo from "../../assets/JingleJam_Red.png";
import {useTabs} from "../common/providers/TabsProvider.tsx";
import {Loading} from "../common/Loading.tsx";
import {CrossFade} from "../common/CrossFade.tsx";
import {ErrorPage} from "../common/Error.tsx";


export const PanelMain: Component = () => {
  const {userConfig, config} = useBackend();
  const ready = () => Boolean(userConfig.data && config.data);

  const showError = () => Boolean(userConfig.error || config.error);

  return (
    <div class={"relative h-screen w-full"}>
      <CrossFade show={!ready()}>
        <Loading/>
      </CrossFade>
      <CrossFade show={showError()}>
        <ErrorPage message={'Failed to load config'}/>
      </CrossFade>
      <CrossFade show={ready()}>
        <Tabs class={"h-screen flex-1 flex flex-col gap-2 py-2"}>
          <PanelHeader/>
          <NavBarAlt/>
          <ExtensionTabs/>
        </Tabs>
      </CrossFade>
    </div>
  );
};
