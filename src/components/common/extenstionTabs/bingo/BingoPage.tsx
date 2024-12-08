import {type Component, For} from "solid-js";
import {Dialog} from "@kobalte/core";
import {AiOutlineClose} from "solid-icons/ai";

interface BingoDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  close: () => void;
}

export const BingoDialog: Component<BingoDialogProps> = (props) => {

  return (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class={'fixed inset-0 z-50 bg-black bg-opacity-20'}/>
        <Dialog.Content
          class={'fixed inset-0 z-50 h-fit flex flex-col items-center justify-center bg-white text-black m-2 rounded-2xl shadow-xl'}>
          <Dialog.Title
            class="w-full p-2 flex flex-row gap-4 rounded-t-2xl"
          >
            <button class={'rounded-full hover:bg-accent-200/10 aspect-square'} onClick={() => props.close()}>
              <AiOutlineClose size={24}/>
            </button>
            <div class={'flex flex-col'}>
              <p class={'text-lg font-bold'}>Yogscast Bingo</p>
            </div>
          </Dialog.Title>
          <Body/>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


export const Body: Component = () => {

  const ind = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

  const item = (idx: number) => {
    if (idx < 12) {
      return options[idx]
    }
    if (idx == 12) {
      return -1;
    }
    return options[idx - 1]
  }

  return <div class={'grid grid-cols-5 w-full p-2 gap-1'}>
    <For each={ind}>
      {(idx) => {
        const i = item(idx)
        if (i == -1) {
          return <DonateTile/>
        }
        return <BingoTile text={`option ${i}`}/>
      }}
    </For>
  </div>
}


const BingoTile: Component<{ text: string }> = (props) => {
  return <div class={'bg-white rounded-2xl aspect-square text-xxs flex flex-col items-center justify-center shadow'}>
    <p class={'text-center'}>{props.text}</p>
  </div>
}


const DonateTile: Component = () => {
  return <div class={'bg-yellow-300 rounded-2xl aspect-square text-xxs flex flex-col items-center justify-center shadow'}>
    <p class={'text-center'}>Donate</p>
  </div>
}
