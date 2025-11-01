import {type Component, Show} from "solid-js";
import { twMerge } from "tailwind-merge";
import { Numeric } from "solid-i18n";
import { useCurrency } from "../../providers/CurrencyProvider.tsx";
import { useTheme } from "../../providers/ThemeProvider.tsx";
import type { JJCause } from "../../../../api";
import { FaSolidArrowUpRightFromSquare } from "solid-icons/fa";
import {TiltifyIcon} from "../../icons/JJIcons.tsx";

interface CharityListItemAltProps {
  charity: JJCause;
  i: number;
}

// Alternative charity list item with subtle surface treatment and clear link affordances
export const CharityListItemAlt: Component<CharityListItemAltProps> = (props) => {
  const { charity, i } = props;

  const { currency } = useCurrency();
  const { theme, tailwindTextPrimary } = useTheme();

  const gradient = [
    "bg-gradient-to-br from-red-200 to-red-400",
    "bg-gradient-to-br from-orange-200 to-orange-400",
    "bg-gradient-to-br from-yellow-200 to-yellow-400",
    "bg-gradient-to-br from-green-200 to-green-400",
    "bg-gradient-to-br from-cyan-200 to-cyan-400",
    "bg-gradient-to-br from-blue-200 to-blue-400",
    "bg-gradient-to-br from-purple-200 to-purple-400",
  ];

  const campaignSurface = (idx: number) => {
    if (theme() === "dark") return "bg-white/5 ring-1 ring-white/10 text-white backdrop-blur-sm";
    if (theme() === "rainbow") return `${gradient[idx % gradient.length]} from-30% to-90% ring-1 ring-black/5`;
    return "bg-neutral-50 ring-1 ring-black/5";
  };

  const raisedColor = () => {
    if (theme() === "dark") return "text-white";
    if (theme() === "rainbow") return "text-black";
    if (theme() === "blue") return "text-accent-600";
    if (theme() === "red") return "text-primary-600";
    return tailwindTextPrimary();
  };

  const value = () => {
    switch (currency()) {
      case "USD":
        return charity.raised.fundraisers.usd
      case "EUR":
        return charity.raised.fundraisers.euro
    }
    return charity.raised.fundraisers.gbp
  }

  const name = () => (charity.name.length > 48 ? charity.name.substring(0, 48) + "…" : charity.name);

  return (
    <div
      class={twMerge(
        "w-full rounded-2xl shadow-sm hover:shadow-md transition-all duration-200",
        "hover:brightness-101 hover:scale-101 active:brightness-[0.98]",
        campaignSurface(i)
      )}
    >
      <div class={"flex h-full w-full flex-col gap-2 p-2.5"}>
        {/* Header */}
        <div class={"flex flex-row items-start h-full gap-2"}>
          <img
            class={"size-8 rounded-lg ring-1 ring-black/10 dark:ring-white/10"}
            alt={charity.name}
            src={charity.logo}
            loading={"lazy"}
          />
          <div class={"min-w-0 flex-1 h-full"}>
            <p class={"truncate text-ellipsis text-sm font-semibold"}>{name()}</p>
          </div>
          <div class={twMerge("flex flex-col items-end text-xs font-bold", raisedColor())}>
            <p>Raised</p>
            <Numeric value={value()} numberStyle="currency" currency={currency()} />
          </div>
        </div>
        <p class={"line-clamp-2 text-xxs opacity-90"}>{charity.description}</p>


        {/* Actions */}
        <div class={"flex gap-2"}>
          <a
            target={"_blank"}
            href={props.charity.donateUrl}
            class={twMerge(
              "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-1.5",
              "bg-primary-500 text-white",
              "transition-all duration-200 hover:brightness-105 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10"
            )}
          >
            <span class={"text-xxs"}>Donate</span>
            <TiltifyIcon class={'size-3'}/>
          </a>
            <a
              target={"_blank"}
              href={props.charity.url}
              class={twMerge(
                "inline-flex items-center justify-center gap-1 rounded-xl px-3 py-1.5",
                "bg-accent-500 text-white",
                "transition-all duration-200 hover:brightness-105 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10"
              )}
            >
              <span class={"text-xxs"}>Website</span>
              <FaSolidArrowUpRightFromSquare size={10} />
            </a>
        </div>
      </div>
    </div>
  );
};
