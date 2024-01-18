<template>
  <div class="main">
   dfg
  </div>
</template>
<script setup lang="ts">
import { useStore } from 'vuex'
const store = useStore()

const currentNews = computed(() => store.getters.getCurrentNews)
const totalPages = computed(() => store.state.totalPages)
const currentPage = computed(() => store.state.currentPage)
const searchQuery = computed(() => store.state.searchQuery)
const filterOption = computed(() => store.state.filterOption)


store.commit('setAllNews')
</script>
