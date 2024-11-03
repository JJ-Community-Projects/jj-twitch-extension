import { useIntelligentTimer } from "./useIntelligentTimer";
import {createEffect, createSignal} from "solid-js";

// Hide the cursor after 5s of inactivity
const timeout = 5_000;
export const useHiddenCursor = () => {
  // Hide the cursor if the user is inactive on the whole page
  const [startTimer] = useIntelligentTimer();
  const [hidden, setHidden] = createSignal(false);

  // Show the cursor for x milliseconds
  const show = (time: number) => {
      setHidden(false);
      startTimer(() => setHidden(true), time);
    }



  // Show the cursor as soon as the user interacts with the page
  createEffect(() => {
    const callback = () => show(timeout);

    document.addEventListener("mouseenter", callback);
    document.addEventListener("mousemove", callback);

    return () => {
      document.removeEventListener("mouseenter", callback);
      document.removeEventListener("mousemove", callback);
    };
  });

  // Hide the cursor when inactive (not sleeping, as that happens on mouse exit)
  createEffect(() => {
    if (hidden()) document.documentElement.style.cursor = "none";
    else document.documentElement.style.removeProperty("cursor");
  });

  // Expose the state and the active function
  return [hidden, show]
};
