import {createContext, type ParentComponent, useContext} from "solid-js";


interface IsMobileProps {
  isMobile: boolean
}

const IsMobileContext = createContext<boolean>();

export const IsMobileProvider: ParentComponent<IsMobileProps> = (props) => {
  return (
    <IsMobileContext.Provider value={props.isMobile}>
      {props.children}
    </IsMobileContext.Provider>
  );
}
export const useIsMobile = () => useContext(IsMobileContext)!
