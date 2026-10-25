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
    <div class={twMerge("items-start justify-center rounded-2xl px-1 pt-1",
      donoMatch() &&  "px-2 pt-2",
      )}>
      <div class={twMerge(
        "flex items-center justify-center gap-2 rounded-xl p-1",
        headerBackground(),
        donoMatch() &&  "text-white p-2",
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
            <p class={"truncate text-ellipsis text-xs font-semibold"}>
              {name()}
            </p>
          </div>
          <CommunityListItemCampaignName/>
        </div>
        <div class={twMerge("flex flex-col items-end justify-center font-bold", raisedColor())}>
          <p class={'text-xxs '}>Raised</p>
          <Numeric class={'text-xs'} value={raised()} numberStyle="currency" currency={currency()}/>
        </div>
      </div>
    </div>
  )
}
