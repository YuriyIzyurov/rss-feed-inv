<template>
  <div class="content">
    <header class="header">
      <div class="header__menu">
        <h1 class="header__title">Список новостей</h1>
        <button class="header__refresh-button" @click="refreshNews">
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
          <button :class="[filterOption === 'all' && 'is-active']" @click="setFilter('all')">Все</button>
          <button :class="[filterOption === 'lenta' && 'is-active']" @click="setFilter('lenta')">Lenta.ru</button>
          <button :class="[filterOption === 'mos' && 'is-active']" @click="setFilter('mos')">Mos.ru</button>
        </div>
        <div class="main__view-changer">
          <ViewChanger :cardsView="cardsView" @change-view="changeView"/>
        </div>
      </section>
      <section v-if="!isLoading" :class="['main__content', cardsView === 'variant-2' ? 'variant-2' : 'variant-1']">
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
import { useStore } from 'vuex'
import type {FilterType, ViewType} from "~/types";
const store = useStore()

const currentNews = computed(() => store.state.currentNews)
const currentPage = computed(() => store.state.currentPage)
const totalPages = computed(() => store.state.totalPages)
const visiblePages = computed(() => store.state.visiblePages)
const searchQuery = computed(() => store.state.searchQuery)
const filterOption = computed(() => store.state.filterOption)
const nothingFound = computed(() => store.state.nothingFound)
const isLoading = computed(() => store.state.isLoading)

const query = ref<string>('')
const cardsView = ref<ViewType>('variant-2')

const router = useRouter();
const route = useRoute();

store.dispatch('fetchData')

if(route.query) {
  if(route.query.page) {
    store.dispatch('setCurrentPage', { page: +route.query.page })
    store.commit('setVisiblePages', { currentPage: +route.query.page, totalPages: totalPages.value })
  }
  if(route.query.q) {
    store.dispatch('searchQuery', { query: route.query.q });
    query.value = route.query.q
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
const changeView = (view: ViewType) => {
  localStorage.setItem('cardsView', view)
  cardsView.value = localStorage.getItem('cardsView')
  const newsShown = cardsView.value === 'variant-1' ? 3 : 4
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
const setFilter = (option: FilterType, isRefresh: boolean = false) => {
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
const refreshNews = () => {
  store.dispatch('fetchData')
  setFilter('all', true)
  query.value = ''
}


onMounted(() => {
  if(!localStorage.getItem('cardsView')) {
    localStorage.setItem('cardsView', 'variant-2')
  }
  const view = localStorage.getItem('cardsView')
  cardsView.value = view
  if(view === 'variant-1') {
    store.dispatch('setNewsPerView', { amount: 3 })
  }

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
