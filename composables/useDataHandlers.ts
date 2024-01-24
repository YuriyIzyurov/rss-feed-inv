import {CardView, Filter, NewsPerView} from "~/types";
import {Store} from "vuex";
import {type State} from "~/store";
import {type Ref} from "vue/dist/vue";
import type {RouteLocationNormalizedLoaded, Router} from "vue-router";
import {LOCAL_STORAGE_KEY} from "~/constants";

export default function useDataHandlers(
    store: Store<State>,
    query: Ref<string>,
    totalPages: Ref<number>,
    searchQuery: Ref<string>,
    filterOption: Ref<Filter>,
    cardsView: Ref<CardView>,
    router: Router,
    route: RouteLocationNormalizedLoaded
) {
    const changePage = (page: number) => {
        router.push({
            path: '/',
            query: {
                ...route.query,
                page
            }
        }).then(() => {
            store.dispatch('setCurrentPage', { page })
            store.commit('setCurrentNews')
            store.commit('setVisiblePages', { currentPage: page, totalPages: totalPages.value })
        })
    }
    const changeView = (view: CardView) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, view)
        cardsView.value = view
        const newsShown = cardsView.value === CardView.VARIANT_1 ? NewsPerView.VARIANT_1 : NewsPerView.VARIANT_2
        store.dispatch('setNewsPerView', { amount: newsShown })

        router.replace({
            path: '/', query: { ...route.query, page: 1 }
        }).then(() => {
            store.dispatch('setCurrentPage', { page: 1 })
            store.commit('setCurrentNews')
            store.commit('setVisiblePages', { currentPage: 1, totalPages: totalPages.value })
        })
    }
    const search = () => {
        store.dispatch('searchQuery', { query: query.value })
        store.dispatch('setCurrentPage', { page: 1 })
        store.commit('setCurrentNews')
        store.commit('setVisiblePages', { currentPage: 1, totalPages: totalPages.value })

        router.replace({
            path: '/',
            query: {q: searchQuery.value, filter: filterOption.value}
        })
    }
    const setFilter = (option: Filter, isRefresh: boolean = false) => {
        store.dispatch('filterBySource', { filter: option });
        isRefresh && store.dispatch('searchQuery', { query: '' });
        store.dispatch('setCurrentPage', { page: 1 });
        store.commit('setCurrentNews')
        store.commit('setVisiblePages', { currentPage: 1, totalPages: totalPages.value })

        router.replace({
            path: '/',
            query: isRefresh
                ? { filter: filterOption.value, page: 1 }
                : {...route.query, filter: filterOption.value, page: 1 }
        })
    }
    const refreshFilter = () => {
        setFilter(Filter.ALL, true)
        query.value = ''
    }

    return { changePage, changeView, setFilter, search, refreshFilter }
}