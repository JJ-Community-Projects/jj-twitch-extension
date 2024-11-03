import {createContext, createEffect, createSignal, onMount, type ParentComponent, useContext} from "solid-js";
import {createStore} from "solid-js/store";
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";
import type {OverlayConfig} from "../../../lib/model/Config.ts";
import {defaultOverlayConfig, type TwitchOverlayConfig} from "../../../lib/model/TwitchConfig.ts";


const useTwitchOverlayConfigHook = () => {
  const {auth} = useTwitchAuth()
  const [config, setConfig] = createStore<TwitchOverlayConfig>(defaultOverlayConfig)
  const [originalConfig, setOriginalConfig] = createStore<TwitchOverlayConfig>(defaultOverlayConfig)
  const twitch = (window as any)?.Twitch?.ext
  const [channelId, setChannelId] = createSignal<string>()
  const edited = () => {
    return (
      config.donationUrl !== originalConfig.donationUrl ||
      config.showCommunityFundraiser !== originalConfig.showCommunityFundraiser ||
      config.showYogsSchedule !== originalConfig.showYogsSchedule ||
      config.theme !== originalConfig.theme ||
      config.chat.enabled !== originalConfig.chat.enabled ||
      config.chat.useDonationLink !== originalConfig.chat.useDonationLink ||
      config.chat.commands.some(
        (c, i) =>
          c.command !== originalConfig.chat.commands[i].command ||
          c.tiltifyId !== originalConfig.chat.commands[i].tiltifyId
      )
    )
  }

  const configOnChanged = () => {
    console.log('configOnChanged')
    if (twitch.configuration.broadcaster) {
      try {
        const config = JSON.parse(twitch.configuration.broadcaster.content)
        console.log('config', config)
        if (typeof config === 'object') {
          console.log('setting config', config)
          setConfig({...config})
          setOriginalConfig({...config})
        } else {
          setConfig(defaultOverlayConfig)
          setOriginalConfig(defaultOverlayConfig)
        }
      } catch (e) {
        setConfig(defaultOverlayConfig)
        setOriginalConfig(defaultOverlayConfig)
      }
    } else {
      setConfig(defaultOverlayConfig)
      setOriginalConfig(defaultOverlayConfig)
    }
  }
  const loadConfig = () => {
    if (!twitch) {
      console.log('loading config', 'no twitch', 'default')
      setConfig(defaultOverlayConfig)
      return
    }
    console.log('twitch', twitch)
    console.log('twitch.configuration', twitch.configuration)
    console.log('twitch.configuration.broadcaster', twitch.configuration.broadcaster)
    if (!twitch.configuration.broadcaster) {
      console.log('loading config', 'no broadcaster', 'default')
      setConfig(defaultOverlayConfig)
    }
    configOnChanged()
    twitch.configuration.onChanged(() => {
      console.log('loading config', 'onChanged')
      configOnChanged()
    })
  }

  onMount(() => {
    console.log('OverlayConfigProvider', twitch)
    if (auth) {
      setChannelId(auth.channelId)
    }
    loadConfig()
  })

  const save = () => {
    console.log('saving', config)
    try {
      twitch?.configuration.set('broadcaster', '1', JSON.stringify(config))
      setOriginalConfig(config)
    } catch (e) {
      console.error('error while saving', e)
    }
  }

  createEffect(() => {
    console.log('config changed', 'createEffect', config)
  })


  return {
    TwitchOverlayConfig: config, edit: {
      save, setTwitchOverlayConfiguration: setConfig, edited, channelId,
      originalConfig
    }
  }
}

const TwitchOverlayConfigContext = createContext<ReturnType<typeof useTwitchOverlayConfigHook>>();

export const TwitchOverlayConfigProvider: ParentComponent = (props) => {
  const hook = useTwitchOverlayConfigHook()
  return (
    <TwitchOverlayConfigContext.Provider value={hook}>
      {props.children}
    </TwitchOverlayConfigContext.Provider>
  );
}

export const hasTwitchOverlayConfig = () => {
  return useContext(TwitchOverlayConfigContext) !== undefined
}

export const _useTwitchPanelConfig = () => useContext(TwitchOverlayConfigContext)!

export const useTwitchOverlayConfig = () => {
  const {TwitchOverlayConfig} = _useTwitchPanelConfig()
  return TwitchOverlayConfig
}

export const useTwitchOverlayConfigEdit = () => {
  const {edit} = _useTwitchPanelConfig()
  return edit
}


interface OverlayConfigProps {
  config: OverlayConfig
}

const OverlayConfigContext = createContext<OverlayConfig>();

export const OverlayConfigProvider: ParentComponent<OverlayConfigProps> = (props) => {
  return (
    <OverlayConfigContext.Provider value={props.config}>
      {props.children}
    </OverlayConfigContext.Provider>
  );
}
export const useOverlayConfig = () => useContext(OverlayConfigContext)!
