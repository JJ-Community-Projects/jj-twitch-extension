import {type Component, Show} from "solid-js";
import {CharityList} from "./CharityList.tsx";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {LiveDonoTrackerLink} from "./LiveDonoTrackerLink.tsx";
import {CharityOverview} from "./CharityOverview.tsx";
import {InvisibleBody} from "../../InvisibleBody.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";


export const CharityTab: Component = (props) => {
  const {config} = useBackend()
  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show when={config().showCharities}
                  fallback={<InvisibleBody text={'The Charities Page will be live soon.'}/>
                  }>
                <Body/>
            </Show>
          )
        }
      }
    </Show>
  );
}

const Body = () => {
  const {causes} = useBackend()
  return (
    <Show when={causes.data}>
      {
        (causes) =>{
          return (
            <ColoredScrollbar>
                <div class={'flex flex-col gap-2 mx-2'}>
                  <CharityOverview data={causes().overview}/>
                  <LiveDonoTrackerLink/>
                  <CharityList charityData={causes().causes}/>
                </div>
            </ColoredScrollbar>
          )
        }
      }
    </Show>
  )
}

/*
        <p class={'mb-2 text-center text-xl text-white'}>Charities</p>

            <CharityOverview data={donation}/>
            <LiveDonoTrackerLink/>
 */
