import {type Component, createMemo, createSignal, For, onCleanup, Show} from "solid-js";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import {twMerge} from "tailwind-merge";
import {DateTime} from "luxon";
import {Numeric} from "solid-i18n";
import {useCurrency} from "../../providers/CurrencyProvider.tsx";
import {useBackend} from "../../providers/BackendProvider.tsx";
import {Accordion} from '@kobalte/core';
import {FaSolidChevronDown} from "solid-icons/fa";
import "./CharityOverviewCollapsable.css";
import type {CurrenciesSchema, OverviewSchema} from "../../../../api";
import {CrossFade} from "../../CrossFade.tsx";
import {CurrencyToggleDropdown} from "../../CurrencyToggleDropdown.tsx";
import {useOverlayBackend} from "../../providers/OverlayBackendProvider.tsx";

// A collapsable version of CharityOverview. When closed, only shows total raised and the currency toggle.
// When opened, it renders the same details as CharityOverview.
export const CharityOverviewCollapsable: Component = () => {
  const {overview, config} = useBackend();


  const {theme} = useTheme();
  const darkText = () => (theme() === "dark" ? "text-white" : "");
  const bgColor = () => {
    if (theme() === 'dark') {
      return "bg-gradient-to-b from-white/30 to-white/10 ring-1 ring-white/10 text-white backdrop-blur-sm";
    }
    return "bg-gradient-to-b from-neutral-50 to-neutral-100 ring-1 ring-black/5"
  }

  const [open, setOpen] = createSignal<string[]>([])

  const isOpen = () => open().includes("overview");

  const chevronHoverColor = () => {
    if (theme() === 'dark') {
      return 'group-hover:text-primary-50'
    }

    if (theme() === 'blue') {
      return 'group-hover:text-accent-700'
    }

    return 'group-hover:text-primary-700'
  }

  return (
    <Show when={overview.data}>
      {(overview) => (
        <div class={twMerge("w-full rounded-2xl p-2 text-xs shadow-sm transition-all duration-200 hover:brightness-105", bgColor())}>
          <Accordion.Root collapsible value={open()} onChange={setOpen}>
            <Accordion.Item value="overview">
              {/* Header: whole row is the trigger with the chevron on the right edge, matching the list items */}
              <Accordion.Header class="relative w-full select-none">
                <Accordion.Trigger
                  class={twMerge(
                    "group flex w-full flex-row items-center gap-2 text-left",
                    theme() === "dark" ? "text-white" : "text-gray-700"
                  )}
                  aria-label="Toggle charity overview"
                >
                  {/* pr-16 keeps the rotating text clear of the currency toggle */}
                  <div class={"relative h-8 min-w-0 flex-1 pr-16"}>
                    <CrossFade show={isOpen()}>
                      <BigCurrency
                        values={overview().raised.total}
                        text={`Raised in ${DateTime.fromJSDate(overview().date).year}`}
                        // text={`Raised in 2024`}
                      />
                    </CrossFade>
                    <CrossFade show={!isOpen()}>
                      <OverviewChanger overview={overview()}/>
                    </CrossFade>
                  </div>
                  <FaSolidChevronDown class={twMerge(
                    "h-3 w-3 shrink-0 transition-transform",
                    "group-data-[expanded]:-rotate-180 group-data-[closed]:-rotate-0",
                    chevronHoverColor()
                  )}/>
                </Accordion.Trigger>

                {/* Keep currency toggle outside trigger so it's still clickable without toggling */}
                <div class={"absolute right-5 top-1/2 z-10 -translate-y-1/2"}>
                  <CurrencyToggleDropdown/>
                </div>
              </Accordion.Header>

              {/* Body: animated open/close */}
              <Accordion.Content
                class="jj-accordion__content">
                <div class="overflow-hidden">
                  <div class={"grid grid-cols-2 gap-2 pt-2"}>
                    <Show when={overview().raised.yogscast}>
                      {
                        (c) => {
                          return <SmallCurrency values={c()} text={"Raised by the Yogscast"}/>

                        }
                      }
                    </Show>
                    <Show when={overview().raised.fundraisers}>
                      {
                        (c) => {
                          return <SmallCurrency values={c()} text={"Raised by Fundraisers"}/>
                        }
                      }
                    </Show>
                    <SmallValue value={overview().collections.redeemed} text={'Collections'}/>
                    <SmallValue value={overview().collections.total - overview().collections.redeemed}
                                text={'Collections Available'}/>
                  </div>
                  <div class={twMerge("flex flex-col items-start gap-0.5 pt-2 text-xxs opacity-80", darkText())}>
                    <p>
                      Last update, {DateTime.fromJSDate(overview().date).toLocaleString(DateTime.DATETIME_MED)}
                    </p>
                    <Show when={config.data}>
                      {
                        (config) => {
                          return <Show when={config().donationTrackerUrl}>
                            {
                              (url) => {
                                return (
                                  <a class={'underline'} href={url()} target={'_blank'}>Live Donation Tracker</a>
                                )
                              }
                            }
                          </Show>
                        }
                      }
                    </Show>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>)}
    </Show>
  );
};
export const OverlayCharityOverviewCollapsable: Component = () => {
  const {overview} = useOverlayBackend();


  const {theme} = useTheme();
  const darkText = () => (theme() === "dark" ? "text-white" : "");
  const bgColor = () => (theme() === "dark" ? "bg-gradient-to-br from-gray-500 to-gray-600" : "bg-gradient-to-br from-white to-gray-100");

  const [open, setOpen] = createSignal<string[]>([])

  const isOpen = () => open().includes("overview");

  return (
    <Show when={overview.data}>
      {(overview) => (
        <div class={twMerge("w-full rounded-2xl p-2 text-xs shadow-sm", bgColor())}>
          <Accordion.Root collapsible value={open()} onChange={setOpen}>
            <Accordion.Item value="overview">
              {/* Header: whole row is the trigger with the chevron on the right edge, matching the list items */}
              <Accordion.Header class="relative w-full select-none">
                <Accordion.Trigger
                  class={twMerge(
                    "group flex w-full flex-row items-center gap-2 text-left",
                    theme() === "dark" ? "text-white" : "text-gray-700"
                  )}
                  aria-label="Toggle charity overview"
                >
                  {/* pr-16 keeps the rotating text clear of the currency toggle */}
                  <div class={"relative h-8 min-w-0 flex-1 pr-16"}>
                    <CrossFade show={isOpen()}>
                      <BigCurrency values={overview().raised.total}
                                   text={`Raised in ${DateTime.fromJSDate(overview().date).year}`}/>
                    </CrossFade>
                    <CrossFade show={!isOpen()}>
                      <OverviewChanger overview={overview()}/>
                    </CrossFade>
                  </div>
                  <FaSolidChevronDown class={twMerge(
                    "h-3 w-3 shrink-0 transition-transform",
                    "group-data-[expanded]:-rotate-180 group-data-[closed]:-rotate-0"
                  )}/>
                </Accordion.Trigger>

                {/* Keep currency toggle outside trigger so it's still clickable without toggling */}
                <div class={"absolute right-5 top-1/2 z-10 -translate-y-1/2"}>
                  <CurrencyToggleDropdown/>
                </div>
              </Accordion.Header>

              {/* Body: animated open/close */}
              <Accordion.Content
                class="jj-accordion__content">
                <div class="overflow-hidden">
                  <div class={"grid grid-cols-2 gap-2 pt-2"}>
                    <Show when={overview().raised.yogscast}>
                      {
                        (c) => {
                          return <SmallCurrency values={c()} text={"Raised by the Yogscast"}/>

                        }
                      }
                    </Show>
                    <Show when={overview().raised.fundraisers}>
                      {
                        (c) => {
                          return <SmallCurrency values={c()} text={"Raised by Fundraisers"}/>
                        }
                      }
                    </Show>
                    <SmallValue value={overview().collections.redeemed} text={'Collections'}/>
                    <SmallValue value={overview().collections.total - overview().collections.redeemed}
                                text={'Collections Available'}/>
                  </div>
                  <p class={twMerge("pt-2 text-xxs opacity-80", darkText())}>
                    Last update, {DateTime.fromJSDate(overview().date).toLocaleString(DateTime.DATETIME_MED)}
                  </p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>)}
    </Show>
  );
};

