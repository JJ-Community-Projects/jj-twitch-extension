import {type Component, Show} from "solid-js";
import {useData} from "../../providers/DataProvider.tsx";
import {CharityList} from "./CharityList.tsx";
import {CurrencyProvider} from "../../providers/CurrencyProvider.tsx";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {LiveDonoTrackerLink} from "./LiveDonoTrackerLink.tsx";
import {CharityOverview} from "./CharityOverview.tsx";
import {usePanelConfig} from "../../providers/PanelConfigProvider.tsx";
import {InvisibleBody} from "../../InvisibleBody.tsx";


export const CharityTab: Component = (props) => {
  const config = usePanelConfig()
  const {donation} = useData()
  return (
    <>
      <Show when={config.showCharities}>
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
      </Show>
      <Show when={!config.showCharities}>
        <InvisibleBody text={'The Charities Page will be live soon.'} />
      </Show>
    </>
  );
}
/*
        <p class={'mb-2 text-center text-xl text-white'}>Charities</p>

            <CharityOverview data={donation}/>
            <LiveDonoTrackerLink/>
 */
