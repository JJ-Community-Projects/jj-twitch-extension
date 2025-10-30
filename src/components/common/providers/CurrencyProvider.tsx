import {type Accessor, createContext, createSignal, type ParentComponent, useContext} from 'solid-js'

interface CurrencyContextProps {
  pounds: Accessor<boolean>
  toggle: () => void
  currency: () => 'GBP' | 'USD'
}

const CurrencyContext = createContext<CurrencyContextProps>()

export const CurrencyProvider: ParentComponent<{}> = props => {
  const [pounds, set] = createSignal(true)

  const toggle = () => {
    set(!pounds())
  }

  const currency = () => {
    if (pounds()) {
      return 'GBP'
    }
    return 'USD'
  }

  return (
    <CurrencyContext.Provider
      value={{
        pounds,
        toggle,
        currency
      }}
    >
      {props.children}
    </CurrencyContext.Provider>
  )
}
export const useCurrency = () => useContext(CurrencyContext)!
