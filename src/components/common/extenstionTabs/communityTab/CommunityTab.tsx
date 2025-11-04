import {type Component, createSignal, Show} from "solid-js";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {DateTime} from "luxon";
import {FiExternalLink} from "solid-icons/fi";
import {InvisibleBodyAlt} from "../../InvisibleBody.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";
import {CommunityListItemAlt} from "./CommunityListItem.tsx";
import {CrossFade} from "../../CrossFade.tsx";
import {Loading} from "../../Loading.tsx";
import {ErrorPage} from "../../Error.tsx";
import {CharityOverviewCollapsable} from "../charityTab/CharityOverviewCollapsable.tsx";
import {CommunitySearchProvider, useCommunitySearch} from "./CommunitySearchProvider.tsx";
import {FaSolidMagnifyingGlass} from "solid-icons/fa";
import {TextField} from "@kobalte/core";
import {Key} from "@solid-primitives/keyed";

export const CommunityTab: Component = () => {
  const {config} = useBackend()

  return (
    <Show when={config.data}>
      {
        (config) => {
          return (
            <Show when={config().showFundraisers} fallback={
              <InvisibleBodyAlt text={'The Community Fundraisers will be shown soon after the Jingle Jam has started.'}>
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
      <Key each={campaigns()} by={(c) => `${c.tiltifyUrl}`} fallback={
        <p class={'text-center text-white'}>No Fundraisers found.</p>
      }>
        {(c, i) => {
          return (
            <CommunityListItemAlt
              i={i()}
              campaign={c()}
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


export const CommunityBottom: Component<{
  date: Date
}> = (props) => {

  const {setSearchTerm} = useCommunitySearch()
  const [showSearchField, setShowSearchField] = createSignal<boolean>(false)
  const toggleSearchField = () => {
    if (showSearchField()) {
      setSearchTerm('')
    }
    setShowSearchField(v => !v)
  }

  return (
    <div class={"flex items-center bg-white text-black rounded-full p-1 mt-1 mx-2"}>
      <button
        type="button"
        class={"shrink-0 flex items-center justify-center h-6 w-6 rounded-full hover:bg-black/5 transition"}
        onClick={toggleSearchField}
        aria-label={showSearchField() ? "Hide search" : "Show search"}
      >
        <FaSolidMagnifyingGlass/>
      </button>

      <div class={"relative flex-1 text-center px-2 h-full w-full"}>
        <CrossFade show={!showSearchField()}>
          <p class={"text-xxs h-full w-full justify-center items-center flex"}>
            Last update, {DateTime.fromJSDate(props.date).toLocaleString(DateTime.DATETIME_MED)}
          </p>
        </CrossFade>
        <CrossFade show={showSearchField()}>
          <TextField.Root class={"h-full w-full px-2"} aria-label="Search fundraisers" onChange={setSearchTerm}>
            <TextField.Input
              autofocus
              placeholder="Search fundraisers..."
              class={"w-full bg-black/5 text-xs text-center placeholder-black/60 rounded-full px-3 border border-black/10 outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:bg-black/10 transition"}
            />
          </TextField.Root>
        </CrossFade>
      </div>

      {/* spacer to keep center content visually centered when icon is present on the left */}
      <div class={"shrink-0 h-6 w-6"}/>
    </div>
  );
}
