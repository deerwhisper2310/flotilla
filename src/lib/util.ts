import Fuse from "fuse.js"
import type {IFuseOptions, FuseResult} from "fuse.js"
import {throttle} from "throttle-debounce"
import {writable} from "svelte/store"
import {sortBy} from "@welshman/lib"
import {browser} from "$app/environment"

export const parseJson = (json: string) => {
  if (!json) return null

  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export const getJson = (k: string) => (browser ? parseJson(localStorage.getItem(k) || "") : null)

export const setJson = (k: string, v: any) => {
  if (browser) {
    localStorage.setItem(k, JSON.stringify(v))
  }
}

export const synced = <T>(key: string, defaultValue: T, delay = 300) => {
  const init = getJson(key)
  const store = writable<T>(init === null ? defaultValue : init)

  store.subscribe(throttle(delay, (value: T) => setJson(key, value)))

  return store
}

export type SearchOptions<V, T> = {

  getValue: (item: T) => V
  fuseOptions?: IFuseOptions<T>
  sortFn?: (items: FuseResult<T>) => any
}

export type Search<V, T> = {
  getValue: (item: T) => V
  getOption: (value: V) => T | undefined
  searchOptions: (term: string) => T[]
  searchValues: (term: string) => V[]
}

export const createSearch = <V, T>(data: T[], opts: SearchOptions<V, T>): Search<V, T> => {
  const fuse = new Fuse(data, {...opts.fuseOptions, includeScore: true})
  const map = new Map<V, T>(data.map(item => [opts.getValue(item), item]))

  const search = (term: string) => {
    let results = term ? fuse.search(term) : data.map(item => ({item, score: 1}) as FuseResult<T>)

    if (opts.sortFn) {
      results = sortBy(opts.sortFn, results)
    }

    return results.map(result => result.item)
  }

  return {
    getValue: opts.getValue,
    getOption: (value: V) => map.get(value),
    searchOptions: (term: string) => search(term),
    searchValues: (term: string) => search(term).map(opts.getValue),
  }
}

export const secondsToDate = (ts: number) => new Date(ts * 1000)

export const dateToSeconds = (date: Date) => Math.round(date.valueOf() / 1000)

export const getTimeZone = () => new Date().toString().match(/GMT[^\s]+/)

export const createLocalDate = (dateString: any) => new Date(`${dateString} ${getTimeZone()}`)

export const getLocale = () => new Intl.DateTimeFormat().resolvedOptions().locale

export const formatTimestamp = (ts: number) => {
  const formatter = new Intl.DateTimeFormat(getLocale(), {
    dateStyle: "short",
    timeStyle: "short",
  })

  return formatter.format(secondsToDate(ts))
}

export const formatTimestampAsDate = (ts: number) => {
  const formatter = new Intl.DateTimeFormat(getLocale(), {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return formatter.format(secondsToDate(ts))
}

export const formatTimestampAsTime = (ts: number) => {
  const formatter = new Intl.DateTimeFormat(getLocale(), {
    timeStyle: "short",
  })

  return formatter.format(secondsToDate(ts))
}
