import {createContext, type ParentComponent, useContext} from "solid-js";
import type {JJCommunityFundraiser} from "../../../../lib/model/jjData/JJCommunityFundraiser.ts";


interface FundraiserProps {
  fundraiser: JJCommunityFundraiser
}

const FundraiserContext = createContext<FundraiserProps>();

export const FundraiserProvider: ParentComponent<FundraiserProps> = (props) => {
  return (
    <FundraiserContext.Provider value={{
      fundraiser: props.fundraiser
    }}>
      {props.children}
    </FundraiserContext.Provider>
  );
}
export const useFundraiser = () => useContext(FundraiserContext)!
