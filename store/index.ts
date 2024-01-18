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
            return state.allNews
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

        },
        searchQuery({state}, payload) {

        },
        filterBySource({state}, payload) {

        }
    }
});