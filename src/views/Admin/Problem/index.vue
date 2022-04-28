<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import 'ant-design-vue/es/message/style/index.css';

import 'vditor/dist/index.css';
import { deleteProblem, getProblemList, Problem } from '@/api/problem';
import router from '@/router';
import message from 'ant-design-vue/es/message';
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '更新时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
  },
  {
    title: '管理',
    key: 'setting',
    dataIndex: 'id',
  },
];
const list = ref<Problem[]>([]);
const fetchProblemList = async () => {
  const res = await getProblemList();
  list.value = res.list ? res.list : [];
};
onMounted(() => {
  fetchProblemList();
});

const handleProblemShow = async (current: { id: any; }) => {
  await router.push({
    name: 'AdminProblemDetail',
    params: {
      action: 'show',
      problemId: current.id
    }
  });
};
const handleProblemEdit = async (current: { id: any; }) => {
  await router.push({
    name: 'AdminProblemDetail',
    params: {
      action: 'edit',
      problemId: current.id
    }
  });
};
const handleProblemDelete = async (current: any) => {
  await deleteProblem(current.id);
  message.success(`删除题目[${current.id}]成功`);
  await fetchProblemList();
};

const handleProblemAdd = () => {
  router.push({ name:'AdminProblemDetail',
    params:{
      action: 'add',
    } });
};
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item>管理员设置</a-breadcrumb-item>
      <a-breadcrumb-item>题目管理</a-breadcrumb-item>
    </a-breadcrumb>
    <a-button type="primary" @click="handleProblemAdd">新建题目</a-button>
    <a-table :columns="columns" :data-source="list">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'setting'">
          <div style="display: flex; justify-content: space-around; flex-wrap: wrap">
            <a-button size="small" @click="handleProblemShow(record)">查看</a-button>
            <a-button type="primary" size="small" @click="handleProblemEdit(record)">修改</a-button>
            <a-button danger size="small" @click="handleProblemDelete(record)">删除</a-button>
          </div>
        </template>
        <template v-if="column.key === 'createTime' || column.key === 'updateTime'">
          {{ new Date(record[column.dataIndex]).toLocaleString() }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="less">
.sample-list {
  display: flex;
  line-height: 36px;
  border-bottom: 1px solid #eee;
  &-name {
    width: 25%;
  }
  &-size {
    width: 15%;
  }
  &-md5 {
    width: 60%;
  }
}
</style>
