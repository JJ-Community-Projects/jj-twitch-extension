import {createContext, type ParentComponent, useContext} from "solid-js";
import type {JJData} from "../../../../lib/model/jjData/JJData.ts";


interface CharityProps {
  donation: JJData,
}

const CharityContext = createContext<CharityProps>();

export const CharityProvider: ParentComponent<CharityProps> = (props) => {
  return (
    <CharityContext.Provider value={{
      donation: props.donation,
    }}>
      {props.children}
    </CharityContext.Provider>
  );
}
export const useCharity = () => useContext(CharityContext)!
