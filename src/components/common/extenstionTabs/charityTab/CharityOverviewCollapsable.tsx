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
    return "bg-gradient-to-b from-neutral-50 to-neutral-100"
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
        <div class={"text-center text-xs"}>
          <div class={twMerge("flex h-full w-full flex-col gap-1 rounded-2xl shadow-xl p-1", bgColor())}>
            <Accordion.Root collapsible value={open()} onChange={setOpen}>
              <Accordion.Item value="overview">
                {/* Header: whole header acts as trigger, with left chevron and right currency toggle */}
                <Accordion.Header class="hover:brightness-105 relative h-12 w-full select-none p-1">
                  <Accordion.Trigger
                    class={twMerge(
                      "hover:brightness-105 group absolute inset-0 flex items-center justify-center rounded-2xl transition-colors",
                      theme() === "dark" ? "text-white hover:bg-white/10" : "text-gray-700 hover:scale-101"
                    )}
                    aria-label="Toggle charity overview"
                  >
                    {/* Left chevron icon */}
                    <div class="absolute left-0 top-0 m-2 flex h-8 w-8 items-center justify-center">
                      <FaSolidChevronDown class={twMerge(
                        "h-4 w-4 transition-transform rounded-full",
                        "group-data-[expanded]:-rotate-180 group-data-[closed]:-rotate-0",
                        chevronHoverColor()
                      )}/>
                    </div>

                    <div class={'left-0 top-1 absolute w-full h-full p-1'}>
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
                  </Accordion.Trigger>

                  {/* Keep currency toggle outside trigger so it's still clickable without toggling */}
                  <div id={"div2"} class={"absolute right-0 top-0 z-10 p-1"}>
                    <CurrencyToggleDropdown/>
                  </div>
                </Accordion.Header>

                {/* Body: animated open/close */}
                <Accordion.Content
                  class="jj-accordion__content">
                  <div class="overflow-hidden">
                    <div class={"grid grid-cols-2 gap-1 gap-y-2 pt-1"}>
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
                    <div class={"flex flex-1 items-end justify-center pt-2"}>
                      <p class={twMerge("text-xxs text-center", darkText())}>
                        Last update, {DateTime.fromJSDate(overview().date).toLocaleString(DateTime.DATETIME_MED)}
                      </p>
                    </div>
                    <Show when={config.data}>
                      {
                        (config) => {
                          return <Show when={config().donationTrackerUrl}>
                            {
                              (url) => {
                                return (
                                  <div class={twMerge("flex flex-1 items-end justify-center", darkText())}>
                                    <a class={'underline'} href={url()} target={'_blank'}>Live Donation Tracker</a>
                                  </div>
                                )
                              }
                            }
                          </Show>
                        }
                      }
                    </Show>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
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
        <div class={"text-center text-xs"}>
          <div class={twMerge("flex h-full w-full flex-col gap-1 rounded-2xl shadow-xl p-1", bgColor())}>
            <Accordion.Root collapsible value={open()} onChange={setOpen}>
              <Accordion.Item value="overview">
                {/* Header: whole header acts as trigger, with left chevron and right currency toggle */}
                <Accordion.Header class="relative h-12 w-full select-none p-1">
                  <Accordion.Trigger
                    class={twMerge(
                      "group absolute inset-0 flex items-center justify-center rounded-2xl transition-colors",
                      theme() === "dark" ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-black/5 hover:scale-101"
                    )}
                    aria-label="Toggle charity overview"
                  >
                    {/* Left chevron icon */}
                    <div class="absolute left-0 top-0 m-2 flex h-8 w-8 items-center justify-center">
                      <FaSolidChevronDown class={twMerge(
                        "h-4 w-4 transition-transform rounded-full",
                        "group-data-[expanded]:-rotate-180 group-data-[closed]:-rotate-0"
                      )}/>
                    </div>

                    <div class={'left-0 top-1 absolute w-full h-full p-1'}>
                      <CrossFade show={isOpen()}>
                        <BigCurrency values={overview().raised.total}
                                     text={`Raised in ${DateTime.fromJSDate(overview().date).year}`}/>
                      </CrossFade>
                      <CrossFade show={!isOpen()}>
                        <OverviewChanger overview={overview()}/>
                      </CrossFade>
                    </div>
                  </Accordion.Trigger>

                  {/* Keep currency toggle outside trigger so it's still clickable without toggling */}
                  <div id={"div2"} class={"absolute right-0 top-0 z-10 p-1"}>
                    <CurrencyToggleDropdown/>
                  </div>
                </Accordion.Header>

                {/* Body: animated open/close */}
                <Accordion.Content
                  class="jj-accordion__content">
                  <div class="overflow-hidden">
                    <div class={"grid grid-cols-2 gap-1 gap-y-2 pt-1"}>
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
                    <div class={"flex flex-1 items-end justify-center pt-1"}>
                      <p class={twMerge("text-xxs text-center", darkText())}>
                        Last update, {DateTime.fromJSDate(overview().date).toLocaleString(DateTime.DATETIME_MED)}
                      </p>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
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
    <div class="flex flex-col items-center justify-center">
      <p class={twMerge("relative text-base font-bold", raisedTextColor())}>
        <Currency values={props.values}/>
      </p>
      <p class={twMerge("text-xs", darkText())}>
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
      <p class={twMerge("text-xxs", darkText())}>
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
    <div class="flex flex-col items-center justify-center">
      <p class={twMerge("relative text-base font-bold", raisedTextColor())}>
        <Numeric value={props.value} numberStyle={"decimal"}/>
      </p>
      <p class={twMerge("text-xs", darkText())}>
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
      <p class={twMerge("text-xxs", darkText())}>{props.text}</p>
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
