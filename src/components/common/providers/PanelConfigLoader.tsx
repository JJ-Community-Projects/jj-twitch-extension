import {createEffect, Match, type ParentComponent, Switch} from "solid-js";
import {useFirestore} from "./FirestoreProvider.tsx";
import type {Config} from "../../../lib/model/Config.ts";
import {collection, type CollectionReference, doc} from "firebase/firestore";
import {useFirestoreDoc} from "../../../lib/useFirestoreDoc.ts";
import {PanelConfigProvider} from "./PanelConfigProvider.tsx";

function loadPanelConfig() {
  const demo = import.meta.env.PUBLIC_DEMO_PANEL_CONFIG
  if (demo) {
    return {
      data: JSON.parse(demo) as Config,
      loading: false,
      error: null
    }
  }
  const fs = useFirestore()
  const collectionRef = collection(fs, 'Config') as CollectionReference<Config>
  const ref = doc(collectionRef,
    "TwitchExtension"
  )
  return useFirestoreDoc<Config>(ref)
}


export const PanelConfigLoader: ParentComponent = (props) => {
  const config = loadPanelConfig()
  return (
    <Switch>
      <Match when={config.data}>
        <PanelConfigProvider config={config.data!}>
          {props.children}
        </PanelConfigProvider>
      </Match>
      <Match when={config.error}>
        <p>{config.error?.message}</p>
      </Match>
      <Match when={config.loading}>
        <p>Loading...</p>
      </Match>
    </Switch>
  );
}
