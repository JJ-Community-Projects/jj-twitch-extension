import {
  type DocumentData,
  type DocumentReference,
  DocumentSnapshot,
  type FirestoreError,
  onSnapshot
} from "firebase/firestore";
import {createStore, reconcile} from "solid-js/store";
import {createComputed, onCleanup} from "solid-js";

type UseFireStoreReturn<T> = {
  data: T
  loading: boolean
  error: FirestoreError | null
}

function getDocData<T>(docRef: DocumentSnapshot<T>) {
  const data = docRef.data()

  if (data) {
    Object.defineProperty(data, 'id', {
      value: docRef.id.toString(),
      writable: false,
    })
  }

  return data
}

export function useFirestoreDoc<T extends DocumentData>(
  ref: DocumentReference<T>
) {
  const [state, setState] = createStore<UseFireStoreReturn<T | null>>({
    data: null,
    loading: true,
    error: null,
  })

  createComputed(() => {
    let close: () => void
    close = onSnapshot(
      ref,
      (snapshot) => {
        setState(
          reconcile({
            loading: false,
            data: getDocData(snapshot) || null,
            error: null,
          }),
        )
      },
      (error) => {
        setState(
          reconcile({
            loading: false,
            data: null,
            error,
          }),
        )
      },
    )
    onCleanup(() => {
      close()
    })
  })

  return state
}
