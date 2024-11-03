import {createContext, createMemo, createSignal, type ParentComponent, useContext} from "solid-js";
import {useIntelligentTimer} from "../../../lib/overlay/useIntelligentTimer.ts";
import {createStore} from "solid-js/store";
import {useOverlay} from "./OverlayProvider.tsx";

type Events = {
  wake: ((time: number) => void) | (() => void);
  sleep: () => void;
};

type Event = keyof Events;

export type Sleeping = {
  sleeping: boolean;
  wake: (time: number) => void;
  sleep: () => void;
  on: (event: Event, fn: Events[Event]) => void;
  off: (event: Event, fn: Events[Event]) => void;
};

const useSleepHook = () => {
  const [startTimer, stopTimer] = useIntelligentTimer();
  const [sleeping, setSleeping] = createSignal(false);

  const [callbacks, setCallbacks] = createStore<{ [k in Event]: Events[k][] }>({
    wake: [],
    sleep: [],
  });
  /*
   const on = useCallback<Sleeping["on"]>((event, fn) => {
    setCallbacks((prev) => ({ ...prev, [event]: [...prev[event], fn] }));
  }, []);
   */
  const on = (event: Event, fn: Events[Event]) => {
    // setCallbacks((prev) => ({ ...prev, [event]: [...prev[event], fn] }));
    setCallbacks((prev) => {
      return {
        ...prev,
        [event]: [...prev[event], fn]
      }
    });
  }

  const off = (event: Event, fn: Events[Event]) => {
    setCallbacks((prev) => ({
      ...prev,
      [event]: prev[event].filter((f) => f !== fn),
    }));
  };

  const wake = (time: number) => {
    setSleeping(false);
    callbacks.wake.forEach((fn) => fn(time));
    startTimer(() => setSleeping(true), time);
  }

  const sleep = () => {
    setSleeping(true);
    callbacks.sleep.forEach((fn) => fn());
    stopTimer();
  }

  return {
    sleeping,
    wake,
    sleep,
    on,
    off,
  }
  /*
  return createMemo(() => ({
    sleeping,
    wake,
    sleep,
    on,
    off,
  }))*/
}

interface SleepProps {
}

const SleepContext = createContext<ReturnType<typeof useSleepHook>>();

export const SleepProvider: ParentComponent<SleepProps> = (props) => {
  const hook = useSleepHook()
  return (
    <SleepContext.Provider value={hook}>
      {props.children}
    </SleepContext.Provider>
  );
}

export const useSleep = () => useContext(SleepContext)!
