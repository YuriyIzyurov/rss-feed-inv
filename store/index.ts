import {createStore} from "vuex";
import {formData} from "~/utils/rss-data-extract";
import {pageCalculator} from "~/utils/page-calculation";
import type {NewsItemType} from "~/types";

export const store = createStore({
    state() {
        return {
            allNews: [],
            currentNews: [],
            totalPages: 0,
            currentPage: 1,
            newsPerView: 4,
            visiblePages: [],
            visiblePagesAmount: 5,
            filterOption: 'all',
            searchQuery: '',
            nothingFound: false,
            isLoading: true
        };
    },
    mutations: {
        setAllNews(state, payload) {
            state.allNews = payload.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            state.totalPages = Math.ceil(payload.length / state.newsPerView)
       },
        setCurrentNews (state) {
            const filteredNews = state.allNews
                .filter((item: NewsItemType) => {
                    let isQueryParamsMatch

                    if(state.searchQuery) {
                        isQueryParamsMatch
                            = item.content && item.content.includes(state.searchQuery)
                            || item.title.includes(state.searchQuery)
                    }
                    if(state.filterOption === 'mos') {
                        return state.searchQuery
                            ? isQueryParamsMatch && item.source === 'mos.ru'
                            : item.source === 'mos.ru'
                    }
                    else if(state.filterOption === 'lenta') {
                        return state.searchQuery
                            ? isQueryParamsMatch && item.source === 'lenta.ru'
                            : item.source === 'lenta.ru'
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
        async fetchData({state, commit}) {
            try {
                let resultNewsArray

                const data1 = await $fetch('/api/rss', {
                    method: 'POST',
                    body: {
                        url: 'https://lenta.ru/rss/news'
                    }
                });
                if(data1.status === 200) {
                    resultNewsArray = formData(data1.data.items)
                }

                const data2 = await $fetch('/api/rss', {
                    method: 'POST',
                    body: {
                        url: 'https://www.mos.ru/rss'
                    }
                });
                if(data2.status === 200) {
                    if(!resultNewsArray) {
                        resultNewsArray = formData(data2.data.items)
                    } else {
                        resultNewsArray.push(...formData(data2.data.items))
                    }
                }

                if(resultNewsArray) {
                    commit('setAllNews', resultNewsArray);
                    commit('setCurrentNews');
                    commit('setVisiblePages', {
                        currentPage: state.currentPage,
                        visiblePagesAmount: state.visiblePagesAmount,
                        totalPages: state.totalPages
                    });
                }

            } catch (error) {
                console.log('Ошибка при получении данных:', error);
            }
        },
        setCurrentPage({state, commit}, payload ) {
            if(!payload.page) return
            state.currentPage = payload.page

            commit('setCurrentNews');
            commit('setVisiblePages', {
                currentPage: state.currentPage,
                visiblePagesAmount: state.visiblePagesAmount,
                totalPages: state.totalPages
            })
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