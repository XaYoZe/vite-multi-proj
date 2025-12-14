<template>
  <div class="page-home">
    <h1>{{ t("home.title") }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<style scoped lang="scss">
.page-home {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>