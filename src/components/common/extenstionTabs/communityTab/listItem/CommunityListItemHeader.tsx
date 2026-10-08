import {type Component} from "solid-js";
import {twMerge} from "tailwind-merge";
import {Numeric} from "solid-i18n";
import {useCommunityListItem} from "./CommunityListItemProvider.tsx";
import {useCurrency} from "../../../providers/CurrencyProvider.tsx";
import {CommunityListItemCampaignName} from "./CommunityListItemCampaignName.tsx";

export const CommunityListItemHeader: Component = () => {
  const {campaign, name, raised, raisedColor, headerBackground, donoMatch} = useCommunityListItem()
  const {currency} = useCurrency()

  return (
    <div class={"items-start justify-center rounded-2xl px-1 pt-1"}>
      <div class={twMerge(
        "flex items-center justify-center gap-2 rounded-xl px-2 py-1",
        headerBackground(),
        donoMatch() &&  "text-white",
      )}>
        <img
          class={twMerge(
            "size-8 rounded-lg ring-1 ring-white",
          )}
          alt={campaign.campaignName}
          src={campaign.twitch?.avatar ?? campaign.avatar}
          loading={"lazy"}
        />
        <div class={"min-w-0 flex-1"}>
          <div class={"flex flex-row gap-1 items-center"}>
            <p class={"truncate text-ellipsis text-sm font-semibold"}>
              {name()}
            </p>
          </div>
          <CommunityListItemCampaignName/>
        </div>
        <div class={twMerge("flex flex-col items-end text-xs font-bold", raisedColor())}>
          <p>Raised</p>
          <Numeric value={raised()} numberStyle="currency" currency={currency()}/>
        </div>
      </div>
    </div>
  )
}
