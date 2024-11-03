import {createContext, type ParentComponent, useContext} from "solid-js";
import type {TwitchExtensionSchedule} from "../../../lib/model/TwitchExtensionSchedule.ts";
import type {JJData} from "../../../lib/model/jjData/JJData.ts";
import type {JJCommunityFundraiser} from "../../../lib/model/jjData/JJCommunityFundraiser.ts";


interface DataProps {
  schedule: TwitchExtensionSchedule,
  donation: JJData,
  fundraiser: JJCommunityFundraiser
}

const DataContext = createContext<DataProps>();

export const DataProvider: ParentComponent<DataProps> = (props) => {
  return (
    <DataContext.Provider value={{
      schedule: props.schedule,
      donation: props.donation,
      fundraiser: props.fundraiser
    }}>
      {props.children}
    </DataContext.Provider>
  );
}
export const useData = () => useContext(DataContext)!
