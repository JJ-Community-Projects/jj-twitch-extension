import {useData} from "./DataProvider.tsx";
import {createContext, createEffect, createSignal, onCleanup, type ParentComponent, useContext} from "solid-js";
import {DateTime, Duration} from "luxon";
import type {TwitchOverlayChatCommand} from "../../../lib/model/TwitchConfig.ts";
import type {Props} from "astro";
import tmi, {type ChatUserstate} from "tmi.js";
import {useTwitchAuth} from "./TwitchAuthProvider.tsx";
import {useTwitchOverlayConfig} from "./OverlayConfigProvider.tsx";
import {useLocalStorage} from "./LocalStorageProvider.tsx";
// Show command-triggered popups for 10s
const commandTimeout = 10_000;

// Show commands only very 60s
const commandDelay = 60_000;


const useTwitchChatHook = (callback: (command: TwitchOverlayChatCommand) => void) => {
  const {channelName} = useTwitchAuth();
  const store = useLocalStorage()
  const config = useTwitchOverlayConfig()
  const commands = config.chat.commands

  const channelNames = () => [channelName()]

  const commandsMap: Map<string, TwitchOverlayChatCommand> = new Map();
  for (const command of commands) {
    commandsMap.set(command.command, command)
  }

  const messageHandler = (
    id: number,
    channel: string,
    tags: ChatUserstate,
    msg: string,
    self: boolean,
  ) => {
    if (!store.getBoolean("chat", true)) {
      return
    }

    // Ignore if user is not a moderator or broadcaster or test user
    if (!tags.mod && !tags.badges?.broadcaster) {
      return;
    }

    // Ignore echoed messages (messages sent by the bot) and messages that don't start with '!'
    if (self || !msg.trim().startsWith("!")) {
      return;
    }
    const commandName = msg.trim().toLowerCase().slice(1);
    const command = commandsMap.get(commandName);
    console.log(
      `*Twitch extension received command: ${commandName} (${command})*`,
      id,
    );
    if (command) {
      callback(command);
    }
  }

  createEffect(() => {
    if (!channelName()) {
      console.log("No channel name, not connecting to chat")
      return
    }
    const channels = channelNames().map((name) => `#${name}`)
    const id = Date.now();
    let closing = false
    console.log("*Twitch extension is connecting to chat*", id, channels);
    const client = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: channels
    });
    // Handle incoming messages
    client.on("message", (...args) => messageHandler(id, ...args));

    client.on("connected", () => {
      // If we connected after being unmounted, disconnect (again)
      if (closing) {
        client
          .disconnect()
          .then(() =>
            console.log(
              "*Twitch extension disconnected from chat (after connecting)*",
              id,
            ),
          );
        return;
      }

      console.log(
        `*Twitch extension is connected to chat: ${channelNames().join(", ")}*`,
        id,
      );
    });

    client.on("disconnected", (reason) => {
      console.log(`*Twitch extension disconnected due to ${reason}*`, id);
    });

    client.connect()
      .then(() => {
        console.log("*Twitch extension connected to chat*", id)
      })
      .catch((e) => {
        console.error("Failed to connect to chat", e)
      })

    onCleanup(() => {
      console.log("*Twitch extension is disconnecting from chat*", 'onCleanup', id);
      closing = true
      client!.disconnect()
        .then(() =>
          console.log("*Twitch extension disconnected from chat*"),
        );
    })
  })
}


const useChatHook = () => {
  const {donation} = useData()
  const causes = donation.causes

  const [lastCommandShown, setLastCommandShown] = createSignal<DateTime>()

  const [timeoutRef, setTimeoutRef] = createSignal<NodeJS.Timeout | undefined>(undefined);

  const [causeId, setCauseId] = createSignal<number>()

  const findCause = (command: TwitchOverlayChatCommand) => {
    return causes.find((cause) => cause.id === command.tiltifyId)
  }

  const diff = () => {
    const now = DateTime.now()
    if (!lastCommandShown()) {
      return Duration.fromObject({
        seconds: 60
      })
    }
    return now.diff(lastCommandShown()!)
  }

  const shouldShowCommand = () => {
    return diff().as('seconds') > 5
  }

  useTwitchChatHook((command) => {
    console.log("Command received", command, 'show', shouldShowCommand(), 'last', lastCommandShown(), 'diff', diff().as('seconds'))
    const cause = findCause(command)
    if (!timeoutRef() && cause && shouldShowCommand()) {
      setLastCommandShown(DateTime.now())
      setCauseId(cause.id)
      setTimeoutRef(setTimeout(() => {
        setCauseId(-1)
        setTimeoutRef(undefined)
        console.log("hide cause", command, 'show', shouldShowCommand(), 'last', lastCommandShown(), 'diff', diff().as('seconds'))
      }, commandTimeout))
    }
  })

  return {
    causes, causeId
  }
}

const ChatContext = createContext<ReturnType<typeof useChatHook>>();

export const ChatProvider: ParentComponent = (props) => {
  const hook = useChatHook()
  return (
    <ChatContext.Provider value={hook}>
      {props.children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext)!
