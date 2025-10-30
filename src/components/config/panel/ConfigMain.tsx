import {type Component, Show} from "solid-js";
import {
  usePanelConfig,
  useTwitchPanelConfig,
  useTwitchPanelConfigEdit
} from "../../common/providers/PanelConfigProvider.tsx";
import {createModalSignal} from "../../../lib/createModalSignal.ts";
import {ThemeSelection} from "./ThemeSelection.tsx";
import {PanelRoot} from "../../panel/PanelRoot.tsx";
import {AlertDialog} from "@kobalte/core/alert-dialog";
import {CgClose} from "solid-icons/cg";
import {Button} from "@kobalte/core/button";

export const ConfigMain: Component = () => {
  const modalSignal = createModalSignal()
  const {setTwitchConfiguration, save, validConfig, edited} = useTwitchPanelConfigEdit()

  return (
    <div class={'bg-primary-500 flex flex-row p-1'}>
      <div class={'text-white'}>
        <div class={'p-2'}>
          <ThemeSelection/>
        </div>

        <div class={'p-2'}>
          <Button
            class={'bg-accent rounded-2xl p-2 text-white disabled:bg-gray-400'}
            onClick={() => {
              save()
              modalSignal.toggle()
              // log('config_save', config)
            }}
            disabled={!validConfig()}
          >
            Save
          </Button>
        </div>
        <Show when={edited()}>
          <p>You have unsaved changes</p>
        </Show>
      </div>
      <div class={'p-2'}>
        <p class={'text-white'}>Preview</p>
        <div class={'from-primary-300 to-primary-700 h-[496px] w-[316px] overflow-hidden bg-gradient-to-b'}>
          <PanelRoot/>
        </div>
      </div>

      <AlertDialog open={modalSignal.isOpen()} onOpenChange={modalSignal.setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay class="fixed inset-0 z-50 bg-black bg-opacity-20"/>
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <AlertDialog.Content
              class="z-50 max-w-[min(calc(100vw_-_16px),500px)] rounded-md border border-solid border-zinc-300 bg-[white] p-4 shadow-lg">
              <div class="mb-3 flex items-baseline justify-between">
                <AlertDialog.Title class="text-xl font-medium text-zinc-900">Configuration Saved</AlertDialog.Title>
                <AlertDialog.CloseButton class="h-4 w-4 text-zinc-600">
                  <CgClose size={24}/>
                </AlertDialog.CloseButton>
              </div>
              <AlertDialog.Description class=" text-base text-zinc-700">
                Jingle Jam Community Extension Extension Configuration Saved
              </AlertDialog.Description>
            </AlertDialog.Content>
          </div>
        </AlertDialog.Portal>
      </AlertDialog>
    </div>
  )
}
