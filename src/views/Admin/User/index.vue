<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { deleteUser, getUserList } from '@/api/user';
import message from 'ant-design-vue/es/message';
import 'ant-design-vue/es/message/style/index.css';

const list = ref([]);
onMounted(async()=>{
  fetchUserList();
});
const columns = [
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
  },
  {
    title: '登录时间',
    key: 'loginTime',
    dataIndex: 'loginTime',
  },
  {
    title: '管理',
    key: 'setting',
    dataIndex: 'email',
  }
];

const fetchUserList = async ()=>{
  const res = await getUserList();
  list.value = res.list ? res.list : [];
};
const handleUserDelete= async(email: string)=>{
  const res = await deleteUser(email);
  await fetchUserList();
  message.success(res.message);
};

</script>


<template>
  <div style="display: flex;flex-direction: column">
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item>管理员设置</a-breadcrumb-item>
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
    </a-breadcrumb>
    <a-table :columns="columns" :data-source="list">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'setting'">
          <a-button danger size="small" @click="handleUserDelete(record.email)">删除</a-button>
        </template>
        <template v-if="column.key === 'loginTime' || column.key === 'registerTime'">
          {{ new Date(record[column.dataIndex]).toLocaleString() }}
        </template>
      </template>
    </a-table>
  </div>

</template>


<style scoped>

</style>