import type {Component} from "solid-js";
import JingleJamLogo from "../../assets/JingleJam_Red.png";

export const ErrorPage: Component<{
  message: string;
}> = (props) => {
  return (
    <div class="h-full w-full flex items-center justify-center">
      <div class="flex flex-col items-center gap-6">
        <img
          src={JingleJamLogo.src}
          alt="Jingle Jam"
          class="w-40 md:w-56 select-none pointer-events-none drop-shadow-lg animate-pulse"
        />
        <div class="flex items-center gap-3 text-white">
          <span class="text-sm">{props.message}</span>
        </div>
        <div class="flex items-center gap-3 text-white">
          <span class="text-sm">Contact @Ostof is this error persists.</span>
        </div>
      </div>
    </div>
  );
};
