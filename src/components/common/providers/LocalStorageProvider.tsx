import {createContext, type  ParentComponent, useContext} from "solid-js";

const useLocalStorageHook = () => {

  const setItem = (key: string, value: any) => {
    localStorage.setItem(key, value);
  }

  const getItem = (key: string, defaultValue: string) => {
    return localStorage.getItem(key) ?? defaultValue
  }

  const setBoolean = (key: string, value: boolean) => setItem(key, value);


  const getBoolean = (key: string, defaultValue: boolean): boolean => {
    const v = getItem(key, `${defaultValue}`);
    return v === "true";
  }

  return {
    setItem,
    getItem,
    setBoolean,
    getBoolean,
  }
}

const LocalStorageContext = createContext<ReturnType<typeof useLocalStorageHook>>();

export const LocalStorageProvider: ParentComponent = (props) => {
  const hook = useLocalStorageHook()
  return (
    <LocalStorageContext.Provider value={hook}>
      {props.children}
    </LocalStorageContext.Provider>
  );
}
export const useLocalStorage = () => useContext(LocalStorageContext)!
