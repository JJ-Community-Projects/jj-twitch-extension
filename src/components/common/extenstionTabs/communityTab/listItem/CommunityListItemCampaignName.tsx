import {type Component, Show} from "solid-js";
import {useCommunityListItem} from "./CommunityListItemProvider.tsx";


export const CommunityListItemCampaignName: Component = () => {
  const {campaign, donoMatch} = useCommunityListItem();

  const text = () => {
    if (donoMatch()) {
      return 'Dono Matching is Active'
    }
    return campaign.campaignName
  }


  return (
    <Show when={text()}>
      {(d) => <p class={"truncate text-ellipsis text-[11px] opacity-80"}>{d()}</p>}
    </Show>
  );
};
