import {type Component, Show} from "solid-js";
import {CharityList} from "./CharityList.tsx";
import {CurrencyProvider} from "../../providers/CurrencyProvider.tsx";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {LiveDonoTrackerLink} from "./LiveDonoTrackerLink.tsx";
import {CharityOverview} from "./CharityOverview.tsx";
import {usePanelConfig} from "../../providers/PanelConfigProvider.tsx";
import {InvisibleBody} from "../../InvisibleBody.tsx";
import {CharityLoader} from "../../providers/data/CharityLoader.tsx";
import {useCharity} from "../../providers/data/CharityProvider.tsx";


export const CharityTab: Component = (props) => {
  const config = usePanelConfig()
  return (
    <>
      <Show when={config.showCharities}>
        <CharityLoader>
          <Body/>
        </CharityLoader>
      </Show>
      <Show when={!config.showCharities}>
        <InvisibleBody text={'The Charities Page will be live soon.'}/>
      </Show>
    </>
  );
}

const Body = () => {
  const {donation} = useCharity()
  return (
    <ColoredScrollbar>
      <p class={'mb-2 text-center text-xl text-white'}>Charities</p>
      <CurrencyProvider avgConversionRate={donation.avgConversionRate}>
        <div class={'flex flex-col gap-2 mx-2'}>
          <CharityOverview data={donation}/>
          <LiveDonoTrackerLink/>
          <CharityList charityData={donation.causes}/>
        </div>
      </CurrencyProvider>
    </ColoredScrollbar>
  )
}

/*
        <p class={'mb-2 text-center text-xl text-white'}>Charities</p>

            <CharityOverview data={donation}/>
            <LiveDonoTrackerLink/>
 */