const OverviewChanger: Component<{ overview: OverviewSchema }> = (props) => {
  const [v, setV] = createSignal<number>(0);

  // Build slides dynamically depending on optional fields
  const slides = createMemo(() => {
    const s: Array<
      | { kind: "currency"; values: CurrenciesSchema; text: string }
      | { kind: "value"; value: number; text: string }
    > = [];

    // Only push these if present
    if (props.overview.raised.fundraisers) {
      s.push({ kind: "currency", values: props.overview.raised.fundraisers, text: "Raised by Fundraisers" });
    }
    if (props.overview.raised.yogscast) {
      s.push({ kind: "currency", values: props.overview.raised.yogscast, text: "Raised by the Yogscast" });
    }

    // Always include these
    s.push({
      kind: "currency",
      values: props.overview.raised.total,
      text: `Raised in ${DateTime.fromJSDate(props.overview.date).year}`
      // text: `Raised in 2024`
    });
    s.push({ kind: "value", value: props.overview.collections.redeemed, text: "Collections" });
    s.push({ kind: "value", value: props.overview.collections.total - props.overview.collections.redeemed, text: "Collections Available" });

    return s;
  });

  const t = setInterval(() => {
    const len = slides().length || 1; // safety, though slides is never empty due to fallbacks
    setV((i) => (i + 1) % len);
  }, 8000);

  onCleanup(() => {
    clearInterval(t);
  });

  return (
    <>
      <For each={slides()}>
        {(s, i) => (
          <CrossFade show={v() === i()}>
            {s.kind === "currency" ? (
              <BigCurrency values={s.values} text={s.text} />
            ) : (
              <BigValue value={s.value} text={s.text} />
            )}
          </CrossFade>
        )}
      </For>
    </>
  );
};

