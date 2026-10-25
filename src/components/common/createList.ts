import {createSignal} from "solid-js";


export const createList = <T>(items?: T[]) => {
  const [list, setList] = createSignal<T[]>(items ?? [])

  const add = (item: T) => {
    setList([...list(), item])
  }

  const remove = (item: T) => {
    setList(list().filter(i => i !== item))
  }

  const clear = () => {
    setList([])
  }

  const isEmpty = () => {
    return list().length === 0
  }

  const indexOf = (item: T) => {
    return list().indexOf(item)
  }

  const contains = (item: T) => {
    return list().includes(item)
  }

  return {
    list,
    add,
    remove,
    clear,
    isEmpty,
    indexOf,
    contains,
  }
}
