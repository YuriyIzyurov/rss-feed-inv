import type {State} from "~/store";
import type {Store} from "vuex";
import type {Ref} from "vue";
import type {RouteLocationNormalizedLoaded, Router} from "vue-router";
import type {Filter} from "~/types";

export default function useInitialQueryParams(
    store: Store<State>,
    query: Ref<string>,
    totalPages: Ref<number>,
    searchQuery: Ref<string>,
    filterOption: Ref<Filter>,
    currentPage: Ref<number>,
    router: Router,
    route: RouteLocationNormalizedLoaded
) {

    if(route.query) {
        if(route.query.page) {
            store.dispatch('setCurrentPage', { page: +route.query.page })
            store.commit('setVisiblePages', { currentPage: +route.query.page, totalPages: totalPages.value })
        }
        if(route.query.q) {
            store.dispatch('searchQuery', { query: route.query.q });
            query.value = <string>route.query.q
        }
        if(route.query.filter) {
            store.dispatch('filterBySource', { filter: route.query.filter });
        }
        router.replace({
            path: '/',
            query: searchQuery.value
                ? {q: searchQuery.value, filter: filterOption.value, page: currentPage.value}
                : {filter: filterOption.value, page: currentPage.value}
        })
    }
}