const BigCurrency: Component<{ values: CurrenciesSchema, text: string }> = (props) => {
  const {tailwindTextPrimaryDark, theme} = useTheme();
  const raisedTextColor = () => (theme() === "dark" ? "text-white" : tailwindTextPrimaryDark());
  const darkText = () => (theme() === "dark" ? "text-white" : "");
  return (
    <div class="flex flex-col items-start justify-center">
      <p class={twMerge("relative text-sm font-bold", raisedTextColor())}>
        <Currency values={props.values}/>
      </p>
      <p class={twMerge("text-xxs opacity-80", darkText())}>
        {props.text}
      </p>
    </div>
  )
}

const SmallCurrency: Component<{ values: CurrenciesSchema, text: string }> = (props) => {
  const {tailwindTextPrimaryDark, theme} = useTheme();
  const raisedTextColor = () => (theme() === "dark" ? "text-white" : tailwindTextPrimaryDark());
  const darkText = () => (theme() === "dark" ? "text-white" : "");
  return (
    <div>
      <p class={twMerge("text-xs font-bold", raisedTextColor())}>
        <Currency values={props.values}/>
      </p>
      <p class={twMerge("text-xxs opacity-80", darkText())}>
        {props.text}
      </p>
    </div>
  )
}

const BigValue: Component<{ value: number, text: string }> = (props) => {
  const {tailwindTextPrimaryDark, theme} = useTheme();
  const raisedTextColor = () => (theme() === "dark" ? "text-white" : tailwindTextPrimaryDark());
  const darkText = () => (theme() === "dark" ? "text-white" : "");
  return (
    <div class="flex flex-col items-start justify-center">
      <p class={twMerge("relative text-sm font-bold", raisedTextColor())}>
        <Numeric value={props.value} numberStyle={"decimal"}/>
      </p>
      <p class={twMerge("text-xxs opacity-80", darkText())}>
        {props.text}
      </p>
    </div>
  )
}

const SmallValue: Component<{ value: number, text: string }> = (props) => {
  const {tailwindTextPrimaryDark, theme} = useTheme();
  const raisedTextColor = () => (theme() === "dark" ? "text-white" : tailwindTextPrimaryDark());
  const darkText = () => (theme() === "dark" ? "text-white" : "");
  return (
    <div>
      <p class={twMerge("text-xs font-bold", raisedTextColor())}>
        <Numeric value={props.value} numberStyle={"decimal"}/>
      </p>
      <p class={twMerge("text-xxs opacity-80", darkText())}>{props.text}</p>
    </div>
  )
}

const Currency: Component<{ values: CurrenciesSchema }> = (props) => {
  const {pounds, usd, eur} = useCurrency()
  return (
    <>
      <Show when={usd()}>
        <div id={'usd'}>
          <Numeric value={props.values.usd} numberStyle="currency" currency={'USD'}/>
        </div>
      </Show>
      <Show when={pounds()}>
        <div id={'gbp'}>
          <Numeric value={props.values.gbp} numberStyle="currency" currency={'GBP'}/>
        </div>
      </Show>
      <Show when={eur()}>
        <div id={'eur'}>
          <Numeric value={props.values.euro} numberStyle="currency" currency={'EUR'}/>
        </div>
      </Show>
    </>
  )
};
