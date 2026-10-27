import {createContext, createEffect, on, type ParentComponent, useContext} from "solid-js";
import {Configuration, TwitchExtensionApi} from "../../../api";
import {useQuery} from "@tanstack/solid-query";
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";
import {useTabs} from "./TabsProvider.tsx";

const useBackendHook = (useConfigPlaceholderData = true) => {

  const {auth} = useTwitchAuth()

  const {currentTab, setCurrentTab} = useTabs()

  const isAuthInit = () => auth().channelId !== undefined && auth().userId !== undefined
    && auth().channelId !== '' && auth().userId !== ''

  const channelId = () => auth().channelId
  const userId = () => auth().userId

  const requestAuth = () => ({
    channelId: auth().channelId,
    userId: auth().userId,
  })

  const apiConfig = new Configuration({
    basePath: 'https://jinglejam.ostof.dev/api/public'
    // basePath: 'http://localhost:3000/api/public',
  })

  const api = new TwitchExtensionApi(apiConfig)

  const configQuery = useQuery(() => ({
      queryKey: ['config', channelId(), userId()],
      queryFn: async () => {
        const config = await api.getExtensionConfig(requestAuth())
        if (import.meta.env.DEV) {
          const {devMockExtensionConfig} = await import("../../../lib/mockUserSchedule.ts")
          const {devMockHeadlinerConfig} = await import("../../../lib/mockHeadlinerSchedule.ts")
          const {devLayoutConfig} = await import("../../../lib/devLayout.ts")
          return devLayoutConfig(devMockHeadlinerConfig(devMockExtensionConfig(config)))
        }
        return config
      },
      enabled: isAuthInit(),
      staleTime: 60_000,
      refetchInterval: 60_000 * 10,
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: false,
      placeholderData: useConfigPlaceholderData ? (prev) => prev : undefined
    })
  )

  const userConfigQuery = useQuery(() => ({
    queryKey: ['user-config', channelId(), userId()],
    queryFn: async () => {
      const config = await api.getUserExtensionConfig(requestAuth())
      if (import.meta.env.DEV) {
        const {devMockUserConfig} = await import("../../../lib/mockUserSchedule.ts")
        const {devLayoutUserConfig} = await import("../../../lib/devLayout.ts")
        return devLayoutUserConfig(devMockUserConfig(config))
      }
      return config
    },
    enabled: isAuthInit(),
    staleTime: 60_000,
    refetchInterval: 60_000 * 10,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: useConfigPlaceholderData ? (prev) => prev : undefined
  }))

  const enableOverviewQuery = () => {
    return isAuthInit() && (currentTab() === 'fundraisers' || currentTab() === 'charities')
  }

  const overviewQuery = useQuery(() => ({
    queryKey: ['overview', channelId(), userId()],
    queryFn: () => api.getOverview(requestAuth()),
    enabled: enableOverviewQuery(),
    staleTime: 30_000,
    refetchInterval: () => configQuery.data?.refreshInterval.charities ?? 60_000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableCampaignsQuery = () => {
    return isAuthInit() && configQuery.data !== undefined
      && configQuery.data.showFundraisers
      && currentTab() === 'fundraisers'
  }

  const campaignsQuery = useQuery(() => ({
    queryKey: ['campaigns', channelId(), userId()],
    queryFn: () => api.getCampaigns(requestAuth()),
    enabled: enableCampaignsQuery(),
    staleTime: 30_000,
    refetchInterval: () => configQuery.data?.refreshInterval.fundraisers ?? 60_000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableCausesQuery = () => {
    return isAuthInit() &&
      configQuery.data !== undefined &&
      configQuery.data.showCharities &&
      (currentTab() === 'charities' || currentTab() === 'fundraisers')
  }

  const causesQuery = useQuery(() => ({
    queryKey: ['causes', channelId(), userId()],
    queryFn: () => api.getCauses(requestAuth()),
    enabled: enableCausesQuery(),
    staleTime: 30_000,
    refetchInterval: () => configQuery.data?.refreshInterval.charities ?? 60_000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableUserDataQuery = () => {
    return isAuthInit() && userConfigQuery.data !== undefined && userConfigQuery.data.hasCampaign
  }

  const userDataQuery = useQuery(() => ({
    queryKey: ['user-data', channelId(), userId()],
    queryFn: () => api.getUserData(requestAuth()),
    enabled: enableUserDataQuery(),
    staleTime: 60_000,
    refetchInterval: () => configQuery.data?.refreshInterval.fundraisers ?? 60_000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableUserScheduleQuery = () => {
    return isAuthInit() && userConfigQuery.data !== undefined
      && userConfigQuery.data.hasSchedule
      && currentTab() === 'user-schedule'
      && configQuery.data !== undefined
      && configQuery.data.showUserSchedule
  }


  const userScheduleQuery = useQuery(() => ({
    queryKey: ['user-schedule', channelId(), userId()],
    queryFn: async () => {
      if (import.meta.env.DEV) {
        const {devMockUserSchedule} = await import("../../../lib/mockUserSchedule.ts")
        const mock = devMockUserSchedule()
        if (mock) return mock
      }
      return api.getUserSchedule(requestAuth())
    },
    enabled: enableUserScheduleQuery(),
    staleTime: 60_000,
    // There is no separate interval for the user and headliner schedules; they share the Yogs schedule's.
    refetchInterval: () => configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 5,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableYogsScheduleQuery = () => {
    return isAuthInit() && configQuery.data !== undefined && configQuery.data.showYogsSchedule &&
      currentTab() === 'yogs'
  }

  const yogsScheduleQuery = useQuery(() => ({
    queryKey: ['yogs-schedule', channelId(), userId()],
    queryFn: async () => {
      if (import.meta.env.DEV) {
        const {devMockYogsSchedule} = await import("../../../lib/mockYogsSchedule.ts")
        const mock = devMockYogsSchedule()
        if (mock) return mock
      }
      return api.getYogsSchedule(requestAuth())
    },
    enabled: enableYogsScheduleQuery(),
    staleTime: 60_000,
    refetchInterval: () => configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 5,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableHeadlinerScheduleQuery = () => {
    return isAuthInit() && configQuery.data !== undefined
      && configQuery.data.showHeadlinerSchedule
      && currentTab() === 'fundraisers'
  }

  const headlinerScheduleQuery = useQuery(() => ({
    queryKey: ['headliner-schedule', channelId(), userId()],
    queryFn: async () => {
      if (import.meta.env.DEV) {
        const {devMockHeadlinerSchedule} = await import("../../../lib/mockHeadlinerSchedule.ts")
        const mock = devMockHeadlinerSchedule()
        if (mock) return mock
      }
      return api.getHeadlinerSchedule(requestAuth())
    },
    enabled: enableHeadlinerScheduleQuery(),
    staleTime: 60_000,
    // Shares the Yogs schedule's interval, like the user schedule.
    refetchInterval: () => configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 5,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  createEffect(on(() => userConfigQuery.data, (config) => {
    if (currentTab() === '' && config) {
      if (config.tabs.length > 0) {
        setCurrentTab(config.tabs[0])
      }
    }
  }))

  return {
    config: configQuery,
    userConfig: userConfigQuery,
    campaigns: campaignsQuery,
    causes: causesQuery,
    overview: overviewQuery,
    userData: userDataQuery,
    userSchedule: userScheduleQuery,
    yogsSchedule: yogsScheduleQuery,
    headlinerSchedule: headlinerScheduleQuery,
  }
}

const BackendContext = createContext<ReturnType<typeof useBackendHook>>();

export const BackendProvider: ParentComponent<{
  useConfigPlaceholderData?: boolean
}> = (props) => {
  const hook = useBackendHook(props.useConfigPlaceholderData)
  return (
    <BackendContext.Provider value={hook}>
      {props.children}
    </BackendContext.Provider>
  );
}
export const useBackend = () => useContext(BackendContext)!
