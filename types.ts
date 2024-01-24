export enum Filter {
    ALL = 'all',
    LENTA = 'lenta',
    MOS = 'mos'
}
export enum SourceUrl {
    LENTA = 'lenta.ru',
    MOS = 'mos.ru'
}
export enum CardView {
    VARIANT_1 = 'variant-1',
    VARIANT_2 = 'variant-2',
}
export enum NewsPerView {
    VARIANT_1 = 3,
    VARIANT_2 = 4
}
export type NewsItemType = {
    image: string | null
    title: string
    content: string | null
    link: string
    pubDate: string
    source: SourceUrl
}
export type PageInfoType = {
    currentPage: number,
    totalPages: number
}
type FeedInfo = {
    title: string
    description: string
    items: FeedItem[]
    link: string
    rss: string
}
export type FeedItem = {
    title: string
    content?: string
    contentSnippet?: string
    enclosure: EnclosureType
    link: string
    pubDate: string
}
type EnclosureType = {
    url: string
    type: string
}
export type APIBody = {
    data: FeedInfo
    error: string | null
    status: number
}