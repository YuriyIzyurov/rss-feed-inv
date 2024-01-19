export type FilterType = 'all' | 'lenta' | 'mos'
export type SourceType = 'lenta.ru' | 'mos.ru'
export type ViewType = 'variant-1' | 'variant-2'
export type NewsItemType = {
    image: string | null
    title: string
    content: string | null
    link: string
    pupDate: string
    source: SourceType
}
export type PageInfoType = {
    currentPage: number,
    visiblePagesAmount: number,
    totalPages: number
}