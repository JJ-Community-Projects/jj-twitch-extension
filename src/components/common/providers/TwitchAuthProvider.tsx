import {createContext, createSignal, onMount, type ParentComponent, useContext} from "solid-js";
import {createStore} from "solid-js/store";

type ChannelsResponse = {
  data: Array<ChannelInfo>;
};

type ChannelInfo = {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  broadcaster_language: string;
  game_id: string;
  game_name: string;
  title: string;
  delay: number;
  tags: string[];
};

export async function fetchCurrentChannelInfo(auth: Twitch.ext.Authorized) {
  const url = new URL("https://api.twitch.tv/helix/channels");
  url.searchParams.set("broadcaster_id", auth.channelId);

  const response = await fetch(url, {
    headers: {
      "client-id": auth.clientId,
      Authorization: `Extension ${auth.helixToken}`,
    },
  });

  const data = (await response.json()) as ChannelsResponse; // TODO: validate schema?
  if (data?.data?.length) return data.data[0];

  return null;
}

const useTwitchAuthHook = () => {
  // if (!("Twitch" in window) || !window.Twitch.ext) return;
  const [auth, setAuth] = createStore<Twitch.ext.Authorized>({
    channelId: "",
    clientId: "",
    token: "",
    userId: "",
    helixToken: ""
  })

  const [channelName, setChannelName] = createSignal<string>();
  const twitch = window?.Twitch?.ext;
  onMount(() => {
    console.log("Twitch Auth Hook Mounted", twitch)
    if (twitch) {
      twitch.onAuthorized((auth) => {
        setAuth(auth);
        fetchCurrentChannelInfo(auth)
          .then((newChannelInfo) => {
            console.log("Channel Info", newChannelInfo)
            if (typeof newChannelInfo?.broadcaster_login === "string") {
              setChannelName(newChannelInfo.broadcaster_login.toLowerCase());
            }
          })
          .catch((e) => {
            console.error("Failed to fetch channel info", e);
            return undefined;
          });
      });
    }else {
      console.error("Twitch not available")
      setChannelName("ostof")
    }
  })

  return {auth, channelName}
}

interface TwitchAuthProps {
}

const TwitchAuthContext = createContext<ReturnType<typeof useTwitchAuthHook>>();

export const TwitchAuthProvider: ParentComponent<TwitchAuthProps> = (props) => {
  const hook = useTwitchAuthHook()
  return (
    <TwitchAuthContext.Provider value={hook}>
      {props.children}
    </TwitchAuthContext.Provider>
  );
}
export const useTwitchAuth = () => useContext(TwitchAuthContext)!
