import {type Component, Show} from "solid-js";
import type {JJCampaign} from "../../../../api";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {Numeric} from "solid-i18n";
import {FaBrandsTwitch, FaSolidArrowUpRightFromSquare} from "solid-icons/fa";
import {useCurrency} from "../../providers/CurrencyProvider.tsx";
import {TiltifyIcon} from "../../icons/JJIcons.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";

interface FundraiserItemProps {
  i: number
  campaign: JJCampaign
}

export const CommunityListItem: Component<FundraiserItemProps> = (props) => {

  const {theme, tailwindTextPrimary} = useTheme()

  const raisedColor = () => {
    if (theme() === 'rainbow') {
      return 'text-black'
    } else if (theme() === 'dark') {
      return 'text-white'
    }
    return tailwindTextPrimary()
  }

  const gradient = [
    'bg-gradient-to-br from-red-200 to-red-400',
    'bg-gradient-to-br from-orange-200 to-orange-400',
    'bg-gradient-to-br from-yellow-200 to-yellow-400',
    'bg-gradient-to-br from-green-200 to-green-400',
    'bg-gradient-to-br from-cyan-200 to-cyan-400',
    'bg-gradient-to-br from-blue-200 to-blue-400',
    'bg-gradient-to-br from-purple-200 to-purple-400',
  ]
  const img = () => props.campaign.twitch?.avatar ?? props.campaign.avatar


  const isLive = () => {
    if (props.campaign.twitch) {
      return props.campaign.twitch.isLive
    }
    return false
  }

  const name = () => {
    return props.campaign.twitch?.name ?? props.campaign.tiltifyName
  }

  const campaignColor = (i: number) => {
    if (theme() === 'rainbow') {
      return gradient[i % gradient.length]
    } else if (theme() === 'dark') {
      return 'bg-gray-500 text-white'
    }
    return 'bg-gradient-to-br from-white to-gray-100'
  }

  return (
    <div class={twMerge('min-h-24 w-full rounded-2xl shadow-xl', campaignColor(props.i))}>
      <div class={'flex h-full w-full flex-col items-start gap-2 p-1.5'}>
        <div class={'flex h-full flex-1 flex-col gap-1'}>
          <div class={'flex flex-row gap-1'}>
            <img class={'h-8 w-8 rounded-lg'} alt={props.campaign.campaignName} src={img()} loading={'lazy'}/>
            <div class={'flex h-full flex-1 min-w-0 flex-col justify-between'}>
              <div class={'flex max-h-[14px] flex-row items-center gap-1 overflow-hidden'}>
                <Show when={isLive()}>
                  <Live/>
                </Show>
                <p class={'truncate text-ellipsis text-sm font-bold min-w-0 flex-1'}>{props.campaign.campaignName}</p>
              </div>
              <p class={'truncate text-ellipsis text-xs font-bold min-w-0'}>{name()}</p>
            </div>
          </div>
          <p class={'line-clamp-2 w-full text-ellipsis text-xs'}>{props.campaign.tiltifyDescription}</p>
          <p class={twMerge('text-primary text-xs font-bold', raisedColor())}>
            Raised <Numeric value={props.campaign.raised.gbp} numberStyle="currency" currency={'GBP'}/>
          </p>
        </div>

        <div class={'flex flex-row gap-2'}>
          <a target={'_blank'} href={props.campaign.tiltifyUrl}
             class={'transition-all hover:scale-101 hover:brightness-105 text-white gap-1 rounded-full bg-tiltify-500 p-1 flex flex-row items-center justify-center'}>
            <span class={'text-xxs'}>Donate</span> <FaSolidArrowUpRightFromSquare size={8}/>
          </a>
          <Show when={props.campaign.twitch?.url}>
            <a target={'_blank'} href={props.campaign.twitch?.url}
               class={'transition-all hover:scale-101 hover:brightness-105 text-white gap-1 rounded-full bg-twitch-500 p-1 flex flex-row items-center justify-center'}>
              <span class={'text-xxs'}>Twitch</span> <FaSolidArrowUpRightFromSquare size={8}/>
            </a>
          </Show>
        </div>
      </div>
    </div>
  )
}

