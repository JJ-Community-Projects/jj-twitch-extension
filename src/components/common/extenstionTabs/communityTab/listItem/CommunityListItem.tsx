import {type Component} from "solid-js";
import {twMerge} from "tailwind-merge";
import {
  CommunityListItemProvider,
  type FundraiserItemProps,
  useCommunityListItem
} from "./CommunityListItemProvider.tsx";
import {CommunityListItemHeader} from "./CommunityListItemHeader.tsx";
import {CommunityListItemActions} from "./CommunityListItemActions.tsx";
import {CommunityListItemDesc} from "./CommunityListItemDesc.tsx";

export const CommunityListItem: Component<FundraiserItemProps> = (props) => {
  return (
    <CommunityListItemProvider i={props.i} campaign={props.campaign} cause={props.cause}>
      <Body/>
    </CommunityListItemProvider>
  );
};

const Body: Component = () => {
  const {
    campaignSurface
  } = useCommunityListItem()
  return (
    <div
      class={twMerge(
        "w-full rounded-2xl shadow-sm hover:shadow-md transition-all duration-200",
        "hover:brightness-105",
        campaignSurface()
      )}
    >
      <div class={"flex h-full w-full flex-col"}>
        <CommunityListItemHeader/>
        <CommunityListItemDesc/>
        <CommunityListItemActions/>
      </div>
    </div>
  );
}
