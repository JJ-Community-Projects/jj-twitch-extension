import {type Component} from "solid-js";
import {twMerge} from "tailwind-merge";
import {Numeric} from "solid-i18n";
import {useCurrency} from "../../providers/CurrencyProvider.tsx";
import {useTheme} from "../../providers/ThemeProvider.tsx";
import type {JJCause} from "../../../../api";
import {FaSolidArrowUpRightFromSquare} from "solid-icons/fa";

interface CharityListItemProps {
  charity: JJCause
  i: number
}

export const CharityListItem: Component<CharityListItemProps> = (props) => {
  const {charity, i} = props

  const {currency} = useCurrency()
  const {theme, tailwindTextPrimary} = useTheme()
  const gradient = [
    'bg-gradient-to-br from-red-200 to-red-400',
    'bg-gradient-to-br from-orange-200 to-orange-400',
    'bg-gradient-to-br from-yellow-200 to-yellow-400',
    'bg-gradient-to-br from-green-200 to-green-400',
    'bg-gradient-to-br from-cyan-200 to-cyan-400',
    'bg-gradient-to-br from-blue-200 to-blue-400',
    'bg-gradient-to-br from-purple-200 to-purple-400',
  ]

  const campaignColor = (i: number) => {
    if (theme() === 'dark') {
      return 'text-white bg-gradient-to-br from-gray-500 to-gray-600'
    } else if (theme() === 'rainbow') {
      return gradient[i % gradient.length]
    }
    return 'bg-gradient-to-br from-white to-gray-100'
  }
  const raisedColor = () => {
    if (theme() === 'dark') {
      return 'text-white'
    } else if (theme() === 'rainbow') {
      return 'text-black'
    }
    return tailwindTextPrimary()
  }
  const name = () => {
    if (charity.name.length > 30) {
      return charity.name.substring(0, 30) + '...'
    }
    return charity.name
  }


  const value = () => {
    switch (currency()) {
      case "USD":
        return charity.raised.fundraisers.usd
      case "EUR":
        return charity.raised.fundraisers.euro
    }
    return charity.raised.fundraisers.gbp
  }

  return (

    <div
      class={twMerge(
        'min-h-24 w-full rounded-2xl shadow-xl',
        campaignColor(i),
      )}
    >
      <div class={'flex h-full w-full flex-col items-start gap-2 p-1.5'}>
        <div class={'flex h-full w-full items-center p-1'}>
          <img class={'h-10 w-10 rounded-lg'} alt={charity.name} src={charity.logo} loading={'lazy'}/>
          <div class={'w-full pl-1'}>
            <p class={'truncate text-ellipsis text-sm'}>{name()}</p>
            <p class={'line-clamp-2 w-full text-ellipsis text-xs'}>{charity.description}</p>
            <p class={twMerge('text-primary text-xs font-bold', tailwindTextPrimary(), raisedColor())}>
              Raised <Numeric value={value()} numberStyle="currency" currency={currency()}/>
            </p>
          </div>
        </div>
        <a target={'_blank'} href={charity.url}
           class={'transition-all hover:scale-101 hover:brightness-105 text-white gap-1 rounded-full bg-primary-500 p-1 flex flex-row items-center justify-center'}>
          <span class={'text-xxs'}>Website</span> <FaSolidArrowUpRightFromSquare size={12}/>
        </a>
      </div>
    </div>
  );
}
