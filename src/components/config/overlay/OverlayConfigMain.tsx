import {type Component, For, Show} from "solid-js";
import {createModalSignal} from "../../../lib/createModalSignal.ts";
import {TextField} from "@kobalte/core/text-field";
import {Button} from "@kobalte/core/button";
import {useTwitchOverlayConfig, useTwitchOverlayConfigEdit} from "../../common/providers/OverlayConfigProvider.tsx";
import {OverlayThemeSelection} from "./OverlayThemeSelection.tsx";
import {Checkbox} from "@kobalte/core/checkbox";
import {FaSolidCheck} from "solid-icons/fa";
import {ColoredScrollbar} from "../../common/ColoredScrollbar.tsx";
import {useTheme} from "../../common/providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {AlertDialog} from "@kobalte/core/alert-dialog";
import {CgClose} from "solid-icons/cg";
import {Tabs} from "@kobalte/core/tabs";
import {SleepProvider} from "../../common/providers/SleepProvider.tsx";
import {OverlayProvider} from "../../common/providers/OverlayProvider.tsx";
import {LocalStorageProvider} from "../../common/providers/LocalStorageProvider.tsx";
import {OverlaySideNav} from "../../overlay/OverlaySideNav.tsx";
import {OverlayBody} from "../../overlay/OverlayBody.tsx";
import {Select} from "@kobalte/core/select";
import {AiOutlineCheck} from "solid-icons/ai";
import {OverlayCharityBanner} from "../../overlay/OverlayCharityBanner.tsx";
import {OverlayCharitySideBanner} from "../../overlay/OverlayCharitySideBanner.tsx";
import {ChatProvider} from "../../common/providers/ChatProvider.tsx";


export const OverlayConfigMain: Component = () => {
  const {theme} = useTheme()

  const background = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'bg-accent-500'
      case 'dark':
        return 'bg-grey-800'
      default:
        return 'bg-primary-500'
    }
  }
  return (
    <Tabs class={twMerge('text-white p-2 w-full h-full', background())}>
      <Tabs.List class={'w-full flex flex-row items-center justify-center gap-4'}>
        <Tabs.Trigger value={'config'}>Config</Tabs.Trigger>
        <Tabs.Trigger value={'preview'}>Preview</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value={'config'} class={'w-full h-full'}>
        <OverlayConfigBody/>
      </Tabs.Content>
      <Tabs.Content value={'preview'} class={'w-full h-full text-black'}>
        <Preview/>
      </Tabs.Content>
    </Tabs>
  );
}


const Preview = () => {
  const twitchConfig = useTwitchOverlayConfig()
  return (
    <ChatProvider initCauseId={582}>
      <div class={'aspect-video bg-gray-700 py-[5rem] pr-[7rmm]'}>
        <div class={'w-full h-full'}>
          <LocalStorageProvider>
            <SleepProvider>
              <OverlayProvider>
                <div class={'h-full w-full relative'}>
                  <div
                    class={twMerge(
                      'h-full w-full absolute top-0 left-0',
                    )}
                  >
                    <div class={'h-full flex flex-row pl-2 pr-28'}>
                      <OverlaySideNav/>
                      <OverlayBody/>
                    </div>
                  </div>

                  <Show when={twitchConfig.chat.enabled}>
                    <Show when={twitchConfig.chat.position === 'top'}>
                      <div class={'pl-20 pr-[7rem] pb-2 absolute top-0 right-0 px-2 w-full h-16'}>
                        <OverlayCharityBanner/>
                      </div>
                    </Show>

                    <Show when={twitchConfig.chat.position === 'bottom'}>
                      <div class={'pl-20 pr-[7rem] pb-2 absolute bottom-0 right-0 px-2 w-full h-16'}>
                        <OverlayCharityBanner/>
                      </div>
                    </Show>

                    <Show when={twitchConfig.chat.position === 'right'}>
                      <div class={'h-full absolute top-0 right-0 pr-[7rem]'}>
                        <OverlayCharitySideBanner/>
                      </div>
                    </Show>
                  </Show>

                </div>
              </OverlayProvider>
            </SleepProvider>
          </LocalStorageProvider>
        </div>
      </div>
    </ChatProvider>
  )
}


const OverlayConfigBody: Component = () => {
  const twitchConfig = useTwitchOverlayConfig()
  const modalSignal = createModalSignal()
  const {setTwitchOverlayConfiguration, save, edited} = useTwitchOverlayConfigEdit()

  const {theme} = useTheme()

  // const { log } = useAnalytics()
  const validateDonationUrl = () => {
    const urlRegex = /\bhttps?:\/\/(?:\w+\.)?tiltify\.com\b/
    const urlRegex2 = /\bhttps?:\/\/(?:\w+\.)?tilti\.fyi\b/
    return (
      twitchConfig.donationUrl === '' ||
      urlRegex.test(twitchConfig.donationUrl) ||
      urlRegex2.test(twitchConfig.donationUrl)
    )
  }

  const saveButtonBackground = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'bg-primary-500'
      case 'dark':
        return 'bg-grey-800'
      default:
        return 'bg-accent-500'
    }
  }

  return (
    <>
      <ColoredScrollbar>
        <div class={'flex flex-col items-start  gap-6 p-2'}>
          <TextField
            class={'flex flex-col gap-1'}
            value={twitchConfig.donationUrl}
            onChange={v => {
              setTwitchOverlayConfiguration({donationUrl: v})
            }}
            validationState={validateDonationUrl() ? 'valid' : 'invalid'}
          >
            <TextField.Label>Donation URL</TextField.Label>
            <TextField.Input class={'text-black'}/>
            <TextField.Description>Enter your custom Jingle Jam Donation URL here.</TextField.Description>
            <TextField.ErrorMessage>Invalid tiltify url</TextField.ErrorMessage>
          </TextField>

          <OverlayThemeSelection/>


          <ViewsSelection/>

          <ChatCommands/>

          <Show when={edited()}>
            <p>You have unsaved changes</p>
          </Show>
          <Button
            class={twMerge('rounded-2xl p-2 text-white disabled:bg-gray-400', saveButtonBackground())}
            onClick={() => {
              save()
              modalSignal.toggle()
              // log('config_save', config)
            }}
            disabled={!validateDonationUrl()}
          >
            Save
          </Button>
        </div>
      </ColoredScrollbar>
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
    </>
  )
}


