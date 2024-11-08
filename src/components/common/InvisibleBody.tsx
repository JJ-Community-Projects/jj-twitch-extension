import {type ParentComponent, Show } from 'solid-js'
import { twMerge } from 'tailwind-merge'
import {useTheme} from "./providers/ThemeProvider.tsx";
import {useIsJJ, useJJStartCountdown, useNextJJStartDate} from "../../lib/useJJDates.ts";

interface InvisibleBodyProps {
  text: string
}

export const InvisibleBody: ParentComponent<InvisibleBodyProps> = props => {
  const { theme } = useTheme()
  const nextJJStartDate = useNextJJStartDate()
  const jjCountdown = useJJStartCountdown()
  const isJJ = useIsJJ()
  return (
    <div class={'p-1'}>
      <div
        class={twMerge(
          'mx-auto flex w-fit flex-col items-center p-1 text-center text-base text-white md:w-[50%] md:text-2xl',
          theme() === 'rainbow' ? 'rounded-2xl bg-gray-500/50' : '',
        )}
      >
        <Show when={!isJJ()}>
          <p class={'p-1 text-2xl font-bold'}>Jingle Jam Countdown</p>
          <p class={'text-xl md:text-3xl'}>{nextJJStartDate().toLocal().toFormat('DDDD')}</p>
          <p class={'text-xl md:text-3xl'}>{nextJJStartDate().toLocal().toFormat('ttt')}</p>
          <p class={''}>{nextJJStartDate().toFormat('DDDD')}</p>
          <p class={''}>{nextJJStartDate().toFormat('ttt')}</p>
          <div class={'flex flex-col items-center p-1 text-white md:p-4'}>
            <p class={'text-2xl md:text-4xl'}>Jingle Jam {nextJJStartDate().year} starts in</p>
            <p class={'font-mono text-2xl md:text-4xl'}>{jjCountdown().toFormat("dd'd' hh'h' mm'm' ss's'")}</p>
          </div>
        </Show>
        <p>{props.text}</p>
        {props.children}
      </div>
    </div>
  )
}
