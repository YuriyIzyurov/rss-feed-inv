import {createStore} from "vuex";

export const store = createStore({
    state() {
        return {
            mos_news: [],
            lenta_news: [],
            allNews: [],
            totalPages: 0,
            currentPage: 1,
            newsPerView: 4,
            filterOption: 'all',
            searchQuery: '',
        };
    },
    getters: {
        getCurrentNews (state) {
            const startIndex = (state.currentPage - 1) * state.newsPerView;
            const endIndex = startIndex + state.newsPerView;

            const filteredNews = state.allNews
                .filter(item => {
                    let isQueryParamsMatch

                    if(state.searchQuery) {
                        isQueryParamsMatch
                            = item.description && item.description[0].includes(state.searchQuery)
                            || item.title[0].includes(state.searchQuery)
                    }
                    if(state.filterOption === 'mos') {
                        return state.searchQuery
                            ? isQueryParamsMatch && item.link[0].includes('mos.ru')
                            : item.link[0].includes('mos.ru')
                    }
                    else if(state.filterOption === 'lenta') {
                        return state.searchQuery
                            ? isQueryParamsMatch && item.link[0].includes('lenta.ru')
                            : item.link[0].includes('lenta.ru')
                    } else
                        return state.searchQuery ? isQueryParamsMatch : true
                })

            const resultNews = filteredNews ? filteredNews : state.allNews
            state.totalPages = Math.ceil(resultNews.length / state.newsPerView)

            return resultNews.slice(startIndex, endIndex);
        }
    },
    mutations: {
        setAllNews(state) {
            state.allNews = [...state.mos_news, ...state.lenta_news]
       },
    },
    actions: {
        setNews({state}, payload) {
            if(payload.source === 'mos') {
                state.mos_news = payload.news
            } else {
                state.lenta_news = payload.news
            }
            state.totalPages = Math.ceil(payload.news.length / state.newsPerView)
        },
        setCurrentPage({state}, payload ) {
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
        }
    }
});