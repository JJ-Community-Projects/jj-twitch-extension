import {type Component, Show} from "solid-js";
import {twMerge} from "tailwind-merge";
import {Numeric} from "solid-i18n";
import {useCurrency} from "../../providers/CurrencyProvider.tsx";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import type {JJCause} from "../../../../api";
import {Accordion} from "@kobalte/core";
import {FaSolidChevronDown} from "solid-icons/fa";
import "./CharityOverviewCollapsable.css";

interface CharityListItemAltProps {
  charity: JJCause;
  i: number;
}

// Alternative charity list item with subtle surface treatment and clear link affordances
export const CharityListItemAlt: Component<CharityListItemAltProps> = (props) => {
  const {charity, i} = props;

  const {currency} = useCurrency();
  const {theme, tailwindTextPrimary} = useTheme();

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
    if (theme() === "red") return "text-primary-600";
    return tailwindTextPrimary();
  };

  const value = () => {
    switch (currency()) {
      case "USD":
        return charity.raised.usd
      case "EUR":
        return charity.raised.euro
    }
    return charity.raised.gbp
  }

  const name = () => (charity.name.length > 48 ? charity.name.substring(0, 48) + "…" : charity.name);

  return (
    <div
      class={twMerge(
        "w-full self-start rounded-2xl shadow-sm hover:shadow-md transition-all duration-200",
        "hover:brightness-105 hover:scale-101 active:brightness-[0.98] hover:shadow-lg",
        campaignSurface(i)
      )}
    >
      <Accordion.Root collapsible class={"h-full w-full p-2"}>
        <Accordion.Item value="charity">
          <Accordion.Header>
            <Accordion.Trigger
              class={"group flex w-full flex-row items-center gap-2 text-left"}
              aria-label={`Toggle ${charity.name} details`}
            >
              <img
                class={twMerge(
                  "size-6 rounded-lg ring-1 ring-black/10 dark:ring-white/10 transition-all duration-200",
                  "group-data-[expanded]:size-8"
                )}
                alt={charity.name}
                src={charity.logo}
                loading={"lazy"}
              />
              <div class={"min-w-0 flex-1"}>
                <p class={"truncate text-ellipsis text-xs font-semibold transition-all duration-200 group-data-[expanded]:text-sm"}>
                  {name()}
                </p>
              </div>
              <div class={twMerge("flex flex-row items-center gap-2", raisedColor())}>
                <div class={"flex flex-col items-end text-xxs font-bold transition-all duration-200 group-data-[expanded]:text-xs"}>
                  <p>Raised</p>
                  <Numeric value={value()} numberStyle="currency" currency={currency()}/>
                </div>
                <FaSolidChevronDown class={twMerge(
                  "h-3 w-3 shrink-0 transition-transform",
                  "group-data-[expanded]:-rotate-180 group-data-[closed]:-rotate-0"
                )}/>
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class="jj-accordion__content">
            <p class={"line-clamp-3 pt-2 text-xxs opacity-90"}>{charity.description}</p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};
