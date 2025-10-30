import {type Component, For, type ParentComponent, Show} from "solid-js";
import {ColoredScrollbar} from "../../ColoredScrollbar.tsx";
import {DateTime} from "luxon";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {Numeric} from "solid-i18n";
import {FiExternalLink} from "solid-icons/fi";
import {InvisibleBody, InvisibleBodyAlt} from "../../InvisibleBody.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";
import type {CurrenciesSchema, JJCampaign} from "../../../../api";
import {TwitchIcon} from "../../icons/JJIcons.tsx";
import {FaBrandsTwitch} from "solid-icons/fa";
import {CommunityListItemAlt, CommunityListItem} from "./CommunityListItem.tsx";
import {CurrencyToggle} from "../../CurrencyToggle.tsx";
import {CrossFade} from "../../CrossFade.tsx";
import {Loading} from "../../Loading.tsx";
import {ErrorPage} from "../../Error.tsx";


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
      <CrossFade show={campaigns.data !== undefined}>
        <Show when={campaigns.data}>
          {
            (campaigns) => {
              return (
                <div class={'flex h-full flex-1 flex-col'}>
                  <ColoredScrollbar>
                    <div class={'flex flex-1 flex-col gap-2 mx-2'}>
                      <FundraiserBody fundraisers={campaigns().campaigns}/>
                    </div>
                  </ColoredScrollbar>
                  <p class={'text-center text-xxs text-black bg-white rounded-full p-1 mt-1 mx-2'}>
                    Last update, {DateTime.fromJSDate(campaigns().date).toLocaleString(DateTime.DATETIME_MED)}
                  </p>
                </div>
              )
            }
          }
        </Show>
      </CrossFade>
    </>
  )
}


const FundraiserBody: Component<{ fundraisers: JJCampaign[] }> = props => {
  const fundraiser = () => props.fundraisers

  return (
    <>
      <TopBar/>
      <For each={fundraiser()} fallback={
        <p class={'text-center text-white'}>No Fundraisers found.</p>
      }>
        {(c, i) => {
          return (
            <CommunityListItemAlt
              i={i()}
              campaign={c}
            />
          )
        }}
      </For>
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


const TopBar: Component = () => {
  return (
    <div class={'flex flex-row justify-between bg-white p-2 rounded-2xl items-start'}>
      <a
        href={'https://twitch.tv/team/jinglejam'}
        target={'_blank'}
        class={'text-xs gap-2 flex flex-row justify-between items-center p-2 rounded-2xl text-white bg-accent text-center hover:scale-101 hover:brightness-101 transition-all'}>Jingle
        Jam Stream Team <FiExternalLink/></a>
      <CurrencyToggle/>
    </div>
  )
}
