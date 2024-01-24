import type {NewsItemType, FeedItem} from "~/types";
import {SourceUrl} from "~/types";

export function formData(newsObjects:  FeedItem[]): NewsItemType[] {

     return Array.from(newsObjects).map((item) => {
        return {
            image: item.enclosure ? item.enclosure.url : null,
            title: item.title,
            content: item.contentSnippet ? item.contentSnippet : null,
            link: item.link,
            pubDate: item.pubDate,
            source: item.link.includes(SourceUrl.MOS)
                ? SourceUrl.MOS
                : SourceUrl.LENTA
        }
    })
}