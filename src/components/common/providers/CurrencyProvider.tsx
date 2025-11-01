import {type Accessor, createContext, createSignal, type ParentComponent, type Setter, useContext} from 'solid-js'
import {makePersisted} from "@solid-primitives/storage";

interface CurrencyContextProps {
  pounds: Accessor<boolean>
  usd: Accessor<boolean>
  eur: Accessor<boolean>
  currency: () => 'GBP' | 'USD' | 'EUR'
  setCurrency: Setter<'GBP' | 'USD' | 'EUR'>
}

const CurrencyContext = createContext<CurrencyContextProps>()

export const CurrencyProvider: ParentComponent<{}> = props => {
  const [currency, setCurrency] = makePersisted(createSignal<'GBP' | 'USD' | 'EUR'>('GBP')) // createSignal<'GBP' | 'USD' | 'EUR'>('GBP')

  const pounds = () => currency() === 'GBP'
  const usd = () => currency() === 'USD'
  const eur = () => currency() === 'EUR'

  return (
    <CurrencyContext.Provider
      value={{
        pounds,
        usd,
        eur,
        currency,
        setCurrency
      }}
    >
      {props.children}
    </CurrencyContext.Provider>
  )
}
export const useCurrency = () => useContext(CurrencyContext)!
