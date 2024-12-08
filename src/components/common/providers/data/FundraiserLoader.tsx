import {Match, type ParentComponent, Switch} from "solid-js";
import {collection, type CollectionReference, doc} from "firebase/firestore";
import {useFirestore} from "../FirestoreProvider.tsx";
import type {JJCommunityFundraiser} from "../../../../lib/model/jjData/JJCommunityFundraiser.ts";
import {useFirestoreDoc} from "../../../../lib/useFirestoreDoc.ts";
import {usePanelConfig} from "../PanelConfigProvider.tsx";
import {FundraiserProvider} from "./CommunityProvider.tsx";


function loadFundraiser() {
  const demo = import.meta.env.PUBLIC_DEMO_FUNDRAISER
  if (demo) {
    return {
      data: JSON.parse(demo) as JJCommunityFundraiser,
      loading: false,
      error: null
    }
  }
  const config = usePanelConfig()
  const db = useFirestore()
  const coll = collection(db, 'Fundraiser') as CollectionReference<JJCommunityFundraiser>
  const d = doc(coll, config.year)
  return useFirestoreDoc(d)
}

export const FundraiserLoader: ParentComponent = (props) => {
  const fundraiser = loadFundraiser();

  const isLoading = () => {
    return   fundraiser.loading;
  }

  const hasError = () => {
    return   fundraiser.error;
  }

  const error = () => {
    return   fundraiser.error;
  }

  const done = () => {
    return   fundraiser.data
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
          <FundraiserProvider
            fundraiser={fundraiser.data!}
          >
            {props.children}
          </FundraiserProvider>
        </Match>
      </Switch>
    </>
  );
}
