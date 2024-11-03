import {type Component, Show} from "solid-js";
import {FaSolidHeart, FaSolidInfo, FaSolidPeopleGroup} from "solid-icons/fa";
import {YogsIcon} from "../common/icons/YogsIcon.tsx";
import {Tooltip} from "@kobalte/core/tooltip";
import './OverlaySideNav.css'
import {useOverlay} from "../common/providers/OverlayProvider.tsx";
import {twMerge} from "tailwind-merge";
import {useOverlayConfig, useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";

export const OverlaySideNav: Component = () => {
  const config = useOverlayConfig()
  const twitchConfig = useTwitchOverlayConfig()
  const {theme, tailwindBGPrimary} = useTheme()
  const {
    toggleAboutJJ,
    toggleCharities,
    toggleCommunity,
    toggleSchedule,
    toggleAbout,
    jj,
    charities,
    community,
    schedule,
    about
  } = useOverlay()

  const buttonColor = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'bg-accent-500'
      case 'dark':
        return 'bg-grey-800'
      default:
        return 'bg-primary-500'
    }
  }
  const buttonBorderColor = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'border-accent-500'
      case 'dark':
        return 'border-grey-800'
      default:
        return 'border-primary-500'
    }
  }
  const buttonBorderHoverColor = () => {
    switch (theme()) {
      case 'blue':
      case 'blue_light':
        return 'border-primary-50'
      case 'dark':
        return 'border-grey-800'
      default:
        return 'border-border-50'
    }
  }

  return (
    <div class={'flex flex-col h-full w-12 py-20 gap-4 justify-center items-center'}>
      <Tooltip placement={'right'}>
        <Tooltip.Trigger
          onClick={toggleAboutJJ}
          class={
            twMerge('hover:scale-105 border-4 transition-all aspect-square rounded-2xl shadow-xl p-2 items-center justify-center flex flex-col',
              buttonColor(),
              jj() ? 'scale-105' : '',
              jj() ? buttonBorderHoverColor(): buttonBorderColor()
            )
          }>
          <p class={'text-white text-xl italic'}>JJ</p>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="tooltip__content flex flex-row bg-accent-500 text-white p-2 rounded">
            <Tooltip.Arrow/>
            <p class={'text-white'}>The Jingle Jam</p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>

      <Tooltip placement={'right'}>
        <Tooltip.Trigger
          onClick={toggleCharities}
          class={
            twMerge('hover:scale-105 border-4 transition-all aspect-square rounded-2xl shadow-xl p-2 items-center justify-center flex flex-col',
              buttonColor(),
              charities() ? 'scale-105' : '',
              charities() ? buttonBorderHoverColor(): buttonBorderColor()
            )
          }>
          <FaSolidHeart class={'text-white'} size={24}/>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="tooltip__content flex flex-row bg-accent-500 text-white p-2 rounded">
            <Tooltip.Arrow/>
            <p class={'text-white'}>The Charities</p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>

      <Show when={config.showFundraiser && twitchConfig.showCommunityFundraiser}>
        <Tooltip placement={'right'}>
          <Tooltip.Trigger
            onClick={toggleCommunity}
            class={
              twMerge('hover:scale-105 border-4 transition-all aspect-square rounded-2xl shadow-xl p-2 items-center justify-center flex flex-col',
                buttonColor(),
                community() ? 'scale-105' : '',
                community() ? buttonBorderHoverColor(): buttonBorderColor()
              )
            }>
            <FaSolidPeopleGroup class={'text-white'} size={24}/>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content class="tooltip__content flex flex-row bg-accent-500 text-white p-2 rounded">
              <Tooltip.Arrow/>
              <p class={'text-white'}>The Community Fundraisers</p>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>

      </Show>
      <Show when={config.showYogsSchedule && twitchConfig.showYogsSchedule}>
        <Tooltip placement={'right'}>
          <Tooltip.Trigger
            onClick={toggleSchedule}
            class={
              twMerge('hover:scale-105 border-4 transition-all aspect-square rounded-2xl shadow-xl p-2 items-center justify-center flex flex-col',
                buttonColor(),
                schedule() ? 'scale-105' : '',
                schedule() ? buttonBorderHoverColor(): buttonBorderColor()
              )
            }
          >
            <YogsIcon size={24}/>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content class="tooltip__content flex flex-row bg-accent-500 text-white p-2 rounded">
              <Tooltip.Arrow/>
              <p class={'text-white'}>The Yogscast Jingle Jam Schedule</p>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>
      </Show>
      <div class={'flex-1'}/>

      <Tooltip placement={'right'}>
        <Tooltip.Trigger
          onClick={toggleAbout}
          class={
            twMerge('w-10 h-10 hover:scale-105 border-4 transition-all aspect-square rounded-2xl shadow-xl p-2 items-center justify-center flex flex-col',
              buttonColor(),
              about() ? 'scale-105' : '',
              about() ? buttonBorderHoverColor(): buttonBorderColor()
            )
          }>
          <FaSolidInfo class={'text-white'} size={18}/>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="tooltip__content flex flex-row bg-accent-500 text-white p-2 rounded">
            <Tooltip.Arrow/>
            <p class={'text-white'}>About</p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
    </div>
  );
}


const NavButton = () => {

}
