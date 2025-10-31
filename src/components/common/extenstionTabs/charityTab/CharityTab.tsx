import {type Component, Show} from "solid-js";
import {CharityList} from "./CharityList.tsx";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {LiveDonoTrackerLink} from "./LiveDonoTrackerLink.tsx";
import {CharityOverview} from "./CharityOverview.tsx";
import {InvisibleBodyAlt} from "../../InvisibleBody.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";
import {CrossFade} from "../../CrossFade.tsx";
import {ErrorPage} from "../../Error.tsx";
import {Loading} from "../../Loading.tsx";


export const CharityTab: Component = (props) => {
  const {config} = useBackend()
  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show
              when={config().showCharities}
              fallback={<InvisibleBodyAlt text={'The Charities Page will be live soon.'}/>}>
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
    <>
      <CrossFade show={causes.isError}>
        <ErrorPage message={'Failed to load causes.'}/>
      </CrossFade>
      <CrossFade show={causes.isPending}>
        <Loading/>
      </CrossFade>
      <CrossFade show={causes.isSuccess}>
        <Show when={causes.data}>
          {
            (causes) => {
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
      </CrossFade>
    </>
  )
}

/*
        <p class={'mb-2 text-center text-xl text-white'}>Charities</p>

            <CharityOverview data={donation}/>
            <LiveDonoTrackerLink/>
 */
