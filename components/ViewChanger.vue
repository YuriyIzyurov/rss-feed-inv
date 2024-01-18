<template>
  <div
      :class="['view-changer view-changer__variant-1', cardsView === 'variant-1' && 'is-active']"
      @click="$emit('changeView', 'variant-1')"
  >
    <span></span>
    <span></span>
  </div>
  <div
      :class="['view-changer view-changer__variant-2', cardsView === 'variant-2' && 'is-active']"
      @click="$emit('changeView', 'variant-2')"
  >
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>
<script setup lang="ts">
type Props = {
  cardsView: string | null;
};
defineProps<Props>();
defineEmits(['changeView']);
</script>
<style lang="scss" scoped>
.view-changer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 18px;
  height: 18px;
  cursor: pointer;

  &__variant-1 {
    span {
      width: 100%;
      height: calc(50% - 1px);
    }
  }
  &__variant-2 {
    flex-wrap: wrap;
    span {
      width: calc(50% - 1px);
      height: calc(50% - 1px);
    }
  }
  &.is-active span {
    background-color: var(--primary-color);
  }
  span {
    display: block;
    background-color: #C4C4C4;
  }
}
</style>