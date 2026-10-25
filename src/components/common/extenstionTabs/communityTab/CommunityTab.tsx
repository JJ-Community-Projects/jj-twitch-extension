import {type Component, Show} from "solid-js";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {FiExternalLink} from "solid-icons/fi";
import {InvisibleBodyAlt} from "../../InvisibleBody.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";
import {CommunityListItem} from "./listItem/CommunityListItem.tsx";
import {CrossFade} from "../../CrossFade.tsx";
import {Loading} from "../../Loading.tsx";
import {ErrorPage} from "../../Error.tsx";
import {CharityOverviewCollapsable} from "../charityTab/CharityOverviewCollapsable.tsx";
import {CommunitySearchProvider, useCommunitySearch} from "./CommunitySearchProvider.tsx";
import {Key} from "@solid-primitives/keyed";
import {CommunityBottom} from "./CommunityBottom.tsx";
import {HeadlinerUpNext} from "./HeadlinerUpNext.tsx";

export const CommunityTab: Component = () => {
  const {config} = useBackend()

  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show
              when={config().showFundraisers}
              fallback={
                <InvisibleBodyAlt
                  text={'The Community Fundraisers will be shown soon after the Jingle Jam has started.'}>
                  <JJStreamTeamLink/>
                </InvisibleBodyAlt>
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
  const {campaigns} = useBackend()

  return (
    <>
      <CrossFade show={campaigns.isError}>
        <ErrorPage message={'Failed to load fundraisers.'}/>
      </CrossFade>
      <CrossFade show={campaigns.isPending}>
        <Loading/>
      </CrossFade>
      <CrossFade show={campaigns.isSuccess}>
        <Show when={campaigns.data}>
          {
            (campaigns) => {
              return (
                <CommunitySearchProvider>
                  <div class={'flex h-full flex-1 flex-col'}>
                    <ColoredScrollbar>
                      <div class={'flex flex-1 flex-col gap-2 mx-2'}>
                        <FundraiserBody/>
                      </div>
                    </ColoredScrollbar>
                    <CommunityBottom date={campaigns().date}/>
                  </div>
                </CommunitySearchProvider>
              )
            }
          }
        </Show>
      </CrossFade>
    </>
  )
}


const FundraiserBody: Component = () => {

  const {campaigns} = useCommunitySearch()

  return (
    <>
      <CharityOverviewCollapsable/>
      <HeadlinerUpNext/>
      <Key
        each={campaigns()}
        by={(c) => `${c.campaign.tiltifyUrl}`}
        fallback={
          <p class={'text-center text-white'}>No Fundraisers
            found.</p>
        }>
        {(c, i) => {
          return (
            <CommunityListItem
              i={i()}
              campaign={c().campaign}
              cause={c().cause}
            />
          )
        }}
      </Key>
    </>
  )
}

const JJStreamTeamLink = () => {
  return (
    <a
      href={'https://twitch.tv/team/jinglejam'}
      target={'_blank'}
      class={'flex flex-row gap-2 justify-between items-center p-2 rounded-2xl text-white bg-accent text-center hover:scale-101 hover:brightness-105 transition-all'}>Jingle
      Jam Stream Team
      <FiExternalLink/></a>
  )
}
