import {createContext, createSignal, type JSX, onCleanup, onMount, type ParentComponent, Show, useContext} from "solid-js";
import {DelegatedEvents, delegateEvents, Portal} from "solid-js/web";

interface PreviewFrameProps {
  class?: string
  style?: JSX.CSSProperties
  // Class for the frame's <body>, i.e. what the extension page sets on its own body.
  bodyClass?: string
}

const PreviewDocumentContext = createContext<Document>();

// Renders the extension views of the config pages inside an iframe, so they get their own viewport:
// h-screen, vw units, breakpoints and fluid sizes resolve against the preview size, just like on Twitch.
// The iframe has no src and is filled from this page, because Twitch's frame-ancestors CSP does not allow
// framing panel.html or overlay.html inside config.html.
export const PreviewFrame: ParentComponent<PreviewFrameProps> = (props) => {
  let iframe!: HTMLIFrameElement
  const [doc, setDoc] = createSignal<Document>()

  onMount(() => {
    const frameDoc = iframe.contentDocument!
    // The blank document is in quirks mode, the extension pages are not
    frameDoc.open()
    frameDoc.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body></body></html>')
    frameDoc.close()

    // Mirror this page's stylesheets, including the ones Vite adds or updates later in dev.
    const clones = new Map<HTMLElement, HTMLElement>()
    const syncStyles = () => {
      const sources = [...document.head.querySelectorAll<HTMLElement>('style, link[rel="stylesheet"]')]
      for (const [source, clone] of clones) {
        if (!sources.includes(source)) {
          clone.remove()
          clones.delete(source)
        }
      }
      for (const source of sources) {
        let clone = clones.get(source)
        if (!clone) {
          clone = source.cloneNode(true) as HTMLElement
          if (source instanceof HTMLLinkElement) {
            (clone as HTMLLinkElement).href = source.href
          }
          clones.set(source, clone)
        } else if (source instanceof HTMLStyleElement && clone.textContent !== source.textContent) {
          clone.textContent = source.textContent
        }
        frameDoc.head.appendChild(clone)
      }
    }
    syncStyles()
    const observer = new MutationObserver(syncStyles)
    observer.observe(document.head, {childList: true, subtree: true, characterData: true})
    onCleanup(() => observer.disconnect())

    if (props.bodyClass) {
      frameDoc.body.className = props.bodyClass
    }
    // Solid listens for onClick & co. on the document, and events inside the iframe stay in its document.
    delegateEvents([...DelegatedEvents], frameDoc)
    setDoc(frameDoc)
  })

  return (
    <>
      <iframe ref={iframe} class={props.class} style={props.style} title={'Extension preview'}/>
      <Show when={doc()}>
        {(frameDoc) => (
          <PreviewDocumentContext.Provider value={frameDoc()}>
            {/* display: contents, like the astro-island the extension pages mount into */}
            <Portal mount={frameDoc().body} ref={(el) => el.style.display = 'contents'}>
              {props.children}
            </Portal>
          </PreviewDocumentContext.Provider>
        )}
      </Show>
    </>
  )
}

// The document the extension renders into: the preview iframe's, or undefined outside a preview.
export const usePreviewDocument = () => useContext(PreviewDocumentContext)

// Mount point for portals (dialogs, tooltips, dropdowns), so they open inside the preview.
export const usePortalMount = () => usePreviewDocument()?.body
