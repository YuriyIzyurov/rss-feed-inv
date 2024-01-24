import {Store} from "vuex";
import {type State} from "~/store";

export default function useStoreState(store: Store<State>) {
    const currentNews = computed(() => store.state.currentNews)
    const visiblePages = computed(() => store.state.visiblePages)
    const nothingFound = computed(() => store.state.nothingFound)
    const isLoading = computed(() => store.state.isLoading)
    const currentPage = computed(() => store.state.currentPage)
    const totalPages = computed(() => store.state.totalPages)
    const searchQuery = computed(() => store.state.searchQuery)
    const filterOption = computed(() => store.state.filterOption)

    return {
        currentNews,
        visiblePages,
        nothingFound,
        isLoading,
        currentPage,
        totalPages,
        searchQuery,
        filterOption
    }
}