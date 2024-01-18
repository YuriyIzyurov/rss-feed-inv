<template>
  <button
      v-for="pageNum in totalPages"
      :class="['page', currentPage === pageNum && 'is-active']"
      @click="$emit('onPaginate', pageNum)"
  >
    {{ pageNum }}
  </button>
</template>
<script lang="ts" setup>
type Props = {
  currentPage: number;
  totalPages: number;
};
defineProps<Props>();
defineEmits(['onPaginate']);
</script>
<style lang="scss" scoped>
.page {
  &.is-active {
    color: var(--primary-color);
  }
}
</style>