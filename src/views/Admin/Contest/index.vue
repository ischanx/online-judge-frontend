<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { parseRemainTime, parseTime } from '@/utils/parser';
import { contestDelete, getContestList } from '@/api/contest';
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
    title: '开始时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
  },
  {
    title: '结束时间',
    key: 'endTime',
    dataIndex: 'endTime',
  },
  {
    title: '持续时间',
    key: 'totalTime',
    dataIndex: 'endTime',
  },
  {
    title: '状态',
    dataIndex: 'endTime',
    key: 'status',
  },
  {
    title: '管理',
    key: 'setting',
    dataIndex: 'id',
  },
];
const list = ref<any[]>([]);

onMounted(() => {
  fetchContestList();
});
const fetchContestList = async () => {
  const res = await getContestList();
  list.value = res;
};

const handleContestEdit = async (current: { id: any }) => {
  await router.push({
    name: 'AdminContestDetail',
    params: {
      action: 'edit',
      contestId: current.id,
    },
  });
};
const handleContestDelete = async (current: any) => {
  await contestDelete(current.id);
  message.success(`删除比赛[${current.id}]成功`);
  await fetchContestList();
};

const handleContestAdd = async () => {
  router.push({
    name: 'AdminContestDetail',
    params: {
      action: 'add',
    },
  });
};

const handleContestShow = async (current) => {
  router.push({
    name: 'AdminContestDetail',
    params: {
      action: 'show',
      contestId: current.id,
    },
  });
};
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item>管理员设置</a-breadcrumb-item>
      <a-breadcrumb-item>比赛管理</a-breadcrumb-item>
    </a-breadcrumb>
    <a-button type="primary" @click="handleContestAdd">新建比赛</a-button>
    <a-table :columns="columns" :data-source="list">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'setting'">
          <div style="display: flex; justify-content: space-around; flex-wrap: wrap">
            <a-button size="small" @click="handleContestShow(record)">查看</a-button>
            <a-button
              :disabled="Date.now() > record.endTime"
              type="primary"
              size="small"
              @click="handleContestEdit(record)"
            >修改</a-button
            >
            <a-button danger size="small" @click="handleContestDelete(record)">删除</a-button>
          </div>
        </template>
        <template v-if="column.key === 'beginTime' || column.key === 'endTime'">
          {{ new Date(record[column.dataIndex]).toLocaleString() }}
        </template>
        <template v-if="column.key === 'totalTime'">
          {{ parseTime(record.endTime - record.beginTime) }}
        </template>
        <template v-else-if="column.key === 'status'">
          <span>
            <a-tag :color="parseRemainTime(record.beginTime, record.endTime).color">
              {{ parseRemainTime(record.beginTime, record.endTime).text }}
            </a-tag>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
