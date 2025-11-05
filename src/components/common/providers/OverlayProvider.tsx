import {createContext, createEffect, createSignal, type ParentComponent, useContext} from "solid-js";
import type {Stream} from "../../../api";

const useOverlayHook = () => {
  const [window, setWindow] = createSignal<string>('none')
  const [stream, setStream] = createSignal<Stream | undefined>(undefined)

  const showAboutJJ = () => {
    setWindow('jj')
  }

  const toggleAboutJJ = () => {
    if (window() === 'jj') {
      setWindow('none')
    } else {
      setStream(undefined)
      setWindow('jj')
    }
  }

  const toggleCharities = () => {
    if (window() === 'charities') {
      setWindow('none')
    } else {
      setStream(undefined)
      setWindow('charities')
    }
  }

  const toggleCommunity = () => {
    if (window() === 'community') {
      setWindow('none')
    } else {
      setStream(undefined)
      setWindow('community')
    }
  }

  const toggleSchedule = () => {
    if (window() === 'yogs_schedule') {
      setWindow('none')
    } else {
      setStream(undefined)
      setWindow('yogs_schedule')
    }
  }

  const toggleUserSchedule = () => {
    if (window() === 'user_schedule') {
      setWindow('none')
    } else {
      setStream(undefined)
      setWindow('user_schedule')
    }
  }

  const toggleAbout = () => {
    if (window() === 'about') {
      setWindow('none')
    } else {
      setStream(undefined)
      setWindow('about')
    }
  }

  const hide = () => {
    setWindow('none')
  }

  const jj = () => window() === 'jj'
  const charities = () => window() === 'charities'
  const community = () => window() === 'community'
  const yogsSchedule = () => window() === 'yogs_schedule'
  const userSchedule = () => window() === 'user_schedule'
  const about = () => window() === 'about'
  const showStream = () => stream() !== undefined

  const none = () => window() === 'none'
  const shows = () => window() !== 'none'

  createEffect(() => {
    if (stream()) {
      setWindow('none')
    }
  })


  return {
    showAboutJJ,
    toggleAboutJJ,
    toggleCharities,
    toggleCommunity,
    toggleSchedule,
    toggleUserSchedule,
    toggleAbout,
    hide,
    window,
    jj,
    charities,
    community,
    yogsSchedule,
    userSchedule,
    about,
    none,
    shows,
    showStream,
    stream,
    setStream
  }
}

interface OverlayProps {
}

const OverlayContext = createContext<ReturnType<typeof useOverlayHook>>();

export const OverlayProvider: ParentComponent<OverlayProps> = (props) => {
  const hook = useOverlayHook()
  return (
    <OverlayContext.Provider value={hook}>
      {props.children}
    </OverlayContext.Provider>
  );
}
export const useOverlay = () => useContext(OverlayContext)!
