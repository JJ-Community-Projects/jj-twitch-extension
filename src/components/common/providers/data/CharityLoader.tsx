import {Match, type ParentComponent, Switch} from "solid-js";
import {collection, type CollectionReference, doc} from "firebase/firestore";
import {useFirestore} from "../FirestoreProvider.tsx";
import type {JJData} from "../../../../lib/model/jjData/JJData.ts";
import {useFirestoreDoc} from "../../../../lib/useFirestoreDoc.ts";
import {usePanelConfig} from "../PanelConfigProvider.tsx";
import {CharityProvider} from "./CharityProvider.tsx";


function loadJJDonationTracker() {
  const demo = import.meta.env.PUBLIC_DEMO_DONATION_TRACKER
  if (demo) {
    return {
      data: JSON.parse(demo) as JJData,
      loading: false,
      error: null
    }
  }

  const config = usePanelConfig()
  const db = useFirestore()
  const coll = collection(db, 'JJDonationTracker') as CollectionReference<JJData>
  const d = doc(coll, config.year)
  return useFirestoreDoc(d)
}

export const CharityLoader: ParentComponent = (props) => {
  const jjDonationTracker = loadJJDonationTracker();

  const isLoading = () => {
    return jjDonationTracker.loading
  }

  const hasError = () => {
    return jjDonationTracker.error
  }

  const error = () => {
    return jjDonationTracker.error
  }

  const done = () => {
    return jjDonationTracker.data
  }

  return (
    <>
      <Switch>
        <Match when={isLoading()}>
          <div>Loading...</div>
        </Match>
        <Match when={hasError()}>
          <div>Error: {error()?.message}</div>
        </Match>
        <Match when={done()}>
          <CharityProvider
            donation={jjDonationTracker.data!}
          >
            {props.children}
          </CharityProvider>
        </Match>
      </Switch>
    </>
  );
}
