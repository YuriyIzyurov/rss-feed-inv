<template>
  <div :class="['card', cardsView === 'variant-2' ? 'variant-2' : 'variant-1']"  >
    <div class="card__top">
      <div class="card__top--left" v-if="cardsView === 'variant-1'">
        <img class="card__image" v-if="post.enclosure" :src="post.enclosure[0].$.url" alt="">
      </div>
      <div class="card__top--right">
        <div class="card__title">
          {{ post.title[0] }}
        </div>
        <p class="card__description" v-if="post.description">
          {{ post.description[0] }}
        </p>
        <a v-if="cardsView === 'variant-2'" :href="post.link[0]">Подробнее</a>
      </div>
    </div>
    <div class="card__bottom">
      <div>{{post.link[0].includes('mos.ru') ? 'mos.ru' : 'lenta.ru'}}</div>
      <div class="card__date">{{ convertDate(post.pubDate[0]) }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {convertDate} from "~/utils/date-converter";

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
    width: 200px;
    height: 100px;
  }
}
</style>