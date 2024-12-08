import {createContext, type ParentComponent, useContext} from "solid-js";
import type {TwitchExtensionSchedule} from "../../../../lib/model/TwitchExtensionSchedule.ts";


interface ScheduleProps {
  schedule: TwitchExtensionSchedule,
}

const ScheduleContext = createContext<ScheduleProps>();

export const ScheduleProvider: ParentComponent<ScheduleProps> = (props) => {
  return (
    <ScheduleContext.Provider value={{
      schedule: props.schedule,
    }}>
      {props.children}
    </ScheduleContext.Provider>
  );
}
export const useSchedule = () => useContext(ScheduleContext)!
