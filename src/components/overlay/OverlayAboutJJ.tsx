import {type Component} from "solid-js";
import {twMerge} from "tailwind-merge";
import {
  DiscordIcon,
  GithubIcon,
  GlobeIcon,
  InstagramIcon,
  TiktokIcon,
  TwitchIcon,
  TwitterIcon
} from "../common/icons/JJIcons.tsx";
import {useOverlayConfig, useTwitchOverlayConfig} from "../common/providers/OverlayConfigProvider.tsx";
import {useTheme} from "../common/providers/ThemeProvider.tsx";


export const OverlayAboutJJ: Component = (props) => {
  const config = useOverlayConfig()
  const twitchConfig = useTwitchOverlayConfig()
  const {theme, tailwindBGPrimary} = useTheme()


  const url = () => {
    if (!twitchConfig.donationUrl || twitchConfig.donationUrl === '' || config.donationLink.overrideCustomLink) {
      return config.donationLink.url
    }
    return twitchConfig.donationUrl
  }



  return (
    <div class={twMerge(
      'text-white flex flex-col rounded-2xl shadow-xl items-center gap-2 p-4',
      tailwindBGPrimary(),
    )}>
      <p class={'~text-xl/2xl text-center'}>Welcome to the Jingle Jam</p>
      <span class={'text-center ~text-xs/base'}>
        <p>Jingle Jam is a registered charity in England and Wales (1200061).</p>
        <p>The Jingle Jam fundraising event is organised by Jingle Jam Promotions on behalf of
          Jingle Jam to raise funds
          for our charity partners.</p>
      </span>
      <a
        class={'~text-xs/base bg-gradient-to-br from-accent-400 to-accent-500 hover:scale-102 flex w-full flex-row items-center justify-center rounded-2xl p-0.5 text-center text-white shadow-xl transition-all hover:shadow-2xl hover:brightness-105'}
        target={'_blank'}
        href={url()}>Donate</a>
      <ExternalLinks/>
      <a
        class={'text-xs flex flex-row gap-1 justify-center items-center hover:scale-105 transition-all'}
        href={'https://github.com/orgs/JJ-Community-Projects/repositories'}
        target={'_blank'}
      >
        Contribute on Github <GithubIcon/>
      </a>
    </div>
  );
}


const ExternalLinks = () => {
  return (
    <div class={'flex flex-row justify-between ~gap-2/4 items-center'}>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'https://jinglejam.co.uk'}
        aria-label={'Jingle Jam Website'}>
        <GlobeIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        href={'https://twitch.tv/team/jinglejam'}
        target={'_blank'}
        aria-label={'Jingle Jam Stream Team'}>
        <TwitchIcon class={'~w-4/8 ~h-4/6'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'https://discord.gg/dsCsJJcvAx'}
        aria-label={'Jingle Jam Discord'}>
        <DiscordIcon class={'~w-4/8 ~h-4/6'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'https://x.com/jinglejam'}
        aria-label={'Jingle Jam Twitter'}>
        <TwitterIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'http://instagram.com/jinglejamofficial'}
        aria-label={'Jingle Jam Instagram'}>
        <InstagramIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
      <a
        class={'hover:scale-110 transition-all'}
        target={'_blank'}
        href={'http://tiktok.com/@jinglejamofficial'}
        aria-label={'Jingle Jam Tiktok'}>
        <TiktokIcon class={'~w-4/8 ~h-4/8'}/>
      </a>
    </div>

  )
}
