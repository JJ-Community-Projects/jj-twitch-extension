import {createContext, createEffect, on, type ParentComponent, useContext} from "solid-js";
import {Configuration, TwitchExtensionApi} from "../../../api";
import {useQuery} from "@tanstack/solid-query";
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";
import {useTabs} from "../TabsProvider.tsx";

const useBackendHook = () => {

  const {auth} = useTwitchAuth()

  const isAuthInit = () => auth.channelId !== undefined && auth.userId !== undefined
    && auth.channelId !== '' && auth.userId !== ''

  const requestAuth = () => ({
    channelId: auth.channelId,
    userId: auth.userId,
  })

  const apiConfig = new Configuration({
    basePath: 'https://beta.jinglejam.ostof.dev/api/public'
  })

  const api = new TwitchExtensionApi(apiConfig)

  const configQuery = useQuery(() => ({
      queryKey: ['config'],
      queryFn: () => api.getExtensionConfig(requestAuth()),
      enabled: isAuthInit(),
      staleTime: 60_000,
      refetchInterval: 60_000 * 10,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
      placeholderData: (prev) => prev
    })
  )

  const userConfigQuery = useQuery(() => ({
    queryKey: ['user-config'],
    queryFn: () => api.getUserExtensionConfig(requestAuth()),
    enabled: isAuthInit(),
    staleTime: 60_000,
    refetchInterval: 60_000 * 10,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    placeholderData: (prev) => prev
  }))

  const campaignsQuery = useQuery(() => ({
    queryKey: ['campaigns'],
    queryFn: () => api.getCampaigns(requestAuth()),
    enabled: isAuthInit(),
    staleTime: 60_000,
    refetchInterval: configQuery.data?.refreshInterval.fundraisers ?? 60_000,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    placeholderData: (prev) => prev
  }))

  const causesQuery = useQuery(() => ({
    queryKey: ['causes'],
    queryFn: () => api.getCauses(requestAuth()),
    enabled: isAuthInit(),
    staleTime: 60_000,
    refetchInterval: configQuery.data?.refreshInterval.charities ?? 60_000,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    placeholderData: (prev) => prev
  }))

  const enableUserDataQuery = () => {
    return isAuthInit() && userConfigQuery.data !== undefined && userConfigQuery.data.hasCampaign
  }

  const userDataQuery = useQuery(() => ({
    queryKey: ['user-data'],
    queryFn: () => api.getUserData(requestAuth()),
    enabled: enableUserDataQuery(),
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    placeholderData: (prev) => prev
  }))

  const userRelatedScheduleQuery = useQuery(() => ({
    queryKey: ['user-related-schedule'],
    queryFn: () => api.getUserRelatedSchedule(requestAuth()),
    enabled: false, // isAuthInit()
  }))

  const userRelationsQuery = useQuery(() => ({
    queryKey: ['user-relations'],
    queryFn: () => api.getUserRelations(requestAuth()),
    enabled: false, // isAuthInit(),
    placeholderData: (prev) => prev
  }))

  const enableUserScheduleQuery = () => {
    return isAuthInit() && userConfigQuery.data !== undefined && userConfigQuery.data.hasSchedule
  }


  const userScheduleQuery = useQuery(() => ({
    queryKey: ['user-schedule'],
    queryFn: () => api.getUserSchedule(requestAuth()),
    enabled: enableUserScheduleQuery(),
    staleTime: 60_000,
    refetchInterval: configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 15,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    placeholderData: (prev) => prev
  }))

  const enableYogsScheduleQuery = () => {
    return isAuthInit() && userConfigQuery.data !== undefined && !userConfigQuery.data.hasSchedule
  }
  const yogsScheduleQuery = useQuery(() => ({
    queryKey: ['yogs-schedule'],
    queryFn: () => api.getYogsSchedule(requestAuth()),
    enabled: enableYogsScheduleQuery(),
    staleTime: 60_000,
    refetchInterval: configQuery.data?.refreshInterval.yogsSchedule ?? 60_000 * 15,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    placeholderData: (prev) => prev
  }))

  const {currentTab, setCurrentTab} = useTabs()

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
    userData: userDataQuery,
    userRelatedSchedule: userRelatedScheduleQuery,
    userRelations: userRelationsQuery,
    userSchedule: userScheduleQuery,
    yogsSchedule: yogsScheduleQuery,
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
