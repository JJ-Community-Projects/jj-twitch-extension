import {Match, type ParentComponent, Switch} from "solid-js";
import {collection, type CollectionReference, doc} from "firebase/firestore";
import type {TwitchExtensionSchedule} from "../../../../lib/model/TwitchExtensionSchedule.ts";
import {useFirestore} from "../FirestoreProvider.tsx";
import {useFirestoreDoc} from "../../../../lib/useFirestoreDoc.ts";
import {usePanelConfig} from "../PanelConfigProvider.tsx";
import {ScheduleProvider} from "./ScheduleProvider.tsx";


function loadSchedule() {
  const demo = import.meta.env.PUBLIC_DEMO_SCHEDULE
  if (demo) {
    return {
      data: JSON.parse(demo) as TwitchExtensionSchedule,
      loading: false,
      error: null
    }
  }
  const config = usePanelConfig()
  const db = useFirestore();
  const collectionRef = collection(db, 'ExtensionSchedules') as CollectionReference<TwitchExtensionSchedule>
  const scheduleRef = doc(collectionRef, config.year)
  return useFirestoreDoc<TwitchExtensionSchedule>(
    scheduleRef
  )
}


export const ScheduleLoader: ParentComponent = (props) => {
  const schedule = loadSchedule();

  const isLoading = () => {
    return schedule.loading
  }

  const hasError = () => {
    return schedule.error
  }

  const error = () => {
    return schedule.error
  }

  const done = () => {
    return schedule.data
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
          <ScheduleProvider
            schedule={schedule.data!}
          >
            {props.children}
          </ScheduleProvider>
        </Match>
      </Switch>
    </>
  );
}
