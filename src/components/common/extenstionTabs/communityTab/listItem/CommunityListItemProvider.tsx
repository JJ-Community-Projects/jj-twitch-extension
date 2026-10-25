import type {JJCampaign, JJCause} from "../../../../../api";
import {useTheme} from "../../../providers/ThemeProvider.tsx";
import {useCurrency} from "../../../providers/CurrencyProvider.tsx";
import {createContext, createMemo, type ParentComponent, useContext} from "solid-js";

export interface FundraiserItemProps {
  i: number
  campaign: JJCampaign
  cause?: JJCause
}

const useCommunityListItemHook = (props: FundraiserItemProps) => {
  const {theme} = useTheme();
  const {eur, usd} = useCurrency()

  const donoMatch = () => {
    return props.campaign.hasActiveDonationMatch
  }

  const gradient = [
    "bg-gradient-to-b from-red-200 to-red-400",
    "bg-gradient-to-b from-orange-200 to-orange-400",
    "bg-gradient-to-b from-yellow-200 to-yellow-400",
    "bg-gradient-to-b from-green-200 to-green-400",
    "bg-gradient-to-b from-cyan-200 to-cyan-400",
    "bg-gradient-to-b from-blue-200 to-blue-400",
    "bg-gradient-to-b from-purple-200 to-purple-400",
  ];

  const campaignSurface = () => {
    if (theme() === "dark") {
      return "bg-gradient-to-b from-white/30 to-white/10 ring-1 ring-white/10 text-white backdrop-blur-sm";
    }
    if (theme() === "rainbow") {
      return `${gradient[props.i % gradient.length]} from-30% to-90% ring-1 ring-black/5`;
    }
    return "bg-gradient-to-b from-neutral-50 to-neutral-100 ring-1 ring-black/5";
  };

  const raisedColor = () => {
    if (donoMatch()){
      return "text-white";
    }
    if (theme() === "dark") return "text-white";
    if (theme() === "rainbow") return "text-black";
    if (theme() === "blue") return "text-accent-600";
    return "text-primary-600";
  };

  const headerBackground = () => {
    if (donoMatch()) {
      if (theme() === "dark") return "bg-gradient-to-b from-white/30 to-white/10";
      if (theme() === "rainbow") return "bg-black";
      if (theme() === "blue") return "bg-accent-600";
      return "bg-primary-600";
    }
    return 'bg-transparent'
  }

  // Replaces campaignSurface while a donation match is active, so the whole card reads as highlighted.
  // The white ring keeps the filled card separated from the similarly coloured extension background.
  const donoMatchSurface = () => {
    if (theme() === "dark") return "bg-gradient-to-b from-primary-500 to-primary-700 ring-2 ring-white text-white";
    if (theme() === "rainbow") return "bg-black ring-2 ring-white text-white";
    if (theme() === "blue") return "bg-accent-600 ring-2 ring-white text-white";
    return "bg-primary-600 ring-2 ring-white text-white";
  }

  const twitchUrl = () => props.campaign.twitch?.url;

  const name = () => props.campaign.twitch?.name ?? props.campaign.tiltifyName

  const raised = () => {
    if (usd()) {
      return props.campaign.raised.usd
    }
    if (eur()) {
      return props.campaign.raised.euro
    }
    return props.campaign.raised.gbp
  }

  const twitchButtonColor = () => {
    if (theme() === 'dark') {
      return "bg-gradient-to-b from-gray-700 to-gray-800 text-white"
    }

    if (theme() === 'blue') {
      return "bg-primary-500 text-white"
    }

    return "bg-accent-500 text-white"
  }

  const isLive = () => props.campaign.twitch?.isLive ?? false;

  const raisedGoalPair = createMemo(() => {
    if (usd()) {
      return {raised: props.campaign.raised.usd, goal: props.campaign.goal.usd}
    }
    if (eur()) {
      return {raised: props.campaign.raised.euro, goal: props.campaign.goal.euro}
    }
    return {raised: props.campaign.raised.gbp, goal: props.campaign.goal.gbp}
  })

  // Same currency on both figures, or the percentage lies.
  const goalRatio = createMemo(() => {
    const pair = raisedGoalPair()
    if (!Number.isFinite(pair.raised) || !Number.isFinite(pair.goal) || pair.goal <= 0) return null;
    return Math.max(0, pair.raised / pair.goal);
  });

  const goalPercent = () => {
    const ratio = goalRatio();
    return ratio === null ? null : Math.round(ratio * 100);
  };

  // Off the un-rounded ratio: 99.6% rounds up to 100 but has not reached the goal.
  const reached = () => (goalRatio() ?? 0) >= 1;
  const progressFill = () => (theme() === "dark" ? "bg-primary-500" : "bg-primary-600");
  const progressTrack = () => (theme() === "dark" ? "bg-white/15" : "bg-black/10");

  return {
    campaign: props.campaign,
    index: props.i,
    cause: props.cause,
    campaignSurface,
    raisedColor,
    twitchUrl,
    name,
    raised,
    twitchButtonColor,
    isLive,
    headerBackground,
    donoMatchSurface,
    donoMatch,
    goalRatio,
    goalPercent,
    reached,
    progressFill,
    progressTrack,
  }
}

const CommunityListItemContext = createContext<ReturnType<typeof useCommunityListItemHook>>();

export const CommunityListItemProvider: ParentComponent<FundraiserItemProps> = (props) => {
  const hook = useCommunityListItemHook(props)
  return (
    <CommunityListItemContext.Provider value={hook}>
      {props.children}
    </CommunityListItemContext.Provider>
  );
}

export const useCommunityListItem = () => useContext(CommunityListItemContext)!
