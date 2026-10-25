import { useIntelligentTimer } from "./useIntelligentTimer";
import {createEffect, createSignal} from "solid-js";
import {usePreviewDocument} from "../../components/common/PreviewFrame.tsx";

// Hide the cursor after 5s of inactivity
const timeout = 5_000;
export const useHiddenCursor = () => {
  // Hide the cursor if the user is inactive on the whole page
  const [startTimer] = useIntelligentTimer();
  const [hidden, setHidden] = createSignal(false);
  // In the config page preview the overlay lives in an iframe with its own document
  const doc = usePreviewDocument() ?? document;

  // Show the cursor for x milliseconds
  const show = (time: number) => {
      setHidden(false);
      startTimer(() => setHidden(true), time);
    }



  // Show the cursor as soon as the user interacts with the page
  createEffect(() => {
    const callback = () => show(timeout);

    doc.addEventListener("mouseenter", callback);
    doc.addEventListener("mousemove", callback);

    return () => {
      doc.removeEventListener("mouseenter", callback);
      doc.removeEventListener("mousemove", callback);
    };
  });

  // Hide the cursor when inactive (not sleeping, as that happens on mouse exit)
  createEffect(() => {
    if (hidden()) doc.documentElement.style.cursor = "none";
    else doc.documentElement.style.removeProperty("cursor");
  });

  // Expose the state and the active function
  return [hidden, show]
};
