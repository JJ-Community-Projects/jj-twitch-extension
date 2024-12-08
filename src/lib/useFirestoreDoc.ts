import {
  type DocumentData,
  type DocumentReference,
  DocumentSnapshot,
  type FirestoreError,
  onSnapshot
} from "firebase/firestore";
import {createStore, reconcile} from "solid-js/store";
import {createComputed, onCleanup} from "solid-js";


type Entry = {
  data: any
  timestamp: number
}

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

/*
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
        console.log('snapshot', snapshot.ref.path)
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

*/

export function useFirestoreDoc<T extends DocumentData>(
  ref: DocumentReference<T>
) {
  const storage = window.localStorage
  const [state, setState] = createStore<UseFireStoreReturn<T | null>>({
    data: null,
    loading: true,
    error: null,
  });

  createComputed(() => {
    const cacheKey = ref.path;
    const cacheEntryStr = storage.getItem(cacheKey)
    const cacheEntry = cacheEntryStr ? JSON.parse(cacheEntryStr) : null
    const now = Date.now();

    if (cacheEntry && now - cacheEntry.timestamp < 60 * 1000) {
      // Use cached data if it's less than 1 minute old
      console.log('Using cache', cacheKey);
      setState(
        reconcile({
          loading: false,
          data: cacheEntry.data,
          error: null,
        })
      );
    } else {
      console.log('Cache expired', cacheKey);
      setState(
        reconcile({
          loading: true,
          data: null,
          error: null,
        })
      );
    }

    // Always set up Firestore listener to update after one minute
    let close: () => void;
    const setupFirestoreListener = () => {
      console.log('Setting up remote listener', cacheKey);
      if (close !== undefined) {
        return
      }
      close = onSnapshot(
        ref,
        (snapshot) => {
          console.log('snapshot', cacheKey)
          const data = getDocData(snapshot) || null;
          // Update cache
          storage.setItem(cacheKey, JSON.stringify({data, timestamp: Date.now()}));
          // Update state
          setState(
            reconcile({
              loading: false,
              data,
              error: null,
            })
          );
        },
        (error) => {
          console.log('error', cacheKey, error);
          setState(
            reconcile({
              loading: false,
              data: null,
              error,
            })
          );
        }
      );
    };

    const startTimer = () => {
      console.log('Setting up remote timer', cacheKey);
      setTimeout(() => {
        setupFirestoreListener();
      }, 60 * 1000); // 1 minute
    };

    if (cacheEntry && now - cacheEntry.timestamp < 60 * 1000) {
      // If cache is valid, refresh Firestore after 1 minute
      startTimer();
    } else {
      // If no valid cache, fetch Firestore immediately
      setupFirestoreListener();
    }

    onCleanup(() => {
      if (close) {
        console.log('Cleaning up', cacheKey);
        close();
      }
    });
  });

  return state;
}
