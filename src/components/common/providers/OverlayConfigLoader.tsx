import {Match, type ParentComponent, Switch} from "solid-js";
import {useFirestore} from "./FirestoreProvider.tsx";
import type {OverlayConfig} from "../../../lib/model/Config.ts";
import {collection, type CollectionReference, doc} from "firebase/firestore";
import {useFirestoreDoc} from "../../../lib/useFirestoreDoc.ts";
import { OverlayConfigProvider } from "./OverlayConfigProvider.tsx";

function loadConfig() {
  const demo = import.meta.env.PUBLIC_DEMO_OVERLAY_CONFIG
  if (demo) {
    return {
      data: JSON.parse(demo) as OverlayConfig,
      loading: false,
      error: null
    }
  }
  const fs = useFirestore()
  const collectionRef = collection(fs, 'Config') as CollectionReference<OverlayConfig>
  const ref = doc(collectionRef,
    "TwitchOverlayExtension"
  )
  return useFirestoreDoc<OverlayConfig>(ref)
}


export const OverlayConfigLoader: ParentComponent = (props) => {
  const config = loadConfig()
  return (
    <Switch>
      <Match when={config.data}>
        <OverlayConfigProvider config={config.data!}>
          {props.children}
        </OverlayConfigProvider>
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
