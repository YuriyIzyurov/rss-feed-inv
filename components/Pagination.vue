<template>
  <button
      v-for="(pageNum, index) in visiblePages"
      v-if="visiblePages.length > 1"
      :class="['page', currentPage === +pageNum && 'is-active']"
      :key="index"
      @click="$emit('onPaginate', pageNum)"
      :disabled="pageNum === '...'"
  >
    {{ pageNum }}
  </button>
</template>
<script lang="ts" setup>
type Props = {
  currentPage: number;
  visiblePages: string[];
};
defineProps<Props>();
defineEmits(['onPaginate']);
</script>
<style lang="scss" scoped>
.page {
  &.is-active {
    color: var(--primary-color);
  }
  &[disabled] {
    cursor: default;
  }
}
</style>