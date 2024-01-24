import {Filter, SourceUrl} from "~/types";

export const SERVER_URL = '/api/rss'
export const RSS_SOURCE_1 = 'https://lenta.ru/rss/news'
export const RSS_SOURCE_2 = 'https://www.mos.ru/rss'
export const LOCAL_STORAGE_KEY = 'cardsView'

export const filterOptions = [
    { value: Filter.ALL, label: 'Все' },
    { value: Filter.LENTA, label: SourceUrl.LENTA },
    { value: Filter.MOS, label: SourceUrl.MOS }
]
