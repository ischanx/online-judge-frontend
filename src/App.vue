<script lang="ts" setup>

</script>

<template>
  <a-layout class="global-layout">

    <div class="global-layout__content">
      <router-view />
    </div>
  </a-layout>
</template>

<style>
@import "./app.less";
</style>
<style lang="less">
.global-layout{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;



  &__content{

    flex-grow: 1;
    overflow: auto;
  }
}

</style>
