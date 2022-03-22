<script lang="ts" setup>
import {  ref } from 'vue';
import { MENU_KEYS } from '@/const/app';

const selectedKeys = ref<number[]>([]);
</script>

<template>
  <a-layout class="global-layout">
    <a-layout-header class="global-layout__header">
      <div>
        <span class="logo" >Online Judge</span>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="horizontal"
        >
          <a-menu-item :key="MENU_KEYS.PROBLEM">题库</a-menu-item>
          <a-menu-item :key="MENU_KEYS.CONTEST">竞赛</a-menu-item>
          <a-menu-item :key="MENU_KEYS.STATUS">统计</a-menu-item>
        </a-menu>
      </div>
      <div>
        <!--todo：用户组件-->
      </div>
    </a-layout-header>
    <a-layout-content class="global-layout__content">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer class="global-layout__footer">
      Online Judge ©2022 Created by chanx.tech
    </a-layout-footer>
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

  &__header{
    display: flex;
    justify-content: space-between;
    user-select: none;
    .logo {
      float: left;
      padding-right: 16px;
      color: white;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
    }
  }

  &__content{
    flex-grow: 1;
  }

  &__footer{
    text-align: center;
  }
}

</style>
