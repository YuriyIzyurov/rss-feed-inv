<template>
  <div class="content">
    <header class="header">
      <div class="header__menu">
        <h1 class="header__title">Список новостей</h1>
        <button class="header__refresh-button" @click="handleRefresh">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" fill="blue">
            <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
          </svg>
        </button>
      </div>
      <div class="header__search">
        <form method="get" class="text-end" @submit.prevent="search">
          <input type="text" name="q" v-model="query"  />
          <button class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" fill="#DCDCDC" viewBox="0 0 26 26">
              <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
            </svg>
          </button>
        </form>
      </div>
    </header>
    <main class="main">
      <section class="main__options">
        <div class="main__filter">
          <button
              v-for="option in filterOptions"
              :key="option.value"
              :class="[filterOption === option.value && 'is-active']"
              @click="setFilter(option.value as Filter)"
          >
            {{ option.label }}
          </button>
        </div>
        <div class="main__view-changer">
          <ViewChanger :cardsView="cardsView" @change-view="changeView"/>
        </div>
      </section>
      <section
          v-if="!isLoading"
          :class="['main__content', cardsView === CardView.VARIANT_2 ? CardView.VARIANT_2 : CardView.VARIANT_1]">
        <NewsCard
            v-for="newsItem in currentNews"
            :newsItem="newsItem"
            :cardsView="cardsView"
            :key="newsItem.link"
        />
        <span v-if="nothingFound" style="font-size: 20px">Ничего не найдено!</span>
      </section>
      <span v-else style="font-size: 24px">Загрузка...</span>
    </main>
    <footer class="footer">
      <Pagination
          v-if="!isLoading && currentNews.length"
          :currentPage="currentPage"
          :visiblePages="visiblePages"
          @on-paginate="changePage"
      />
    </footer>
  </div>
</template>
<script setup lang="ts">
import {useStore} from 'vuex'
import {type APIBody, CardView, Filter, type NewsItemType, NewsPerView} from "~/types";
import {filterOptions, LOCAL_STORAGE_KEY, RSS_SOURCE_1, RSS_SOURCE_2, SERVER_URL} from "~/constants";
import {key} from "~/store";
import useInitialQueryParams from "~/composables/useInitialQueryParams";
import useDataHandlers from "~/composables/useDataHandlers";
import useStoreState from "~/composables/useStoreState";


const router = useRouter();
const route = useRoute();
const store = useStore(key)
const { currentNews, visiblePages, nothingFound, isLoading, currentPage, totalPages, searchQuery, filterOption } = useStoreState(store)

const query = ref<string>('')
const cardsView = ref<CardView>(CardView.VARIANT_1)
const itemsArray = ref<NewsItemType[]>([])

//todo: ошибка A composable that requires access to the Nuxt instance was called outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function
//const { getData } =  useDataFetching(store)
//const refresh = await getData()

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


//применение параметров строки запроса при загрузке страницы
useInitialQueryParams(store, query, totalPages, searchQuery, filterOption, currentPage, router, route)

//методы управления данными
const { changePage, changeView, setFilter, refreshFilter, search } = useDataHandlers(store, query, totalPages, searchQuery, filterOption, cardsView, router, route)

function handleRefresh() {
  refreshSource1()
  refreshSource2()
  if (dataSource1.value) itemsArray.value = formData(dataSource1.value.data.items)
  if (dataSource2.value) itemsArray.value.push(...formData(dataSource2.value.data.items))
  store.dispatch('setData', { data: itemsArray.value })
  refreshFilter()
}

onMounted(() => {
  if(!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, CardView.VARIANT_2)
  }
  const view = localStorage.getItem(LOCAL_STORAGE_KEY) as CardView
  cardsView.value = view
  if(view === CardView.VARIANT_1) {
    store.dispatch('setNewsPerView', { amount: NewsPerView.VARIANT_1 })
  }

  store.dispatch('setData', { data: itemsArray.value })
  store.dispatch('setLoadingStatus', { isLoading: false })
})
</script>
<style lang="scss" scoped>
.content {
  max-width: 1060px;
  margin: 0 auto;
}
.header {
  display: flex;
  padding: 36px 0;
  border-bottom: 1px solid #E5E5E5;

  &__menu {
    display: flex;
    gap: 30px;
  }
  &__title {
    display: flex;
    align-items: center;
    font-size: 36px;
    line-height: 41px;
    font-weight: 700;
  }
  &__refresh-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    box-shadow: var(--shadow);
  }
  &__search {
    display: flex;
    margin-left: auto;

    .search-icon {
      position: absolute;
      top: 8px;
      right: 10px;
    }
    form {
      position: relative;
    }
    input {
      padding-left: 10px;
      padding-right: 45px;
      border-radius: 3px;
      border: none;
      width: 321px;
      height: 40px;
      box-shadow: var(--shadow);
    }
  }
}
.main {
  &__options {
    display: flex;
    justify-content: space-between;
    padding: 24px 0;
  }
  &__filter {
    display: flex;
    gap: 12px;
    font-weight: 700;
    color: var(--primary-color);

    .is-active {
      color: black;
    }
  }
  &__view-changer {
    display: flex;
    gap: 10px;
  }
  &__content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    &.variant-1 {
      flex-direction: column;
    }
  }
}
.footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 50px;
  padding-bottom: 100px;
  font-size: 18px;
  font-weight: 700;
}

@media screen and (max-width: 1100px) {
  .content {
    max-width: 400px;
    padding: 0 10px;
  }
  .header {
    flex-direction: column;
    gap: 20px;
    padding: 28px 0 24px;

    &__search {
      margin-left: unset;

      form,
      input {
        width: 100%;
      }
    }
    &__title {
      font-size: 24px;
      line-height: 28px;
    }
    &__menu {
      justify-content: space-between;
    }
  }
  .main {
    &__options {
      padding: 20px 0;
    }
  }
}
</style>
