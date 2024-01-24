import type {APIBody} from "~/types";
import {RSS_SOURCE_1, RSS_SOURCE_2, SERVER_URL} from "~/constants";
import {type NewsItemType} from "~/types";
import {Store} from "vuex";
import {type State} from "~/store";

export const useDataFetching = (store: Store<State>) => {
    //загрузка данных и сохранение в хранилище
    const itemsArray = ref<NewsItemType[]>([])

    const getData = async () => {
        const { data: dataSource1, refresh: refreshSource1 } = await useFetch<APIBody>(SERVER_URL, {
            method: 'POST',
            body: {url: RSS_SOURCE_1}
        })
        if (dataSource1.value) itemsArray.value = formData(dataSource1.value.data.items)

        const { data: dataSource2, refresh: refreshSource2 } = await useFetch<APIBody>(SERVER_URL, {
            method: 'POST',
            body: {url: RSS_SOURCE_2}
        })
        if (dataSource2.value) itemsArray.value.push(...formData(dataSource2.value.data.items))

        store.dispatch('setData', { data: itemsArray.value })

        return function refreshData() {
            refreshSource1()
            refreshSource2()

            if (dataSource1.value) itemsArray.value = formData(dataSource1.value.data.items)
            if (dataSource2.value) itemsArray.value.push(...formData(dataSource2.value.data.items))
            store.dispatch('setData', { data: itemsArray.value })
        }
    }


    return { getData }
}