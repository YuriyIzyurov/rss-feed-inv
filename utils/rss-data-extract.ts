import {convertDate} from "~/utils/date-converter";
import type {NewsItemType} from "~/types";
export function formData(newsObjects): NewsItemType[] {
     return Array.from(newsObjects).map((item) => {
        return {
            image: item.enclosure ? item.enclosure.url : null,
            title: item.title,
            content: item.contentSnippet ? item.contentSnippet : null,
            link: item.link,
            pupDate: item.pubDate,
            source: item.link.includes('mos.ru')
                ? 'mos.ru'
                : item.link.includes('lenta.ru')
                    ? 'lenta.ru'
                    : ''
        }
    })
}