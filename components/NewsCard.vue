<template>
  <div :class="['card', cardsView === 'variant-2' ? 'variant-2' : 'variant-1']"  >
    <div class="card__top">
      <div class="card__top--left" v-if="cardsView === 'variant-1'">
        <img class="card__image"  src="https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg" alt="">
      </div>
      <div class="card__top--right">
        <div class="card__title">
          {{ 'Lorem Ipsum passage, and going through the cites of the word' }}
        </div>
        <p class="card__description" v-if="post.description">
          {{ 'Lorem Ipsum passage, and going through the cites of the word' }}
        </p>
        <a v-if="cardsView === 'variant-2'" href="#">Подробнее</a>
      </div>
    </div>
    <div class="card__bottom">
      <div class="card__date">{{ '11.11.2022' }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">

type Props = {
  post: any;
  cardsView: string | null;
};
defineProps<Props>();
</script>
<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 24px;
  height: 256px;
  padding: 30px 30px 16px;
  background-color: white;
  box-shadow: var(--shadow);

  &.variant-1 {
    width: 100%;
    height: 200px;
    padding-bottom: 4px;
  }
  &.variant-2 {
    width: 520px;
  }
  &__title {
    font-size: 18px;
    line-height: 22px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: auto;
  }
  &__top {
    display: flex;
    flex-grow: 1;
    gap: 30px;

    &--right {
      display: flex;
      flex-direction: column;
    }
  }
  &__bottom {
    display: flex;
    justify-content: space-between;
    color: gray;
  }
  &__image {
    width: 166px;
    height: 127px;
  }
}
</style>