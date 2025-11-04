import {type Component, createEffect, createMemo, createSignal, on, type ParentComponent, Show} from "solid-js";
import {
  TwitchPanelConfigProvider,
  useTwitchPanelConfig,
  useTwitchPanelConfigEdit
} from "../../common/providers/PanelConfigProvider.tsx";
import {createModalSignal} from "../../../lib/createModalSignal.ts";
import {ThemeSelection} from "./ThemeSelection.tsx";
import {AlertDialog} from "@kobalte/core/alert-dialog";
import {CgClose} from "solid-icons/cg";
import {Button} from "@kobalte/core/button";
import {createI18n, I18nProvider} from "solid-i18n";
import {useLocale} from "@kobalte/core";
import {QueryClient, QueryClientProvider} from "@tanstack/solid-query";
import {TwitchAuthProvider, useTwitchAuth} from "../../common/providers/TwitchAuthProvider.tsx";
import {TabsProvider} from "../../common/providers/TabsProvider.tsx";
import {BackendProvider, useBackend} from "../../common/providers/BackendProvider.tsx";
import {AnalyticsProvider} from "../../common/providers/AnalyticsProvider.tsx";
import {ThemeProvider} from "../../common/providers/ThemeProvider.tsx";
import {CurrencyProvider} from "../../common/providers/CurrencyProvider.tsx";
import {Select} from "@kobalte/core/select";
import {AiOutlineCheck} from "solid-icons/ai";
import {PanelMain} from "../../panel/PanelMain.tsx";
import {Background} from "../../common/Background.tsx";

