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

    }
});