<template>
  <div :class="['card', cardsView === 'variant-2' ? 'variant-2' : 'variant-1']"  >
    <div class="card__top">
      <div class="card__top--left" v-if="cardsView === 'variant-1'">
        <img v-if="post.enclosure" :src="post.enclosure[0].$.url" alt="">
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
      <a :href="`https://${post.link[0].includes('mos.ru') ? 'mos.ru' : 'lenta.ru'}`"
         target="_blank"
      >
        {{post.link[0].includes('mos.ru') ? 'mos.ru' : 'lenta.ru'}}
      </a>
      <span class="card__date">{{ convertDate(post.pubDate[0]) }}</span>
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
  gap: 20px;
  height: 256px;
  padding: 30px 30px 16px;
  background-color: white;
  box-shadow: var(--shadow);

  &.variant-1 {
    width: 100%;
    height: 189px;
    padding-bottom: 4px;

    .card__top {
      flex-grow: 0;
    }
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

    &--left {
      min-width: 200px;
      height: 100px;
    }
    &--right {
      display: flex;
      flex-direction: column;
      gap: 16px;

      a {
        color: var(--primary-color);
      }
    }
  }
  &__bottom {
    display: flex;
    justify-content: space-between;
    color: #DCDCDC;

    a {
      color: #DCDCDC;
    }
    span:first-child {
      text-decoration: underline;
    }
  }
  &__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
  }
}
@media screen and (max-width: 1100px) {
  .card {
    padding: 30px 22px 4px;
    overflow: hidden;

    &.variant-1 {
      padding-top: 20px;
      height: unset;

      .card__top {
        gap: 20px;
      }
    }
    &__top {
      flex-direction: column;

      &--left {
        height: 166px;
      }
    }
    &__bottom {
      position: relative;
      background-color: #FCFCFC;
      z-index: 1;

      &::before {
        content: '';
        position: absolute;
        left: -15%;
        width: 130%;
        height: 120%;
        z-index: -1;
        background-color: #FCFCFC;
      }
    }
    &__description {
      -webkit-line-clamp: 3;
    }
  }
}
</style>