export const ConfigMain: Component = () => {
  const modalSignal = createModalSignal()
  const {save, validConfig, edited} = useTwitchPanelConfigEdit()

  const config = useTwitchPanelConfig()

  return (
    <div class={'flex flex-row p-1'}>
      <div class={'text-white flex-1'}>
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
        <div class={'p-2 mt-4 space-y-3 rounded-2xl bg-gray-500/50'}>
          <h2 class={'text-white text-lg font-semibold'}>Next steps</h2>
          <ul class={'list-disc pl-5 space-y-2'}>
            <li class={'text-white'}>
              Create a Jingle Jam Campaign at{' '}
              <a href="https://jinglejam.tiltify.com/" target="_blank" rel="noopener noreferrer"
                 class={'underline text-white'}>
                jinglejam.tiltify.com
              </a>.
            </li>
            <li class={'text-white'}>
              Connect your Twitch account to your Tiltify account at{' '}
              <a href="https://app.tiltify.com/profile/setup" target="_blank" rel="noopener noreferrer"
                 class={'underline text-white'}>
                app.tiltify.com/profile/setup
              </a>.
            </li>
            <li class={'text-white'}>
              To create your own custom Jingle Jam schedule, visit{' '}
              <a href="https://jinglejam.ostof.dev" target="_blank" rel="noopener noreferrer"
                 class={'underline text-white'}>
                jinglejam.ostof.dev
              </a>{' '}and sign up using your Tiltify account.
            </li>
            <li class={'text-white'}>
              The preview may not represent the final visuals 100%. You might have to switch between tabs in the preview
              to make data load.
            </li>
          </ul>
          <p class={'text-sm text-gray-50 opacity-80'}>
            The Jingle Jam Extension and jinglejam.ostof.dev are community projects and is not associated with the
            Jingle Jam.
          </p>
        </div>
        <Show when={edited()}>
          <p>You have unsaved changes</p>
        </Show>
      </div>
      <Preview/>
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


const PreviewSelection: Component = () => {

  const {setPreviewAuth} = useTwitchAuth()
  const {refetchAll, userConfig, config} = useBackend()
  type PreviewKey = 'yogscast' | 'yogs-member' | 'ostofbot' | 'yours'

  const [selected, setSelected] = createSignal<PreviewKey>('yours')

  const labelMap = new Map<PreviewKey, string>([
    ['yours', 'Yours (Default)'],
    ['yogscast', 'Yogscast'],
    ['yogs-member', 'Yogs Member'],
    ['ostofbot', 'OstofBot (Test Channel)'],
  ])

  const authByKey = createMemo<Partial<Record<PreviewKey, Twitch.ext.Authorized>>>(() => ({
    yogscast: {
      channelId: "20786541",
      clientId: "333",
      token: "test-123",
      userId: "333",
      helixToken: "333",
    },
    'yogs-member': {
      // Using Martyn's channel for a generic "Yogs Member" preview
      channelId: "46969360",
      clientId: "333",
      token: "test-123",
      userId: "333",
      helixToken: "333",
    },
    ostofbot: {
      channelId: "960814823",
      clientId: "333",
      token: "test-123",
      userId: "333",
      helixToken: "333",
    },
    yours: undefined,
  }))

  const options = () => Array.from(labelMap.keys())

  const auth = () => selected() === 'yours' ? undefined : authByKey()[selected()]

  createEffect(on(auth, (a) => {
    if (a) {
      // When selecting a specific preview (e.g., Yogscast/Yogs Member), override auth
      setPreviewAuth(a)
    } else {
      // When switching back to "Yours", clear the preview override so real auth is used
      setPreviewAuth({
        channelId: "",
        clientId: "",
        token: "",
        userId: "",
        helixToken: "",
      })
    }
    refetchAll()
  }))

  const hasConfig = () => !config.isLoading && !userConfig.isLoading

  return (
    <div class={'p-2'}>
      <p class={'text-white'}>Preview</p>
      <div class={'mb-2'}>
        <Select<PreviewKey>
          class="row col w-52 gap-4 p-2 text-white"
          value={selected()}
          placeholder="Select a Preview"
          onChange={(v) => setSelected(v as PreviewKey)}
          options={options()}
          itemComponent={(props) => (
            <Select.Item
              class={'flex w-full flex-row justify-between p-1 text-white hover:cursor-pointer'}
              item={props.item}
            >
              <Select.ItemLabel>{labelMap.get(props.item.rawValue as PreviewKey)}</Select.ItemLabel>
              <Select.ItemIndicator>
                <AiOutlineCheck/>
              </Select.ItemIndicator>
            </Select.Item>
          )}
        >
          <Select.Trigger class="flex w-52 flex-row items-center justify-between" aria-label="Preview as">
            <Select.Value<PreviewKey>>{(state) => labelMap.get(state.selectedOption() as PreviewKey)}</Select.Value>
            <Select.Icon class="select__icon">
              <svg
                fill="currentColor"
                stroke-width="0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="2em"
                width="2em"
                style="overflow: visible; --darkreader-inline-fill: currentColor;"
                data-darkreader-inline-fill=""
              >
                <path
                  fill="currentColor"
                  d="m12 15-4.243-4.242 1.415-1.414L12 12.172l2.828-2.828 1.415 1.414L12 15.001Z"
                  data-darkreader-inline-fill=""
                  style="--darkreader-inline-fill: currentColor;"
                ></path>
              </svg>
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="bg-accent-500 rounded shadow">
              <Select.Listbox class="flex flex-col gap-1"/>
            </Select.Content>
          </Select.Portal>
        </Select>
      </div>

      <div class={'from-primary-300 to-primary-700 overflow-hidden bg-gradient-to-b'}
           style={{
             height: '496px',
             width: '316px'
           }}
      >
        <Background>
          <Show when={hasConfig()} fallback={<div class={'h-full w-full'}>Loading...</div>}>
            <PanelMain/>
          </Show>
        </Background>
      </div>
    </div>
  );
}


const Preview: ParentComponent<{}> = () => {
  const i18n = createI18n({language: useLocale().locale()})
  return (
    <QueryClientProvider client={new QueryClient()}>
      <I18nProvider i18n={i18n}>
        <TwitchAuthProvider>
          <TabsProvider>
            <BackendProvider useConfigPlaceholderData={false}>
              <TwitchPanelConfigProvider>
                <AnalyticsProvider>
                  <ThemeProvider>
                    <CurrencyProvider>
                      <PreviewSelection/>
                    </CurrencyProvider>
                  </ThemeProvider>
                </AnalyticsProvider>
              </TwitchPanelConfigProvider>
            </BackendProvider>
          </TabsProvider>
        </TwitchAuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
