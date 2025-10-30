import type {ParentComponent} from "solid-js";

export const CrossFade: ParentComponent<{ show: boolean }> = (props) => {
  return (
    <div
      class={`absolute inset-0 transition-opacity duration-300 ease-in-out ${props.show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {props.children}
    </div>
  )
}
