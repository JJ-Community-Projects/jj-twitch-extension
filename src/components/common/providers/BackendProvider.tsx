import {createContext, createEffect, on, type ParentComponent, useContext} from "solid-js";
import {Configuration, TwitchExtensionApi} from "../../../api";
import {useQuery} from "@tanstack/solid-query";
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";
import {useTabs} from "./TabsProvider.tsx";

const useBackendHook = () => {

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
    basePath: 'https://beta.jinglejam.ostof.dev/api/public'
  })

  const api = new TwitchExtensionApi(apiConfig)

  const configQuery = useQuery(() => ({
      queryKey: ['config', channelId(), userId()],
      queryFn: () => api.getExtensionConfig(requestAuth()),
      enabled: isAuthInit(),
      staleTime: 60_000,
      refetchInterval: 60_000 * 10,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      placeholderData: (prev) => prev
    })
  )

  const userConfigQuery = useQuery(() => ({
    queryKey: ['user-config', channelId(), userId()],
    queryFn: () => api.getUserExtensionConfig(requestAuth()),
    enabled: isAuthInit(),
    staleTime: 60_000,
    refetchInterval: 60_000 * 10,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableOverviewQuery = () => {
    return isAuthInit() && (currentTab() === 'fundraisers' || currentTab() === 'charities')
  }

  const overviewQuery = useQuery(() => ({
    queryKey: ['overview', channelId(), userId()],
    queryFn: () => api.getOverview(requestAuth()),
    enabled: enableOverviewQuery(),
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
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
    staleTime: 60_000,
    refetchInterval: () => configQuery.data?.refreshInterval.fundraisers ?? 60_000,
    refetchOnWindowFocus: false,
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
    staleTime: 60_000,
    refetchInterval: () => configQuery.data?.refreshInterval.charities ?? 60_000,
    refetchOnWindowFocus: false,
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
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const userRelatedScheduleQuery = useQuery(() => ({
    queryKey: ['user-related-schedule', channelId(), userId()],
    queryFn: () => api.getUserRelatedSchedule(requestAuth()),
    enabled: false, // isAuthInit()
  }))

  const userRelationsQuery = useQuery(() => ({
    queryKey: ['user-relations', channelId(), userId()],
    queryFn: () => api.getUserRelations(requestAuth()),
    enabled: false, // isAuthInit(),
    placeholderData: (prev) => prev
  }))

  const enableUserScheduleQuery = () => {
    return isAuthInit() && userConfigQuery.data !== undefined
      && userConfigQuery.data.hasSchedule
      && currentTab() === 'user-schedule'
  }


  const userScheduleQuery = useQuery(() => ({
    queryKey: ['user-schedule', channelId(), userId()],
    queryFn: () => api.getUserSchedule(requestAuth()),
    enabled: enableUserScheduleQuery(),
    staleTime: 60_000,
    refetchInterval: () => configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 15,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    placeholderData: (prev) => prev
  }))

  const enableYogsScheduleQuery = () => {
    return isAuthInit() && userConfigQuery.data !== undefined
      && configQuery.data !== undefined && configQuery.data.showYogsSchedule &&
      currentTab() === 'yogs'
  }

  const yogsScheduleQuery = useQuery(() => ({
    queryKey: ['yogs-schedule', channelId(), userId()],
    queryFn: () => api.getYogsSchedule(requestAuth()),
    enabled: enableYogsScheduleQuery(),
    staleTime: 60_000 * 5,
    refetchInterval: () => configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 10,
    refetchOnWindowFocus: false,
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

  const refetchAll = () => {
    configQuery.refetch()
    userConfigQuery.refetch()
    /*
    campaignsQuery.refetch()
    causesQuery.refetch()
    overviewQuery.refetch()
    userDataQuery.refetch()
    userScheduleQuery.refetch()
    yogsScheduleQuery.refetch()*/
  }

  return {
    config: configQuery,
    userConfig: userConfigQuery,
    campaigns: campaignsQuery,
    causes: causesQuery,
    overview: overviewQuery,
    userData: userDataQuery,
    userRelatedSchedule: userRelatedScheduleQuery,
    userRelations: userRelationsQuery,
    userSchedule: userScheduleQuery,
    yogsSchedule: yogsScheduleQuery,
    refetchAll,
  }
}

const BackendContext = createContext<ReturnType<typeof useBackendHook>>();

export const BackendProvider: ParentComponent = (props) => {
  const hook = useBackendHook()
  return (
    <BackendContext.Provider value={hook}>
      {props.children}
    </BackendContext.Provider>
  );
}
export const useBackend = () => useContext(BackendContext)!
