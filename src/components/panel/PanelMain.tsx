import {type Component, type ParentComponent} from "solid-js";
import {Tabs} from "@kobalte/core/tabs";
import {ExtensionTabs} from "../common/ExtensionTabs.tsx";
import {PanelHeader} from "../common/PanelHeader.tsx";
import {NavBarAlt} from "../common/NavBarAlt.tsx";
import {useBackend} from "../common/providers/BackendProvider.tsx";
import JingleJamLogo from "../../assets/JingleJam_Red.png";

const CrossFade: ParentComponent<{ show: boolean }> = (props) => {
  return (
    <div
      class={`absolute inset-0 transition-opacity duration-300 ease-in-out ${props.show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {props.children}
    </div>
  )
}

export const PanelMain: Component = () => {
  const {userConfig, config} = useBackend();
  const ready = () => Boolean(userConfig.data && config.data);

  return (
    <div class={"relative h-screen w-full"}>
      <CrossFade show={!ready()}>
        <Loading/>
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

export const Loading: Component = () => {
  return (
    <div class="h-screen w-full flex items-center justify-center">
      <div class="flex flex-col items-center gap-6">
        <img
          src={JingleJamLogo.src}
          alt="Jingle Jam"
          class="w-40 md:w-56 select-none pointer-events-none drop-shadow-lg animate-pulse"
        />
        <div class="flex items-center gap-3 text-white">
          <span class="text-sm">Loading…</span>
        </div>
      </div>
    </div>
  );
};
