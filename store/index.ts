import {createStore, Store} from "vuex";
import {type InjectionKey} from 'vue'
import {pageCalculator} from "~/utils/page-calculation";
import type {NewsItemType} from "~/types";
import {Filter, NewsPerView, SourceUrl} from "~/types";

export interface State {
    allNews: NewsItemType[],
    currentNews: NewsItemType[],
    totalPages: number,
    currentPage: number,
    newsPerView: NewsPerView,
    visiblePages: string[],
    filterOption: Filter,
    searchQuery: string,
    nothingFound: boolean,
    isLoading: boolean
}
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore({
    state() {
        return {
            allNews: [] as NewsItemType[],
            currentNews: [] as NewsItemType[],
            totalPages: 0,
            currentPage: 1,
            newsPerView: NewsPerView.VARIANT_2,
            visiblePages: [] as (string | number)[],
            filterOption: Filter.ALL,
            searchQuery: '',
            nothingFound: false,
            isLoading: true
        };
    },
    mutations: {
        setAllNews(state, payload: NewsItemType[]) {
            state.allNews = payload.sort((a, b) =>
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
            state.totalPages = Math.ceil(payload.length / state.newsPerView)
       },
        setCurrentNews (state) {

            const filteredNews = state.allNews
                .filter((item: NewsItemType) => {
                    let isQueryParamsMatch

                    if(state.searchQuery) {
                        const searchQueryLower = state.searchQuery.toLowerCase();
                        isQueryParamsMatch
                            = item.content && item.content.toLowerCase().includes(searchQueryLower)
                            || item.title.toLowerCase().includes(searchQueryLower)
                    }
                    if(state.filterOption === Filter.MOS) {
                        return state.searchQuery
                            ? isQueryParamsMatch && item.source === SourceUrl.MOS
                            : item.source === SourceUrl.MOS
                    }
                    else if(state.filterOption === Filter.LENTA) {
                        return state.searchQuery
                            ? isQueryParamsMatch && item.source === SourceUrl.LENTA
                            : item.source === SourceUrl.LENTA
                    } else
                        return state.searchQuery ? isQueryParamsMatch : true
                })

            const resultNews = filteredNews ? filteredNews : state.allNews;
            state.totalPages = !resultNews.length ? 0 : Math.ceil(resultNews.length / state.newsPerView);

            state.nothingFound = !resultNews.length;

            let startIndex = (state.currentPage - 1) * state.newsPerView;
            const endIndex = startIndex + state.newsPerView;
            state.currentNews = resultNews.slice(startIndex, endIndex);
        },
        setVisiblePages(state, payload) {
            state.visiblePages = pageCalculator(payload)
        }
    },
    actions: {
        setData({state, commit}, payload: {data: NewsItemType[]}) {
            commit('setAllNews', payload.data);
            commit('setCurrentNews');
            commit('setVisiblePages', { currentPage: state.currentPage, totalPages: state.totalPages });
        },
        setCurrentPage({state, commit}, payload ) {
            if(!payload.page) return
            state.currentPage = payload.page
        },
        setNewsPerView({state}, payload) {
            state.newsPerView = payload.amount
            state.totalPages = Math.ceil(state.allNews.length / state.newsPerView)
        },
        searchQuery({state}, payload) {
            state.searchQuery = payload.query
        },
        filterBySource({state}, payload) {
            state.filterOption = payload.filter
        },
        setLoadingStatus({state}, payload) {
            state.isLoading = payload.isLoading
        }
    }
});