import {type Component, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
import {
  CommunityListItemProvider,
  type FundraiserItemProps,
  useCommunityListItem
} from "./CommunityListItemProvider.tsx";
import {CommunityListItemHeader} from "./CommunityListItemHeader.tsx";
import {CommunityListItemActions} from "./CommunityListItemActions.tsx";
import {CommunityListItemDesc} from "./CommunityListItemDesc.tsx";
import {CommunityListItemCampaignName} from "./CommunityListItemCampaignName.tsx";

export const CommunityListItem: Component<FundraiserItemProps> = (props) => {
  return (
    <CommunityListItemProvider i={props.i} campaign={props.campaign}>
      <Body/>
    </CommunityListItemProvider>
  );
};


const Body: Component = () => {
  const {
    campaign,
    campaignSurface
  } = useCommunityListItem()
  return (
    <div
      class={twMerge(
        "w-full rounded-2xl shadow-sm hover:shadow-md transition-all duration-200",
        "hover:brightness-105 hover:scale-101",
        campaignSurface()
      )}
    >
      <div class={"flex h-full w-full flex-col gap-1"}>
        <CommunityListItemHeader/>
        <CommunityListItemDesc/>
        <CommunityListItemActions/>
      </div>
    </div>
  );
}
