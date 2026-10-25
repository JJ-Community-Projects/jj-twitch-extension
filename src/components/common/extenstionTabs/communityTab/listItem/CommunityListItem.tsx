import {type Component, Show} from "solid-js";
import {Dynamic} from "solid-js/web";
import {twMerge} from "tailwind-merge";
import {Numeric} from "solid-i18n";
import {FaSolidChevronRight} from "solid-icons/fa";
import {
  CommunityListItemProvider,
  type FundraiserItemProps,
  useCommunityListItem
} from "./CommunityListItemProvider.tsx";
import {useCurrency} from "../../../providers/CurrencyProvider.tsx";

export const CommunityListItem: Component<FundraiserItemProps> = (props) => {
  return (
    <CommunityListItemProvider i={props.i} campaign={props.campaign} cause={props.cause}>
      <Body/>
    </CommunityListItemProvider>
  );
};

// Compact single-row card. The whole card links to the fundraiser's Twitch page when they have one;
// the right chevron marks it as clickable.
const Body: Component = () => {
  const {
    campaign,
    campaignSurface,
    donoMatchSurface,
    donoMatch,
    name,
    raised,
    raisedColor,
    twitchUrl,
    isLive,
  } = useCommunityListItem()
  const {currency} = useCurrency()

  return (
    <Dynamic
      component={twitchUrl() ? "a" : "div"}
      href={twitchUrl()}
      target={twitchUrl() ? "_blank" : undefined}
      rel={twitchUrl() ? "noopener noreferrer" : undefined}
      aria-label={twitchUrl() ? `Open ${name()} on Twitch${isLive() ? " (live)" : ""}` : undefined}
      class={twMerge(
        "block w-full self-start rounded-2xl shadow-sm transition-all duration-200",
        twitchUrl() && "hover:brightness-105 hover:scale-101 active:brightness-[0.98] hover:shadow-lg",
        donoMatch() ? donoMatchSurface() : campaignSurface()
      )}
    >
      <div class={"flex w-full flex-row items-center gap-2 p-2"}>
        <img
          class={"size-6 rounded-lg ring-1 ring-white"}
          alt={campaign.campaignName}
          src={campaign.twitch?.avatar ?? campaign.avatar}
          loading={"lazy"}
        />
        <div class={"min-w-0 flex-1"}>
          <p class={"truncate text-ellipsis text-xs font-semibold"}>{name()}</p>
          {/* One subline for both, so a dono-matching card stays as tall as the others */}
          <Show when={twitchUrl() || donoMatch()}>
            <p class={"truncate text-ellipsis text-xxxs"}>
              <Show when={twitchUrl()}>
                <span class={"opacity-80"}>{isLive() ? "Watch Live" : "Visit Twitch"}</span>
              </Show>
              <Show when={twitchUrl() && donoMatch()}>
                <span class={"opacity-80"}> · </span>
              </Show>
              <Show when={donoMatch()}>
                <span class={"font-bold"}>Dono Matching</span>
              </Show>
            </p>
          </Show>
        </div>
        {/* Not twMerge: it doesn't know the custom text-xxs size and drops it in favour of the text colour */}
        <div class={`flex flex-col items-end self-start text-xxs font-bold ${raisedColor()}`}>
          <p>Raised</p>
          <Numeric value={raised()} numberStyle="currency" currency={currency()}/>
        </div>
        <Show when={twitchUrl()}>
          <FaSolidChevronRight class={twMerge("h-3 w-3 shrink-0", raisedColor())}/>
        </Show>
      </div>
    </Dynamic>
  );
}
