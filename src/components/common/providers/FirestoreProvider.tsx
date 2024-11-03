import {createContext, type ParentComponent, useContext} from "solid-js";
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const useFirestoreHook = () => {
  const firebaseConfig = JSON.parse(import.meta.env.PUBLIC_FIREBASE_CONFIG)
  const app = initializeApp(firebaseConfig);
  return getFirestore(app)
}

interface FirestoreProps {
}

const FirestoreContext = createContext<ReturnType<typeof useFirestoreHook>>();

export const FirestoreProvider: ParentComponent<FirestoreProps> = (props) => {
  const hook = useFirestoreHook()
  return (
    <FirestoreContext.Provider value={hook}>
      {props.children}
    </FirestoreContext.Provider>
  );
}
export const useFirestore = () => useContext(FirestoreContext)!;
