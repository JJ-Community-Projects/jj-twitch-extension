import {createContext, createSignal, onMount, type ParentComponent, useContext} from "solid-js";
import {defaultConfig, type TwitchConfig} from "../../../lib/model/TwitchConfig.ts";
import {createStore} from "solid-js/store";
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";
import type {Config} from "../../../lib/model/Config.ts";


const useTwitchConfigHook = () => {
  const {auth} = useTwitchAuth()
  const [config, setConfig] = createStore<TwitchConfig>(defaultConfig)
  const [originalConfig, setOriginalConfig] = createStore<TwitchConfig>(defaultConfig)
  const twitch = (window as any)?.Twitch?.ext
  const [channelId, setChannelId] = createSignal<string>()
  const edited = () => {
    return (
      config.tab1 !== originalConfig.tab1 ||
      config.tab2 !== originalConfig.tab2 ||
      config.tab3 !== originalConfig.tab3 ||
      config.theme !== originalConfig.theme
    )
  }

  const configOnChanged = () => {
    if (twitch.configuration.broadcaster) {
      try {
        const config = JSON.parse(twitch.configuration.broadcaster.content)
        if (typeof config === 'object') {
          if (config.tab1 === undefined) {
            setConfig(defaultConfig)
            setOriginalConfig(defaultConfig)
          } else {
            setConfig({...config})
            setOriginalConfig({...config})
          }
        } else {
          setConfig(defaultConfig)
          setOriginalConfig(defaultConfig)
        }
      } catch (e) {
        setConfig(defaultConfig)
        setOriginalConfig(defaultConfig)
      }
    } else {
      setConfig(defaultConfig)
      setOriginalConfig(defaultConfig)
    }
  }
  const loadConfig = () => {
    if (!twitch) {
      setConfig(defaultConfig)
      return
    }
    if (!twitch.configuration.broadcaster) {
      setConfig(defaultConfig)
    }
    configOnChanged()
    twitch.configuration.onChanged(() => {
      configOnChanged()
    })
  }

  onMount(() => {
    if (auth) {
      setChannelId(auth.channelId)
    }
    loadConfig()
  })

  const setTwitchConfiguration = (newConfig: Partial<TwitchConfig>) => {
    setConfig({...config, ...newConfig})
  }
  const save = () => {
    twitch?.configuration.set('broadcaster', '1', JSON.stringify(config))
    setOriginalConfig(config)
  }

  const validConfig = () => {
    const t12 = config.tab1 !== config.tab2 || (config.tab1 === 'none' && config.tab2 === 'none')
    const t13 = config.tab1 !== config.tab3 || (config.tab1 === 'none' && config.tab3 === 'none')
    const t23 = config.tab2 !== config.tab3 || (config.tab2 === 'none' && config.tab3 === 'none')
    return t12 && t13 && t23
  }

  return {
    twitchConfig: config, edit: {
      save, setTwitchConfiguration, validConfig, edited, channelId,
      originalConfig
    }
  }
}


const TwitchPanelConfigContext = createContext<ReturnType<typeof useTwitchConfigHook>>();

export const TwitchPanelConfigProvider: ParentComponent = (props) => {
  const hook = useTwitchConfigHook()
  return (
    <TwitchPanelConfigContext.Provider value={hook}>
      {props.children}
    </TwitchPanelConfigContext.Provider>
  );
}

export const hasTwitchPanelConfig = () => {
  return useContext(TwitchPanelConfigContext) !== undefined
}

export const _useTwitchPanelConfig = () => useContext(TwitchPanelConfigContext)!

export const useTwitchPanelConfig = () => {
  const {twitchConfig} = _useTwitchPanelConfig()
  return twitchConfig
}

export const useTwitchPanelConfigEdit = () => {
  const {edit} = _useTwitchPanelConfig()
  return edit
}


const ConfigContext = createContext<Config>();

interface ConfigProviderProps {
  config: Config
}

export const PanelConfigProvider: ParentComponent<ConfigProviderProps> = (props) => {
  return (
    <ConfigContext.Provider value={props.config}>
      {props.children}
    </ConfigContext.Provider>
  );
}


export const usePanelConfig = () => useContext(ConfigContext)!
