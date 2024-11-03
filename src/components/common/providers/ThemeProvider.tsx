import {createContext, type ParentComponent, useContext} from "solid-js";
import {hasTwitchPanelConfig, useTwitchPanelConfig} from "./PanelConfigProvider.tsx";
import type {Theme} from "../../../lib/model/TwitchConfig.ts";
import {hasTwitchOverlayConfig, useTwitchOverlayConfig} from "./OverlayConfigProvider.tsx";


const useThemeHook = () => {

  const theme = (): Theme => {
    if (hasTwitchOverlayConfig()) {
      const config = useTwitchOverlayConfig()
      return config.theme
    } else if(hasTwitchPanelConfig()) {
      const config = useTwitchPanelConfig()
      return config.theme
    }
    throw 'red'
  }

  const tailwindBGAccent = () => {
    switch (theme()) {
      case 'blue':
        return 'bg-primary-500'
      case 'dark':
        return 'bg-gray-500'
      case 'red_light':
        return 'bg-accent-400'
      case 'blue_light':
        return 'bg-primary-400'
      default:
        return 'bg-accent-500'
    }
  }
  const tailwindBGAccent300 = () => {
    switch (theme()) {
      case 'blue':
        return 'bg-primary-300'
      case 'dark':
        return 'bg-gray-600'
      case 'red_light':
        return 'bg-accent-400'
      case 'blue_light':
        return 'bg-primary-400'
      default:
        return 'bg-accent-300'
    }
  }
  const tailwindBGPrimary = () => {
    switch (theme()) {
      case 'blue':
        return 'bg-accent-500'
      case 'dark':
        return 'bg-gray-800'
      case 'red_light':
        return 'bg-primary-400'
      case 'blue_light':
        return 'bg-accent-400'
      default:
        return 'bg-primary-500'
    }
  }
  const tailwindBGPrimary300 = () => {
    switch (theme()) {
      case 'blue':
        return 'bg-accent-300'
      case 'dark':
        return 'bg-gray-600'
      case 'red_light':
        return 'bg-primary-400'
      case 'blue_light':
        return 'bg-accent-400'
      default:
        return 'bg-primary-300'
    }
  }
  const tailwindTextAccent = () => {
    switch (theme()) {
      case 'blue':
        return 'text-primary-500'
      case 'dark':
        return 'text-gray-500'
      case 'red_light':
        return 'text-accent-400'
      case 'blue_light':
        return 'text-primary-400'
      default:
        return 'text-accent-500'
    }
  }
  const tailwindTextPrimary = () => {
    switch (theme()) {
      case 'blue':
        return 'text-accent-500'
      case 'dark':
        return 'text-gray-800'
      case 'red_light':
        return 'text-primary-400'
      case 'blue_light':
        return 'text-accent-400'
      default:
        return 'text-primary-500'
    }
  }

  return {
    theme,
    tailwindBGAccent,
    tailwindBGPrimary,
    tailwindTextAccent,
    tailwindTextPrimary,
    tailwindBGAccent300,
    tailwindBGPrimary300,
  }
}

const ThemeContext = createContext<ReturnType<typeof useThemeHook>>();

export const ThemeProvider: ParentComponent = (props) => {
  const hook = useThemeHook()
  return (
    <ThemeContext.Provider value={hook}>
      {props.children}
    </ThemeContext.Provider>
  );
}

const useOverlayThemeHook = () => {
  const config = useTwitchOverlayConfig()

  const theme = (): Theme => {
    return config.theme
  }

  const tailwindBGAccent = () => {
    switch (theme()) {
      case 'blue':
        return 'bg-primary-500'
      case 'dark':
        return 'bg-gray-500'
      case 'red_light':
        return 'bg-accent-400'
      case 'blue_light':
        return 'bg-primary-400'
      default:
        return 'bg-accent-500'
    }
  }
  const tailwindBGAccent300 = () => {
    switch (theme()) {
      case 'blue':
        return 'bg-primary-300'
      case 'dark':
        return 'bg-gray-600'
      case 'red_light':
        return 'bg-accent-400'
      case 'blue_light':
        return 'bg-primary-400'
      default:
        return 'bg-accent-300'
    }
  }
  const tailwindBGPrimary = () => {
    switch (theme()) {
      case 'blue':
        return 'bg-accent-500'
      case 'dark':
        return 'bg-gray-800'
      case 'red_light':
        return 'bg-primary-400'
      case 'blue_light':
        return 'bg-accent-400'
      default:
        return 'bg-primary-500'
    }
  }
  const tailwindBGPrimary300 = () => {
    switch (theme()) {
      case 'blue':
        return 'bg-accent-300'
      case 'dark':
        return 'bg-gray-600'
      case 'red_light':
        return 'bg-primary-400'
      case 'blue_light':
        return 'bg-accent-400'
      default:
        return 'bg-primary-300'
    }
  }
  const tailwindTextAccent = () => {
    switch (theme()) {
      case 'blue':
        return 'text-primary-500'
      case 'dark':
        return 'text-gray-500'
      case 'red_light':
        return 'text-accent-400'
      case 'blue_light':
        return 'text-primary-400'
      default:
        return 'text-accent-500'
    }
  }
  const tailwindTextPrimary = () => {
    switch (theme()) {
      case 'blue':
        return 'text-accent-500'
      case 'dark':
        return 'text-gray-800'
      case 'red_light':
        return 'text-primary-400'
      case 'blue_light':
        return 'text-accent-400'
      default:
        return 'text-primary-500'
    }
  }

  return {
    theme,
    tailwindBGAccent,
    tailwindBGPrimary,
    tailwindTextAccent,
    tailwindTextPrimary,
    tailwindBGAccent300,
    tailwindBGPrimary300,
  }
}

const OverlayThemeContext = createContext<ReturnType<typeof useOverlayThemeHook>>();

export const OverlayThemeProvider: ParentComponent = (props) => {
  const hook = useOverlayThemeHook()
  return (
    <OverlayThemeContext.Provider value={hook}>
      {props.children}
    </OverlayThemeContext.Provider>
  );
}
export const useTheme = () => {
  const theme = useContext(ThemeContext)
  if (theme !== undefined) {
    return theme
  }
  const overlayTheme = useContext(OverlayThemeContext)
  if (overlayTheme !== undefined) {
    return overlayTheme
  }
  throw new Error('useTheme must be used within a ThemeProvider or OverlayThemeProvider')
}
