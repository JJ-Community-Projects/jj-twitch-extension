import type { Component } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Select } from "@kobalte/core/select";
import { AiOutlineCheck } from "solid-icons/ai";
import { useCurrency } from "./providers/CurrencyProvider.tsx";
import { useTheme } from "./providers/ThemeProvider.tsx";
import {FaSolidChevronDown} from "solid-icons/fa";

// Refactored to use Kobalte's Select component with compact styling.
export const CurrencyToggleDropdown: Component = () => {
  const { currency, setCurrency } = useCurrency();
  const { tailwindBGPrimary } = useTheme();

  const options = ["GBP", "USD", "EUR"] as const;
  const labelFor = (code: (typeof options)[number]) => {
    switch (code) {
      case "GBP":
        return "£ GBP";
      case "USD":
        return "$ USD";
      case "EUR":
      default:
        return "€ EUR";
    }
  };

  const aria = () => `Select currency. Currently ${currency()}.`;

  return (
    <Select<("GBP" | "USD" | "EUR")>
      value={currency()}
      onChange={(v) => {
        if (v!==null) {
          setCurrency(v)
        }
      }}
      options={[...options]}
      itemComponent={(props) => (
        <Select.Item
          class={twMerge(
            "flex w-full flex-row items-center justify-between gap-2 px-2 py-1 text-white",
            "hover:cursor-pointer hover:bg-white/10"
          )}
          item={props.item}
        >
          <Select.ItemLabel class="text-xs">{labelFor(props.item.rawValue)}</Select.ItemLabel>
          <Select.ItemIndicator>
            <AiOutlineCheck size={12} />
          </Select.ItemIndicator>
        </Select.Item>
      )}
      class={twMerge("inline-flex items-center text-white")}
    >
      <Select.Trigger
        aria-label={aria()}
        title={aria()}
        class={twMerge(
          "inline-flex items-center justify-between text-white/95 text-[10px] leading-none",
          "rounded-md h-[18px] px-1 transition-all",
          "opacity-90 hover:opacity-100 hover:brightness-105",
          "focus:outline-none focus:ring-1 focus:ring-white/70",
          "shadow-sm",
          tailwindBGPrimary()
        )}
      >
        <Select.Value<("GBP" | "USD" | "EUR")>>{(state) => labelFor((state.selectedOption()) ?? currency())}</Select.Value>
        <Select.Icon class="pointer-events-none ml-2">
          <FaSolidChevronDown/>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="z-[60] rounded-md bg-black/80 shadow-lg backdrop-blur">
          <Select.Listbox class="flex min-w-[90px] flex-col gap-0.5 py-1" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
};