const ViewsSelection: Component = () => {
  const twitchConfig = useTwitchOverlayConfig()
  const {setTwitchOverlayConfiguration} = useTwitchOverlayConfigEdit()

  return (
    <div class={'flex flex-col gap-2'}>
      <p class={'font-bold text-lg'}>Views</p>
      <Checkbox class={'flex flex-row items-center gap-2'} checked={twitchConfig.showCommunityFundraiser}
                onChange={(v) => {
                  setTwitchOverlayConfiguration({showCommunityFundraiser: v})
                }}>
        <Checkbox.Input/>
        <Checkbox.Control class={'w-6 h-6 border-2 rounded border-white p-2 flex items-center justify-center'}>
          <Checkbox.Indicator>
            <FaSolidCheck size={18}/>
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label>Show Community Fundraiser</Checkbox.Label>
      </Checkbox>
    </div>
  );
}
const ChatCommands: Component = () => {
  const config = useTwitchOverlayConfig()
  const twitchConfig = useTwitchOverlayConfig()
  const {setTwitchOverlayConfiguration} = useTwitchOverlayConfigEdit()
  return (
    <div class={'flex flex-col gap-2'}>
      <p class={'font-bold text-lg'}>Chat Commands</p>
      <span>
        <p>These chat commands can be used by your mods. Once they trigger them a small overlay is shown on the stream player.</p>
        <p>This overlay has a links to the charities website and tiltify or your tiltify.</p>
        <p class={'font-bold'}>This feature should not be used as a replacement for regular chat commands.</p>
      </span>


      <Checkbox class={'flex flex-row items-center gap-2'} checked={twitchConfig.chat.enabled} onChange={(v) => {
        setTwitchOverlayConfiguration('chat', 'enabled', v)
      }}>
        <Checkbox.Input/>
        <Checkbox.Control class={'w-6 h-6 border-2 rounded border-white p-2 flex items-center justify-center'}>
          <Checkbox.Indicator>
            <FaSolidCheck size={18}/>
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label>Enable Overlay Chat commands</Checkbox.Label>
      </Checkbox>

      <Show when={twitchConfig.chat.enabled}>
        <OverlayChatPosition/>
        <Checkbox class={'flex flex-row items-center gap-2'} checked={twitchConfig.chat.useDonationLink}
                  onChange={(v) => {
                    setTwitchOverlayConfiguration('chat', 'useDonationLink', v)
                  }}>
          <Checkbox.Input/>
          <Checkbox.Control class={'w-6 h-6 border-2 rounded border-white p-2 flex items-center justify-center'}>
            <Checkbox.Indicator>
              <FaSolidCheck size={18}/>
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.Label>Use my Tiltify Link instead of the charity Tiltify link.</Checkbox.Label>
        </Checkbox>
        <p class={'font-bold text-lg'}>Commands</p>
        <p>Do not add any prefix like ! or #. The extension uses ! as the command prefix. i.e. !calm</p>
        <div class={'flex flex-col gap-2'}>
          <For each={config.chat.commands}>
            {
              (command, index) => {
                return (
                  <div class={'flex flex-row w-[480px]'}>
                    <p>{command.name}</p>
                    <div class={'flex-1'}></div>
                    <TextField
                      class={'text-black'}
                      value={command.command}
                      onChange={(v) => {
                        setTwitchOverlayConfiguration(
                          'chat', 'commands', index(), 'command', v
                        )
                      }}>
                      <TextField.Input/>
                    </TextField>
                  </div>
                )
              }
            }
          </For>
        </div>

      </Show>
    </div>
  );
}


export const OverlayChatPosition: Component = () => {
  const twitchConfig = useTwitchOverlayConfig()
  const {setTwitchOverlayConfiguration} = useTwitchOverlayConfigEdit()

  const optionsMap = new Map<string, string>([
    ['top', 'Top'],
    ['bottom', 'Bottom'],
    ['right', 'Right'],
  ])

  const options = () => [...optionsMap.keys()]

  return (
    <div class={'flex flex-col'}>
      <p class={'font-bold text-lg'}>Charity Banner position</p>
      <Select<string>
        class="row col w-32 gap-4 p-2"
        value={twitchConfig.chat.position}
        placeholder="Select a Position"
        onChange={v => {
          if (v) {
            setTwitchOverlayConfiguration('chat', 'position', v)
          }
        }}
        options={options()}
        itemComponent={props => (
          <Select.Item
            class={'flex w-full flex-row justify-between p-1 text-white hover:cursor-pointer'}
            item={props.item}
          >
            <Select.ItemLabel>{optionsMap.get(props.item.rawValue)}</Select.ItemLabel>
            <Select.ItemIndicator>
              <AiOutlineCheck/>
            </Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.Trigger class="flex w-32 flex-row items-center justify-between" aria-label="Fruit">
          <Select.Value<string>>{state => optionsMap.get(state.selectedOption())}</Select.Value>
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
  )
}