const Live = () => {
  return (
    <div class={'relative flex h-3 items-center justify-center'}>
      <p class={'bg-twitch-500 rounded p-0.5 text-[6px] text-white'}>LIVE</p>
    </div>
  )
}


export const CommunityListItemAlt: Component<{ i: number; campaign: JJCampaign }> = (props) => {
  const { theme } = useTheme();
  const {eur, currency, usd} = useCurrency()

  const gradient = [
    "bg-gradient-to-b from-red-200 to-red-400",
    "bg-gradient-to-b from-orange-200 to-orange-400",
    "bg-gradient-to-b from-yellow-200 to-yellow-400",
    "bg-gradient-to-b from-green-200 to-green-400",
    "bg-gradient-to-b from-cyan-200 to-cyan-400",
    "bg-gradient-to-b from-blue-200 to-blue-400",
    "bg-gradient-to-b from-purple-200 to-purple-400",
  ];

  const campaignSurface = (idx: number) => {
    if (theme() === "dark") {
      return "bg-gradient-to-b from-white/30 to-white/10 ring-1 ring-white/10 text-white backdrop-blur-sm";
    }
    if (theme() === "rainbow") {
      return `${gradient[idx % gradient.length]} from-30% to-90% ring-1 ring-black/5`;
    }
    return "bg-gradient-to-b from-neutral-50 to-neutral-100 ring-1 ring-black/5";
  };

  const raisedColor = () => {
    if (theme() === "dark") return "text-white";
    if (theme() === "rainbow") return "text-black";
    if (theme() === "blue") return "text-accent-600";
    return "text-primary-600";
  };

  const twitchUrl = () => props.campaign.twitch?.url;
  const isLive = () => props.campaign.twitch?.isLive ?? false;

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

  return (
    <div
      class={twMerge(
        "w-full rounded-2xl shadow-sm hover:shadow-md transition-all duration-200",
        "hover:brightness-105 hover:scale-101",
        campaignSurface(props.i)
      )}
    >
      <div class={"flex h-full w-full flex-col gap-2 p-2.5"}>
        {/* Header */}
        <div class={"flex items-start gap-2"}>
            <img
              class={"size-8 rounded-lg ring-1 ring-black/10 dark:ring-white/10"}
              alt={props.campaign.campaignName}
              src={props.campaign.twitch?.avatar??props.campaign.avatar}
              loading={"lazy"}
            />
          <div class={"min-w-0 flex-1"}>
            <div class={"flex flex-row gap-1 items-center"}>
              <Show when={isLive()}>
                <div class={"rounded-full bg-red-500 px-1.5 text-center justify-center items-center py-0.5 shadow text-[8px] text-white"}>
                  LIVE
                </div>
              </Show>
              <p class={"truncate text-ellipsis text-sm font-semibold"}>
                {name()}</p>
            </div>
            <Show when={props.campaign.campaignName}>
              {(d) => <p class={"truncate text-ellipsis text-[11px] opacity-80"}>{d()}</p>}
            </Show>
          </div>
          <div class={twMerge("flex flex-col items-end text-xs font-bold", raisedColor())}>
            <p>Raised</p>
            <Numeric value={raised()} numberStyle="currency" currency={currency()} />
          </div>
        </div>

        {/* Description (second line clamp to ensure fit) */}
        <Show when={props.campaign.tiltifyDescription}>
          {(d) => <p class={"line-clamp-2 text-xxs opacity-90"}>{d()}</p>}
        </Show>

        {/* Actions */}
        <div class={"flex gap-2"}>
          <Show when={twitchUrl()}>
            <a
              target={"_blank"}
              href={twitchUrl()!}
              class={twMerge(
                "inline-flex items-center justify-center gap-1 rounded-xl px-3 py-1.5",
               twitchButtonColor(),
                "transition-all duration-200 hover:brightness-105 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10"
              )}
            >
              <span class={"text-xxs"}>Twitch</span>
              <FaBrandsTwitch size={12} />
            </a>
          </Show>
        </div>
      </div>
    </div>
  );
};
