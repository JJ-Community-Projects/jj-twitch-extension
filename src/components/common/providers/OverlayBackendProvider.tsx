import {createContext, createEffect, on, type ParentComponent, useContext} from "solid-js";
import {Configuration, TwitchExtensionApi} from "../../../api";
import {useQuery} from "@tanstack/solid-query";
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";
import {useTabs} from "./TabsProvider.tsx";
import {useOverlay} from "./OverlayProvider.tsx";

const useBackendHook = () => {

  const {auth} = useTwitchAuth()

  const {
    charities,
    community,
    yogsSchedule,} = useOverlay()

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
  })

  const api = new TwitchExtensionApi(apiConfig)

  const configQuery = useQuery(() => ({
      queryKey: ['config', channelId(), userId()],
      queryFn: async () => {
        const config = await api.getExtensionConfig(requestAuth())
        if (import.meta.env.DEV) {
          const {devMockExtensionConfig} = await import("../../../lib/mockUserSchedule.ts")
          const {devLayoutConfig} = await import("../../../lib/devLayout.ts")
          return devLayoutConfig(devMockExtensionConfig(config))
        }
        return config
      },
      enabled: isAuthInit(),
      staleTime: 60_000,
      refetchInterval: 60_000 * 10,
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: false,
      placeholderData: (prev) => prev
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
    placeholderData: (prev) => prev
  }))

  const enableOverviewQuery = () => {
    return isAuthInit() && (community() || charities())
  }

  const overviewQuery = useQuery(() => ({
    queryKey: ['overview', channelId(), userId()],
    queryFn: () => api.getOverview(requestAuth()),
    enabled: enableOverviewQuery(),
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableCampaignsQuery = () => {
    return isAuthInit() && configQuery.data !== undefined
      && configQuery.data.showFundraisers
      && community()
  }

  const campaignsQuery = useQuery(() => ({
    queryKey: ['campaigns', channelId(), userId()],
    queryFn: () => api.getCampaigns(requestAuth()),
    enabled: enableCampaignsQuery(),
    staleTime: 60_000,
    refetchInterval: () => configQuery.data?.refreshInterval.fundraisers ?? 60_000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableCausesQuery = () => {
    return isAuthInit() &&
      configQuery.data !== undefined &&
      configQuery.data.showCharities &&
      charities()
  }

  const causesQuery = useQuery(() => ({
    queryKey: ['causes', channelId(), userId()],
    queryFn: () => api.getCauses(requestAuth()),
    enabled: enableCausesQuery(),
    staleTime: 60_000,
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
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableUserScheduleQuery = () => {
    // Fetch when auth is initialized and user has a schedule configured.
    // We intentionally do not gate this behind a specific overlay window
    // to keep the component simple to mount.
    return isAuthInit() && userConfigQuery.data !== undefined && userConfigQuery.data.hasSchedule
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
    refetchInterval: () => configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 15,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableYogsScheduleQuery = () => {
    return isAuthInit() && userConfigQuery.data !== undefined
      && configQuery.data !== undefined && configQuery.data.showYogsSchedule &&
      yogsSchedule()
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
    staleTime: 60_000 * 5,
    refetchInterval: () => configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 10,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
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
  }
}

const BackendContext = createContext<ReturnType<typeof useBackendHook>>();

export const OverlayBackendProvider: ParentComponent = (props) => {
  const hook = useBackendHook()
  return (
    <BackendContext.Provider value={hook}>
      {props.children}
    </BackendContext.Provider>
  );
}
export const useOverlayBackend = () => useContext(BackendContext)!
