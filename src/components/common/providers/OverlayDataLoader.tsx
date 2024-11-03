import {Match, type ParentComponent, Switch} from "solid-js";
import {collection, type CollectionReference, doc} from "firebase/firestore";
import type {TwitchExtensionSchedule} from "../../../lib/model/TwitchExtensionSchedule.ts";
import {useFirestore} from "./FirestoreProvider.tsx";
import type {JJCommunityFundraiser} from "../../../lib/model/jjData/JJCommunityFundraiser.ts";
import type {JJData} from "../../../lib/model/jjData/JJData.ts";
import {DataProvider} from "./DataProvider.tsx";
import {useFirestoreDoc} from "../../../lib/useFirestoreDoc.ts";
import {useOverlayConfig} from "./OverlayConfigProvider.tsx";


function loadSchedule() {
  const config = useOverlayConfig()
  const db = useFirestore();
  const collectionRef = collection(db, 'ExtensionSchedules') as CollectionReference<TwitchExtensionSchedule>
  const scheduleRef = doc(collectionRef, config.year)
  return useFirestoreDoc<TwitchExtensionSchedule>(
    scheduleRef
  )
}

function loadJJDonationTracker() {
  const config = useOverlayConfig()
  const db = useFirestore()
  const coll = collection(db, 'JJDonationTracker') as CollectionReference<JJData>
  const d = doc(coll, config.year)
  return useFirestoreDoc(d)
}

function loadFundraiser() {
  const config = useOverlayConfig()
  const db = useFirestore()
  const coll = collection(db, 'Fundraiser') as CollectionReference<JJCommunityFundraiser>
  const d = doc(coll, config.year)
  return useFirestoreDoc(d)
}

export const OverlayDataLoader: ParentComponent = (props) => {
  const schedule = loadSchedule();
  const jjDonationTracker = loadJJDonationTracker();
  const fundraiser = loadFundraiser();

  const isLoading = () => {
    return schedule.loading && jjDonationTracker.loading && fundraiser.loading;
  }

  const hasError = () => {
    return schedule.error || jjDonationTracker.error || fundraiser.error;
  }

  const error = () => {
    return schedule.error ?? jjDonationTracker.error ?? fundraiser.error;
  }

  const done = () => {
    return schedule.data && jjDonationTracker.data && fundraiser.data
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
          <DataProvider
            schedule={schedule.data!}
            donation={jjDonationTracker.data!}
            fundraiser={fundraiser.data!}
          >
            {props.children}
          </DataProvider>
        </Match>
      </Switch>
    </>
  );
}
