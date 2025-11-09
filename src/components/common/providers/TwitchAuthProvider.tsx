import {createContext, createSignal, onMount, type ParentComponent, useContext} from "solid-js";
import {createStore} from "solid-js/store";


const debugDataMap = {
  'ostof': {
    channelId: "96860795",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'ostofbot': {
    channelId: "960814823",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'hrry': {
    channelId: "27063689",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'martyn': {
    channelId: "12131870",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'brionykay': {
    channelId: "79911474",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'mousie': {
    channelId: "46969360",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'shadowatnoon': {
    channelId: "68525019",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'yogscast': {
    channelId: "20786541",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'mudkipninja': {
    channelId: "96202541",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'chasedbyvoices': {
    channelId: "675328467",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'a': {
    channelId: "333",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
  'dawnfire': {
    channelId: "75214953",
    clientId: "333",
    token: "test-123",
    userId: "333",
    helixToken: "333"
  },
}
const debugChannel = 'ostofbot'
const debugData = debugDataMap[debugChannel]
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

  const [auth, setAuth] = createStore<Twitch.ext.Authorized>({
    channelId: "",
    clientId: "",
    token: "",
    userId: "",
    helixToken: ""
  })

  const [previewAuth, setPreviewAuth] = createStore<Twitch.ext.Authorized>({
    channelId: "",
    clientId: "",
    token: "",
    userId: "",
    helixToken: ""
  })

  const [channelName, setChannelName] = createSignal<string>();
  const twitch = window?.Twitch?.ext;
  onMount(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        setAuth(auth);
        fetchCurrentChannelInfo(auth)
          .then((newChannelInfo) => {
            if (typeof newChannelInfo?.broadcaster_login === "string") {
              setChannelName(newChannelInfo.broadcaster_login.toLowerCase());
            }
          })
          .catch((e) => {
            console.error("Failed to fetch channel info", e);
            return undefined;
          });
      });

      if (import.meta.env.DEV) {
        console.log("Twitch Auth debug")
        setChannelName(debugChannel)
        setAuth(debugData)
      }
    } else {
      if (import.meta.env.DEV) {
        setChannelName(debugChannel)
        setAuth(debugData)
      }
      console.error("Twitch not available")
    }
  })

  const actualAuth = () => {
    if (previewAuth.channelId === '') {
      return auth
    }
    return previewAuth
  }

  return {auth: actualAuth, channelName, setPreviewAuth,}
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
